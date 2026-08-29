// DocAction — Mock Data Layer
// All seeded data for the Phase 1 prototype

export const userProfile = {
  id: 'user-001',
  name: 'Rahul Sharma',
  firstName: 'Rahul',
  age: 21,
  state: 'Maharashtra',
  occupation: 'Student',
  occupationType: 'student',
  ownsVehicle: true,
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  avatar: null,
  digilockerConnected: true,
  createdAt: '2026-08-01',
};

export const familyMembers = [
  {
    id: 'family-001',
    name: 'Rahul Sharma',
    relation: 'Self',
    age: 21,
    documentsCount: 10,
    healthy: 7,
    expiring: 2,
    missing: 1,
    avatar: null,
  },
  {
    id: 'family-002',
    name: 'Suresh Sharma',
    relation: 'Father',
    age: 52,
    documentsCount: 8,
    healthy: 6,
    expiring: 1,
    missing: 1,
    highlight: 'Vehicle insurance expires in 21 days.',
    avatar: null,
  },
  {
    id: 'family-003',
    name: 'Meena Sharma',
    relation: 'Mother',
    age: 48,
    documentsCount: 6,
    healthy: 5,
    expiring: 1,
    missing: 0,
    highlight: 'Passport expiring in 4 months.',
    avatar: null,
  },
];

export const documents = [
  {
    id: 'doc-001',
    name: 'Aadhaar Card',
    type: 'Government',
    subtype: 'Identity',
    status: 'healthy',
    issueDate: '2020-03-15',
    expiryDate: null,
    actionRequired: false,
    action: null,
    priority: null,
    number: 'XXXX XXXX 4521',
    issuedBy: 'UIDAI',
    aiSummary: 'Your Aadhaar card is active and verified through DigiLocker. No action is required at this time.',
    icon: 'fingerprint',
    source: 'DigiLocker',
  },
  {
    id: 'doc-002',
    name: 'PAN Card',
    type: 'Financial',
    subtype: 'Tax Identity',
    status: 'healthy',
    issueDate: '2021-06-20',
    expiryDate: null,
    actionRequired: false,
    action: null,
    priority: null,
    number: 'ABCPS1234K',
    issuedBy: 'Income Tax Department',
    aiSummary: 'Your PAN card is active. It is linked to your Aadhaar as required by current regulations.',
    icon: 'credit-card',
    source: 'DigiLocker',
  },
  {
    id: 'doc-003',
    name: 'Driving Licence',
    type: 'Government',
    subtype: 'Vehicle',
    status: 'healthy',
    issueDate: '2023-04-10',
    expiryDate: '2027-04-10',
    actionRequired: false,
    action: null,
    priority: 'low',
    number: 'MH-02-2023-XXXXXXX',
    issuedBy: 'RTO Maharashtra',
    aiSummary: 'Your driving licence is valid until April 2027. No immediate action is required.',
    icon: 'car',
    source: 'DigiLocker',
  },
  {
    id: 'doc-004',
    name: 'Vehicle Insurance',
    type: 'Financial',
    subtype: 'Vehicle',
    status: 'expiring',
    issueDate: '2025-10-12',
    expiryDate: '2026-10-12',
    actionRequired: true,
    action: 'Renew vehicle insurance',
    priority: 'high',
    number: 'POL-2025-MH-98765',
    issuedBy: 'ICICI Lombard',
    aiSummary: 'Your vehicle insurance expires on October 12, 2026. That is approximately 44 days from now. Renewing before expiry helps avoid a lapse in coverage and potential legal issues while driving.',
    whyItMatters: 'Your insurance expires in 44 days. Renewing before expiry helps avoid a lapse in coverage.',
    icon: 'shield',
    source: 'Personal Upload',
  },
  {
    id: 'doc-005',
    name: '12th Marksheet',
    type: 'Education',
    subtype: 'Academic',
    status: 'healthy',
    issueDate: '2023-06-15',
    expiryDate: null,
    actionRequired: false,
    action: null,
    priority: null,
    number: 'MH-HSC-2023-123456',
    issuedBy: 'Maharashtra State Board',
    aiSummary: 'Your 12th standard marksheet is verified. It may be required for college admissions, scholarship applications, and competitive exam registrations.',
    icon: 'graduation-cap',
    source: 'DigiLocker',
  },
  {
    id: 'doc-006',
    name: 'College ID',
    type: 'Education',
    subtype: 'Identity',
    status: 'healthy',
    issueDate: '2023-08-01',
    expiryDate: '2027-06-30',
    actionRequired: false,
    action: null,
    priority: null,
    number: 'STU-2023-4567',
    issuedBy: 'University of Mumbai',
    aiSummary: 'Your college ID is valid through your expected graduation date. It serves as student identity verification.',
    icon: 'badge',
    source: 'Personal Upload',
  },
  {
    id: 'doc-007',
    name: 'Bank Account Proof',
    type: 'Financial',
    subtype: 'Banking',
    status: 'healthy',
    issueDate: '2023-09-01',
    expiryDate: null,
    actionRequired: false,
    action: null,
    priority: null,
    number: 'SBI A/C XXXXXX7890',
    issuedBy: 'State Bank of India',
    aiSummary: 'Your bank account passbook serves as proof of your active savings account. This is commonly required for scholarship disbursements and financial aid applications.',
    icon: 'landmark',
    source: 'Personal Upload',
  },
  {
    id: 'doc-008',
    name: 'Scholarship Notice',
    type: 'Education',
    subtype: 'Notice',
    status: 'attention',
    issueDate: '2026-07-15',
    expiryDate: null,
    deadline: '2026-09-10',
    actionRequired: true,
    action: 'Submit scholarship application',
    priority: 'high',
    number: 'SCH-MH-2026-789',
    issuedBy: 'Directorate of Higher Education, Maharashtra',
    aiSummary: 'This scholarship notice has a submission deadline of September 10, 2026. You currently have 3 of 4 required documents. Your income certificate is missing.',
    whyItMatters: 'The scholarship application deadline is September 10. You are missing your income certificate, which is a required supporting document.',
    icon: 'award',
    source: 'Personal Upload',
  },
  {
    id: 'doc-009',
    name: 'Income Certificate',
    type: 'Government',
    subtype: 'Financial',
    status: 'missing',
    issueDate: null,
    expiryDate: null,
    actionRequired: true,
    action: 'Obtain income certificate',
    priority: 'high',
    number: null,
    issuedBy: null,
    aiSummary: 'An income certificate is not currently available in your document collection. Based on your profile and the scholarship workflow you are preparing for, this document is potentially relevant.',
    whyItMatters: 'Your selected scholarship workflow lists an income certificate among its supporting documents.',
    relevantFor: 'Scholarship application',
    howToGet: 'Apply through your local Tahsildar office or the Maharashtra Aaple Sarkar portal. You will typically need your Aadhaar, ration card, and a salary slip or self-declaration.',
    icon: 'file-text',
    source: null,
  },
  {
    id: 'doc-010',
    name: 'Passport',
    type: 'Government',
    subtype: 'Travel',
    status: 'not-available',
    issueDate: null,
    expiryDate: null,
    actionRequired: false,
    action: null,
    priority: null,
    number: null,
    issuedBy: null,
    aiSummary: 'A passport is not currently available in your document collection. This may be relevant if you plan to travel internationally or apply for programs requiring travel documentation.',
    relevantFor: 'International travel, Study abroad programs',
    howToGet: 'Apply through the Passport Seva portal (passportindia.gov.in). You will need your Aadhaar, PAN, and address proof.',
    icon: 'globe',
    source: null,
  },
];

export const workflows = [
  {
    id: 'wf-001',
    name: 'Scholarship Application',
    description: 'Maharashtra State Merit Scholarship 2026',
    deadline: '2026-09-10',
    requiredDocuments: [
      { name: 'Aadhaar Card', docId: 'doc-001', status: 'available' },
      { name: '12th Marksheet', docId: 'doc-005', status: 'available' },
      { name: 'Bank Account Proof', docId: 'doc-007', status: 'available' },
      { name: 'Income Certificate', docId: 'doc-009', status: 'missing' },
    ],
    readinessPercent: 75,
    missingCount: 1,
    icon: 'award',
  },
  {
    id: 'wf-002',
    name: 'Passport Application',
    description: 'Fresh Passport — Normal Application',
    deadline: null,
    requiredDocuments: [
      { name: 'Aadhaar Card', docId: 'doc-001', status: 'available' },
      { name: 'PAN Card', docId: 'doc-002', status: 'available' },
      { name: '10th or 12th Marksheet', docId: 'doc-005', status: 'available' },
      { name: 'Bank Account Proof', docId: 'doc-007', status: 'available' },
    ],
    readinessPercent: 100,
    missingCount: 0,
    icon: 'globe',
  },
  {
    id: 'wf-003',
    name: 'Vehicle Registration Transfer',
    description: 'Transfer of vehicle ownership within Maharashtra',
    deadline: null,
    requiredDocuments: [
      { name: 'Aadhaar Card', docId: 'doc-001', status: 'available' },
      { name: 'PAN Card', docId: 'doc-002', status: 'available' },
      { name: 'Vehicle Insurance', docId: 'doc-004', status: 'available' },
      { name: 'Driving Licence', docId: 'doc-003', status: 'available' },
      { name: 'Vehicle RC', docId: null, status: 'missing' },
    ],
    readinessPercent: 80,
    missingCount: 1,
    icon: 'car',
  },
];

export const reminders = [
  {
    id: 'rem-001',
    title: 'Renew vehicle insurance',
    date: '2026-10-01',
    documentId: 'doc-004',
    priority: 'high',
    completed: false,
    category: 'upcoming',
  },
  {
    id: 'rem-002',
    title: 'Submit scholarship application',
    date: '2026-09-10',
    documentId: 'doc-008',
    priority: 'high',
    completed: false,
    category: 'this-week',
  },
  {
    id: 'rem-003',
    title: 'Obtain income certificate',
    date: '2026-09-05',
    documentId: 'doc-009',
    priority: 'medium',
    completed: false,
    category: 'this-week',
  },
  {
    id: 'rem-004',
    title: 'Driving licence renewal',
    date: '2027-04-10',
    documentId: 'doc-003',
    priority: 'low',
    completed: false,
    category: 'later',
  },
];

export const vaultCategories = [
  { id: 'vc-1', name: 'Personal', count: 3, icon: 'user' },
  { id: 'vc-2', name: 'Education', count: 3, icon: 'graduation-cap' },
  { id: 'vc-3', name: 'Financial', count: 3, icon: 'landmark' },
  { id: 'vc-4', name: 'Legal', count: 0, icon: 'scale' },
  { id: 'vc-5', name: 'Other', count: 1, icon: 'folder' },
];

export const aiResponses = {
  'what documents need my attention': {
    text: 'Based on your document collection, two items need your attention:\n\n1. **Vehicle Insurance** — expires on October 12, 2026 (44 days from now). You should initiate renewal before the expiry date to avoid a coverage lapse.\n\n2. **Scholarship Application** — the deadline is September 10, 2026 (12 days from now). You are currently missing your **income certificate**, which is listed as a required supporting document.',
    sources: ['Vehicle Insurance', 'Scholarship Notice', 'Your Profile'],
  },
  'when does my insurance expire': {
    text: 'Your **vehicle insurance** (Policy: POL-2025-MH-98765, issued by ICICI Lombard) expires on **October 12, 2026**. That is approximately 44 days from now.\n\nI recommend setting a reminder to begin the renewal process at least 2 weeks before expiry.',
    sources: ['Vehicle Insurance'],
  },
  'what am i missing for my scholarship': {
    text: 'For the **Maharashtra State Merit Scholarship 2026**, you have 3 of 4 required documents:\n\n✓ Aadhaar Card\n✓ 12th Marksheet\n✓ Bank Account Proof\n✗ **Income Certificate** — missing\n\nYou can obtain an income certificate through your local Tahsildar office or the Maharashtra Aaple Sarkar portal.',
    sources: ['Scholarship Notice', 'Your Documents'],
  },
  'am i ready to apply': {
    text: 'It depends on which application you mean:\n\n**Scholarship Application** — 75% ready. You are missing your income certificate. The deadline is September 10, 2026.\n\n**Passport Application** — 100% ready. You have all 4 required documents available.\n\n**Vehicle Registration Transfer** — 80% ready. You are missing your Vehicle RC.',
    sources: ['Scholarship Requirements', 'Passport Requirements', 'Your Documents'],
  },
  'what should i do next': {
    text: 'Based on your current deadlines and document status, here is my recommended priority order:\n\n1. **Obtain your income certificate** — this is blocking your scholarship application and the deadline is September 10 (12 days away).\n\n2. **Submit scholarship application** — once you have the income certificate, submit before September 10.\n\n3. **Renew vehicle insurance** — your policy expires October 12. Start the renewal process by late September.\n\n4. No other documents require immediate action.',
    sources: ['Your Documents', 'Scholarship Notice', 'Vehicle Insurance'],
  },
  'default': {
    text: 'I can help you understand your documents and what actions they require. Try asking me:\n\n• "What documents need my attention?"\n• "When does my insurance expire?"\n• "What am I missing for my scholarship?"\n• "Am I ready to apply?"\n• "What should I do next?"',
    sources: ['DocAction Knowledge Base'],
  },
};

export const documentTemplates = [
  {
    id: 'tpl-001',
    name: 'Income Certificate Application',
    type: 'Application',
    icon: 'file-text',
    content: `To,
The Tahsildar,
{taluka} Tahsil Office,
District: {district}, Maharashtra

Subject: Application for Income Certificate

Respected Sir/Madam,

I, {name}, son/daughter of {fatherName}, residing at {address}, respectfully submit this application for the issuance of an Income Certificate for the financial year 2025-2026.

The certificate is required for the purpose of applying for the Maharashtra State Merit Scholarship 2026 (Reference: SCH-MH-2026-789).

Details:
- Full Name: {name}
- Aadhaar Number: XXXX XXXX 4521
- Occupation: Student
- Annual Family Income: Rs. {income}/-

I have enclosed the following supporting documents:
1. Copy of Aadhaar Card
2. Copy of Ration Card
3. Self-Declaration of Income

I request you to kindly process this application and issue the income certificate at the earliest.

Thanking you,

Yours faithfully,
{name}
Date: {date}
Place: {place}`,
  },
  {
    id: 'tpl-002',
    name: 'Complaint Letter',
    type: 'Complaint',
    icon: 'alert-circle',
    content: `To,
The {authority},
{department},
{address}

Subject: Complaint regarding {subject}

Respected Sir/Madam,

I, {name}, bearing {idType} number {idNumber}, wish to bring to your attention the following matter:

{complaintDetails}

I have previously attempted to resolve this matter through {previousAttempts}, but have not received a satisfactory response.

I kindly request your intervention in this matter and look forward to a prompt resolution.

Attached Documents:
{attachedDocs}

Thanking you,

Yours faithfully,
{name}
Contact: {phone}
Date: {date}`,
  },
  {
    id: 'tpl-003',
    name: 'Request Letter',
    type: 'Request',
    icon: 'mail',
    content: `To,
The {authority},
{department},
{address}

Subject: Request for {subject}

Respected Sir/Madam,

I, {name}, respectfully submit this request for {requestDetails}.

The relevant details are as follows:
- Name: {name}
- Reference Number: {refNumber}
- Purpose: {purpose}

I have enclosed the necessary supporting documents for your reference.

I request you to kindly consider this application and process it at the earliest convenience.

Thanking you,

Yours faithfully,
{name}
Date: {date}`,
  },
  {
    id: 'tpl-004',
    name: 'Declaration',
    type: 'Declaration',
    icon: 'file-check',
    content: `SELF-DECLARATION

I, {name}, son/daughter of {fatherName}, aged {age} years, residing at {address}, do hereby solemnly declare that:

1. {declarationPoint1}
2. {declarationPoint2}
3. {declarationPoint3}

I declare that the above information is true and correct to the best of my knowledge and belief. I understand that any false statement may result in legal consequences.

Signature: _______________
Name: {name}
Date: {date}
Place: {place}

Verification:
Verified by: _______________
Date: _______________`,
  },
];

export const notifications = [
  {
    id: 'notif-001',
    title: 'Vehicle Insurance expiring soon',
    message: 'Your vehicle insurance expires on Oct 12, 2026.',
    time: '2 hours ago',
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-002',
    title: 'Scholarship deadline approaching',
    message: 'The scholarship application deadline is Sep 10, 2026.',
    time: '1 day ago',
    read: false,
    type: 'urgent',
  },
  {
    id: 'notif-003',
    title: 'Documents analyzed',
    message: '10 documents were analyzed and categorized.',
    time: '3 days ago',
    read: true,
    type: 'info',
  },
];

// Utility: get days until a date
export function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
}

// Utility: format date
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Utility: get status color class
export function getStatusColor(status) {
  switch (status) {
    case 'healthy': return 'text-emerald-400';
    case 'expiring': return 'text-amber-400';
    case 'attention': return 'text-amber-400';
    case 'missing': return 'text-red-400';
    case 'not-available': return 'text-slate-500';
    default: return 'text-slate-400';
  }
}

export function getStatusBg(status) {
  switch (status) {
    case 'healthy': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
    case 'expiring': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
    case 'attention': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
    case 'missing': return 'bg-red-400/10 text-red-400 border-red-400/20';
    case 'not-available': return 'bg-slate-400/10 text-slate-500 border-slate-400/20';
    default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'healthy': return 'Healthy';
    case 'expiring': return 'Expiring Soon';
    case 'attention': return 'Attention';
    case 'missing': return 'Missing';
    case 'not-available': return 'Not Available';
    default: return status;
  }
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'text-red-400';
    case 'medium': return 'text-amber-400';
    case 'low': return 'text-emerald-400';
    default: return 'text-slate-400';
  }
}
