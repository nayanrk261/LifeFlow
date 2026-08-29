import { ArrowLeft, Bell, Share2, Download, Cpu, Shield, Clock, AlertTriangle, CheckCircle, FileText, ExternalLink } from 'lucide-react';
import { formatDate, getDaysUntil, getStatusBg, getStatusLabel } from '../data/mockData';

export default function DocIntelligence({ document: doc, navigate, addToast, addReminder }) {
  if (!doc) {
    return (
      <div className="text-center py-20">
        <FileText size={24} className="text-slate-600 mx-auto mb-3" />
        <p className="text-[14px] text-slate-400">Document not found</p>
        <button onClick={() => navigate('documents')} className="mt-4 text-[13px] text-sky-400 hover:text-sky-300">
          Back to documents
        </button>
      </div>
    );
  }

  const days = getDaysUntil(doc.expiryDate || doc.deadline);

  const handleSetReminder = () => {
    addReminder({
      title: doc.action || `Review ${doc.name}`,
      date: doc.expiryDate || doc.deadline || new Date().toISOString().split('T')[0],
      documentId: doc.id,
      priority: doc.priority || 'medium',
      completed: false,
      category: 'upcoming',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <button
        onClick={() => navigate('documents')}
        className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to documents
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Document preview */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-6 sticky top-6">
            {/* Simulated document card */}
            <div className="aspect-[3/4] bg-gradient-to-b from-slate-800/40 to-slate-800/20 border border-slate-700/40 rounded-lg flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {/* Watermark grid */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-3 gap-8 p-4 rotate-[-15deg] scale-150 translate-x-4">
                  {Array.from({length: 12}).map((_, i) => (
                    <span key={i} className="text-[8px] text-white whitespace-nowrap">DOCACTION</span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-slate-400" />
                </div>
                <h3 className="text-[16px] font-semibold text-slate-200">{doc.name}</h3>
                {doc.number && (
                  <p className="text-[13px] text-slate-500 mt-1 font-mono">{doc.number}</p>
                )}
                {doc.issuedBy && (
                  <p className="text-[12px] text-slate-500 mt-2">{doc.issuedBy}</p>
                )}
                {doc.source && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-700/30 border border-slate-600/30">
                    <span className="text-[10px] text-slate-400 font-medium">{doc.source}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right — AI Understanding */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI badge */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              <Cpu size={11} className="text-sky-400" />
              <span className="text-[11px] font-medium text-sky-400">AI analyzed</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/40">
              <Shield size={11} className="text-slate-400" />
              <span className="text-[11px] font-medium text-slate-500">Designed for on-device processing</span>
            </div>
          </div>

          {/* Title and status */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white">{doc.name}</h1>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusBg(doc.status)}`}>
                {getStatusLabel(doc.status)}
              </span>
            </div>
          </div>

          {/* AI Understanding Card */}
          <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5">
            <h2 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider mb-4">AI Understanding</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                <span className="text-[13px] text-slate-500">Document type</span>
                <span className="text-[13px] text-slate-200 font-medium">{doc.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                <span className="text-[13px] text-slate-500">Category</span>
                <span className="text-[13px] text-slate-200">{doc.type} / {doc.subtype}</span>
              </div>
              {doc.issueDate && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <span className="text-[13px] text-slate-500">Issued</span>
                  <span className="text-[13px] text-slate-200">{formatDate(doc.issueDate)}</span>
                </div>
              )}
              {doc.expiryDate && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <span className="text-[13px] text-slate-500">Expires</span>
                  <span className={`text-[13px] font-medium ${days <= 30 ? 'text-amber-400' : days <= 90 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {formatDate(doc.expiryDate)}
                    {days !== null && days > 0 && ` (${days} days)`}
                  </span>
                </div>
              )}
              {doc.deadline && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <span className="text-[13px] text-slate-500">Deadline</span>
                  <span className="text-[13px] font-medium text-amber-400">
                    {formatDate(doc.deadline)}
                    {getDaysUntil(doc.deadline) > 0 && ` (${getDaysUntil(doc.deadline)} days)`}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                <span className="text-[13px] text-slate-500">Action required</span>
                <span className={`text-[13px] font-medium ${doc.actionRequired ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {doc.actionRequired ? 'Yes' : 'No'}
                </span>
              </div>
              {doc.action && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <span className="text-[13px] text-slate-500">Action</span>
                  <span className="text-[13px] text-slate-200 font-medium">{doc.action}</span>
                </div>
              )}
              {doc.priority && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-[13px] text-slate-500">Priority</span>
                  <span className={`text-[13px] font-medium ${
                    doc.priority === 'high' ? 'text-red-400' :
                    doc.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {doc.priority.charAt(0).toUpperCase() + doc.priority.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Why it matters */}
          {doc.whyItMatters && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
              <h2 className="text-[13px] font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle size={13} />
                Why this matters
              </h2>
              <p className="text-[14px] text-slate-300 leading-relaxed">
                {doc.whyItMatters}
              </p>
            </div>
          )}

          {/* AI Summary */}
          <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5">
            <h2 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Summary</h2>
            <p className="text-[14px] text-slate-300 leading-relaxed">{doc.aiSummary}</p>
          </div>

          {/* How to get (for missing docs) */}
          {doc.howToGet && (
            <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5">
              <h2 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider mb-2">How to obtain</h2>
              <p className="text-[14px] text-slate-300 leading-relaxed">{doc.howToGet}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSetReminder}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-lg text-[13px] font-medium hover:bg-white/15 transition-colors"
            >
              <Bell size={14} />
              Set Reminder
            </button>
            <button
              onClick={() => addToast('Added to tasks', 'success')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-[13px] font-medium hover:bg-slate-800 transition-colors"
            >
              <CheckCircle size={14} />
              Add to Tasks
            </button>
            <button
              onClick={() => addToast('Shareable link copied', 'success')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-[13px] font-medium hover:bg-slate-800 transition-colors"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={() => addToast('Export started', 'info')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-[13px] font-medium hover:bg-slate-800 transition-colors"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
