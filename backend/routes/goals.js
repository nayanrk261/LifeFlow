import express from 'express';
import mongoose from 'mongoose';
import Goal from '../models/Goal.js';
import Document from '../models/Document.js';
import Profile from '../models/Profile.js';
import FamilyConnection from '../models/FamilyConnection.js';
import { protect } from '../middleware/auth.js';
import { analyzeUserGoalPipeline } from '../services/goalAnalysisService.js';
import { calculateReadinessScore, determineNextBestActionAndExplanation } from '../services/goalEngine.js';

const router = express.Router();
const memoryGoals = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper to get user documents & authorized shared family documents
 */
async function getUserAndFamilyDocs(userId) {
  if (!isDbConnected()) {
    return { userDocs: [], sharedFamilyDocs: [], userProfile: {} };
  }

  // 1. User docs
  const userDocs = await Document.find({ userId }).sort({ createdAt: -1 });

  // 2. User profile
  const userProfile = await Profile.findOne({ userId }) || {};

  // 3. Connected family members
  const connections = await FamilyConnection.find({
    $or: [
      { requesterId: userId, status: 'accepted' },
      { recipientId: userId, status: 'accepted' }
    ]
  });

  const connectedUserIds = connections.map(c =>
    String(c.requesterId) === String(userId) ? c.recipientId : c.requesterId
  );

  // 4. Documents explicitly shared with userId by connected members
  const sharedDocs = await Document.find({
    userId: { $in: connectedUserIds },
    visibility: 'shared',
    'sharedWith.userId': userId
  }).populate('userId', 'name email');

  const sharedFamilyDocs = sharedDocs.map(doc => ({
    document: doc,
    memberName: doc.userId?.name || 'Connected Family Member'
  }));

  return { userDocs, sharedFamilyDocs, userProfile };
}

// POST /api/goals/analyze — Analyze Natural Language Goal Request with Groq AI + LifeFlow Engine
router.post('/analyze', protect, async (req, res) => {
  try {
    const { userRequest } = req.body;
    if (!userRequest || typeof userRequest !== 'string' || !userRequest.trim() || userRequest.trim().length < 3) {
      return res.status(400).json({ message: 'Please enter a valid goal with at least 3 characters.' });
    }

    const { userDocs, sharedFamilyDocs, userProfile } = await getUserAndFamilyDocs(req.user._id);

    // Call Real AI + Deterministic Goal Analysis Pipeline
    const result = await analyzeUserGoalPipeline({
      userRequest: userRequest.trim(),
      userDocs,
      sharedFamilyDocs,
      userProfile
    });

    res.json(result);
  } catch (error) {
    console.error('Analyze goal error:', error);
    res.status(500).json({ message: error.message || 'Error analyzing goal request' });
  }
});

// POST /api/goals/:id/analyze — Re-Analyze Existing Goal with Fresh Vault Data
router.post('/:id/analyze', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    let goal;

    if (isDbConnected()) {
      goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    } else {
      goal = memoryGoals.find(g => (g._id === req.params.id || g.id === req.params.id) && g.userId === userIdStr);
    }

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or no longer available.' });
    }

    const { userDocs, sharedFamilyDocs, userProfile } = await getUserAndFamilyDocs(req.user._id);

    const goalQuery = goal.originalUserRequest || goal.title;

    // Call Real AI + Deterministic Goal Analysis Pipeline on current goal
    const result = await analyzeUserGoalPipeline({
      userRequest: goalQuery,
      userDocs,
      sharedFamilyDocs,
      userProfile
    });

    // Update goal readiness and explanation in DB
    if (isDbConnected()) {
      goal.readinessScore = result.readinessScore;
      goal.nextBestAction = result.nextBestAction;
      goal.aiExplanation = result.aiExplanation;
      goal.requirements = result.requirements;
      await goal.save();
    } else {
      goal.readinessScore = result.readinessScore;
      goal.nextBestAction = result.nextBestAction;
      goal.aiExplanation = result.aiExplanation;
      goal.requirements = result.requirements;
    }

    res.json({
      ...result,
      existingGoalId: goal._id || goal.id
    });
  } catch (error) {
    console.error('Re-analyze goal error:', error);
    res.status(500).json({ message: error.message || 'Error re-analyzing goal' });
  }
});

// GET /api/goals — List all user goals with up-to-date document readiness recalculation
router.get('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);

    if (isDbConnected()) {
      const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
      const { userDocs, sharedFamilyDocs, userProfile } = await getUserAndFamilyDocs(req.user._id);

      // Dynamically sync document readiness for all active goals
      const updatedGoals = await Promise.all(goals.map(async (goal) => {
        let changed = false;

        goal.requirements.forEach(req => {
          const matchedDoc = userDocs.find(d =>
            (d.title || '').toLowerCase().includes(req.name.toLowerCase()) ||
            (req.acceptedDocTypes || []).some(t => (d.title || d.documentType || '').toLowerCase().includes(t.toLowerCase()))
          );

          if (matchedDoc) {
            if (req.status !== 'available' || String(req.matchedDocumentId) !== String(matchedDoc._id)) {
              req.status = 'available';
              req.matchedDocumentId = matchedDoc._id;
              changed = true;
            }
          }
        });

        if (changed) {
          const isProfileComplete = Boolean(userProfile.age && userProfile.state && userProfile.occupation);
          goal.readinessScore = calculateReadinessScore({
            requirements: goal.requirements,
            profileComplete: isProfileComplete,
            actions: goal.actions
          });
          const evalRes = determineNextBestActionAndExplanation({
            title: goal.title,
            requirements: goal.requirements,
            readinessScore: goal.readinessScore,
            userProfile
          });
          goal.nextBestAction = evalRes.nextBestAction;
          await goal.save();
        }
        return goal;
      }));

      return res.json(updatedGoals);
    } else {
      return res.json(memoryGoals.filter(g => g.userId === userIdStr));
    }
  } catch (error) {
    console.error('Fetch goals error:', error);
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

// GET /api/goals/:id — Get Detailed Goal Information
router.get('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);

    if (isDbConnected()) {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      return res.json(goal);
    } else {
      const memGoal = memoryGoals.find(g => (g._id === req.params.id || g.id === req.params.id) && g.userId === userIdStr);
      if (!memGoal) return res.status(404).json({ message: 'Goal not found' });
      return res.json(memGoal);
    }
  } catch (error) {
    console.error('Fetch goal detail error:', error);
    res.status(500).json({ message: 'Error fetching goal details' });
  }
});

// POST /api/goals — Create a New Goal
router.post('/', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);
    const {
      originalUserRequest,
      processType,
      title,
      category,
      description,
      readinessScore,
      status,
      nextBestAction,
      aiExplanation,
      deadline,
      requirements,
      actions
    } = req.body;

    if (!processType || !title) {
      return res.status(400).json({ message: 'Process type and title are required' });
    }

    if (isDbConnected()) {
      const goal = await Goal.create({
        userId: req.user._id,
        originalUserRequest,
        processType,
        title,
        category: category || 'General',
        description,
        readinessScore: readinessScore || 0,
        status: status || 'active',
        nextBestAction,
        aiExplanation,
        deadline,
        requirements: requirements || [],
        actions: actions || []
      });
      return res.status(201).json(goal);
    } else {
      const memGoal = {
        _id: 'goal-' + Date.now(),
        id: 'goal-' + Date.now(),
        userId: userIdStr,
        originalUserRequest,
        processType,
        title,
        category: category || 'General',
        description,
        readinessScore: readinessScore || 0,
        status: status || 'active',
        nextBestAction,
        aiExplanation,
        deadline,
        requirements: requirements || [],
        actions: actions || [],
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

// PUT /api/goals/:id — Update Goal Details/Status
router.put('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);

    if (isDbConnected()) {
      const goal = await Goal.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: req.body },
        { new: true }
      );
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      return res.json(goal);
    } else {
      const idx = memoryGoals.findIndex(g => (g._id === req.params.id || g.id === req.params.id) && g.userId === userIdStr);
      if (idx === -1) return res.status(404).json({ message: 'Goal not found' });
      memoryGoals[idx] = { ...memoryGoals[idx], ...req.body };
      return res.json(memoryGoals[idx]);
    }
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Error updating goal' });
  }
});

// PUT /api/goals/:id/actions/:actionId — Update Specific Action Progress
router.put('/:id/actions/:actionId', protect, async (req, res) => {
  try {
    const { status } = req.body; // 'Not Started', 'In Progress', 'Completed'
    const userIdStr = String(req.user._id || req.user.id);

    if (isDbConnected()) {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
      if (!goal) return res.status(404).json({ message: 'Goal not found' });

      const action = goal.actions.id(req.params.actionId) || goal.actions.find(a => String(a._id) === String(req.params.actionId));
      if (!action) return res.status(404).json({ message: 'Action step not found' });

      action.status = status || 'Completed';
      if (status === 'Completed') {
        action.completedAt = new Date();
      } else {
        action.completedAt = null;
      }

      // Recalculate readiness score
      const userProfile = await Profile.findOne({ userId: req.user._id }) || {};
      const isProfileComplete = Boolean(userProfile.age && userProfile.state && userProfile.occupation);

      goal.readinessScore = calculateReadinessScore({
        requirements: goal.requirements,
        profileComplete: isProfileComplete,
        actions: goal.actions
      });

      await goal.save();
      return res.json(goal);
    } else {
      const goal = memoryGoals.find(g => (g._id === req.params.id || g.id === req.params.id) && g.userId === userIdStr);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });

      const action = (goal.actions || []).find(a => String(a._id || a.id) === String(req.params.actionId));
      if (action) {
        action.status = status || 'Completed';
      }
      return res.json(goal);
    }
  } catch (error) {
    console.error('Update action status error:', error);
    res.status(500).json({ message: 'Error updating action step' });
  }
});

// DELETE /api/goals/:id — Delete Goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const userIdStr = String(req.user._id || req.user.id);

    if (isDbConnected()) {
      const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      return res.json({ message: 'Goal removed successfully' });
    } else {
      const idx = memoryGoals.findIndex(g => (g._id === req.params.id || g.id === req.params.id) && g.userId === userIdStr);
      if (idx === -1) return res.status(404).json({ message: 'Goal not found' });
      memoryGoals.splice(idx, 1);
      return res.json({ message: 'Goal removed successfully' });
    }
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Error deleting goal' });
  }
});

export default router;
