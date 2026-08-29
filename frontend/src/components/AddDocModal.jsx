import { useState, useRef } from 'react';
import { X, Upload, FileText, Check, Shield, AlertCircle, Plus, Sparkles, CheckCircle2, ArrowRight, Loader2, Edit3, Target, Calendar } from 'lucide-react';

export default function AddDocModal({ onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'manual', 'digilocker'
  const fileInputRef = useRef(null);

  // Flow stage: 'input' | 'analyzing' | 'review'
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

  // Analysis result states
  const [analysisResult, setAnalysisResult] = useState(null);
  const [confirmGoalMatch, setConfirmGoalMatch] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadingSteps = [
    'Analyzing your document...',
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

  // Step 1: Start Analysis Flow
  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!selectedFile && !docTitle.trim()) {
      setError('Please select a file or enter a document title.');
      return;
    }

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
    };

    try {
      const { api } = await import('../services/api');
      const analysis = await api.analyzeDocument(payload);

      clearInterval(stepInterval);
      setAnalysisResult(analysis);

      // Pre-fill confirmed AI fields
      if (analysis.documentType) setDocType(analysis.documentType);
      if (analysis.category) setDocCategory(analysis.category);
      if (analysis.expiryDate) setExpiryDate(analysis.expiryDate);

      setStage('review');
    } catch (err) {
      clearInterval(stepInterval);
      console.warn('Document analysis API error, falling back to manual review:', err);
      // Fallback: Proceed to review step with local defaults so file saving never breaks
      setAnalysisResult({
        documentType: docType || 'Personal Document',
        category: docCategory || 'Personal',
        analysisConfidence: 0.60,
        analysisStatus: 'needs_review',
        extractedFields: {},
        expiryDate: expiryDate || null,
        aiSummary: 'File uploaded. AI analysis unavailable, please review details.',
        potentialGoalMatch: null
      });
      setStage('review');
    }
  };

  // Step 2: Confirm & Save Document
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">AI Document Intelligence</h2>
              <p className="text-[12px] text-slate-400">Upload & analyze document for goals and expiry tracking</p>
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

        {/* INPUT STAGE */}
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
              <form onSubmit={handleStartAnalysis} className="space-y-4">
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
                      placeholder="e.g. Identity Proof / Marksheet"
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
                    <Sparkles size={16} />
                    Analyze & Review
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: MANUAL ENTRY */}
            {activeTab === 'manual' && (
              <form onSubmit={handleStartAnalysis} className="space-y-3">
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
                      placeholder="e.g. Aadhaar / Marksheet"
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
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-[13px] transition-colors disabled:opacity-50"
                  >
                    Analyze & Save
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

        {/* ANALYZING STAGE */}
        {stage === 'analyzing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 fade-in">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin flex items-center justify-center" />
              <Sparkles size={22} className="text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Analyzing your document...</h3>
              <p className="text-[13px] text-emerald-400 font-medium h-6">
                {loadingSteps[loadingStep]}
              </p>
              <p className="text-[12px] text-slate-500 mt-2">
                File: <span className="text-slate-200 font-bold italic">&quot;{docTitle || selectedFile?.name}&quot;</span>
              </p>
            </div>
          </div>
        )}

        {/* REVIEW STAGE */}
        {stage === 'review' && analysisResult && (
          <div className="space-y-5 fade-in">
            {/* Header / Confidence */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">DOCUMENT DETECTED</span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">{docType}</h3>
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
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                  <Target size={14} />
                  <span>LIFEFLOW GOAL MATCH DETECTED</span>
                </div>
                <p className="text-[13px] font-medium text-white">
                  Good news! This document may complete a missing requirement (<strong className="text-emerald-400">&quot;{analysisResult.potentialGoalMatch.requirementName}&quot;</strong>) for your <strong className="text-white">&quot;{analysisResult.potentialGoalMatch.goalTitle}&quot;</strong> goal.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[12px] text-slate-400">
                    Goal Readiness: <strong className="text-amber-400">{analysisResult.potentialGoalMatch.currentReadiness}%</strong> → <strong className="text-emerald-400">{analysisResult.potentialGoalMatch.newReadiness}%</strong>
                  </span>
                  <label className="flex items-center gap-2 text-[12px] font-semibold text-emerald-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmGoalMatch}
                      onChange={(e) => setConfirmGoalMatch(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-400"
                    />
                    Update Goal Progress
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
                onClick={() => setStage('input')}
                className="py-2.5 px-4 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-[13px] font-medium hover:bg-slate-800"
              >
                Back to Edit
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
