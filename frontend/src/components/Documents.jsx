import { useState } from 'react';
import { FileText, Plus, ChevronRight, Search, Upload, AlertTriangle, Sparkles, Shield, CheckCircle2, Calendar } from 'lucide-react';
import { getStatusBg, getStatusLabel, formatDate, getDaysUntil } from '../data/mockData';

const tabs = ['All', 'Government', 'Education', 'Financial', 'Identity', 'Insurance', 'Personal'];

export default function Documents({ documents = [], navigate, onAddDoc }) {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const expiringDocs = documents.filter(d => d.expiryDate && getDaysUntil(d.expiryDate) <= 90 && getDaysUntil(d.expiryDate) > 0);
  const linkedDocs = documents.filter(d => d.linkedGoals && d.linkedGoals.length > 0);

  const filtered = documents
    .filter(d => activeTab === 'All' || d.category === activeTab || d.type === activeTab)
    .filter(d => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const nameMatch = (d.title || d.name || '').toLowerCase().includes(q);
      const typeMatch = (d.documentType || d.type || '').toLowerCase().includes(q);
      const catMatch = (d.category || '').toLowerCase().includes(q);
      return nameMatch || typeMatch || catMatch;
    });

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Your Document Vault</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            {documents.length} document{documents.length !== 1 ? 's' : ''} stored and analyzed by LifeFlow AI
          </p>
        </div>
        <button
          onClick={onAddDoc}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-[13px] font-bold shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus size={15} />
          Add Document
        </button>
      </div>

      {/* YOUR DOCUMENT INSIGHTS BANNER */}
      {documents.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] uppercase tracking-wider mb-2">
            <Sparkles size={15} />
            <span>YOUR DOCUMENT INSIGHTS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-100">{expiringDocs.length} Expiring Soon</p>
                <p className="text-[11px] text-slate-400">Within 90 days</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-100">{linkedDocs.length} Goal Helpers</p>
                <p className="text-[11px] text-slate-400">Linked to active goals</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Shield size={16} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-100">{documents.length} Vault Secured</p>
                <p className="text-[11px] text-slate-400">100% Private & encrypted</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, type, or category (e.g. Aadhaar, Insurance, Education)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-2.5">
        {filtered.map(doc => {
          const docId = doc.id || doc._id;
          const title = doc.title || doc.name;
          const category = doc.category || doc.type || 'Personal';
          const subType = doc.documentType || doc.subtype || 'General';
          const days = getDaysUntil(doc.expiryDate || doc.deadline);

          return (
            <button
              key={docId}
              onClick={() => navigate('doc-intelligence', docId)}
              className="w-full bg-[#0a0f1a] border border-slate-800/80 rounded-xl p-4 hover:border-emerald-500/40 transition-all text-left group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-slate-100 truncate group-hover:text-emerald-400 transition-colors">{title}</p>
                      {doc.analysisConfidence && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700 font-mono">
                          AI {Math.round(doc.analysisConfidence * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[12px] text-slate-400">
                      <span>{category} • {subType}</span>
                      {doc.expiryDate && days !== null && days > 0 && days <= 90 && (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Calendar size={12} /> Expires in {days}d
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBg(doc.status)}`}>
                    {getStatusLabel(doc.status)}
                  </span>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </button>
          );
        })}

        {/* EMPTY STATES */}
        {documents.length === 0 && (
          <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-10 text-center fade-in">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Upload size={22} className="text-slate-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-1">No documents yet</h3>
            <p className="text-[13px] text-slate-400 max-w-sm mx-auto mb-6">
              Add your important government, education, or financial documents to start tracking process readiness.
            </p>
            <button
              onClick={onAddDoc}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-[13px] transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Plus size={15} />
              Add your first document
            </button>
          </div>
        )}

        {documents.length > 0 && filtered.length === 0 && (
          <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-8 text-center fade-in">
            <FileText size={22} className="text-slate-500 mx-auto mb-3" />
            <p className="text-[14px] text-slate-300 font-medium">No documents found for &quot;{search}&quot;</p>
            <p className="text-[12px] text-slate-500 mt-1">Try searching by name (e.g. Aadhaar), category, or clearing filters.</p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-[12px] hover:bg-slate-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
