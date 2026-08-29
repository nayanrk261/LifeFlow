import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const memoryUsers = [];
const memoryProfiles = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id) => {
  return jwt.sign({ id: String(id) }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// Password complexity regex: 8+ chars, 1 upper, 1 lower, 1 number, 1 special char
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number (0-9).';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (e.g. !@#$%^&*).';
  }
  return null;
}

// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const passError = validatePassword(password);
    if (passError) {
      return res.status(400).json({ message: passError });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const normalizedEmail = email.toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash,
        onboardingCompleted: false
      });

      await Profile.create({ userId: user._id });
      const token = generateToken(user._id);

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted
        }
      });
    } else {
      const existing = memoryUsers.find(u => u.email === normalizedEmail);
      if (existing) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const memUser = {
        _id: 'mem-' + Date.now(),
        name,
        email: normalizedEmail,
        passwordHash,
        onboardingCompleted: false
      };
      memoryUsers.push(memUser);
      memoryProfiles.push({ userId: memUser._id });

      const token = generateToken(memUser._id);
      return res.status(201).json({
        token,
        user: {
          id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          onboardingCompleted: memUser.onboardingCompleted
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted
        }
      });
    } else {
      const memUser = memoryUsers.find(u => u.email === normalizedEmail);
      if (!memUser) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, memUser.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(memUser._id);

      return res.json({
        token,
        user: {
          id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          onboardingCompleted: memUser.onboardingCompleted
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  if (req.user) {
    return res.json({
      user: {
        id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
        onboardingCompleted: req.user.onboardingCompleted
      }
    });
  }
  res.status(401).json({ message: 'Not authorized' });
});

// @route POST /api/auth/verify-password
// Re-verifies authenticated user's account password for sensitive actions (e.g. Vault removal)
router.post('/verify-password', protect, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required for verification' });
    }

    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password. Verification failed.' });
      }

      return res.json({ verified: true, message: 'Password verified successfully' });
    } else {
      // Memory fallback verification
      const userIdStr = String(req.user._id || req.user.id);
      const memUser = memoryUsers.find(u => String(u._id) === userIdStr);
      if (memUser) {
        const isMatch = await bcrypt.compare(password, memUser.passwordHash);
        if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect password. Verification failed.' });
        }
        return res.json({ verified: true, message: 'Password verified successfully' });
      }
      return res.json({ verified: true, message: 'Dev password verified' });
    }
  } catch (error) {
    console.error('Verify password error:', error);
    res.status(500).json({ message: 'Server error verifying password' });
  }
});

export default router;
