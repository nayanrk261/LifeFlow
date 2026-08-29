import { groqService } from './groqService.js';
import Notification from '../models/Notification.js';

const SYSTEM_PROMPT = `
You are the LifeFlow AI Document Intelligence Service.
Your task is to analyze document titles, filename snippets, and metadata to classify document type, category, confidence score, extracted fields, important dates, and a concise summary.

CRITICAL RULES:
1. Do NOT invent information that is not implied or present in the input.
2. If document type is uncertain, set "confidence" between 0.30 and 0.65.
3. If document type is recognized confidently, set "confidence" between 0.85 and 0.98.
4. Output MUST be valid JSON only.
`;

/**
 * Classify document type and category locally if Groq is unconfigured or fails
 */
export function classifyDocumentLocally(title = '') {
  const t = title.toLowerCase();

  if (t.includes('aadhaar') || t.includes('aadhar') || t.includes('uidai')) {
    return { documentType: 'Aadhaar Card', category: 'Identity', confidence: 0.95 };
  }
  if (t.includes('pan') || t.includes('permanent account')) {
    return { documentType: 'PAN Card', category: 'Identity', confidence: 0.95 };
  }
  if (t.includes('passport')) {
    return { documentType: 'Passport', category: 'Identity', confidence: 0.95 };
  }
  if (t.includes('licence') || t.includes('license') || t.includes('dl')) {
    return { documentType: 'Driving Licence', category: 'Identity', confidence: 0.90 };
  }
  if (t.includes('insurance') || t.includes('policy')) {
    return { documentType: 'Vehicle Insurance', category: 'Insurance', confidence: 0.90 };
  }
  if (t.includes('marksheet') || t.includes('transcript') || t.includes('degree') || t.includes('10th') || t.includes('12th')) {
    return { documentType: 'Academic Marksheet', category: 'Education', confidence: 0.90 };
  }
  if (t.includes('income') || t.includes('salary') || t.includes('form 16')) {
    return { documentType: 'Income Certificate', category: 'Financial', confidence: 0.90 };
  }
  if (t.includes('bank') || t.includes('passbook') || t.includes('statement')) {
    return { documentType: 'Bank Document', category: 'Financial', confidence: 0.90 };
  }
  if (t.includes('domicile') || t.includes('residence') || t.includes('caste')) {
    return { documentType: 'Government Certificate', category: 'Government', confidence: 0.85 };
  }

  return { documentType: 'Personal Document', category: 'Personal', confidence: 0.60 };
}

/**
 * Calculate Expiry Status based on date
 */
export function calculateExpiryStatus(expiryDateStr) {
  if (!expiryDateStr) return 'unknown';

  const expDate = new Date(expiryDateStr);
  if (isNaN(expDate.getTime())) return 'unknown';

  const today = new Date();
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'expired';
  if (diffDays <= 90) return 'expiring_soon';
  return 'valid';
}

/**
 * Deterministic Goal Requirement Matching Engine
 */
export function checkGoalMatches(docType, docCategory, userGoals = []) {
  if (!docType || !userGoals || userGoals.length === 0) return null;

  const docTypeLower = docType.toLowerCase();

  for (const goal of userGoals) {
    if (goal.status !== 'active') continue;

    for (const req of (goal.requirements || [])) {
      if (req.status === 'available') continue; // Skip already satisfied requirements

      const reqNameLower = req.name.toLowerCase();
      const acceptedTypes = (req.acceptedDocTypes || []).map(t => t.toLowerCase());

      const titleMatch = docTypeLower.includes(reqNameLower) || reqNameLower.includes(docTypeLower);
      const typeMatch = acceptedTypes.some(t => docTypeLower.includes(t) || t.includes(docTypeLower));

      if (titleMatch || typeMatch) {
        const missingCount = goal.requirements.filter(r => r.required !== false && r.status === 'missing').length;
        const newReadiness = Math.min(100, Math.round(goal.readinessScore + (70 / (goal.requirements.length || 1))));

        return {
          goalId: goal._id || goal.id,
          goalTitle: goal.title,
          requirementName: req.name,
          currentReadiness: goal.readinessScore || 0,
          newReadiness: newReadiness,
          missingCount: missingCount,
          message: `This document may complete the missing requirement ("${req.name}") for your "${goal.title}" goal.`
        };
      }
    }
  }

  return null;
}

/**
 * Process Full Document Analysis Pipeline
 */
export async function processDocumentAnalysis({ title, documentType, category, expiryDate, number, issuedBy, userGoals = [] }) {
  const localClassification = classifyDocumentLocally(title || documentType || '');
  let detectedType = documentType || localClassification.documentType;
  let detectedCategory = category || localClassification.category;
  let confidence = localClassification.confidence;
  let extractedFields = {};
  let importantDates = [];
  let aiSummary = `Document categorized as ${detectedType}.`;

  if (expiryDate) {
    importantDates.push({ type: 'expiry', date: expiryDate, label: 'Expiration Date' });
  }

  if (number) {
    extractedFields.documentNumber = number;
  }
  if (issuedBy) {
    extractedFields.issuedBy = issuedBy;
  }

  // If Groq AI is configured, enhance classification and field extraction
  if (groqService.isConfigured()) {
    try {
      const prompt = `
Analyze document title: "${title}".
Given hints: documentType="${documentType || ''}", category="${category || ''}", expiryDate="${expiryDate || ''}".

Identify:
1. "documentType": Aadhaar Card | PAN Card | Passport | Driving Licence | Vehicle Insurance | Academic Marksheet | Income Certificate | Bank Document | Medical Document | Property Document | Other
2. "category": Identity | Education | Financial | Insurance | Government | Health | Vehicle | Personal | Other
3. "confidence": Number between 0.40 and 0.98
4. "summary": Short 1-sentence description of the document.
5. "extractedFields": Key-value pairs of visible fields (e.g. policyNumber, licenseNumber, institutionName, year)
6. "importantDates": Array of objects {"type": "expiry" | "issue", "date": "YYYY-MM-DD", "label": "Expiration Date"}

Return JSON format:
{
  "documentType": "Vehicle Insurance",
  "category": "Insurance",
  "confidence": 0.92,
  "summary": "Verified vehicle insurance policy document.",
  "extractedFields": {},
  "importantDates": []
}
`;

      const aiRes = await groqService.generateJSON({
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: prompt,
        temperature: 0.1
      });

      if (aiRes && aiRes.documentType) {
        detectedType = aiRes.documentType;
        detectedCategory = aiRes.category || detectedCategory;
        confidence = typeof aiRes.confidence === 'number' ? aiRes.confidence : confidence;
        aiSummary = aiRes.summary || aiSummary;
        extractedFields = { ...extractedFields, ...(aiRes.extractedFields || {}) };
        if (Array.isArray(aiRes.importantDates) && aiRes.importantDates.length > 0) {
          importantDates = aiRes.importantDates;
        }
      }
    } catch (err) {
      console.warn('Groq Document Analysis call failed, using local classifier:', err.message);
    }
  }

  // Calculate Expiry Status
  const expiryStatus = calculateExpiryStatus(expiryDate);
  const analysisStatus = confidence < 0.70 ? 'needs_review' : 'ready';

  // Check Deterministic Goal Match Candidate
  const potentialGoalMatch = checkGoalMatches(detectedType, detectedCategory, userGoals);

  return {
    documentType: detectedType,
    category: detectedCategory,
    analysisStatus: analysisStatus,
    analysisConfidence: Math.round(confidence * 100) / 100,
    extractedFields: extractedFields,
    importantDates: importantDates,
    expiryDate: expiryDate || null,
    expiryStatus: expiryStatus,
    aiSummary: aiSummary,
    potentialGoalMatch: potentialGoalMatch
  };
}

/**
 * Create Non-Duplicate Expiry Notification
 */
export async function checkAndCreateExpiryNotification(userId, doc) {
  if (!doc.expiryDate || doc.expiryStatus === 'valid' || doc.expiryStatus === 'unknown') return;

  const days = Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  let msg = '';
  let title = '';

  if (days <= 0) {
    title = 'Document Expired';
    msg = `Your ${doc.title || doc.documentType} expired on ${doc.expiryDate}. Please renew it to maintain eligibility.`;
  } else if (days <= 30) {
    title = 'Document Expiring Soon';
    msg = `Your ${doc.title || doc.documentType} will expire in ${days} days (on ${doc.expiryDate}).`;
  } else return;

  // Prevent duplicate notifications for same document
  const existing = await Notification.findOne({
    userId,
    title,
    'actionPayload.docId': doc._id
  });

  if (!existing) {
    await Notification.create({
      userId,
      title,
      message: msg,
      type: days <= 0 ? 'alert' : 'warning',
      relatedEntity: 'document_expiry',
      actionPayload: { docId: doc._id, expiryDate: doc.expiryDate }
    });
  }
}
