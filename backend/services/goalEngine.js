/**
 * LifeFlow Action Engine — Document Matching, Readiness & Next Best Action Service
 */

/**
 * Perform exact/keyword document matching against user's documents and authorized family documents
 */
export function matchDocumentToRequirement(reqItem, userDocs = [], sharedFamilyDocs = []) {
  const reqNameLower = reqItem.name.toLowerCase();
  const acceptedTypes = (reqItem.acceptedDocTypes || []).map(t => t.toLowerCase());

  // 1. First check authenticated user's own documents
  for (const doc of userDocs) {
    const docTitle = (doc.title || doc.name || '').toLowerCase();
    const docType = (doc.documentType || doc.category || '').toLowerCase();

    // Check direct name match or accepted doc type match
    const titleMatch = docTitle.includes(reqNameLower) || reqNameLower.includes(docTitle);
    const typeMatch = acceptedTypes.some(t => docTitle.includes(t) || docType.includes(t));

    if (titleMatch || typeMatch) {
      return {
        matched: true,
        isFamily: false,
        docId: doc._id || doc.id,
        docTitle: doc.title || doc.name,
      };
    }
  }

  // 2. Check explicitly shared family documents (ONLY if authorized & explicitly shared)
  for (const item of sharedFamilyDocs) {
    const doc = item.document || item;
    const memberName = item.memberName || 'Connected Family Member';
    const docTitle = (doc.title || doc.name || '').toLowerCase();
    const docType = (doc.documentType || doc.category || '').toLowerCase();

    const titleMatch = docTitle.includes(reqNameLower) || reqNameLower.includes(docTitle);
    const typeMatch = acceptedTypes.some(t => docTitle.includes(t) || docType.includes(t));

    if (titleMatch || typeMatch) {
      return {
        matched: true,
        isFamily: true,
        docId: doc._id || doc.id,
        docTitle: doc.title || doc.name,
        memberName: memberName
      };
    }
  }

  return { matched: false };
}

/**
 * Calculate multi-factor weighted readiness score
 */
export function calculateReadinessScore({
  requirements = [],
  profileComplete = false,
  actions = []
}) {
  const requiredReqs = requirements.filter(r => r.required !== false);
  const optionalReqs = requirements.filter(r => r.required === false);

  // 1. Required Doc Weight: 70%
  let docScore = 0;
  if (requiredReqs.length > 0) {
    const availableRequired = requiredReqs.filter(r => r.status === 'available').length;
    docScore = (availableRequired / requiredReqs.length) * 70;
  } else {
    docScore = 70;
  }

  // 2. Profile Completion Weight: 10%
  const profileScore = profileComplete ? 10 : 5;

  // 3. Optional Docs Weight: 10%
  let optionalScore = 10;
  if (optionalReqs.length > 0) {
    const availableOptional = optionalReqs.filter(r => r.status === 'available').length;
    optionalScore = (availableOptional / optionalReqs.length) * 10;
  }

  // 4. Action Completion Weight: 10%
  let actionScore = 0;
  if (actions.length > 0) {
    const completedActions = actions.filter(a => a.status === 'Completed' || a.completed).length;
    actionScore = (completedActions / actions.length) * 10;
  } else {
    actionScore = 10;
  }

  const total = Math.round(docScore + profileScore + optionalScore + actionScore);
  return Math.min(100, Math.max(0, total));
}

/**
 * Evaluate Next Best Action and dynamic AI Explanation
 */
export function determineNextBestActionAndExplanation({
  title,
  requirements = [],
  readinessScore = 0,
  userProfile = {}
}) {
  const missingRequired = requirements.filter(r => r.required !== false && r.status === 'missing');
  const availableRequired = requirements.filter(r => r.required !== false && r.status === 'available');
  const familyAvailable = requirements.filter(r => r.matchedFamilyDocumentId);

  let nextBestAction = '';
  let aiExplanation = '';

  if (missingRequired.length > 0) {
    const primaryMissing = missingRequired[0];

    if (primaryMissing.matchedFamilyDocumentId) {
      nextBestAction = `Request permission or copy of ${primaryMissing.name} from ${primaryMissing.matchedFamilyMemberName}.`;
    } else {
      nextBestAction = `Obtain your ${primaryMissing.name} before continuing. This is the primary missing requirement.`;
    }

    const availableNames = availableRequired.map(r => r.name).join(', ');
    const missingNames = missingRequired.map(r => r.name).join(', ');

    aiExplanation = `You are ${readinessScore}% ready to complete ${title}. ${
      availableNames ? `Your ${availableNames} ${availableRequired.length > 1 ? 'are' : 'is'} available.` : ''
    } You still need: ${missingNames}.`;

  } else {
    nextBestAction = `All required documents are ready! Proceed to complete your ${title} application.`;
    aiExplanation = `Great news! You are ${readinessScore}% ready for ${title}. All core requirements are fulfilled in your LifeFlow vault.`;
  }

  return { nextBestAction, aiExplanation };
}

/**
 * Full Goal Analysis Engine Execution
 */
export function processGoalAnalysis({
  userRequest,
  processAnalysis,
  userDocs = [],
  sharedFamilyDocs = [],
  userProfile = {}
}) {
  const { title, category, processType, description, requirements = [], actions = [] } = processAnalysis;

  // Process requirements with doc matching
  const processedRequirements = requirements.map(req => {
    const match = matchDocumentToRequirement(req, userDocs, sharedFamilyDocs);

    let status = 'missing';
    let matchedDocId = null;
    let matchedFamDocId = null;
    let matchedFamMemberName = null;

    if (match.matched) {
      status = 'available';
      if (match.isFamily) {
        matchedFamDocId = match.docId;
        matchedFamMemberName = match.memberName;
      } else {
        matchedDocId = match.docId;
      }
    } else if (req.required === false) {
      status = 'optional';
    }

    return {
      name: req.name,
      category: req.category || 'General',
      required: req.required !== false,
      description: req.description || '',
      acceptedDocTypes: req.acceptedDocTypes || [],
      status: status,
      matchedDocumentId: matchedDocId,
      matchedFamilyDocumentId: matchedFamDocId,
      matchedFamilyMemberName: matchedFamMemberName
    };
  });

  // Action items format
  const processedActions = actions.map((act, index) => ({
    _id: 'act-' + index + '-' + Date.now(),
    title: act.title,
    description: act.description || '',
    priority: act.priority || 'medium',
    status: 'Not Started',
  }));

  const isProfileComplete = Boolean(userProfile.age && userProfile.state && userProfile.occupation);

  const readinessScore = calculateReadinessScore({
    requirements: processedRequirements,
    profileComplete: isProfileComplete,
    actions: processedActions
  });

  const { nextBestAction, aiExplanation } = determineNextBestActionAndExplanation({
    title,
    requirements: processedRequirements,
    readinessScore,
    userProfile
  });

  return {
    originalUserRequest: userRequest,
    processType: processType || 'custom',
    title: title,
    category: category || 'General',
    description: description || '',
    readinessScore: readinessScore,
    status: 'active',
    nextBestAction: nextBestAction,
    aiExplanation: aiExplanation,
    requirements: processedRequirements,
    actions: processedActions
  };
}
