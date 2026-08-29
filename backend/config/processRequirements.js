// Centralized Process & Requirements Configuration Library for LifeFlow Action Engine

export const PROCESS_REQUIREMENTS_LIBRARY = {
  scholarship: {
    processType: 'scholarship',
    title: 'Prepare for Scholarship Application',
    category: 'Education',
    description: 'Complete documentation for merit or means-based academic scholarship applications.',
    requirements: [
      {
        name: 'Identity Proof',
        category: 'Identity',
        required: true,
        description: 'Government issued photo ID proof (e.g. Aadhaar Card, Passport, Voter ID).',
        acceptedDocTypes: ['aadhaar', 'passport', 'voter id', 'identity proof', 'pan card', 'national id']
      },
      {
        name: 'Academic Marksheet',
        category: 'Education',
        required: true,
        description: 'Latest academic marksheets or transcripts (10th/12th/Semester marksheet).',
        acceptedDocTypes: ['marksheet', 'academic marksheet', 'transcript', 'degree', 'report card']
      },
      {
        name: 'Income Certificate',
        category: 'Financial',
        required: true,
        description: 'Family income certificate issued by competent authority or salary slip.',
        acceptedDocTypes: ['income certificate', 'salary slip', 'income proof', 'form 16']
      },
      {
        name: 'Bank Account Proof',
        category: 'Financial',
        required: true,
        description: 'Bank passbook copy or cancelled cheque for direct scholarship disbursement.',
        acceptedDocTypes: ['bank passbook', 'bank statement', 'cancelled cheque', 'bank account proof']
      },
      {
        name: 'Residence Proof',
        category: 'Address',
        required: true,
        description: 'Domicile certificate or address proof confirming residential status.',
        acceptedDocTypes: ['domicile certificate', 'address proof', 'residence proof', 'utility bill']
      },
      {
        name: 'Passport Photograph',
        category: 'Personal',
        required: false,
        description: 'Recent colored passport size photograph.',
        acceptedDocTypes: ['passport photo', 'photograph', 'photo']
      }
    ],
    defaultActions: [
      { title: 'Verify active student profile details', description: 'Ensure your institution name and current year of study are accurate.', priority: 'high' },
      { title: 'Check document expiration dates', description: 'Ensure income certificate and domicile proof are valid for the current financial year.', priority: 'medium' },
      { title: 'Obtain missing income certificate', description: 'Apply at your local revenue office or Tehsildar office if expired.', priority: 'high' },
      { title: 'Submit digital application', description: 'Upload verified documents to the official scholarship portal before deadline.', priority: 'high' }
    ]
  },

  college_admission: {
    processType: 'college_admission',
    title: 'Prepare for College Admission',
    category: 'Education',
    description: 'Documentation and eligibility checklist for higher education admission.',
    requirements: [
      {
        name: 'Academic Marksheets',
        category: 'Education',
        required: true,
        description: '10th and 12th board exam marksheets and passing certificates.',
        acceptedDocTypes: ['marksheet', 'academic marksheet', 'passing certificate', 'transcript']
      },
      {
        name: 'Identity Proof',
        category: 'Identity',
        required: true,
        description: 'Aadhaar Card or Passport for identity verification.',
        acceptedDocTypes: ['aadhaar', 'passport', 'identity proof']
      },
      {
        name: 'Transfer / Migration Certificate',
        category: 'Education',
        required: true,
        description: 'TC or Migration Certificate from your previous school/board.',
        acceptedDocTypes: ['transfer certificate', 'migration certificate', 'school leaving certificate']
      },
      {
        name: 'Category Certificate',
        category: 'Official',
        required: false,
        description: 'Reserved category/Caste certificate if applying under quota.',
        acceptedDocTypes: ['caste certificate', 'category certificate', 'reservation proof']
      },
      {
        name: 'Passport Photographs',
        category: 'Personal',
        required: false,
        description: 'Set of 4-6 recent passport photographs.',
        acceptedDocTypes: ['passport photo', 'photograph', 'photo']
      }
    ],
    defaultActions: [
      { title: 'Collect original academic transcripts', description: 'Keep attested digital copies ready for verification.', priority: 'high' },
      { title: 'Obtain Transfer & Migration certificate', description: 'Request from your last attended school/college office.', priority: 'high' },
      { title: 'Prepare self-attested document copies', description: 'Sign and scan all required document pages.', priority: 'medium' }
    ]
  },

  passport: {
    processType: 'passport',
    title: 'Prepare for Passport Application / Renewal',
    category: 'Identity & Travel',
    description: 'Checklist and preparation workflow for Indian Passport issuance or renewal.',
    requirements: [
      {
        name: 'Proof of Address',
        category: 'Address',
        required: true,
        description: 'Aadhaar Card, Bank Passbook with photo, or registered Rent Agreement.',
        acceptedDocTypes: ['aadhaar', 'address proof', 'utility bill', 'bank passbook', 'rent agreement']
      },
      {
        name: 'Proof of Date of Birth',
        category: 'Identity',
        required: true,
        description: 'Birth Certificate, Transfer Certificate, or Aadhaar Card with full DOB.',
        acceptedDocTypes: ['birth certificate', 'aadhaar', 'pan card', 'transfer certificate']
      },
      {
        name: 'Identity Proof',
        category: 'Identity',
        required: true,
        description: 'PAN Card, Voter ID, or Driving Licence.',
        acceptedDocTypes: ['pan card', 'voter id', 'driving licence', 'identity proof']
      },
      {
        name: 'Existing Passport (if renewal)',
        category: 'Travel',
        required: false,
        description: 'Original old passport and self-attested copies of first/last page.',
        acceptedDocTypes: ['passport', 'old passport']
      }
    ],
    defaultActions: [
      { title: 'Ensure name matches across all ID proofs', description: 'Name spelling must match exactly between Aadhaar and PAN Card.', priority: 'high' },
      { title: 'Confirm address proof is in current residential location', description: 'Must reflect current address for police verification.', priority: 'high' },
      { title: 'Book appointment on Passport Seva portal', description: 'Select nearest Passport Seva Kendra (PSK).', priority: 'medium' }
    ]
  },

  driving_licence: {
    processType: 'driving_licence',
    title: 'Prepare for Driving Licence Renewal / Application',
    category: 'Identity & Travel',
    description: 'Documentation required for RTO Driving Licence renewal or new DL application.',
    requirements: [
      {
        name: 'Existing Driving Licence / Learner Licence',
        category: 'Identity',
        required: true,
        description: 'Existing DL (for renewal) or valid Learner Licence number.',
        acceptedDocTypes: ['driving licence', 'dl', 'learner licence']
      },
      {
        name: 'Proof of Age',
        category: 'Identity',
        required: true,
        description: 'Aadhaar Card, Birth Certificate, or 10th Marksheet.',
        acceptedDocTypes: ['aadhaar', 'birth certificate', 'marksheet', 'pan card']
      },
      {
        name: 'Proof of Residence',
        category: 'Address',
        required: true,
        description: 'Aadhaar Card, Voter ID, Passport, or Electricity Bill.',
        acceptedDocTypes: ['aadhaar', 'address proof', 'utility bill', 'passport']
      },
      {
        name: 'Medical Certificate (Form 1A)',
        category: 'Medical',
        required: false,
        description: 'Required if age is over 40 or applying for commercial vehicle licence.',
        acceptedDocTypes: ['medical certificate', 'form 1a', 'doctor certificate']
      }
    ],
    defaultActions: [
      { title: 'Verify DL validity and renewal grace period', description: 'Ensure renewal application is submitted within allowed RTO window.', priority: 'high' },
      { title: 'Upload address proof to Parivahan portal', description: 'Complete online application on Sarathi Parivahan.', priority: 'high' },
      { title: 'Pay RTO renewal fee online', description: 'Keep receipt generated for document verification.', priority: 'medium' }
    ]
  },

  insurance: {
    processType: 'insurance',
    title: 'Prepare Insurance Renewal / Claim Documentation',
    category: 'Financial',
    description: 'Document readiness for vehicle, health, or life insurance policy management.',
    requirements: [
      {
        name: 'Previous Insurance Policy Document',
        category: 'Financial',
        required: true,
        description: 'Existing policy document containing policy number and expiry details.',
        acceptedDocTypes: ['insurance', 'insurance policy', 'vehicle insurance', 'health insurance']
      },
      {
        name: 'Vehicle RC / Property Certificate',
        category: 'Official',
        required: true,
        description: 'Vehicle Registration Certificate (RC) or property title deed.',
        acceptedDocTypes: ['rc', 'registration certificate', 'vehicle rc']
      },
      {
        name: 'Policy Holder Identity Proof',
        category: 'Identity',
        required: true,
        description: 'PAN Card or Aadhaar Card of the primary policyholder.',
        acceptedDocTypes: ['pan card', 'aadhaar', 'identity proof']
      }
    ],
    defaultActions: [
      { title: 'Compare renewal quotes and No Claim Bonus (NCB)', description: 'Ensure NCB discount is retained during renewal.', priority: 'medium' },
      { title: 'Inspect policy coverage & add-ons', description: 'Verify zero-depreciation and engine protection add-ons.', priority: 'low' },
      { title: 'Complete policy payment before expiry date', description: 'Avoid break-in inspection fees by renewing on time.', priority: 'high' }
    ]
  },

  loan: {
    processType: 'loan',
    title: 'Prepare Loan Application Documentation',
    category: 'Financial',
    description: 'Document verification checklist for personal, education, or home loans.',
    requirements: [
      {
        name: 'PAN Card',
        category: 'Financial',
        required: true,
        description: 'Mandatory for credit score evaluation (CIBIL check).',
        acceptedDocTypes: ['pan card', 'pan']
      },
      {
        name: 'Aadhaar / Address Proof',
        category: 'Identity',
        required: true,
        description: 'Aadhaar Card or Passport for KYC verification.',
        acceptedDocTypes: ['aadhaar', 'address proof', 'passport']
      },
      {
        name: 'Income Tax Returns / Form 16',
        category: 'Financial',
        required: true,
        description: 'Latest 2-3 years ITR filings or Form 16 from employer.',
        acceptedDocTypes: ['itr', 'tax return', 'form 16', 'income certificate']
      },
      {
        name: 'Bank Statement (6 Months)',
        category: 'Financial',
        required: true,
        description: 'Official bank account statement showing salary credit or cashflow.',
        acceptedDocTypes: ['bank statement', 'bank passbook']
      }
    ],
    defaultActions: [
      { title: 'Download 6-month bank statement PDF', description: 'Ensure statement is password-unlocked and clear.', priority: 'high' },
      { title: 'Obtain latest ITR acknowledgement copies', description: 'Keep e-filing receipts ready.', priority: 'high' }
    ]
  },

  government_scheme: {
    processType: 'government_scheme',
    title: 'Prepare for Government Scheme Application',
    category: 'Government',
    description: 'Standard documentation required for central & state welfare schemes.',
    requirements: [
      {
        name: 'Aadhaar Card',
        category: 'Identity',
        required: true,
        description: 'Linked with active mobile number for OTP verification.',
        acceptedDocTypes: ['aadhaar', 'national id']
      },
      {
        name: 'Income Certificate',
        category: 'Financial',
        required: true,
        description: 'Issued by competent authority for category eligibility.',
        acceptedDocTypes: ['income certificate', 'income proof', 'salary slip']
      },
      {
        name: 'Domicile / Residence Certificate',
        category: 'Address',
        required: true,
        description: 'State domicile proof confirming eligibility.',
        acceptedDocTypes: ['domicile certificate', 'residence proof', 'address proof']
      },
      {
        name: 'Bank Passbook / DBT Account Proof',
        category: 'Financial',
        required: true,
        description: 'Aadhaar-seeded bank account details for direct benefit transfer.',
        acceptedDocTypes: ['bank passbook', 'bank account proof', 'bank statement']
      }
    ],
    defaultActions: [
      { title: 'Verify Aadhaar-Mobile linking', description: 'Check OTP reception on UIDAI portal.', priority: 'high' },
      { title: 'Verify Bank Direct Benefit Transfer (DBT) status', description: 'Ensure bank account is NPCI mapped.', priority: 'high' }
    ]
  },

  certificate: {
    processType: 'certificate',
    title: 'Prepare Certificate Application',
    category: 'Government',
    description: 'Documentation for Caste, Birth, Domicile, or Income Certificate issuance.',
    requirements: [
      {
        name: 'Identity Proof',
        category: 'Identity',
        required: true,
        description: 'Aadhaar Card, Voter ID, or Ration Card.',
        acceptedDocTypes: ['aadhaar', 'voter id', 'identity proof']
      },
      {
        name: 'Address Proof',
        category: 'Address',
        required: true,
        description: 'Electricity bill, Ration Card, or Water Bill.',
        acceptedDocTypes: ['address proof', 'utility bill', 'electricity bill']
      },
      {
        name: 'Self Declaration / Affidavit',
        category: 'Official',
        required: true,
        description: 'Signed affidavit or self-declaration form as prescribed.',
        acceptedDocTypes: ['affidavit', 'declaration', 'application form']
      }
    ],
    defaultActions: [
      { title: 'Obtain affidavit from notary if required', description: 'Required for domicile or income verification.', priority: 'medium' },
      { title: 'Submit application on e-District portal', description: 'Upload scanned documents and track acknowledgment number.', priority: 'high' }
    ]
  }
};

/**
 * Classify natural language goal query into library process type
 */
export function classifyGoalRequest(userRequest = '') {
  const query = userRequest.toLowerCase().trim();

  if (query.includes('scholarship') || query.includes('stipend') || query.includes('grant') || query.includes('fee waiver')) {
    return PROCESS_REQUIREMENTS_LIBRARY.scholarship;
  }
  if (query.includes('passport') || query.includes('visa') || query.includes('travel doc')) {
    return PROCESS_REQUIREMENTS_LIBRARY.passport;
  }
  if (query.includes('licence') || query.includes('license') || query.includes('driving') || query.includes('rto') || query.includes('vehicle licence')) {
    return PROCESS_REQUIREMENTS_LIBRARY.driving_licence;
  }
  if (query.includes('college') || query.includes('admission') || query.includes('university') || query.includes('school admission')) {
    return PROCESS_REQUIREMENTS_LIBRARY.college_admission;
  }
  if (query.includes('insurance') || query.includes('policy') || query.includes('claim')) {
    return PROCESS_REQUIREMENTS_LIBRARY.insurance;
  }
  if (query.includes('loan') || query.includes('mortgage') || query.includes('credit')) {
    return PROCESS_REQUIREMENTS_LIBRARY.loan;
  }
  if (query.includes('scheme') || query.includes('yojana') || query.includes('government benefit')) {
    return PROCESS_REQUIREMENTS_LIBRARY.government_scheme;
  }
  if (query.includes('certificate') || query.includes('caste') || query.includes('domicile') || query.includes('income cert')) {
    return PROCESS_REQUIREMENTS_LIBRARY.certificate;
  }

  // Fallback for custom user goal
  const titleWords = userRequest.trim() ? userRequest.trim() : 'Custom Action Plan';
  return {
    processType: 'custom',
    title: titleWords.length > 50 ? titleWords.substring(0, 50) + '...' : titleWords,
    category: 'General',
    description: 'Custom action plan created from your natural language goal.',
    requirements: [
      {
        name: 'Identity & Profile Check',
        category: 'Identity',
        required: true,
        description: 'Valid Aadhaar or official ID proof.',
        acceptedDocTypes: ['aadhaar', 'identity proof', 'pan card', 'passport']
      },
      {
        name: 'Relevant Supporting Document',
        category: 'General',
        required: true,
        description: 'Any relevant document associated with your goal.',
        acceptedDocTypes: ['document', 'certificate', 'proof', 'bill']
      }
    ],
    defaultActions: [
      { title: 'Define key requirements & milestones', description: 'Review your overall objective and break it down into manageable tasks.', priority: 'high' },
      { title: 'Gather necessary supporting documents', description: 'Upload relevant files to your LifeFlow vault for easy tracking.', priority: 'medium' },
      { title: 'Execute step-by-step actions', description: 'Track progress as you complete each stage.', priority: 'medium' }
    ]
  };
}
