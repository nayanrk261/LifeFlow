import { useState } from 'react';
import { FileText, Plus, ChevronRight, Search } from 'lucide-react';
import { getStatusBg, getStatusLabel, formatDate, getDaysUntil } from '../data/mockData';

const tabs = ['All', 'Government', 'Education', 'Financial', 'Personal'];

export default function Documents({ documents, navigate, onAddDoc }) {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = documents
    .filter(d => d.status !== 'not-available' || activeTab === 'All')
    .filter(d => activeTab === 'All' || d.type === activeTab)
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Your Documents</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{documents.filter(d => d.status !== 'not-available').length} documents analyzed</p>
        </div>
        <button
          onClick={onAddDoc}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/10 text-white rounded-lg text-[13px] font-medium hover:bg-white/15 transition-colors shrink-0"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800/40 border border-slate-700/40 rounded-lg pl-10 pr-4 py-2 text-[13px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-slate-800 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-1.5">
        {filtered.map(doc => {
          const days = getDaysUntil(doc.expiryDate || doc.deadline);
          return (
            <button
              key={doc.id}
              onClick={() => navigate('doc-intelligence', doc.id)}
              className="w-full bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-all text-left group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-slate-100 truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-slate-500">{doc.type} • {doc.subtype}</span>
                      {doc.expiryDate && days !== null && days > 0 && days <= 90 && (
                        <span className="text-[11px] text-amber-400">
                          Expires in {days}d
                        </span>
                      )}
                      {doc.deadline && days !== null && days > 0 && (
                        <span className="text-[11px] text-amber-400">
                          Due in {days}d
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusBg(doc.status)}`}>
                    {getStatusLabel(doc.status)}
                  </span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={24} className="text-slate-600 mx-auto mb-3" />
            <p className="text-[14px] text-slate-400">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
