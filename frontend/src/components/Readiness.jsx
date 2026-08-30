import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Award, Globe, Car, AlertTriangle, FileText, Cpu, Building2, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { formatDate, getDaysUntil } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const processCategories = [
  {
    category: 'EDUCATION',
    items: [
      { id: 'scholarship', name: 'Scholarship Application', desc: 'State merit scholarship or fee waiver', reqs: ['Aadhaar Card', '12th Marksheet', 'Bank Account Proof', 'Income Certificate'] },
      { id: 'college_admission', name: 'College Admission', desc: 'Undergraduate or postgraduate admissions', reqs: ['12th Marksheet', '10th Marksheet', 'Aadhaar Card', 'Migration Certificate'] },
      { id: 'competitive_exam', name: 'Competitive Exam Registration', desc: 'NEET, JEE, UPSC, or MPSC registration', reqs: ['Aadhaar Card', '12th Marksheet', 'Passport Photo', 'Category Certificate'] },
    ]
  },
  {
    category: 'IDENTITY & TRAVEL',
    items: [
      { id: 'passport', name: 'Passport Application', desc: 'Fresh normal passport or renewal', reqs: ['Aadhaar Card', 'PAN Card', '10th or 12th Marksheet', 'Bank Account Proof'] },
      { id: 'driving_licence', name: 'Driving Licence Renewal', desc: 'RTO driving licence renewal', reqs: ['Aadhaar Card', 'PAN Card', 'Current Driving Licence', 'Medical Certificate'] },
    ]
  },
  {
    category: 'GOVERNMENT',
    items: [
      { id: 'gov_scheme', name: 'Government Scheme Application', desc: 'Social welfare or housing scheme', reqs: ['Aadhaar Card', 'PAN Card', 'Ration Card', 'Bank Account Proof'] },
      { id: 'income_cert', name: 'Income Certificate Request', desc: 'Certificate for scholarship or quota', reqs: ['Aadhaar Card', 'Ration Card', 'Self Declaration'] },
    ]
  },
  {
    category: 'FINANCIAL',
    items: [
      { id: 'insurance', name: 'Vehicle Insurance Renewal', desc: 'Motor vehicle policy renewal', reqs: ['Aadhaar Card', 'Driving Licence', 'Vehicle Insurance Policy'] },
      { id: 'loan_docs', name: 'Loan Documentation', desc: 'Personal or education loan proof', reqs: ['PAN Card', 'Aadhaar Card', 'Bank Account Proof', 'Income Proof'] },
    ]
  }
];

export default function Readiness({ documents = [], navigate, onSaveGoal }) {
  const { isDemo } = useAuth();
  const [selectedProcess, setSelectedProcess] = useState(null);

  // Match available user documents by title/name
  const checkRequirementStatus = (reqName) => {
    const userDocNames = documents.map(d => (d.title || d.name || '').toLowerCase());
    const matched = userDocNames.some(name => name.includes(reqName.toLowerCase()) || reqName.toLowerCase().includes(name));
    return matched ? 'available' : 'missing';
  };

  const calculateReadiness = (proc) => {
    const total = proc.reqs.length;
    let availableCount = 0;
    proc.reqs.forEach(r => {
      if (checkRequirementStatus(r) === 'available') availableCount++;
    });
    const percent = Math.round((availableCount / total) * 100);
    return { percent, availableCount, total, missingCount: total - availableCount };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Goal Readiness Checker</h1>
        <p className="text-[13px] text-slate-400 mt-0.5">
          Readiness is not just about storing documents. LifeFlow connects what you have with what you want to achieve.
        </p>
      </div>

      {/* PROCESS SELECTION STEP */}
      {!selectedProcess ? (
        <div className="space-y-6 fade-in">
          <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-100 mb-1">What are you preparing for?</h2>
            <p className="text-[13px] text-slate-500 mb-6">Choose from categorized goals below:</p>

            <div className="space-y-6">
              {processCategories.map(cat => (
                <div key={cat.category}>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">{cat.category}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.items.map(proc => (
                      <button
                        key={proc.id}
                        onClick={() => setSelectedProcess(proc)}
                        className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all text-left group flex items-start justify-between"
                      >
                        <div>
                          <p className="text-[14px] font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{proc.name}</p>
                          <p className="text-[12px] text-slate-500 mt-0.5">{proc.desc}</p>
                          <span className="inline-block mt-2 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                            {proc.reqs.length} required documents
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 mt-1 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* READINESS DETAILED REPORT FOR SELECTED PROCESS */
        <div className="space-y-6 fade-in">
          <button
            onClick={() => setSelectedProcess(null)}
            className="text-[13px] text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            ← Choose another goal
          </button>

          {(() => {
            const { percent, availableCount, total, missingCount } = calculateReadiness(selectedProcess);
            return (
              <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Selected Goal</span>
                    <h2 className="text-2xl font-bold text-white mt-0.5">{selectedProcess.name}</h2>
                    <p className="text-[13px] text-slate-400 mt-1">{selectedProcess.desc}</p>
                  </div>
                  {onSaveGoal && (
                    <button
                      onClick={() => onSaveGoal(selectedProcess)}
                      className="px-3.5 py-2 bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-600 rounded-xl text-[12px] font-medium transition-colors shrink-0"
                    >
                      Save as Active Goal
                    </button>
                  )}
                </div>

                {/* Score */}
                <div>
                  <div className="flex items-end gap-3 mb-3">
                    <span className={`text-5xl font-bold ${
                      percent === 100 ? 'text-emerald-400' :
                      percent >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {percent}%
                    </span>
                    <span className="text-[14px] text-slate-400 mb-1.5">readiness score ({availableCount}/{total} documents ready)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        percent === 100 ? 'bg-emerald-400' :
                        percent >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Requirements Checklist</h3>
                  <div className="space-y-2">
                    {selectedProcess.reqs.map(req => {
                      const status = checkRequirementStatus(req);
                      const isAvailable = status === 'available';

                      return (
                        <div
                          key={req}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                            isAvailable
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                              : 'bg-red-500/5 border-red-500/20 text-red-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isAvailable ? (
                              <CheckCircle size={17} className="text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle size={17} className="text-red-400 shrink-0" />
                            )}
                            <span className="text-[14px] font-medium">{req}</span>
                          </div>
                          <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                            isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {isAvailable ? 'Available' : 'Missing'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Next Action */}
                <div className={`p-4 rounded-xl border ${
                  missingCount === 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <p className="text-[13px] font-semibold mb-1">
                    {missingCount === 0 ? '✓ You are 100% ready to proceed!' : `⚠️ Missing ${missingCount} required document${missingCount > 1 ? 's' : ''}`}
                  </p>
                  <p className="text-[13px] opacity-90">
                    {missingCount === 0
                      ? 'You have all required documents in your vault. You can begin your application submission.'
                      : 'Obtain your missing documents first before submitting this application to prevent rejection.'}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
