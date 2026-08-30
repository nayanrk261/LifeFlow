import { groqService } from './groqService.js';
import { classifyDocumentLocally } from './docIntelligenceService.js';

/**
 * Sensitivity Categories definitions
 */
export const SENSITIVE_CATEGORIES = {
  PERSONAL_IDENTITY: 'Personal identity information',
  GOVERNMENT_ID: 'Government identifiers',
  FINANCIAL_INFO: 'Financial information',
  ADDRESS_INFO: 'Address information',
  PERSONAL_RECORDS: 'Personal records'
};

/**
 * Evaluates document sensitivity based on title, category, and document type
 */
export function evaluateDocumentSensitivity({ title = '', documentType = '', category = '' }) {
  const text = `${title} ${documentType} ${category}`.toLowerCase();
  const detectedCategories = [];

  // Check Personal Identity Information
  if (
    text.includes('aadhaar') || text.includes('aadhar') || text.includes('passport') ||
    text.includes('pan') || text.includes('voter') || text.includes('identity') || text.includes('ssn')
  ) {
    detectedCategories.push(SENSITIVE_CATEGORIES.PERSONAL_IDENTITY);
  }

  // Check Government Identifiers
  if (
    text.includes('uidai') || text.includes('aadhaar') || text.includes('pan') ||
    text.includes('licence') || text.includes('license') || text.includes('certificate') ||
    text.includes('domicile') || text.includes('passport') || text.includes('government')
  ) {
    if (!detectedCategories.includes(SENSITIVE_CATEGORIES.GOVERNMENT_ID)) {
      detectedCategories.push(SENSITIVE_CATEGORIES.GOVERNMENT_ID);
    }
  }

  // Check Financial Information
  if (
    text.includes('income') || text.includes('salary') || text.includes('form 16') ||
    text.includes('bank') || text.includes('passbook') || text.includes('tax') ||
    text.includes('itr') || text.includes('statement') || text.includes('financial') ||
    text.includes('loan') || text.includes('pay slip')
  ) {
    detectedCategories.push(SENSITIVE_CATEGORIES.FINANCIAL_INFO);
  }

  // Check Address Information
  if (
    text.includes('domicile') || text.includes('residence') || text.includes('utility') ||
    text.includes('electricity') || text.includes('water bill') || text.includes('rent') ||
    text.includes('address')
  ) {
    detectedCategories.push(SENSITIVE_CATEGORIES.ADDRESS_INFO);
  }

  // Check Personal Records
  if (
    text.includes('marksheet') || text.includes('transcript') || text.includes('degree') ||
    text.includes('medical') || text.includes('health') || text.includes('birth') ||
    text.includes('caste') || text.includes('certificate')
  ) {
    if (!detectedCategories.includes(SENSITIVE_CATEGORIES.PERSONAL_RECORDS)) {
      detectedCategories.push(SENSITIVE_CATEGORIES.PERSONAL_RECORDS);
    }
  }

  // Calculate Sensitivity Level
  let sensitivityLevel = 'Low';
  if (
    detectedCategories.includes(SENSITIVE_CATEGORIES.FINANCIAL_INFO) ||
    detectedCategories.includes(SENSITIVE_CATEGORIES.PERSONAL_IDENTITY) ||
    detectedCategories.length >= 2
  ) {
    sensitivityLevel = 'High';
  } else if (detectedCategories.length === 1) {
    sensitivityLevel = 'Medium';
  }

  // Fallback defaults if no category explicitly matched
  if (detectedCategories.length === 0) {
    detectedCategories.push(SENSITIVE_CATEGORIES.PERSONAL_RECORDS);
  }

  return {
    sensitivityLevel,
    sensitiveCategories: detectedCategories,
    message: sensitivityLevel === 'High'
      ? 'This document contains sensitive personal, financial, or government identity details.'
      : sensitivityLevel === 'Medium'
      ? 'This document contains standard personal or residential records.'
      : 'This document appears to contain low-sensitivity general information.'
  };
}

/**
 * Local / Private Document Processor
 * Performs entity classification and extraction strictly on local safe metadata without sending full text to cloud AI.
 */
export const LocalPrivateProcessor = {
  name: 'Local/Private Processor',
  providerType: 'local_private',
  async process({ title, documentType, category, expiryDate, number, issuedBy }) {
    const localClassification = classifyDocumentLocally(title || documentType || '');
    const detectedType = documentType || localClassification.documentType;
    const detectedCategory = category || localClassification.category;

    const extractedFields = {};
    if (number) extractedFields.documentNumber = number;
    if (issuedBy) extractedFields.issuedBy = issuedBy;

    const importantDates = [];
    if (expiryDate) {
      importantDates.push({ type: 'expiry', date: expiryDate, label: 'Expiration Date' });
    }

    return {
      documentType: detectedType,
      category: detectedCategory,
      confidence: localClassification.confidence,
      aiSummary: `Processed via LifeFlow Private Intelligence (Privacy Mode). Zero sensitive data sent to external cloud AI.`,
      extractedFields,
      importantDates,
      processingMode: 'private',
      processingProvider: 'Local/Private Processor'
    };
  }
};

/**
 * Cloud AI Document Processor
 * Leverages Groq AI backend integration for deeper semantic understanding.
 */
export const CloudAiProcessor = {
  name: 'Cloud AI Processor',
  providerType: 'cloud_ai',
  async process({ title, documentType, category, expiryDate, number, issuedBy }) {
    const localFallback = await LocalPrivateProcessor.process({ title, documentType, category, expiryDate, number, issuedBy });

    if (!groqService.isConfigured()) {
      return {
        ...localFallback,
        processingMode: 'enhanced',
        processingProvider: 'Cloud AI Processor (Local Fallback)'
      };
    }

    try {
      const SYSTEM_PROMPT = `
You are the LifeFlow AI Document Intelligence Service.
Your task is to analyze document metadata and return a structured JSON response.
Return valid JSON ONLY.
`;
      const prompt = `
Analyze document title: "${title}".
Given hints: documentType="${documentType || ''}", category="${category || ''}", expiryDate="${expiryDate || ''}".

Identify:
1. "documentType": Aadhaar Card | PAN Card | Passport | Driving Licence | Vehicle Insurance | Academic Marksheet | Income Certificate | Bank Document | Medical Document | Property Document | Government Certificate | Other
2. "category": Identity | Education | Financial | Insurance | Government | Health | Vehicle | Personal | Other
3. "confidence": Number between 0.85 and 0.98
4. "summary": Short 1-sentence description.
5. "extractedFields": Key-value object (e.g. policyNumber, documentNumber, issuedBy)
6. "importantDates": Array of objects {"type": "expiry" | "issue", "date": "YYYY-MM-DD", "label": "Expiration Date"}

Return JSON format:
{
  "documentType": "Income Certificate",
  "category": "Financial",
  "confidence": 0.95,
  "summary": "Verified family income certificate document.",
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
        const extractedFields = { ...(localFallback.extractedFields || {}), ...(aiRes.extractedFields || {}) };
        if (number) extractedFields.documentNumber = number;

        return {
          documentType: aiRes.documentType,
          category: aiRes.category || localFallback.category,
          confidence: typeof aiRes.confidence === 'number' ? aiRes.confidence : localFallback.confidence,
          aiSummary: aiRes.summary || `Enhanced AI analysis completed for ${aiRes.documentType}.`,
          extractedFields,
          importantDates: (Array.isArray(aiRes.importantDates) && aiRes.importantDates.length > 0) ? aiRes.importantDates : localFallback.importantDates,
          processingMode: 'enhanced',
          processingProvider: 'Cloud AI Processor (Groq)'
        };
      }
    } catch (err) {
      console.warn('Cloud AI Processor execution failed, falling back to LocalPrivateProcessor:', err.message);
    }

    return {
      ...localFallback,
      processingMode: 'enhanced',
      processingProvider: 'Cloud AI Processor (Fallback)'
    };
  }
};

/**
 * Processing Provider Factory
 * Conceptually routes requests to the requested provider strategy.
 * Architecture allows future OnDeviceNpuProcessor or mobile provider to replace or extend LocalPrivateProcessor.
 */
export function getProcessingProvider(processingMode = 'private') {
  if (processingMode === 'enhanced') {
    return CloudAiProcessor;
  }
  // Default is Private Mode
  return LocalPrivateProcessor;
}
