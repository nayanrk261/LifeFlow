import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, Users, ArrowRight, X, Loader2, ShieldCheck, AlertCircle, HelpCircle, Target, Plus, ChevronRight, Edit3 } from 'lucide-react';

export default function AskLifeFlowModal({ initialQuery = '', onClose, onSaveGoal, isDemo = false, userDocs = [], goals = [] }) {
  // Modal stage: 'select' | 'analyzing' | 'clarification' | 'result' | 'error'
  const [stage, setStage] = useState(initialQuery && initialQuery.trim().length >= 3 ? 'analyzing' : 'select');
  const [queryInput, setQueryInput] = useState(initialQuery || '');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [activeGoalId, setActiveGoalId] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [customClarifyInput, setCustomClarifyInput] = useState('');

  const loadingSteps = [
    'Understanding your goal intent...',
    'Identifying the right process & requirements...',
    'Checking your available documents in vault...',
    'Checking authorized family shared documents...',
    'Calculating readiness score & creating action plan...'
  ];

  const exampleChips = [
    { label: '🎓 Apply for a scholarship', query: 'I want to apply for a scholarship.' },
    { label: 'Passport preparation', query: 'I need to prepare for a passport.' },
    { label: 'Renew driving licence', query: 'I want to renew my driving licence.' },
    { label: 'Government scheme', query: 'I want to apply for a government scheme.' },
    { label: 'College admission', query: 'I want to prepare documents for college admission.' },
    { label: 'Custom goal', query: '' }
  ];

  // Perform Analysis for New or Existing Goal
  const performAnalysis = async (targetQueryOrGoal, isExisting = false) => {
    let finalQuery = '';
    let goalId = null;

    if (isExisting && targetQueryOrGoal && (targetQueryOrGoal._id || targetQueryOrGoal.id)) {
      goalId = targetQueryOrGoal._id || targetQueryOrGoal.id;
      finalQuery = targetQueryOrGoal.title;
      setSelectedGoal(targetQueryOrGoal);
      setActiveGoalId(goalId);
    } else if (typeof targetQueryOrGoal === 'string') {
      finalQuery = targetQueryOrGoal.trim();
      setSelectedGoal(null);
      setActiveGoalId(null);
    } else if (queryInput.trim()) {
      finalQuery = queryInput.trim();
      setSelectedGoal(null);
      setActiveGoalId(null);
    }

    // STRICT VALIDATION
    if (!finalQuery || finalQuery.trim().length < 3) {
      setErrorMsg('Please select an active goal or enter a goal with at least 3 characters.');
      return;
    }

    setQueryInput(finalQuery);
    setStage('analyzing');
    setLoadingStep(0);
    setErrorMsg('');

    // Honest loading step timer
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    try {
      if (isDemo) {
        // Fallback simulation for demo mode
        await new Promise(r => setTimeout(r, 2000));
        const qLower = finalQuery.toLowerCase();

        if (qLower === 'i need docs' || qLower === 'help me' || qLower.length < 4) {
          clearInterval(stepInterval);
          setAnalysisResult({
            needsClarification: true,
            clarifyingQuestions: ['What specific application or service are you preparing for?'],
            suggestedOptions: ['Scholarship Application', 'Passport Renewal', 'Driving Licence', 'Government Scheme', 'College Admission']
          });
          setStage('clarification');
          return;
        }

        let title = isExisting ? targetQueryOrGoal.title : 'Scholarship Application Preparation';
        let category = isExisting ? targetQueryOrGoal.category : 'Education';
        let processType = isExisting ? targetQueryOrGoal.processType : 'scholarship';
        let reqs = [
          { name: 'Aadhaar Card', status: 'available', required: true, matchedDocumentId: 'd1' },
          { name: '12th Marksheet', status: 'available', required: true, matchedDocumentId: 'd2' },
          { name: 'Bank Account Passbook', status: 'available', required: true, matchedDocumentId: 'd3' },
          { name: 'Income Certificate', status: 'missing', required: true },
          { name: 'Passport Size Photo', status: 'optional', required: false }
        ];

        if (qLower.includes('passport')) {
          title = 'Passport Application / Renewal';
          category = 'Identity & Travel';
          processType = 'passport';
          reqs = [
            { name: 'Aadhaar Card (Address Proof)', status: 'available', required: true },
            { name: 'PAN Card (ID Proof)', status: 'available', required: true },
            { name: 'Birth Certificate / Date of Birth Proof', status: 'missing', required: true }
          ];
        } else if (qLower.includes('licence') || qLower.includes('license') || qLower.includes('driving')) {
          title = 'Driving Licence Renewal';
          category = 'Identity & Travel';
          processType = 'driving_licence';
          reqs = [
            { name: 'Existing Driving Licence', status: 'available', required: true },
            { name: 'Address Proof', status: 'available', required: true },
            { name: 'Medical Certificate Form 1A', status: 'missing', required: true }
          ];
        }

        const missingCount = reqs.filter(r => r.required && r.status === 'missing').length;
        const availableCount = reqs.filter(r => r.status === 'available').length;
        const readiness = Math.round((availableCount / reqs.filter(r => r.required).length) * 80 + 10);

        const mockRes = {
          originalUserRequest: finalQuery,
          processType,
          title,
          category,
          isOfficial: true,
          guidanceLabel: 'Official Requirements Mapped',
          readinessScore: readiness,
          nextBestAction: missingCount > 0 ? `Obtain your ${reqs.find(r => r.status === 'missing')?.name} to complete your application readiness.` : 'All required documents are ready! Proceed to apply.',
          aiExplanation: `LifeFlow checked your current vault. You're ${readiness}% ready for ${title}. ${availableCount} requirements are ready and ${missingCount} required document is missing.`,
          requirements: reqs,
          actions: [
            { title: 'Verify student profile details', priority: 'high', status: 'Completed' },
            { title: `Obtain missing ${reqs.find(r => r.status === 'missing')?.name || 'documents'}`, priority: 'high', status: 'Not Started' },
            { title: 'Submit final application on portal', priority: 'medium', status: 'Not Started' }
          ]
        };

        clearInterval(stepInterval);
        setAnalysisResult(mockRes);
        setStage('result');
      } else {
        // Authenticated Real Backend API Call
        const { api } = await import('../services/api');
        let data;

        if (goalId) {
          data = await api.analyzeExistingGoal(goalId);
        } else {
          data = await api.analyzeGoal(finalQuery);
        }

        clearInterval(stepInterval);

        if (data && data.needsClarification) {
          setAnalysisResult(data);
          setStage('clarification');
        } else {
          setAnalysisResult(data);
          setStage('result');
        }
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Goal analysis failed:', err);
      setErrorMsg(err.message || 'Failed to analyze goal request. Please try again.');
      setStage('error');
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length >= 3) {
      performAnalysis(initialQuery);
    }
  }, [initialQuery]);

  const handleChipClick = (chipQuery) => {
    if (chipQuery) {
      setQueryInput(chipQuery);
      performAnalysis(chipQuery);
    } else {
      setQueryInput('');
    }
  };

  const handleClarifySubmit = (optionText) => {
    const combinedQuery = optionText || customClarifyInput || 'Scholarship Application';
    performAnalysis(combinedQuery);
  };

  const handleCreatePlan = async () => {
    if (!analysisResult || saving) return;
    setSaving(true);
    try {
      const sanitizedGoalPayload = {
        ...analysisResult,
        actions: (analysisResult.actions || []).map(act => {
          const item = {
            title: act.title,
            description: act.description || '',
            priority: act.priority || 'medium',
            status: act.status || 'Not Started'
          };
          if (act._id && typeof act._id === 'string' && /^[0-9a-fA-F]{24}$/.test(act._id)) {
            item._id = act._id;
          }
          return item;
        })
      };
      await onSaveGoal(sanitizedGoalPayload);
      onClose();
    } catch (err) {
      console.error('Save goal failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const isInputValid = queryInput.trim().length >= 3;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto fade-in">
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Ask LifeFlow Engine</h2>
              <p className="text-[12px] text-slate-400">LifeFlow turns your goal into requirements, readiness, and next actions.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">

          {/* STEP 1: GOAL SELECTION / DECISION SCREEN */}
          {stage === 'select' && (
            <div className="space-y-6 fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Tell LifeFlow what you&apos;re trying to achieve.
                </h3>
                <p className="text-[13px] text-slate-400 mt-1">
                  Choose an active goal you&apos;re already working on, or tell LifeFlow about a new goal to build your action plan.
                </p>
              </div>

              {/* SECTION A — YOUR ACTIVE GOALS */}
              {goals && goals.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={14} />
                    YOUR ACTIVE GOALS ({goals.length})
                  </p>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {goals.map((g) => {
                      const goalId = g._id || g.id;
                      const missingCount = (g.requirements || []).filter(r => r.required !== false && r.status === 'missing').length;

                      return (
                        <div
                          key={goalId}
                          onClick={() => performAnalysis(g, true)}
                          className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                              <Target size={18} className="text-emerald-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                                  {g.category || 'Goal'}
                                </span>
                                <span className="text-[13px] font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                                  {g.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {missingCount > 0 ? `${missingCount} requirement${missingCount > 1 ? 's' : ''} remaining` : '✓ All requirements available'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className={`px-3 py-1 rounded-lg border text-center ${getScoreColor(g.readinessScore)}`}>
                              <span className="text-xs font-black">{g.readinessScore}% Ready</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); performAnalysis(g, true); }}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-[12px] rounded-lg transition-colors"
                            >
                              Select & Re-Analyze
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <p className="text-[13px] text-slate-300 font-medium">You haven&apos;t created any active goals yet.</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">Tell LifeFlow what you want to accomplish below to build your first action plan.</p>
                </div>
              )}

              {/* SECTION B — START SOMETHING NEW */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus size={14} className="text-emerald-400" />
                  START SOMETHING NEW
                </p>

                {/* Suggested Chips */}
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

                {/* New Goal Input Form */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={queryInput}
                      onChange={(e) => { setQueryInput(e.target.value); setErrorMsg(''); }}
                      placeholder="Example: I want to apply for a scholarship..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-[14px] placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-[12px] text-red-400 font-medium flex items-center gap-1">
                      <AlertCircle size={13} /> {errorMsg}
                    </p>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[13px] font-semibold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!isInputValid}
                      onClick={() => performAnalysis(queryInput)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-[13px] rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Sparkles size={16} />
                      Ask LifeFlow Engine
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING LOADING SCREEN */}
          {stage === 'analyzing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 fade-in">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin flex items-center justify-center" />
                <Sparkles size={22} className="text-emerald-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Analyzing your goal...</h3>
                <p className="text-[13px] text-emerald-400 font-medium h-6 transition-all">
                  {loadingSteps[loadingStep]}
                </p>
                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 inline-block max-w-md">
                  <p className="text-[12px] text-slate-400">
                    Goal: <span className="text-slate-100 font-bold italic">&quot;{queryInput || selectedGoal?.title || 'Scholarship Application'}&quot;</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CLARIFICATION SCREEN */}
          {stage === 'clarification' && analysisResult && (
            <div className="py-6 space-y-6 fade-in">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <HelpCircle size={22} className="text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-white">Clarification Required</h3>
                  <p className="text-[13px] text-slate-300 mt-1">
                    {analysisResult.clarifyingQuestions?.[0] || 'What process or application are you trying to prepare for?'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Select a process option:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(analysisResult.suggestedOptions || ['Scholarship Application', 'Passport Renewal', 'Driving Licence', 'College Admission']).map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleClarifySubmit(opt)}
                      className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 hover:border-emerald-500/40 rounded-xl text-left transition-all group"
                    >
                      <span className="text-[13px] font-semibold text-slate-200 group-hover:text-white">{opt}</span>
                      <ChevronRight size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <p className="text-[12px] text-slate-400">Or describe your specific goal in detail:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customClarifyInput}
                    onChange={(e) => setCustomClarifyInput(e.target.value)}
                    placeholder="e.g. I want to apply for a state scholarship for engineering..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-[13px] focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={() => handleClarifySubmit(customClarifyInput)}
                    disabled={!customClarifyInput.trim()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-[13px] rounded-xl transition-all"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ERROR SCREEN */}
          {stage === 'error' && (
            <div className="py-8 text-center space-y-4 fade-in">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle size={24} />
              </div>
              <p className="text-slate-300 text-[14px] font-medium">{errorMsg}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setStage('select')}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white font-medium text-[13px] rounded-xl transition-colors"
                >
                  Choose Another Goal
                </button>
                <button
                  onClick={() => performAnalysis(queryInput || selectedGoal)}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-[13px] rounded-xl transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: ANALYSIS RESULT */}
          {stage === 'result' && analysisResult && (
            <div className="space-y-6 fade-in">
              {/* Header Title & Readiness */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      {analysisResult.category || 'Goal'}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-medium">
                      {analysisResult.guidanceLabel || (analysisResult.isOfficial ? 'Official Requirements Mapped' : 'AI-generated planning guidance')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{analysisResult.title}</h3>
                  <p className="text-[12px] text-slate-400 mt-0.5">Goal Intent: &quot;{analysisResult.originalUserRequest || queryInput}&quot;</p>
                </div>
                <div className={`px-4 py-3 rounded-xl border text-center shrink-0 ${getScoreColor(analysisResult.readinessScore)}`}>
                  <span className="block text-2xl font-black">{analysisResult.readinessScore}%</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">READINESS SCORE</span>
                </div>
              </div>

              {/* AI Explanation Banner */}
              {analysisResult.aiExplanation && (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
                  <Sparkles size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">LIFEFLOW AI SUMMARY</p>
                    <p className="text-[13px] text-slate-300 leading-relaxed">
                      {analysisResult.aiExplanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements Checklist */}
              <div>
                <h4 className="text-[14px] font-semibold text-slate-200 mb-3 flex items-center justify-between">
                  <span>Process Requirements Checklist</span>
                  <span className="text-[12px] text-slate-400 font-normal">
                    {analysisResult.requirements.filter(r => r.status === 'available').length} of {analysisResult.requirements.length} Ready
                  </span>
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {analysisResult.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 flex items-center justify-between text-[13px]"
                    >
                      <div className="flex items-center gap-3">
                        {req.status === 'available' ? (
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        ) : req.status === 'optional' ? (
                          <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                        ) : (
                          <XCircle size={18} className="text-red-400 shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-200">{req.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {req.description || req.category}
                            {req.matchedFamilyMemberName && (
                              <span className="ml-2 text-indigo-400 font-medium">
                                (👥 Shared by {req.matchedFamilyMemberName})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase ${
                        req.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        req.status === 'optional' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {req.status === 'available' ? 'Available' : req.status === 'optional' ? 'Optional' : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Best Action Card */}
              {analysisResult.nextBestAction && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30">
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    ⚡ RECOMMENDED NEXT BEST ACTION
                  </p>
                  <p className="text-[14px] font-medium text-slate-100">
                    {analysisResult.nextBestAction}
                  </p>
                </div>
              )}

              {/* Action Plan Footer CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setStage('select')}
                  className="px-3.5 py-2 text-slate-400 hover:text-slate-200 text-[12px] font-medium transition-colors"
                >
                  ← Choose Another Goal
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[13px] font-semibold rounded-xl transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleCreatePlan}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[13px] font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving Goal...
                      </>
                    ) : (
                      <>
                        Create My Action Plan
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
