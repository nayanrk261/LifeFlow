import { AlertTriangle, Shield, FileText, ChevronRight, Clock, CheckCircle, AlertCircle, XCircle, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { getDaysUntil, formatDate, getStatusBg, getStatusLabel } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function Overview({ documents = [], goals = [], navigate, onAddDoc }) {
  const { user, profile, isDemo } = useAuth();

  const firstName = profile?.firstName || user?.name?.split(' ')[0] || 'User';

  const healthyDocs = documents.filter(d => d.status === 'healthy');
  const expiringDocs = documents.filter(d => d.status === 'expiring' || d.status === 'attention');
  const missingDocs = documents.filter(d => d.status === 'missing');
  const actionDocs = documents.filter(d => d.actionRequired);

  // Check if profile is complete (age > 0, state present, occupation present)
  const isProfileComplete = profile && profile.age && profile.state && profile.occupation;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const hasData = documents.length > 0 || goals.length > 0;

  // Next steps checklist filtering based on actual user progress
  const checklistSteps = [
    !isProfileComplete && {
      id: 'profile',
      step: '1',
      title: 'Complete your profile & life context',
      desc: 'Help LifeFlow identify processes relevant to your state and occupation.',
      action: () => navigate('profile'),
      btn: 'Edit Profile'
    },
    documents.length === 0 && {
      id: 'doc',
      step: isProfileComplete ? '1' : '2',
      title: 'Add your first document',
      desc: 'Upload an Aadhaar, PAN, marksheet, or vehicle insurance policy.',
      action: onAddDoc,
      btn: 'Add Document'
    },
    goals.length === 0 && {
      id: 'goal',
      step: (!isProfileComplete && documents.length === 0) ? '3' : '2',
      title: 'Choose a life process to prepare for',
      desc: 'Check your readiness score for Scholarships, Passport, DL, or Insurance.',
      action: () => navigate('readiness'),
      btn: 'Check Readiness'
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {greeting()}, {firstName}.
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">
            {hasData ? "Here's what needs your attention today." : "Let's build your LifeFlow personal dashboard."}
          </p>
        </div>
        {!hasData && (
          <button
            onClick={() => navigate('readiness')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[13px] transition-colors"
          >
            <Sparkles size={14} />
            Explore Processes
          </button>
        )}
      </div>

      {/* NEW USER EMPTY / INITIALIZING DASHBOARD STATE */}
      {!hasData && !isDemo ? (
        <div className="space-y-6 fade-in">
          {/* Welcome card */}
          <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Sparkles size={24} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Welcome to LifeFlow!</h2>
                <p className="text-[14px] text-slate-400 mt-1 max-w-lg leading-relaxed">
                  Your personal document & process copilot is ready. Follow these recommended next steps to get started:
                </p>
              </div>
            </div>

            {/* Dynamic Checklist steps */}
            {checklistSteps.length > 0 ? (
              <div className="space-y-3">
                {checklistSteps.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[12px] font-semibold text-slate-300">
                        {s.step}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-slate-200">{s.title}</p>
                        <p className="text-[12px] text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={s.action}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 rounded-lg text-[12px] font-medium transition-colors shrink-0"
                    >
                      {s.btn}
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[14px] text-slate-300 font-medium">Your profile setup is 100% complete!</p>
                <p className="text-[13px] text-slate-500 mt-1">Add your first document or choose a process to get started.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* REGULAR / DEMO DASHBOARD STATE */
        <>
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
        </>
      )}
    </div>
  );
}
