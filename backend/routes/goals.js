import express from 'express';
import mongoose from 'mongoose';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const memoryGoals = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.json(goals);
    } else {
      return res.json(memoryGoals.filter(g => g.userId === userIdStr));
    }
  } catch (error) {
    console.error('Fetch goals error:', error);
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const { processType, title, category, progress, requirements, deadline } = req.body;
    if (!processType || !title) {
      return res.status(400).json({ message: 'Process type and title are required' });
    }

    if (isDbConnected()) {
      const goal = await Goal.create({
        userId: req.user._id,
        processType,
        title,
        category: category || 'General',
        progress: progress || 0,
        requirements: requirements || [],
        deadline
      });
      return res.status(201).json(goal);
    } else {
      const memGoal = {
        _id: 'goal-' + Date.now(),
        userId: userIdStr,
        processType,
        title,
        category: category || 'General',
        progress: progress || 0,
        requirements: requirements || [],
        deadline,
        createdAt: new Date().toISOString()
      };
      memoryGoals.unshift(memGoal);
      return res.status(201).json(memGoal);
    }
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Error creating goal' });
  }
});

export default router;
