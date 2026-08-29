import express from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const memoryNotifications = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
      return res.json(notifications);
    } else {
      return res.json(memoryNotifications.filter(n => n.userId === userIdStr));
    }
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { read: true },
        { new: true }
      );
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      return res.json(notification);
    } else {
      const notif = memoryNotifications.find(n => n._id === req.params.id && n.userId === userIdStr);
      if (!notif) return res.status(404).json({ message: 'Notification not found' });
      notif.read = true;
      return res.json(notif);
    }
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

export default router;
