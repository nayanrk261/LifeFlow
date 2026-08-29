import { Lock, Plus, User, GraduationCap, Landmark, Scale, Folder, FileText, Shield } from 'lucide-react';
import { vaultCategories } from '../data/mockData';

const iconMap = { user: User, 'graduation-cap': GraduationCap, landmark: Landmark, scale: Scale, folder: Folder };

export default function Vault({ documents, onAddDoc }) {
  const totalDocs = vaultCategories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock size={18} className="text-slate-400" />
            Private Vault
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{totalDocs} documents stored securely</p>
        </div>
        <button
          onClick={onAddDoc}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/10 text-white rounded-lg text-[13px] font-medium hover:bg-white/15 transition-colors"
        >
          <Plus size={14} />
          Add Document
        </button>
      </div>

      {/* Encryption notice */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/20 border border-slate-800/40 rounded-xl">
        <Shield size={16} className="text-slate-500 shrink-0" />
        <p className="text-[12px] text-slate-500">
          Your vault is designed for encrypted, local-first storage. Documents are accessible only to you.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vaultCategories.map(cat => {
          const Icon = iconMap[cat.icon] || Folder;
          return (
            <div
              key={cat.id}
              className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-slate-800/80 transition-colors">
                  <Icon size={18} className="text-slate-400" />
                </div>
                <span className="text-[22px] font-bold text-slate-300">{cat.count}</span>
              </div>
              <p className="text-[14px] font-medium text-slate-200">{cat.name}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">{cat.count} document{cat.count !== 1 ? 's' : ''}</p>
            </div>
          );
        })}
      </div>

      {/* Recent in vault */}
      <div>
        <h2 className="text-[14px] font-semibold text-slate-300 mb-3">Recent Documents</h2>
        <div className="space-y-1">
          {documents.filter(d => d.status !== 'not-available' && d.status !== 'missing').slice(0, 4).map(doc => (
            <div
              key={doc.id}
              className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={15} className="text-slate-500" />
                <div>
                  <p className="text-[13px] font-medium text-slate-200">{doc.name}</p>
                  <p className="text-[11px] text-slate-500">{doc.source || 'Personal'}</p>
                </div>
              </div>
              <Lock size={12} className="text-slate-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
