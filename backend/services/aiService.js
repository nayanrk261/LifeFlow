import { groqService } from './groqService.js';
import { classifyGoalRequest } from '../config/processRequirements.js';

/**
 * AI Service Layer for LifeFlow Action Engine using Groq AI
 */
export async function analyzeUserGoalWithAI(userRequest = '') {
  const cleanRequest = userRequest.trim();

  if (groqService.isConfigured()) {
    try {
      const systemPrompt = `You are the LifeFlow AI Action Engine. Analyze user goal requests and respond in JSON.`;
      const userPrompt = `Analyze this user goal request: "${cleanRequest}".
Return ONLY a valid JSON object matching this structure:
{
  "processType": "scholarship | passport | driving_licence | college_admission | insurance | loan | government_scheme | certificate | custom",
  "title": "Clear concise goal title",
  "category": "Education | Identity & Travel | Financial | Government | General",
  "description": "Short explanation of the goal",
  "requirements": [
    {
      "name": "Requirement Name",
      "category": "Category",
      "required": true,
      "description": "Description of why it is needed",
      "acceptedDocTypes": ["doc_tag1", "doc_tag2"]
    }
  ],
  "actions": [
    {
      "title": "Action step title",
      "description": "Action step description",
      "priority": "high | medium | low"
    }
  ],
  "aiExplanation": "A short, specific, 2-sentence summary explaining readiness and key next steps."
}`;

      const parsed = await groqService.generateJSON({ systemPrompt, userPrompt });

      if (parsed && parsed.title && Array.isArray(parsed.requirements)) {
        return {
          processType: parsed.processType || 'custom',
          title: parsed.title,
          category: parsed.category || 'General',
          description: parsed.description || '',
          requirements: parsed.requirements,
          actions: parsed.actions || [],
          aiExplanation: parsed.aiExplanation || 'Goal analyzed successfully by LifeFlow AI.'
        };
      }
    } catch (err) {
      console.warn('Groq AI goal analysis failed, using fallback engine:', err.message);
    }
  }

  // Graceful Fallback Engine
  const matchedProcess = classifyGoalRequest(cleanRequest);
  const fallbackExplanation = `LifeFlow identified your goal as ${matchedProcess.title}. We have mapped ${matchedProcess.requirements.length} core process requirements against your document vault.`;

  return {
    processType: matchedProcess.processType,
    title: matchedProcess.title,
    category: matchedProcess.category,
    description: matchedProcess.description,
    requirements: matchedProcess.requirements,
    actions: matchedProcess.defaultActions,
    aiExplanation: fallbackExplanation
  };
}
