import express from 'express';
import { protect } from '../middleware/auth.js';
import { groqService } from '../services/groqService.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// POST /api/generator/generate — Official Application & Document Drafting powered by Groq AI
router.post('/generate', protect, async (req, res) => {
  try {
    const { documentType, addressedTo, programName, purpose, additionalDetails } = req.body;

    if (!documentType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    let userProfile = {};
    try {
      userProfile = await Profile.findOne({ userId: req.user._id }) || {};
    } catch (e) {
      // Ignore DB fetch error
    }

    const userName = req.user.name || userProfile.firstName || 'User';
    const userLocation = `${userProfile.city || 'City'}, ${userProfile.state || 'State'}`;
    const docTypeName = documentType.name || documentType;

    if (groqService.isConfigured()) {
      const systemPrompt = `You are LifeFlow AI Official Document & Application Generator.
Draft formal, highly professional, complete application letters, complaints, requests, or declarations suitable for submission in India.
Include proper formal letter formatting (To, Subject, Salutation, Body paragraphs, Declaration, Sign-off). Do not include any JSON wrapper or code blocks.`;

      const userPrompt = `Draft an official formal application/letter with these details:
- Document/Application Type: ${docTypeName}
- Addressed To: ${addressedTo || 'The Competent Authority'}
- Applicant Name: ${userName}
- Applicant Location: ${userLocation}
- Program / Scheme / Reference: ${programName || 'N/A'}
- Purpose: ${purpose || 'Official submission and process verification'}
- Additional Context & Specific Details: ${additionalDetails || 'None provided'}

Generate the complete, formal text for this document ready for submission.`;

      const generatedText = await groqService.generateText({
        systemPrompt,
        userPrompt,
        temperature: 0.2
      });

      return res.json({ content: generatedText });
    }

    // Static fallback if Groq API key is unconfigured
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const fallbackText = `To,\n${addressedTo || 'The Competent Authority'}\n${userLocation}\n\nDate: ${dateStr}\n\nSubject: Application regarding ${docTypeName} - ${programName || 'Process Request'}\n\nRespected Sir/Madam,\n\nI, ${userName}, residing at ${userLocation}, respectfully submit this application for ${docTypeName}.\n\nReason & Purpose:\n${purpose || 'For official records and process verification.'}\n${additionalDetails ? `\nAdditional Context:\n${additionalDetails}\n` : ''}\nI declare that the information provided above is true and accurate to the best of my knowledge.\n\nThanking you,\n\nYours faithfully,\n\n${userName}\nLocation: ${userLocation}\n\n--- Document Generated via LifeFlow Copilot ---`;

    return res.json({ content: fallbackText });

  } catch (error) {
    console.error('Document generator AI error:', error.message);
    res.status(500).json({ message: error.message || 'Error generating document text' });
  }
});

export default router;
