import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Sparkles, AlertCircle, Plus, Trash2, Check, RefreshCw, Calendar, FilePlus } from 'lucide-react';

export default function GoalDetail({ goal, navigate, onUpdateActionStatus, onDeleteGoal, onAddDoc, addToast }) {
  const [updatingActionId, setUpdatingActionId] = useState(null);

  if (!goal) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400">Goal not found or was removed.</p>
        <button
          onClick={() => navigate('overview')}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[13px] font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const {
    _id,
    id,
    title,
    category,
    originalUserRequest,
    readinessScore = 0,
    nextBestAction,
    aiExplanation,
    requirements = [],
    actions = []
  } = goal;

  const goalId = _id || id;

  const handleToggleAction = async (actionId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
    setUpdatingActionId(actionId);
    try {
      await onUpdateActionStatus(goalId, actionId, nextStatus);
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to update action status', 'error');
    } finally {
      setUpdatingActionId(null);
    }
  };

  const availableReqs = requirements.filter(r => r.status === 'available');
  const missingReqs = requirements.filter(r => r.status === 'missing' && r.required !== false);
  const optionalReqs = requirements.filter(r => r.required === false || r.status === 'optional');

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('overview')}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[13px] font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Goals
        </button>
        <button
          onClick={() => onDeleteGoal(goalId)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-[12px] font-semibold transition-colors"
        >
          <Trash2 size={14} />
          Delete Goal
        </button>
      </div>

      {/* Goal Header */}
      <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              {category || 'Goal'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
            {originalUserRequest && (
              <p className="text-[13px] text-slate-400">
                User Goal: <span className="text-slate-300 italic font-mono">&quot;{originalUserRequest}&quot;</span>
              </p>
            )}
          </div>

          <div className={`px-6 py-4 rounded-2xl border text-center shrink-0 ${getScoreColor(readinessScore)}`}>
            <span className="block text-3xl font-black">{readinessScore}%</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Readiness Score</span>
          </div>
        </div>

        {/* AI Explanation Summary */}
        {aiExplanation && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
            <Sparkles size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-300 leading-relaxed">
              {aiExplanation}
            </p>
          </div>
        )}

        {/* LifeFlow Guidance Bar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[12px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-semibold text-slate-200">Your goal is the starting point.</span>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            <span className="text-slate-400">Understand the goal</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-400">Check your readiness</span>
            <span className="text-slate-600">→</span>
            <span className="text-amber-400">Identify what&apos;s missing</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-400">Take the next action</span>
          </div>
        </div>
      </div>

      {/* Next Best Action Card */}
      {nextBestAction && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                ⚡ RECOMMENDED NEXT BEST ACTION
              </span>
              <p className="text-base font-semibold text-white leading-snug">
                {nextBestAction}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onAddDoc}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[13px] rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                <FilePlus size={15} />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Requirements & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Requirements Column */}
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white">Goal Requirements</h2>
            <span className="text-[12px] text-slate-400">
              {availableReqs.length} / {requirements.length} Completed
            </span>
          </div>

          {/* Available */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">AVAILABLE ({availableReqs.length})</p>
            {availableReqs.length > 0 ? (
              availableReqs.map((req, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-800/20 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-200">{req.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {req.description || 'Verified in your vault'}
                        {req.matchedFamilyMemberName && (
                          <span className="ml-2 text-indigo-400 font-medium">
                            (👥 Shared by {req.matchedFamilyMemberName})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Ready
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-slate-500 italic">No available documents yet.</p>
            )}
          </div>

          {/* Missing */}
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider">MISSING ({missingReqs.length})</p>
            {missingReqs.length > 0 ? (
              missingReqs.map((req, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <XCircle size={16} className="text-red-400 shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-200">{req.name}</p>
                      <p className="text-[11px] text-slate-400">{req.description || 'Document missing from vault'}</p>
                    </div>
                  </div>
                  <button
                    onClick={onAddDoc}
                    className="text-[11px] font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                  >
                    Add Doc
                  </button>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-emerald-400 font-medium">✓ All required documents are available!</p>
            )}
          </div>

          {/* Optional */}
          {optionalReqs.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OPTIONAL ({optionalReqs.length})</p>
              {optionalReqs.map((req, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-800/20 border border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-slate-300">{req.name}</p>
                      <p className="text-[11px] text-slate-500">{req.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    Optional
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Plan Column */}
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white">Action Plan</h2>
            <span className="text-[12px] text-slate-400">
              {actions.filter(a => a.status === 'Completed').length} of {actions.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {actions.length > 0 ? (
              actions.map((action) => {
                const actionId = action._id || action.id;
                const isCompleted = action.status === 'Completed';

                return (
                  <div
                    key={actionId}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted ? 'bg-slate-900/30 border-slate-800/60 opacity-80' : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleAction(actionId, action.status)}
                          disabled={updatingActionId === actionId}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                              : 'border-slate-600 hover:border-emerald-400 bg-slate-800'
                          }`}
                        >
                          {isCompleted && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div>
                          <p className={`text-[14px] font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                            {action.title}
                          </p>
                          {action.description && (
                            <p className="text-[12px] text-slate-400 mt-0.5 leading-normal">{action.description}</p>
                          )}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                        action.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        action.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {action.priority || 'medium'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[13px] text-slate-500 italic">No action steps recorded.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
