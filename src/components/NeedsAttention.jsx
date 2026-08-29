import { AlertTriangle, Clock, XCircle, ChevronRight, FileText } from 'lucide-react';
import { formatDate, getDaysUntil, getStatusBg, getStatusLabel } from '../data/mockData';

export default function NeedsAttention({ documents, navigate }) {
  const actionRequired = documents.filter(d => d.actionRequired && d.status !== 'missing');
  const expiring = documents.filter(d => d.expiryDate && getDaysUntil(d.expiryDate) > 0 && getDaysUntil(d.expiryDate) <= 365);
  const missing = documents.filter(d => d.status === 'missing');

  const Section = ({ title, icon: Icon, iconColor, items }) => (
    <div>
      <h2 className="text-[14px] font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <Icon size={15} className={iconColor} />
        {title}
        <span className="text-[12px] text-slate-600 font-normal ml-1">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-6 text-center">
          <p className="text-[13px] text-slate-500">Nothing here. You're all good.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(doc => {
            const days = getDaysUntil(doc.expiryDate || doc.deadline);
            return (
              <button
                key={doc.id}
                onClick={() => navigate('doc-intelligence', doc.id)}
                className="w-full bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-slate-100">{doc.name}</p>
                      {doc.action && (
                        <p className="text-[13px] text-slate-500 mt-0.5">
                          Action: <span className="text-slate-300">{doc.action}</span>
                        </p>
                      )}
                      {(doc.expiryDate || doc.deadline) && (
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          {doc.deadline ? 'Deadline' : 'Expires'}: {formatDate(doc.expiryDate || doc.deadline)}
                          {days !== null && days > 0 && (
                            <span className={`ml-1 ${days <= 30 ? 'text-amber-400' : 'text-slate-400'}`}>
                              ({days} days)
                            </span>
                          )}
                        </p>
                      )}
                      {doc.status === 'missing' && doc.relevantFor && (
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          Relevant for: <span className="text-slate-400">{doc.relevantFor}</span>
                        </p>
                      )}
                      {doc.status === 'missing' && doc.whyItMatters && (
                        <p className="text-[12px] text-slate-500 mt-1 italic">
                          {doc.whyItMatters}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusBg(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Needs Attention</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Documents and deadlines that require your action.</p>
      </div>

      <Section title="Action Required" icon={AlertTriangle} iconColor="text-amber-400" items={actionRequired} />
      <Section title="Expiring Soon" icon={Clock} iconColor="text-amber-400" items={expiring} />
      <Section title="Missing Documents" icon={XCircle} iconColor="text-red-400" items={missing} />
    </div>
  );
}
