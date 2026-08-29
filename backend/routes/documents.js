import express from 'express';
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import Goal from '../models/Goal.js';
import FamilyConnection from '../models/FamilyConnection.js';
import { protect } from '../middleware/auth.js';
import { processDocumentAnalysis, calculateExpiryStatus, checkAndCreateExpiryNotification } from '../services/docIntelligenceService.js';

const router = express.Router();
const memoryDocs = [];
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/documents — List User Documents
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

// POST /api/documents/analyze — AI Document Analysis & Goal Requirement Matching
router.post('/analyze', protect, async (req, res) => {
  try {
    const { title, documentType, category, issueDate, expiryDate, number, issuedBy } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Document title or filename is required for analysis.' });
    }

    let userGoals = [];
    if (isDbConnected()) {
      userGoals = await Goal.find({ userId: req.user._id, status: 'active' });
    }

    const analysis = await processDocumentAnalysis({
      title,
      documentType,
      category,
      expiryDate,
      number,
      issuedBy,
      userGoals
    });

    res.json(analysis);
  } catch (error) {
    console.error('Analyze document error:', error);
    res.status(500).json({ message: 'Error analyzing document metadata' });
  }
});

// POST /api/documents — Save Document with Confirmed Intelligence & Goal Linking
router.post('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const {
      title,
      documentType,
      category,
      source,
      status,
      issueDate,
      expiryDate,
      number,
      issuedBy,
      extractedData,
      aiSummary,
      analysisStatus,
      analysisConfidence,
      extractedFields,
      importantDates,
      confirmGoalMatch,
      linkedGoalId
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Document title is required' });
    }

    const expiryStatus = calculateExpiryStatus(expiryDate);
    const linkedGoals = linkedGoalId ? [linkedGoalId] : [];

    let createdDoc;

    if (isDbConnected()) {
      createdDoc = await Document.create({
        userId: req.user._id,
        title,
        documentType: documentType || 'General',
        category: category || 'Personal',
        source: source || 'Personal Upload',
        status: status || (expiryStatus === 'expiring_soon' ? 'expiring' : expiryStatus === 'expired' ? 'attention' : 'healthy'),
        issueDate,
        expiryDate,
        number,
        issuedBy,
        extractedData,
        aiSummary: aiSummary || 'Document analyzed and stored in vault.',
        analysisStatus: analysisStatus || 'ready',
        analysisConfidence: analysisConfidence || 0.95,
        extractedFields: extractedFields || {},
        importantDates: importantDates || [],
        expiryStatus: expiryStatus,
        linkedGoals: linkedGoals,
        visibility: 'private',
        sharedWith: []
      });

      // If user confirmed linking to a goal, update the goal's requirement status to available
      if (confirmGoalMatch && linkedGoalId) {
        const goal = await Goal.findOne({ _id: linkedGoalId, userId: req.user._id });
        if (goal) {
          let updatedReq = false;
          goal.requirements.forEach(req => {
            if (req.status !== 'available') {
              const reqName = req.name.toLowerCase();
              const docName = (documentType || title).toLowerCase();
              const accepted = (req.acceptedDocTypes || []).map(t => t.toLowerCase());

              if (docName.includes(reqName) || reqName.includes(docName) || accepted.some(t => docName.includes(t))) {
                req.status = 'available';
                req.matchedDocumentId = createdDoc._id;
                updatedReq = true;
              }
            }
          });

          if (updatedReq) {
            const availableCount = goal.requirements.filter(r => r.status === 'available').length;
            const requiredCount = goal.requirements.filter(r => r.required !== false).length;
            goal.readinessScore = Math.min(100, Math.round((availableCount / (requiredCount || 1)) * 70 + 20));
            await goal.save();
          }
        }
      }

      // Trigger expiry notification check if applicable
      await checkAndCreateExpiryNotification(req.user._id, createdDoc);

      return res.status(201).json(createdDoc);
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
        aiSummary: aiSummary || 'Document analyzed and stored in vault.',
        analysisStatus: analysisStatus || 'ready',
        analysisConfidence: analysisConfidence || 0.95,
        extractedFields: extractedFields || {},
        importantDates: importantDates || [],
        expiryStatus: expiryStatus,
        linkedGoals: linkedGoals,
        visibility: 'private',
        sharedWith: [],
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

// PUT /api/documents/:id — Update Document Metadata & Goal Links
router.put('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);

    if (isDbConnected()) {
      if (req.body.expiryDate) {
        req.body.expiryStatus = calculateExpiryStatus(req.body.expiryDate);
      }
      const doc = await Document.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: req.body },
        { new: true }
      );
      if (!doc) return res.status(404).json({ message: 'Document not found' });
      return res.json(doc);
    } else {
      const idx = memoryDocs.findIndex(d => (d._id === req.params.id || d.id === req.params.id) && d.userId === userIdStr);
      if (idx === -1) return res.status(404).json({ message: 'Document not found' });
      memoryDocs[idx] = { ...memoryDocs[idx], ...req.body };
      return res.json(memoryDocs[idx]);
    }
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Error updating document' });
  }
});

// PUT /api/documents/:id/share — Explicit Document Sharing with Connected Family Member
router.put('/:id/share', protect, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ message: 'Target family member user ID is required' });
    }

    const connection = await FamilyConnection.findOne({
      $or: [
        { requesterId: req.user._id, recipientId: targetUserId, status: 'accepted' },
        { requesterId: targetUserId, recipientId: req.user._id, status: 'accepted' }
      ]
    });

    if (!connection) {
      return res.status(403).json({ message: 'Can only share documents with connected family members.' });
    }

    const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    doc.visibility = 'shared';
    const exists = doc.sharedWith.some(s => String(s.userId) === String(targetUserId));
    if (!exists) {
      doc.sharedWith.push({ userId: targetUserId, permission: 'view', sharedAt: new Date() });
    }
    await doc.save();

    res.json({ message: 'Document shared with family member successfully', doc });
  } catch (error) {
    console.error('Share document error:', error);
    res.status(500).json({ message: 'Error sharing document' });
  }
});

// PUT /api/documents/:id/unshare — Revoke Sharing
router.put('/:id/unshare', protect, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    doc.sharedWith = doc.sharedWith.filter(s => String(s.userId) !== String(targetUserId));
    if (doc.sharedWith.length === 0) {
      doc.visibility = 'private';
    }
    await doc.save();

    res.json({ message: 'Revoked document sharing', doc });
  } catch (error) {
    console.error('Unshare document error:', error);
    res.status(500).json({ message: 'Error revoking document sharing' });
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
