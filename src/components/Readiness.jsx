import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Award, Globe, Car, AlertTriangle, User, FileText, Cpu } from 'lucide-react';
import { workflows, formatDate, getDaysUntil } from '../data/mockData';

const iconMap = { award: Award, globe: Globe, car: Car };

export default function Readiness({ documents, navigate }) {
  const [selectedWf, setSelectedWf] = useState(workflows[0].id);
  const wf = workflows.find(w => w.id === selectedWf);
  const WfIcon = iconMap[wf.icon] || Award;
  const days = getDaysUntil(wf.deadline);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Am I ready?</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Check if you have all required documents for an application.</p>
      </div>

      {/* Workflow selector */}
      <div className="flex flex-wrap gap-2">
        {workflows.map(w => {
          const Icon = iconMap[w.icon] || Award;
          return (
            <button
              key={w.id}
              onClick={() => setSelectedWf(w.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                selectedWf === w.id
                  ? 'bg-white text-slate-900 border-white'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <Icon size={15} />
              {w.name}
            </button>
          );
        })}
      </div>

      {/* Readiness Report */}
      <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center shrink-0">
            <WfIcon size={22} className="text-slate-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{wf.name}</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">{wf.description}</p>
            {wf.deadline && (
              <p className="text-[12px] text-amber-400 mt-1">
                Deadline: {formatDate(wf.deadline)}
                {days > 0 && ` (${days} days remaining)`}
              </p>
            )}
          </div>
        </div>

        {/* Readiness Score */}
        <div className="mb-8">
          <div className="flex items-end gap-3 mb-3">
            <span className={`text-5xl font-bold ${
              wf.readinessPercent === 100 ? 'text-emerald-400' :
              wf.readinessPercent >= 75 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {wf.readinessPercent}%
            </span>
            <span className="text-[14px] text-slate-500 mb-1.5">ready</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                wf.readinessPercent === 100 ? 'bg-emerald-400' :
                wf.readinessPercent >= 75 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${wf.readinessPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2 mb-6">
          {wf.requiredDocuments.map((rd, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                rd.status === 'available'
                  ? 'bg-emerald-500/5 border-emerald-500/10'
                  : 'bg-red-500/5 border-red-500/10'
              }`}
            >
              {rd.status === 'available' ? (
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <XCircle size={16} className="text-red-400 shrink-0" />
              )}
              <span className={`text-[14px] font-medium flex-1 ${
                rd.status === 'available' ? 'text-slate-200' : 'text-red-300'
              }`}>
                {rd.name}
              </span>
              {rd.status === 'available' ? (
                <span className="text-[11px] text-emerald-400/70 font-medium">Available</span>
              ) : (
                <span className="text-[11px] text-red-400/70 font-medium">Missing</span>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {wf.missingCount > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle size={15} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] text-amber-300 font-medium">
                  You're missing {wf.missingCount} document{wf.missingCount > 1 ? 's' : ''}.
                </p>
                <p className="text-[13px] text-slate-400 mt-1">
                  {wf.id === 'wf-001' && 'Obtain your income certificate before starting the application.'}
                  {wf.id === 'wf-003' && 'Obtain your Vehicle RC before initiating the transfer.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {wf.readinessPercent === 100 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle size={15} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] text-emerald-300 font-medium">
                  You have all required documents.
                </p>
                <p className="text-[13px] text-slate-400 mt-1">
                  You can proceed with this application whenever you're ready.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reasoning explanation */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={13} className="text-sky-400" />
            <span className="text-[12px] text-sky-400 font-medium">How DocAction reasons</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <span className="px-2 py-0.5 bg-slate-700/40 rounded">Your Profile</span>
            <span>+</span>
            <span className="px-2 py-0.5 bg-slate-700/40 rounded">Your Documents</span>
            <span>+</span>
            <span className="px-2 py-0.5 bg-slate-700/40 rounded">Workflow Requirements</span>
            <span>=</span>
            <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded border border-sky-500/20">Readiness</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {wf.missingCount > 0 && wf.requiredDocuments.filter(r => r.status === 'missing').map((rd, i) => (
            <button
              key={i}
              onClick={() => rd.docId ? navigate('doc-intelligence', rd.docId) : null}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-lg text-[13px] font-medium hover:bg-white/15 transition-colors"
            >
              Find out how to get {rd.name}
              <ChevronRight size={14} />
            </button>
          ))}
          <button
            onClick={() => navigate('generator')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-[13px] font-medium hover:bg-slate-800 transition-colors"
          >
            <FileText size={14} />
            Generate Application
          </button>
        </div>
      </div>
    </div>
  );
}
