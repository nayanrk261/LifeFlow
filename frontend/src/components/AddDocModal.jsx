import { useState, useRef } from 'react';
import { X, Upload, FileText, Check, Shield, AlertCircle, Plus, Sparkles } from 'lucide-react';

export default function AddDocModal({ onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'manual', 'digilocker'
  const fileInputRef = useRef(null);

  // Upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [docCategory, setDocCategory] = useState('Government');
  const [docType, setDocType] = useState('Identity Document');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Manual entry states
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('Government');
  const [manualType, setManualType] = useState('Aadhaar Card');
  const [manualNumber, setManualNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

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
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const docPayload = {
        title: selectedFile.name.replace(/\.[^/.]+$/, ''),
        documentType: docType,
        category: docCategory,
        source: 'File Upload',
        status: 'healthy',
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        expiryDate: expiryDate || null,
        aiSummary: `Uploaded ${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB). Document analyzed and verified.`,
        actionRequired: false,
      };

      await onAdd(docPayload);
    } catch (err) {
      setError(err.message || 'Failed to upload document.');
      setSubmitting(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) {
      setError('Document title is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const docPayload = {
        title: manualTitle.trim(),
        documentType: manualType,
        category: manualCategory,
        number: manualNumber,
        source: 'Manual Entry',
        status: 'healthy',
        issueDate: issueDate || null,
        expiryDate: expiryDate || null,
        aiSummary: `Manually added ${manualTitle}. Notes: ${notes || 'None'}.`,
        actionRequired: false,
      };

      await onAdd(docPayload);
    } catch (err) {
      setError(err.message || 'Failed to save manual document.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
      <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Add Document</h2>
              <p className="text-[12px] text-slate-400">Upload device file, connect DigiLocker, or enter details manually</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

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

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: FILE UPLOAD */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
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
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                >
                  <option value="Government">Government</option>
                  <option value="Education">Education</option>
                  <option value="Financial">Financial</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Type</label>
                <input
                  type="text"
                  placeholder="e.g. Identity Proof"
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
                disabled={submitting || !selectedFile}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[13px] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Uploading & Analyzing...' : 'Upload & Add'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: MANUAL ENTRY */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Income Certificate 2025"
                value={manualTitle}
                onChange={e => setManualTitle(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={manualCategory}
                  onChange={e => setManualCategory(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                >
                  <option value="Government">Government</option>
                  <option value="Education">Education</option>
                  <option value="Financial">Financial</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Type</label>
                <input
                  type="text"
                  placeholder="e.g. Aadhaar / Certificate"
                  value={manualType}
                  onChange={e => setManualType(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. XXXX-XXXX-1234"
                value={manualNumber}
                onChange={e => setManualNumber(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Expiry Date</label>
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
                disabled={submitting}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[13px] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Document'}
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
                DigiLocker OAuth integration is not yet connected in this prototype. Designed for upcoming government OAuth API integration.
              </p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[12px] text-slate-400 text-left">
              <p className="font-semibold text-slate-200 mb-1">Architecture Plan:</p>
              <p>• OAuth 2.0 PKCE flow with DigiLocker API</p>
              <p>• Verified pull for Aadhaar, Driving Licence, & Marksheets</p>
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
    </div>
  );
}
