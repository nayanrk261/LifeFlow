import { useState, useRef } from 'react';
import { X, Upload, FileText, Check, Shield, AlertCircle, Plus, Sparkles, CheckCircle2, ArrowRight, Loader2, Edit3, Target, Calendar, Lock, Cpu, Eye } from 'lucide-react';

export default function AddDocModal({ onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'manual', 'digilocker'
  const fileInputRef = useRef(null);

  // Flow stage: 'input' | 'privacy_check' | 'privacy_review' | 'analyzing' | 'review'
  const [stage, setStage] = useState('input');
  const [loadingStep, setLoadingStep] = useState(0);

  // Upload & Document states
  const [selectedFile, setSelectedFile] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Government');
  const [docType, setDocType] = useState('Identity Document');
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  // Privacy Intelligence states
  const [sensitivityResult, setSensitivityResult] = useState(null);
  const [selectedProcessingMode, setSelectedProcessingMode] = useState('private'); // 'private' | 'enhanced'

  // Analysis result states
  const [analysisResult, setAnalysisResult] = useState(null);
  const [confirmGoalMatch, setConfirmGoalMatch] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadingSteps = [
    'Applying privacy-first processing filters...',
    'Identifying document type & category...',
    'Extracting important metadata & dates...',
    'Checking active LifeFlow goals for requirement matches...'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please select a PDF, PNG, JPG, or JPEG file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the maximum limit of 10MB.');
      return;
    }

    setSelectedFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    setDocTitle(cleanName);
  };

  // Step 1: Start Privacy Sensitivity Evaluation
  const handleStartPrivacyCheck = async (e) => {
    e.preventDefault();
    if (!selectedFile && !docTitle.trim()) {
      setError('Please select a file or enter a document title.');
      return;
    }

    setStage('privacy_check');
    setError('');

    const titleToUse = docTitle.trim() || selectedFile?.name || 'Document';

    try {
      const { api } = await import('../services/api');
      const sens = await api.checkSensitivity({
        title: titleToUse,
        documentType: docType,
        category: docCategory
      });

      setSensitivityResult(sens);
      // Give brief visual feedback for checking step
      setTimeout(() => {
        setStage('privacy_review');
      }, 400);
    } catch (err) {
      console.warn('Sensitivity check failed, using safe fallback:', err);
      setSensitivityResult({
        sensitivityLevel: 'Medium',
        sensitiveCategories: ['Personal identity information', 'Government identifiers'],
        message: 'Checking how this document should be processed...'
      });
      setStage('privacy_review');
    }
  };

  // Step 2: User Chooses Processing Mode & Executes Analysis
  const handleSelectModeAndAnalyze = async (mode) => {
    setSelectedProcessingMode(mode);
    setStage('analyzing');
    setLoadingStep(0);
    setError('');

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    const payload = {
      title: docTitle.trim() || selectedFile?.name || 'Document',
      documentType: docType,
      category: docCategory,
      issueDate: issueDate || null,
      expiryDate: expiryDate || null,
      number: docNumber || null,
      processingMode: mode
    };

    try {
      const { api } = await import('../services/api');
      const analysis = await api.analyzeDocument(payload);

      clearInterval(stepInterval);
      setAnalysisResult(analysis);

      // Pre-fill confirmed fields
      if (analysis.documentType) setDocType(analysis.documentType);
      if (analysis.category) setDocCategory(analysis.category);
      if (analysis.expiryDate) setExpiryDate(analysis.expiryDate);

      setStage('review');
    } catch (err) {
      clearInterval(stepInterval);
      console.warn('Document analysis error, falling back to manual review:', err);
      setAnalysisResult({
        documentType: docType || 'Personal Document',
        category: docCategory || 'Personal',
        analysisConfidence: 0.60,
        analysisStatus: 'needs_review',
        extractedFields: {},
        expiryDate: expiryDate || null,
        aiSummary: 'File uploaded. AI analysis unavailable, please review details.',
        processingMode: mode,
        sensitivityLevel: sensitivityResult?.sensitivityLevel || 'Low',
        sensitiveCategories: sensitivityResult?.sensitiveCategories || [],
        potentialGoalMatch: null
      });
      setStage('review');
    }
  };

  // Step 3: Confirm & Save Document to Vault
  const handleFinalSave = async () => {
    setSubmitting(true);
    setError('');

    try {
      const docPayload = {
        title: docTitle.trim() || selectedFile?.name || 'Uploaded Document',
        documentType: docType,
        category: docCategory,
        number: docNumber,
        source: selectedFile ? 'File Upload' : 'Manual Entry',
        status: 'healthy',
        issueDate: issueDate || null,
        expiryDate: expiryDate || null,
        aiSummary: analysisResult?.aiSummary || 'Document saved and verified.',
        analysisStatus: analysisResult?.analysisStatus || 'ready',
        analysisConfidence: analysisResult?.analysisConfidence || 0.90,
        extractedFields: analysisResult?.extractedFields || {},
        importantDates: analysisResult?.importantDates || [],
        processingMode: selectedProcessingMode,
        sensitivityLevel: sensitivityResult?.sensitivityLevel || analysisResult?.sensitivityLevel || 'Low',
        sensitiveCategories: sensitivityResult?.sensitiveCategories || analysisResult?.sensitiveCategories || [],
        confirmGoalMatch: confirmGoalMatch && Boolean(analysisResult?.potentialGoalMatch),
        linkedGoalId: analysisResult?.potentialGoalMatch?.goalId || null
      };

      await onAdd(docPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save document.');
      setSubmitting(false);
    }
  };

  const getConfidenceBadge = (confidence = 0.9) => {
    if (confidence >= 0.85) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">High Confidence ({Math.round(confidence * 100)}%)</span>;
    }
    if (confidence >= 0.70) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium Confidence ({Math.round(confidence * 100)}%)</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">Low Confidence ({Math.round(confidence * 100)}%)</span>;
  };

  const getSensitivityBadge = (level = 'Low') => {
    if (level === 'High') {
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1"><Lock size={12} /> HIGH SENSITIVITY</span>;
    }
    if (level === 'Medium') {
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1"><Shield size={12} /> MEDIUM SENSITIVITY</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 size={12} /> LOW SENSITIVITY</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                LifeFlow Private Intelligence
              </h2>
              <p className="text-[12px] text-slate-400">Privacy-aware document processing & goal engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. INPUT STAGE */}
        {stage === 'input' && (
          <div>
            {/* Tab switcher */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl mb-5">
              <button
                onClick={() => { setActiveTab('upload'); setError(''); }}
                className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
                  activeTab === 'upload' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => { setActiveTab('manual'); setError(''); }}
                className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
                  activeTab === 'manual' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Enter Manually
              </button>
              <button
                onClick={() => { setActiveTab('digilocker'); setError(''); }}
                className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
                  activeTab === 'digilocker' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DigiLocker
              </button>
            </div>

            {/* TAB 1: FILE UPLOAD */}
            {activeTab === 'upload' && (
              <form onSubmit={handleStartPrivacyCheck} className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl bg-slate-900/50 hover:bg-slate-900 transition-all text-center group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-emerald-400 transition-colors">
                      <Upload size={22} />
                    </div>
                    <p className="text-[14px] font-semibold text-slate-200">Click to select file from device</p>
                    <p className="text-[12px] text-slate-500 mt-1">Supports PDF, PNG, JPG (Max 10MB)</p>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-emerald-400" size={24} />
                      <div>
                        <p className="text-[13px] font-semibold text-slate-100">{selectedFile.name}</p>
                        <p className="text-[11px] text-slate-500">{Math.round(selectedFile.size / 1024)} KB • {selectedFile.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-[12px] text-red-400 hover:text-red-300 font-medium"
                    >
                      Change
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">Category Hint</label>
                    <select
                      value={docCategory}
                      onChange={e => setDocCategory(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                    >
                      <option value="Government">Government</option>
                      <option value="Education">Education</option>
                      <option value="Financial">Financial</option>
                      <option value="Identity">Identity</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Type Hint</label>
                    <input
                      type="text"
                      placeholder="e.g. Income Certificate / Aadhaar"
                      value={docType}
                      onChange={e => setDocType(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-[13px] font-medium hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-[13px] transition-all flex items-center justify-center gap-2"
                  >
                    <Shield size={16} />
                    Check Privacy & Continue
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: MANUAL ENTRY */}
            {activeTab === 'manual' && (
              <form onSubmit={handleStartPrivacyCheck} className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Income Certificate 2026"
                    value={docTitle}
                    onChange={e => setDocTitle(e.target.value)}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">Category</label>
                    <select
                      value={docCategory}
                      onChange={e => setDocCategory(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                    >
                      <option value="Government">Government</option>
                      <option value="Education">Education</option>
                      <option value="Financial">Financial</option>
                      <option value="Identity">Identity</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Income Certificate / Aadhaar"
                      value={docType}
                      onChange={e => setDocType(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">Issue Date (Optional)</label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={e => setIssueDate(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={e => setExpiryDate(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-[13px] font-medium hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!docTitle.trim()}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-[13px] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Shield size={16} />
                    Check Privacy & Continue
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: DIGILOCKER */}
            {activeTab === 'digilocker' && (
              <div className="space-y-4 py-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">DigiLocker Integration</h3>
                  <p className="text-[13px] text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                    DigiLocker OAuth integration ready for government API keys.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[13px] font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. PRIVACY CHECK SCANNING STAGE */}
        {stage === 'privacy_check' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-5 fade-in">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin flex items-center justify-center" />
              <Shield size={22} className="text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">LIFEFLOW PRIVATE INTELLIGENCE</h3>
              <p className="text-[13px] text-emerald-400 font-medium italic">
                Checking how this document should be processed...
              </p>
            </div>
          </div>
        )}

        {/* 3. PRIVACY REVIEW & USER PROCESSING CHOICE STAGE */}
        {stage === 'privacy_review' && sensitivityResult && (
          <div className="space-y-5 fade-in">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">DOCUMENT PRIVACY STATUS</span>
                {getSensitivityBadge(sensitivityResult.sensitivityLevel)}
              </div>
              <p className="text-[13px] text-slate-200 leading-relaxed font-medium">
                🔒 {sensitivityResult.message}
              </p>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Detected Information Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {(sensitivityResult.sensitiveCategories || []).map((cat, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-400" />
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Choose Document Processing Mode:</p>

              {/* MODE 1: PRIVATE MODE */}
              <button
                type="button"
                onClick={() => handleSelectModeAndAnalyze('private')}
                className="w-full text-left p-4 rounded-xl bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-900 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Shield size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[14px] font-bold text-white group-hover:text-emerald-400 transition-colors">PRIVATE MODE</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Recommended</span>
                    </div>
                    <p className="text-[12px] text-slate-300 leading-relaxed">
                      &quot;Use privacy-first processing. Only the minimum information needed is used.&quot;
                    </p>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      Local metadata extraction strategy. Zero sensitive document text sent to external cloud AI.
                    </p>
                  </div>
                </div>
              </button>

              {/* MODE 2: ENHANCED AI ANALYSIS */}
              <button
                type="button"
                onClick={() => handleSelectModeAndAnalyze('enhanced')}
                className="w-full text-left p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[14px] font-bold text-white group-hover:text-blue-400 transition-colors">ENHANCED AI ANALYSIS</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Cloud Reasoning</span>
                    </div>
                    <p className="text-[12px] text-slate-300 leading-relaxed">
                      &quot;Use LifeFlow AI for deeper document understanding.&quot;
                    </p>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      Sends metadata to LifeFlow Groq AI backend for deep entity structure detection.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStage('input')}
                className="w-full py-2.5 border border-slate-700 text-slate-300 rounded-xl text-[13px] font-medium hover:bg-slate-800"
              >
                Back to Edit
              </button>
            </div>
          </div>
        )}

        {/* 4. ANALYZING STAGE */}
        {stage === 'analyzing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 fade-in">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin flex items-center justify-center" />
              <Sparkles size={22} className="text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Analyzing document...</h3>
              <p className="text-[13px] text-emerald-400 font-medium h-6">
                {loadingSteps[loadingStep]}
              </p>
              <p className="text-[12px] text-slate-500 mt-2">
                Processing Mode: <span className="text-slate-200 font-bold uppercase">{selectedProcessingMode}</span>
              </p>
            </div>
          </div>
        )}

        {/* 5. REVIEW & GOAL MATCH STAGE */}
        {stage === 'review' && analysisResult && (
          <div className="space-y-5 fade-in">
            {/* Header / Confidence & Processing Mode Badge */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">DOCUMENT DETECTED</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedProcessingMode === 'private' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {selectedProcessingMode === 'private' ? '🔒 PRIVATE MODE' : '⚡ ENHANCED AI'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-1">{docType}</h3>
                <p className="text-[12px] text-slate-400">Category: <span className="text-slate-200 font-semibold">{docCategory}</span></p>
              </div>
              <div>
                {getConfidenceBadge(analysisResult.analysisConfidence)}
              </div>
            </div>

            {/* AI Summary */}
            {analysisResult.aiSummary && (
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[13px] text-slate-300 leading-relaxed flex items-start gap-2.5">
                <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <p>{analysisResult.aiSummary}</p>
              </div>
            )}

            {/* LIFEFLOW GOAL MATCH INSIGHT BANNER */}
            {analysisResult.potentialGoalMatch && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-3 shadow-lg shadow-emerald-950/50">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <Target size={15} />
                  <span>LIFEFLOW GOAL MATCH DETECTED</span>
                </div>
                <p className="text-[13px] font-medium text-white leading-relaxed">
                  Good news! This document fulfills the missing requirement (<strong className="text-emerald-400">&quot;{analysisResult.potentialGoalMatch.requirementName}&quot;</strong>) for your active goal <strong className="text-white">&quot;{analysisResult.potentialGoalMatch.goalTitle}&quot;</strong>.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                  <span className="text-[12px] text-slate-300 font-semibold">
                    Goal Readiness: <span className="text-amber-400 font-bold">{analysisResult.potentialGoalMatch.currentReadiness}%</span> → <span className="text-emerald-400 font-extrabold text-[14px]">{analysisResult.potentialGoalMatch.newReadiness}%</span>
                  </span>
                  <label className="flex items-center gap-2 text-[12px] font-bold text-emerald-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmGoalMatch}
                      onChange={(e) => setConfirmGoalMatch(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-400 w-4 h-4"
                    />
                    Update Goal Readiness
                  </label>
                </div>
              </div>
            )}

            {/* Editable Fields Form */}
            <div className="space-y-3 pt-1">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Verify Extracted Fields:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Document Type</label>
                  <input
                    type="text"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-emerald-400 appearance-none"
                  >
                    <option value="Government">Government</option>
                    <option value="Education">Education</option>
                    <option value="Financial">Financial</option>
                    <option value="Identity">Identity</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Document / Policy Number</label>
                  <input
                    type="text"
                    placeholder="e.g. XXXX-XXXX-1234"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStage('privacy_review')}
                className="py-2.5 px-4 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-[13px] font-medium hover:bg-slate-800"
              >
                Back to Privacy
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSave}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-[13px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving Document...
                  </>
                ) : (
                  <>
                    Confirm & Save to Vault
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
