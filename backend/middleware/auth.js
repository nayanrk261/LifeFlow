import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-passwordHash');
      } else {
        // Dev fallback for offline testing
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: 'Dev User',
          email: 'user@dev.com',
          onboardingCompleted: true
        };
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or token invalid' });
      }
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
