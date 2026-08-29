import express from 'express';
import mongoose from 'mongoose';
import Reminder from '../models/Reminder.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const memoryReminders = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const reminders = await Reminder.find({ userId: req.user._id }).sort({ dueDate: 1 });
      return res.json(reminders);
    } else {
      return res.json(memoryReminders.filter(r => r.userId === userIdStr));
    }
  } catch (error) {
    console.error('Fetch reminders error:', error);
    res.status(500).json({ message: 'Error fetching reminders' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const { title, description, dueDate, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    if (isDbConnected()) {
      const reminder = await Reminder.create({
        userId: req.user._id,
        title,
        description,
        dueDate,
        priority: priority || 'medium',
        status: 'pending'
      });
      return res.status(201).json(reminder);
    } else {
      const memReminder = {
        _id: 'rem-' + Date.now(),
        userId: userIdStr,
        title,
        description,
        dueDate,
        priority: priority || 'medium',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      memoryReminders.unshift(memReminder);
      return res.status(201).json(memReminder);
    }
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Error creating reminder' });
  }
});

export default router;
