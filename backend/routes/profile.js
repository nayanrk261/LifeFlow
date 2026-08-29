import express from 'express';
import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const memoryProfiles = {};

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/profile
router.get('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      let profile = await Profile.findOne({ userId: req.user._id });
      if (!profile) {
        profile = await Profile.create({ userId: req.user._id });
      }
      return res.json(profile);
    } else {
      if (!memoryProfiles[userIdStr]) {
        memoryProfiles[userIdStr] = {
          userId: userIdStr,
          age: 21,
          state: 'Maharashtra',
          city: '',
          occupation: 'Student',
          ownsVehicle: false,
          studying: true,
          hasPassport: false,
          hasDrivingLicence: false,
        };
      }
      return res.json(memoryProfiles[userIdStr]);
    }
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// PUT /api/profile
router.put('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const updates = req.body;

    if (isDbConnected()) {
      let profile = await Profile.findOne({ userId: req.user._id });
      if (!profile) {
        profile = new Profile({ userId: req.user._id });
      }

      Object.assign(profile, updates);
      await profile.save();

      if (updates.onboardingCompleted !== undefined) {
        await User.findByIdAndUpdate(req.user._id, { onboardingCompleted: updates.onboardingCompleted });
      }
      return res.json(profile);
    } else {
      if (!memoryProfiles[userIdStr]) {
        memoryProfiles[userIdStr] = { userId: userIdStr };
      }
      Object.assign(memoryProfiles[userIdStr], updates);
      return res.json(memoryProfiles[userIdStr]);
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;
