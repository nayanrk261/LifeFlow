import express from 'express';
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const memoryDocs = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/documents
router.get('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const { search, category } = req.query;

    if (isDbConnected()) {
      let query = { userId: req.user._id };
      if (category && category !== 'All') query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { documentType: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }
      const docs = await Document.find(query).sort({ createdAt: -1 });
      return res.json(docs);
    } else {
      let filtered = memoryDocs.filter(d => d.userId === userIdStr);
      if (category && category !== 'All') {
        filtered = filtered.filter(d => d.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(d =>
          (d.title || '').toLowerCase().includes(q) ||
          (d.documentType || '').toLowerCase().includes(q) ||
          (d.category || '').toLowerCase().includes(q)
        );
      }
      return res.json(filtered);
    }
  } catch (error) {
    console.error('Fetch documents error:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// POST /api/documents
router.post('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const { title, documentType, category, source, status, issueDate, expiryDate, number, issuedBy, extractedData, aiSummary, actionRequired, action, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Document title is required' });
    }

    if (isDbConnected()) {
      const doc = await Document.create({
        userId: req.user._id,
        title,
        documentType: documentType || 'General',
        category: category || 'Personal',
        source: source || 'Personal Upload',
        status: status || 'healthy',
        issueDate,
        expiryDate,
        number,
        issuedBy,
        extractedData,
        aiSummary: aiSummary || 'Document added and analyzed.',
        actionRequired: actionRequired || false,
        action,
        priority
      });
      return res.status(201).json(doc);
    } else {
      const memDoc = {
        _id: 'doc-' + Date.now(),
        id: 'doc-' + Date.now(),
        userId: userIdStr,
        title,
        documentType: documentType || 'General',
        category: category || 'Personal',
        source: source || 'Personal Upload',
        status: status || 'healthy',
        issueDate,
        expiryDate,
        number,
        issuedBy,
        extractedData,
        aiSummary: aiSummary || 'Document added and analyzed.',
        actionRequired: actionRequired || false,
        action,
        priority,
        createdAt: new Date().toISOString()
      };
      memoryDocs.unshift(memDoc);
      return res.status(201).json(memDoc);
    }
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Error creating document' });
  }
});

// GET /api/documents/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
      if (!doc) return res.status(404).json({ message: 'Document not found' });
      return res.json(doc);
    } else {
      const doc = memoryDocs.find(d => (d._id === req.params.id || d.id === req.params.id) && d.userId === userIdStr);
      if (!doc) return res.status(404).json({ message: 'Document not found' });
      return res.json(doc);
    }
  } catch (error) {
    console.error('Fetch single document error:', error);
    res.status(500).json({ message: 'Error fetching document' });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    if (isDbConnected()) {
      const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!doc) return res.status(404).json({ message: 'Document not found' });
      return res.json({ message: 'Document removed' });
    } else {
      const idx = memoryDocs.findIndex(d => (d._id === req.params.id || d.id === req.params.id) && d.userId === userIdStr);
      if (idx === -1) return res.status(404).json({ message: 'Document not found' });
      memoryDocs.splice(idx, 1);
      return res.json({ message: 'Document removed' });
    }
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

export default router;
