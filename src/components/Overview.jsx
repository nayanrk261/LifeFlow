import { AlertTriangle, Shield, FileText, ChevronRight, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { getDaysUntil, formatDate, getStatusBg, getStatusLabel } from '../data/mockData';

export default function Overview({ documents, profile, navigate }) {
  const healthyDocs = documents.filter(d => d.status === 'healthy');
  const expiringDocs = documents.filter(d => d.status === 'expiring' || d.status === 'attention');
  const missingDocs = documents.filter(d => d.status === 'missing');
  const actionDocs = documents.filter(d => d.actionRequired);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting()}, {profile.firstName}.
        </h1>
        <p className="text-[14px] text-slate-500 mt-1">Here's what needs your attention.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Documents', value: documents.length, icon: FileText, color: 'text-slate-300' },
          { label: 'Need Attention', value: expiringDocs.length, icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Expiring Soon', value: documents.filter(d => d.expiryDate && getDaysUntil(d.expiryDate) <= 90 && getDaysUntil(d.expiryDate) > 0).length, icon: Clock, color: 'text-amber-400' },
          { label: 'Missing', value: missingDocs.length, icon: XCircle, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={14} className={stat.color} />
              <span className="text-[12px] text-slate-500 font-medium">{stat.label}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Needs You Section */}
      <div>
        <h2 className="text-[15px] font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-400" />
          Needs your attention
        </h2>
        <div className="space-y-2">
          {actionDocs.map(doc => {
            const days = getDaysUntil(doc.expiryDate || doc.deadline);
            return (
              <button
                key={doc.id}
                onClick={() => navigate('doc-intelligence', doc.id)}
                className="w-full bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {doc.priority === 'high' && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 rounded uppercase">
                          Urgent
                        </span>
                      )}
                      <span className="text-[14px] font-semibold text-slate-100">{doc.name}</span>
                    </div>
                    {doc.expiryDate && (
                      <p className="text-[13px] text-slate-400 mt-0.5">
                        Expires {formatDate(doc.expiryDate)}
                        {days !== null && days > 0 && (
                          <span className={`ml-2 ${days <= 30 ? 'text-amber-400' : 'text-slate-500'}`}>
                            ({days} days)
                          </span>
                        )}
                      </p>
                    )}
                    {doc.deadline && (
                      <p className="text-[13px] text-slate-400 mt-0.5">
                        Deadline: {formatDate(doc.deadline)}
                        {getDaysUntil(doc.deadline) !== null && getDaysUntil(doc.deadline) > 0 && (
                          <span className="ml-2 text-amber-400">
                            ({getDaysUntil(doc.deadline)} days)
                          </span>
                        )}
                      </p>
                    )}
                    {doc.action && (
                      <p className="text-[13px] text-slate-500 mt-1">
                        Action: <span className="text-slate-300">{doc.action}</span>
                      </p>
                    )}
                    {doc.status === 'missing' && (
                      <p className="text-[13px] text-red-400/80 mt-1">
                        Missing — relevant for {doc.relevantFor}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-slate-600 mt-1 group-hover:text-slate-400 transition-colors shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Health */}
      <div>
        <h2 className="text-[15px] font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Shield size={15} className="text-slate-400" />
          Document Health
        </h2>
        <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{documents.filter(d => d.status !== 'not-available').length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Analyzed</p>
            </div>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(healthyDocs.length / documents.length) * 100}%` }} />
              <div className="bg-amber-400 h-full transition-all" style={{ width: `${(expiringDocs.length / documents.length) * 100}%` }} />
              <div className="bg-red-400 h-full transition-all" style={{ width: `${(missingDocs.length / documents.length) * 100}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-5 text-[12px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {healthyDocs.length} Healthy
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {expiringDocs.length} Attention
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {missingDocs.length} Missing
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate('readiness')}
          className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-colors text-left group"
        >
          <CheckCircle size={16} className="text-sky-400 mb-2" />
          <p className="text-[14px] font-semibold text-slate-100">Check Readiness</p>
          <p className="text-[12px] text-slate-500 mt-0.5">Am I ready for my scholarship?</p>
        </button>
        <button
          onClick={() => navigate('assistant')}
          className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-colors text-left group"
        >
          <AlertCircle size={16} className="text-slate-400 mb-2" />
          <p className="text-[14px] font-semibold text-slate-100">Ask Assistant</p>
          <p className="text-[12px] text-slate-500 mt-0.5">What should I do next?</p>
        </button>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-slate-200">Recent Documents</h2>
          <button onClick={() => navigate('documents')} className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors">
            View all
          </button>
        </div>
        <div className="space-y-1">
          {documents.filter(d => d.status !== 'not-available').slice(0, 5).map(doc => (
            <button
              key={doc.id}
              onClick={() => navigate('doc-intelligence', doc.id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText size={15} className="text-slate-500" />
                <div className="text-left">
                  <p className="text-[13px] font-medium text-slate-200">{doc.name}</p>
                  <p className="text-[11px] text-slate-500">{doc.type} • {doc.subtype}</p>
                </div>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusBg(doc.status)}`}>
                {getStatusLabel(doc.status)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
