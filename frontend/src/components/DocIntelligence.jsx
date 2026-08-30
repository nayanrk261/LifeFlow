import { ArrowLeft, Bell, Share2, Download, Cpu, Shield, Clock, AlertTriangle, CheckCircle, FileText, ExternalLink, Target, Sparkles, Calendar } from 'lucide-react';
import { formatDate, getDaysUntil, getStatusBg, getStatusLabel } from '../data/mockData';

export default function DocIntelligence({ document: doc, navigate, addToast, addReminder }) {
  if (!doc) {
    return (
      <div className="text-center py-20">
        <FileText size={24} className="text-slate-600 mx-auto mb-3" />
        <p className="text-[14px] text-slate-400">Document not found</p>
        <button onClick={() => navigate('documents')} className="mt-4 text-[13px] text-emerald-400 hover:text-emerald-300">
          Back to documents
        </button>
      </div>
    );
  }

  const days = getDaysUntil(doc.expiryDate || doc.deadline);
  const docTitle = doc.title || doc.name;
  const category = doc.category || doc.type || 'Personal';
  const subType = doc.documentType || doc.subtype || 'General';

  const handleSetReminder = () => {
    addReminder({
      title: doc.action || `Review ${docTitle}`,
      date: doc.expiryDate || doc.deadline || new Date().toISOString().split('T')[0],
      documentId: doc.id || doc._id,
      priority: doc.priority || 'medium',
      completed: false,
      category: 'upcoming',
    });
  };

  const getScoreColor = (confidence = 0.9) => {
    if (confidence >= 0.85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (confidence >= 0.70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Back nav */}
      <button
        onClick={() => navigate('documents')}
        className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Document Vault
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Document preview */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sticky top-6">
            <div className="aspect-[3/4] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="grid grid-cols-3 gap-8 p-4 rotate-[-15deg] scale-150 translate-x-4">
                  {Array.from({length: 12}).map((_, i) => (
                    <span key={i} className="text-[8px] text-white font-mono">LIFEFLOW VAULT</span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <FileText size={28} />
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">{docTitle}</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {category} • {subType}
                </span>

                {doc.number && (
                  <p className="text-[13px] text-slate-400 font-mono pt-2">No: {doc.number}</p>
                )}
                {doc.issuedBy && (
                  <p className="text-[12px] text-slate-500">Issued by {doc.issuedBy}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right — AI Document Intelligence & Details */}
        <div className="lg:col-span-3 space-y-5">
          {/* AI Confidence & Status Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px]">
              <Shield size={13} />
              <span>Private Intelligence Verified</span>
            </div>
            {doc.analysisConfidence && (
              <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${getScoreColor(doc.analysisConfidence)}`}>
                Confidence: {Math.round(doc.analysisConfidence * 100)}%
              </span>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-medium">
              <Shield size={12} strokeWidth={2} />
              <span>Encrypted Vault Document</span>
            </div>
          </div>

          {/* Private Intelligence Statement */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[12px] text-slate-300 flex items-center gap-2.5">
            <Shield size={16} className="text-emerald-400 shrink-0" />
            <p>Sensitive information is analyzed through LifeFlow&apos;s privacy-aware processing architecture.</p>
          </div>

          {/* Title and status */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{docTitle}</h1>
              <p className="text-[13px] text-slate-400 mt-0.5">Source: {doc.source || 'Vault Storage'}</p>
            </div>
            <span className={`text-[12px] font-bold px-3 py-1 rounded-full border ${getStatusBg(doc.status)}`}>
              {getStatusLabel(doc.status)}
            </span>
          </div>

          {/* AI Summary Banner */}
          {doc.aiSummary && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
              <Sparkles size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">LIFEFLOW AI SUMMARY</p>
                <p className="text-[13px] text-slate-300 leading-relaxed">{doc.aiSummary}</p>
              </div>
            </div>
          )}

          {/* AI Extracted Metadata Metadata */}
          <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h2 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Document Intelligence Metadata</h2>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-[13px] text-slate-400">Document Type</span>
                <span className="text-[13px] text-white font-semibold">{subType}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-[13px] text-slate-400">Category</span>
                <span className="text-[13px] text-slate-200">{category}</span>
              </div>
              {doc.issueDate && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-[13px] text-slate-400">Issue Date</span>
                  <span className="text-[13px] text-slate-200">{formatDate(doc.issueDate)}</span>
                </div>
              )}
              {doc.expiryDate && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-[13px] text-slate-400">Expiry Date</span>
                  <span className={`text-[13px] font-bold ${days <= 30 ? 'text-red-400' : days <= 90 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatDate(doc.expiryDate)}
                    {days !== null && days > 0 && ` (${days} days remaining)`}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-[13px] text-slate-400">Expiry Status</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                  doc.expiryStatus === 'expired' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  doc.expiryStatus === 'expiring_soon' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {doc.expiryStatus || 'valid'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleSetReminder}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[13px] font-semibold transition-colors"
            >
              <Bell size={15} />
              Set Expiry Reminder
            </button>
            <button
              onClick={() => addToast('Document link shared with connected family members', 'success')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[13px] font-medium transition-colors"
            >
              <Share2 size={15} />
              Share with Family
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
