import { useState } from 'react';
import { AlertTriangle, Shield, FileText, ChevronRight, Clock, CheckCircle, AlertCircle, XCircle, Plus, Sparkles, ArrowRight, Target, Zap } from 'lucide-react';
import { getDaysUntil, formatDate } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function Overview({ documents = [], goals = [], navigate, onAddDoc, onOpenAskLifeFlow, onSelectGoal }) {
  const { user, profile, isDemo } = useAuth();
  const [goalQuery, setGoalQuery] = useState('');

  const firstName = profile?.firstName || user?.name?.split(' ')[0] || 'User';

  const healthyDocs = documents.filter(d => d.status === 'healthy');
  const expiringDocs = documents.filter(d => d.status === 'expiring' || d.status === 'attention');
  const missingDocs = documents.filter(d => d.status === 'missing');
  const actionDocs = documents.filter(d => d.actionRequired);

  const isProfileComplete = profile && profile.age && profile.state && profile.occupation;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const exampleChips = [
    { label: '🎓 Apply for a scholarship', query: 'I want to apply for a scholarship.' },
    { label: '🛂 Prepare for passport', query: 'I need to prepare for a passport.' },
    { label: '🚗 Renew driving licence', query: 'I want to renew my driving licence.' },
    { label: '🏛 Find a government scheme', query: 'I want to apply for a government scheme.' },
    { label: '📄 Prepare for college admission', query: 'I want to prepare documents for college admission.' },
  ];

  const handleSubmitGoal = (e) => {
    e.preventDefault();
    if (!goalQuery.trim()) return;
    if (onOpenAskLifeFlow) {
      onOpenAskLifeFlow(goalQuery.trim());
    }
  };

  const handleChipClick = (queryText) => {
    setGoalQuery(queryText);
    if (onOpenAskLifeFlow) {
      onOpenAskLifeFlow(queryText);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {greeting()}, {firstName}.
          </h1>
          <p className="text-[14px] text-slate-400 mt-1">
            Tell LifeFlow what you want to accomplish today.
          </p>
        </div>
      </div>

      {/* PROMINENT ASK LIFEFLOW ENTRY CARD */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#0a0f1a] to-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={160} className="text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider">
            <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Sparkles size={14} />
              LIFEFLOW • FROM LIFE GOAL TO NEXT ACTION
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            What do you want to get done?
          </h2>

          <p className="text-[13px] sm:text-[14px] text-slate-300 max-w-2xl leading-relaxed">
            See what you&apos;re ready for, what you&apos;re missing, and what to do next. Tell LifeFlow your goal to analyze requirements and generate your personalized action plan.
          </p>

          {/* Goal Query Form */}
          <form onSubmit={handleSubmitGoal} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={goalQuery}
                onChange={(e) => setGoalQuery(e.target.value)}
                placeholder="Example: I want to apply for a scholarship..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-[14px] placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={!goalQuery.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-[14px] rounded-xl shadow-lg shadow-emerald-500/20 transition-all shrink-0"
            >
              <Sparkles size={16} />
              Ask LifeFlow
            </button>
          </form>

          {/* Suggested Example Chips */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Suggested Examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip.query)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-emerald-500/40 text-[12px] font-medium text-slate-300 hover:text-white transition-all text-left"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE LIFEFLOW GOALS SECTION */}
      {goals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-white flex items-center gap-2 tracking-tight">
              <Target size={18} className="text-emerald-400" />
              Active LifeFlow Goals
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {goals.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const goalId = goal._id || goal.id;
              const missingCount = (goal.requirements || []).filter(r => r.required !== false && r.status === 'missing').length;

              return (
                <div
                  key={goalId}
                  onClick={() => onSelectGoal(goal)}
                  className="bg-[#0a0f1a] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl group space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                        {goal.category || 'Education'}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                        {goal.title}
                      </h3>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl border text-center shrink-0 ${getScoreColor(goal.readinessScore)}`}>
                      <span className="block text-lg font-black">{goal.readinessScore}%</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider">READINESS</span>
                    </div>
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        goal.readinessScore >= 80 ? 'bg-emerald-400' :
                        goal.readinessScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${goal.readinessScore}%` }}
                    />
                  </div>

                  {/* Goal Info */}
                  <div className="text-[12px] space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Missing Requirements:</span>
                      <span className={`font-semibold ${missingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {missingCount > 0 ? `${missingCount} Item${missingCount > 1 ? 's' : ''}` : '✓ None'}
                      </span>
                    </div>
                    {goal.nextBestAction && (
                      <p className="text-slate-300 line-clamp-1">
                        <strong className="text-emerald-400">Next Action:</strong> {goal.nextBestAction}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end text-[12px] font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    View Action Plan <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EMPTY GOALS STATE */}
      {goals.length === 0 && (
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <Target size={20} />
          </div>
          <h3 className="text-[16px] font-bold text-white">No active goal yet.</h3>
          <p className="text-[13px] text-slate-400 max-w-md mx-auto leading-relaxed">
            Tell LifeFlow what you&apos;re preparing for, and we&apos;ll help you understand what comes next.
          </p>
          <button
            onClick={() => onOpenAskLifeFlow('')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-[13px] shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Sparkles size={15} />
            Create Your First Goal
          </button>
        </div>
      )}

      {/* DASHBOARD STATS ROW */}
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
      {actionDocs.length > 0 && (
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
                  key={doc.id || doc._id}
                  onClick={() => navigate('doc-intelligence', doc.id || doc._id)}
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
                        <span className="text-[14px] font-semibold text-slate-100">{doc.title || doc.name}</span>
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
                      {doc.action && (
                        <p className="text-[13px] text-slate-500 mt-1">
                          Action: <span className="text-slate-300">{doc.action}</span>
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
      )}

      {/* Document Health */}
      {documents.length > 0 && (
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
                <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(healthyDocs.length / (documents.length || 1)) * 100}%` }} />
                <div className="bg-amber-400 h-full transition-all" style={{ width: `${(expiringDocs.length / (documents.length || 1)) * 100}%` }} />
                <div className="bg-red-400 h-full transition-all" style={{ width: `${(missingDocs.length / (documents.length || 1)) * 100}%` }} />
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
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate('readiness')}
          className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-colors text-left group"
        >
          <CheckCircle size={16} className="text-emerald-400 mb-2" />
          <p className="text-[14px] font-semibold text-slate-100">Check Readiness</p>
          <p className="text-[12px] text-slate-500 mt-0.5">Am I ready for my next application?</p>
        </button>
        <button
          onClick={() => navigate('assistant')}
          className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-colors text-left group"
        >
          <AlertCircle size={16} className="text-slate-400 mb-2" />
          <p className="text-[14px] font-semibold text-slate-100">Ask Copilot</p>
          <p className="text-[12px] text-slate-500 mt-0.5">What should I do next?</p>
        </button>
      </div>
    </div>
  );
}
