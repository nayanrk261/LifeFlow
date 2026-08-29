import { useState } from 'react';
import { FileText, Sparkles, Copy, Download, Share2, Edit3, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const documentTypes = [
  { id: 'scholarship', name: 'Scholarship Application Request', category: 'APPLICATIONS', targetDefault: 'The Tahsildar / Scholarship Officer' },
  { id: 'college_admission', name: 'College Admission Application', category: 'APPLICATIONS', targetDefault: 'The Principal / Dean of Admissions' },
  { id: 'certificate_request', name: 'Certificate Request Letter', category: 'APPLICATIONS', targetDefault: 'The Registrar / Issuing Authority' },
  { id: 'leave_app', name: 'Leave Application', category: 'APPLICATIONS', targetDefault: 'The Principal / Manager' },
  { id: 'lost_doc_complaint', name: 'Lost Document Complaint', category: 'COMPLAINTS', targetDefault: 'The Station House Officer, Police Station' },
  { id: 'general_complaint', name: 'General Grievance Complaint', category: 'COMPLAINTS', targetDefault: 'The Grievance Redressal Officer' },
  { id: 'correction_request', name: 'Document Correction Request', category: 'REQUESTS', targetDefault: 'The Issuing Authority' },
  { id: 'info_request', name: 'Information Request (RTI/General)', category: 'REQUESTS', targetDefault: 'The Public Information Officer' },
  { id: 'self_declaration', name: 'Self Declaration Affidavit', category: 'DECLARATIONS', targetDefault: 'To Whom It May Concern' },
  { id: 'cover_letter', name: 'Formal Cover Letter', category: 'PROFESSIONAL', targetDefault: 'The Hiring Manager' },
];

export default function DocGenerator({ addToast }) {
  const { user, profile } = useAuth();

  // Generator flow steps: 'choose' | 'qa' | 'preview'
  const [genStep, setGenStep] = useState('choose');
  const [selectedType, setSelectedType] = useState(null);

  // Minimal Q&A form answers
  const [qaAnswers, setQaAnswers] = useState({
    addressedTo: '',
    programName: '',
    purpose: '',
    additionalDetails: '',
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const startQa = (docItem) => {
    setSelectedType(docItem);
    setQaAnswers({
      addressedTo: docItem.targetDefault,
      programName: docItem.name.includes('Scholarship') ? 'Post-Matric Merit Scholarship 2025-2026' : '',
      purpose: 'Official submission and process verification',
      additionalDetails: '',
    });
    setGenStep('qa');
  };

  const handleGenerate = () => {
    const name = user?.name || profile?.firstName || 'User';
    const age = profile?.age || 21;
    const location = `${profile?.city || 'Pune'}, ${profile?.state || 'Maharashtra'}`;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    let text = `To,\n${qaAnswers.addressedTo || selectedType.targetDefault}\n${location}\n\nDate: ${dateStr}\n\nSubject: Application regarding ${selectedType.name} - ${qaAnswers.programName || 'Process Request'}\n\nRespected Sir/Madam,\n\nI, ${name}, aged ${age} years, residing at ${location}, respectfully submit this application for ${selectedType.name}.\n\nReason & Purpose:\n${qaAnswers.purpose || 'For official records and process verification.'}\n`;

    if (qaAnswers.programName) {
      text += `\nProgram / Scheme Details:\n${qaAnswers.programName}\n`;
    }

    if (qaAnswers.additionalDetails) {
      text += `\nAdditional Context:\n${qaAnswers.additionalDetails}\n`;
    }

    text += `\nI declare that the information provided above is true and accurate to the best of my knowledge. All supporting documents are attached for your verification.\n\nThanking you,\n\nYours faithfully,\n\n${name}\nPhone / Contact: Available in LifeFlow Vault\nLocation: ${location}\n\n--- Document Generated via LifeFlow Copilot ---`;

    setGeneratedContent(text);
    setGenStep('preview');
  };

  // Export / Download Document
  const handleExportDownload = () => {
    setExporting(true);
    if (addToast) addToast('Generating LifeFlow document download...', 'info');

    setTimeout(() => {
      try {
        const cleanTitle = (selectedType?.name || 'Document').replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `LifeFlow_${cleanTitle}.txt`;
        const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        if (addToast) addToast(`Downloaded ${fileName}`, 'success');
      } catch (err) {
        if (addToast) addToast('Failed to download document file.', 'error');
      } finally {
        setExporting(false);
      }
    }, 600);
  };

  // Share Document
  const handleShare = async () => {
    setSharing(true);
    const title = selectedType?.name || 'LifeFlow Application';

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: generatedContent,
          url: window.location.href,
        });
        if (addToast) addToast('Shared successfully!', 'success');
      } catch (err) {
        // User cancelled or share failed
      } finally {
        setSharing(false);
      }
    } else {
      // Desktop Fallback: Copy link/text
      try {
        await navigator.clipboard.writeText(generatedContent);
        if (addToast) addToast('Document content copied to clipboard (Link & text ready to paste)', 'success');
      } catch (e) {
        if (addToast) addToast('Failed to copy content', 'error');
      } finally {
        setSharing(false);
      }
    }
  };

  // Save Generated Document to MongoDB
  const handleSaveToVault = async () => {
    try {
      await api.createDocument({
        title: selectedType?.name || 'Generated Application',
        documentType: 'Generated Application',
        category: selectedType?.category === 'APPLICATIONS' ? 'Education' : 'Personal',
        source: 'LifeFlow Generator',
        status: 'healthy',
        aiSummary: `Generated document for ${selectedType?.name}. Ready for submission.`,
        extractedData: { content: generatedContent }
      });
      if (addToast) addToast('Document saved to your LifeFlow vault!', 'success');
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to save document', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">AI Application Generator</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Answer a few quick questions to generate properly formatted formal applications, requests, and complaints.
        </p>
      </div>

      {/* STEP 1: CHOOSE DOCUMENT TYPE */}
      {genStep === 'choose' && (
        <div className="space-y-6 fade-in">
          {['APPLICATIONS', 'COMPLAINTS', 'REQUESTS', 'DECLARATIONS', 'PROFESSIONAL'].map(cat => {
            const items = documentTypes.filter(d => d.category === cat);
            return (
              <div key={cat}>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">{cat}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => startQa(item)}
                      className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all text-left group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <FileText size={16} />
                        </div>
                        <p className="text-[14px] font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{item.name}</p>
                      </div>
                      <ArrowRight size={15} className="text-slate-600 group-hover:text-emerald-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 2: MINIMAL Q&A */}
      {genStep === 'qa' && selectedType && (
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 fade-in max-w-2xl">
          <button
            onClick={() => setGenStep('choose')}
            className="text-[13px] text-slate-400 hover:text-white transition-colors"
          >
            ← Back to document options
          </button>

          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Step 2: Minimal Q&A</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{selectedType.name}</h2>
            <p className="text-[13px] text-slate-400 mt-1">Answer these 3 quick questions. LifeFlow will handle the formatting.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-slate-300 mb-1">1. Who is this application addressed to?</label>
              <input
                type="text"
                value={qaAnswers.addressedTo}
                onChange={e => setQaAnswers(a => ({ ...a, addressedTo: e.target.value }))}
                placeholder="e.g. The Tahsildar / Principal / Officer"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-slate-300 mb-1">2. Scheme, Program, or Document Name</label>
              <input
                type="text"
                value={qaAnswers.programName}
                onChange={e => setQaAnswers(a => ({ ...a, programName: e.target.value }))}
                placeholder="e.g. Merit Scholarship 2025 or Passport Renewal"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-slate-300 mb-1">3. What is your reason or purpose?</label>
              <textarea
                value={qaAnswers.purpose}
                onChange={e => setQaAnswers(a => ({ ...a, purpose: e.target.value }))}
                rows={3}
                placeholder="e.g. Submitting income proof for college fee waiver scholarship"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1">4. Any additional details? (Optional)</label>
              <input
                type="text"
                value={qaAnswers.additionalDetails}
                onChange={e => setQaAnswers(a => ({ ...a, additionalDetails: e.target.value }))}
                placeholder="e.g. Roll No: 2025-1049, College: COEP Pune"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px] transition-colors shadow-lg shadow-emerald-950/20"
          >
            <Sparkles size={16} />
            Generate Document with LifeFlow AI
          </button>
        </div>
      )}

      {/* STEP 3: EDITABLE PREVIEW, EXPORT, SHARE */}
      {genStep === 'preview' && (
        <div className="space-y-4 fade-in">
          <button
            onClick={() => setGenStep('qa')}
            className="text-[13px] text-slate-400 hover:text-white transition-colors"
          >
            ← Modify questions
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">{selectedType?.name}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[12px] hover:bg-slate-700"
              >
                <Edit3 size={14} />
                {isEditing ? 'Preview Mode' : 'Edit Text'}
              </button>
              <button
                onClick={handleSaveToVault}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[12px] hover:bg-slate-700"
              >
                Save to Vault
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[12px] hover:bg-slate-700"
              >
                <Share2 size={14} />
                Share
              </button>
              <button
                onClick={handleExportDownload}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg text-[12px] hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                <Download size={14} />
                {exporting ? 'Generating...' : 'Export & Download'}
              </button>
            </div>
          </div>

          <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            {isEditing ? (
              <textarea
                value={generatedContent}
                onChange={e => setGeneratedContent(e.target.value)}
                rows={16}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl p-4 text-[14px] text-slate-200 font-mono focus:outline-none leading-relaxed"
              />
            ) : (
              <pre className="text-[14px] text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {generatedContent}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
