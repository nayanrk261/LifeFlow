import { groqService } from './groqService.js';
import { PROCESS_REQUIREMENTS_LIBRARY, classifyGoalRequest } from '../config/processRequirements.js';
import { processGoalAnalysis, calculateReadinessScore, determineNextBestActionAndExplanation } from './goalEngine.js';

const SYSTEM_PROMPT = `
You are the LifeFlow AI Action Engine assistant.
LifeFlow is a personal process preparation copilot. Your role is to understand user goal intent, clarify vague queries, classify processes, and provide personalized explanations.

CRITICAL RULES:
1. Never invent government or legal rules.
2. Never invent deadlines.
3. If the user request is vague (e.g. "I need help", "documents required"), set "needsClarification": true and provide clarifying questions.
4. Output MUST be valid JSON only.
`;

/**
 * Coordinate Real AI + Deterministic Goal Analysis Pipeline
 */
export async function analyzeUserGoalPipeline({ userRequest, userDocs = [], sharedFamilyDocs = [], userProfile = {} }) {
  const cleanRequest = userRequest.trim();

  // If Groq API is configured, run AI-assisted classification & explanation
  if (groqService.isConfigured()) {
    try {
      // 1. Groq Intent Classification & Clarification Check
      const intentPrompt = `
Analyze the user request: "${cleanRequest}".
Determine if the intent is clear or if clarification is needed.

Available process types in LifeFlow verified library:
- "scholarship": Scholarship application / grants
- "passport": Indian Passport issuance or renewal
- "driving_licence": Driving licence application / renewal
- "college_admission": Higher education / university admission
- "insurance": Vehicle / health insurance renewal or claims
- "loan": Personal, education, or home loan documentation
- "government_scheme": Welfare schemes / Yojana preparation
- "certificate": Caste, birth, income, domicile certificate
- "custom": Any other valid goal not listed above

Return JSON format:
{
  "needsClarification": false,
  "clarifyingQuestions": [],
  "suggestedOptions": [],
  "processType": "scholarship | passport | driving_licence | college_admission | insurance | loan | government_scheme | certificate | custom",
  "goalTitle": "Clear Goal Title",
  "category": "Education | Identity & Travel | Financial | Government | General",
  "confidence": 0.95
}

If the query is too vague (e.g. "I need docs", "help me"), return:
{
  "needsClarification": true,
  "clarifyingQuestions": ["What application or service are you preparing for?"],
  "suggestedOptions": ["Scholarship", "Passport", "Driving Licence", "Government Scheme", "College Admission"]
}
`;

      const intentResult = await groqService.generateJSON({
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: intentPrompt,
        temperature: 0.1
      });

      // Handle Clarification Step
      if (intentResult && intentResult.needsClarification) {
        return {
          needsClarification: true,
          clarifyingQuestions: intentResult.clarifyingQuestions || ['What process or application are you preparing for?'],
          suggestedOptions: intentResult.suggestedOptions || ['Scholarship', 'Passport', 'Driving Licence', 'Government Scheme', 'College Admission']
        };
      }

      // 2. Process Requirements Engine Source Selection
      let processType = intentResult.processType || 'custom';
      let verifiedProcess = PROCESS_REQUIREMENTS_LIBRARY[processType];
      let isOfficial = true;

      if (!verifiedProcess) {
        processType = 'custom';
        verifiedProcess = classifyGoalRequest(cleanRequest);
        isOfficial = false;
      }

      const title = intentResult.goalTitle || verifiedProcess.title;
      const category = intentResult.category || verifiedProcess.category;

      // 3. Deterministic Document & Shared Family Document Matching
      const matchedAnalysis = processGoalAnalysis({
        userRequest: cleanRequest,
        processAnalysis: {
          title,
          category,
          processType,
          description: verifiedProcess.description,
          requirements: verifiedProcess.requirements,
          actions: verifiedProcess.defaultActions
        },
        userDocs,
        sharedFamilyDocs,
        userProfile
      });

      // 4. Groq Personalized Explanation Generation based strictly on real matched data
      const availableNames = matchedAnalysis.requirements.filter(r => r.status === 'available').map(r => r.name).join(', ');
      const missingNames = matchedAnalysis.requirements.filter(r => r.status === 'missing' && r.required !== false).map(r => r.name).join(', ');

      const explanationPrompt = `
Generate a concise, 2-sentence user explanation for the goal "${title}".
User's Readiness Score: ${matchedAnalysis.readinessScore}%.
Available documents in vault: ${availableNames || 'None'}.
Missing required documents: ${missingNames || 'None'}.

Instructions:
- Keep explanation short, friendly, and action-oriented.
- Do NOT invent fake documents or government rules.
- Mention available vs missing docs clearly.

Return JSON format:
{
  "aiExplanation": "Your 2-sentence summary here.",
  "personalizedTip": "One optional short tip."
}
`;

      let aiExplanation = matchedAnalysis.aiExplanation;
      try {
        const explanationRes = await groqService.generateJSON({
          systemPrompt: SYSTEM_PROMPT,
          userPrompt: explanationPrompt,
          temperature: 0.3
        });
        if (explanationRes && explanationRes.aiExplanation) {
          aiExplanation = explanationRes.aiExplanation;
        }
      } catch (expErr) {
        console.warn('Groq explanation call failed, using deterministic summary:', expErr.message);
      }

      // 5. Structure & Return Validated Response
      return {
        originalUserRequest: cleanRequest,
        processType: processType,
        title: title,
        category: category,
        isOfficial: isOfficial,
        guidanceLabel: isOfficial ? 'Official Requirements Mapped' : 'AI-generated planning guidance',
        readinessScore: matchedAnalysis.readinessScore,
        status: 'active',
        nextBestAction: matchedAnalysis.nextBestAction,
        aiExplanation: aiExplanation,
        requirements: matchedAnalysis.requirements,
        actions: matchedAnalysis.actions,
        needsClarification: false
      };

    } catch (err) {
      console.warn('Groq Goal Analysis failed, using fallback engine:', err.message);
    }
  }

  // Graceful Rule-Based Fallback Engine (when Groq key missing or error occurs)
  const matchedProcess = classifyGoalRequest(cleanRequest);
  const matchedAnalysis = processGoalAnalysis({
    userRequest: cleanRequest,
    processAnalysis: matchedProcess,
    userDocs,
    sharedFamilyDocs,
    userProfile
  });

  return {
    originalUserRequest: cleanRequest,
    processType: matchedProcess.processType,
    title: matchedProcess.title,
    category: matchedProcess.category,
    isOfficial: matchedProcess.processType !== 'custom',
    guidanceLabel: matchedProcess.processType !== 'custom' ? 'Official Requirements Mapped' : 'AI-generated planning guidance',
    readinessScore: matchedAnalysis.readinessScore,
    status: 'active',
    nextBestAction: matchedAnalysis.nextBestAction,
    aiExplanation: matchedAnalysis.aiExplanation,
    requirements: matchedAnalysis.requirements,
    actions: matchedAnalysis.actions,
    needsClarification: false,
    isAiFallback: true
  };
}
