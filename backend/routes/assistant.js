import express from 'express';
import { protect } from '../middleware/auth.js';
import { groqService } from '../services/groqService.js';
import Document from '../models/Document.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// POST /api/assistant/chat — Context-aware Document & Goal Assistant powered by Groq AI
router.post('/chat', protect, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Query string is required' });
    }

    let docs = [];
    let userProfile = {};

    try {
      docs = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
      userProfile = await Profile.findOne({ userId: req.user._id }) || {};
    } catch (e) {
      // Continue even if DB fetch fails
    }

    const docContext = docs.map(d => `- ${d.title || d.name} (${d.category || d.type || 'General'}): Status=${d.status || 'valid'}, Expiry=${d.expiryDate || 'N/A'}`).join('\n');
    const profileContext = `User: ${req.user.name || userProfile.firstName || 'User'}, Occupation: ${userProfile.occupation || 'N/A'}, Location: ${userProfile.city || ''} ${userProfile.state || ''}`;

    if (groqService.isConfigured()) {
      const systemPrompt = `You are LifeFlow AI Assistant — a personal life goal, document, and readiness copilot.
Answer user questions clearly, concisely, and helpfully based on their document vault context and profile.
Provide specific guidance on document status, upcoming deadlines, missing proofs, and next steps.

User Profile:
${profileContext}

User Document Vault:
${docContext || 'No documents uploaded yet.'}`;

      const userPrompt = `User question: "${query.trim()}"`;

      const aiText = await groqService.generateText({
        systemPrompt,
        userPrompt,
        temperature: 0.3
      });

      return res.json({
        response: aiText,
        sources: docs.slice(0, 3).map(d => d.title || d.name)
      });
    }

    // Fallback response if Groq API key is unconfigured
    const fallbackText = `Based on your LifeFlow profile and ${docs.length} document(s) in your vault, you currently have ${docs.filter(d => d.status === 'valid').length} valid document(s). To complete your goals, ensure all required proofs are uploaded to your vault.`;
    return res.json({
      response: fallbackText,
      sources: docs.slice(0, 3).map(d => d.title || d.name)
    });

  } catch (error) {
    console.error('Assistant AI error:', error.message);
    res.status(500).json({ message: error.message || 'Error processing assistant query' });
  }
});

export default router;
