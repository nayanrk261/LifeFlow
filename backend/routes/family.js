import express from 'express';
import mongoose from 'mongoose';
import FamilyMember from '../models/FamilyMember.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const memoryFamily = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/family
router.get('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const members = await FamilyMember.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.json(members);
    } else {
      return res.json(memoryFamily.filter(m => m.userId === userIdStr));
    }
  } catch (error) {
    console.error('Fetch family error:', error);
    res.status(500).json({ message: 'Error fetching family members' });
  }
});

// POST /api/family
router.post('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const { name, relationship, dateOfBirth, notes } = req.body;
    if (!name || !relationship) {
      return res.status(400).json({ message: 'Name and relationship are required' });
    }

    if (isDbConnected()) {
      const member = await FamilyMember.create({
        userId: req.user._id,
        name,
        relationship,
        dateOfBirth,
        notes
      });
      return res.status(201).json(member);
    } else {
      const memMember = {
        _id: 'fam-' + Date.now(),
        userId: userIdStr,
        name,
        relationship,
        dateOfBirth,
        notes,
        createdAt: new Date().toISOString()
      };
      memoryFamily.unshift(memMember);
      return res.status(201).json(memMember);
    }
  } catch (error) {
    console.error('Create family member error:', error);
    res.status(500).json({ message: 'Error creating family member' });
  }
});

// PUT /api/family/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const { name, relationship, dateOfBirth, notes } = req.body;

    if (isDbConnected()) {
      const member = await FamilyMember.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: { name, relationship, dateOfBirth, notes } },
        { new: true }
      );
      if (!member) return res.status(404).json({ message: 'Family member not found' });
      return res.json(member);
    } else {
      const member = memoryFamily.find(m => m._id === req.params.id && m.userId === userIdStr);
      if (!member) return res.status(404).json({ message: 'Family member not found' });
      if (name) member.name = name;
      if (relationship) member.relationship = relationship;
      if (dateOfBirth !== undefined) member.dateOfBirth = dateOfBirth;
      if (notes !== undefined) member.notes = notes;
      return res.json(member);
    }
  } catch (error) {
    console.error('Update family member error:', error);
    res.status(500).json({ message: 'Error updating family member' });
  }
});

// DELETE /api/family/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const member = await FamilyMember.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!member) return res.status(404).json({ message: 'Family member not found' });
      return res.json({ message: 'Family member removed' });
    } else {
      const idx = memoryFamily.findIndex(m => m._id === req.params.id && m.userId === userIdStr);
      if (idx === -1) return res.status(404).json({ message: 'Family member not found' });
      memoryFamily.splice(idx, 1);
      return res.json({ message: 'Family member removed' });
    }
  } catch (error) {
    console.error('Delete family member error:', error);
    res.status(500).json({ message: 'Error deleting family member' });
  }
});

export default router;
