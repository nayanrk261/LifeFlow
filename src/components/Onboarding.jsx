import { useState, useEffect } from 'react';
import { ArrowRight, Check, Link2, Loader2, Shield, ChevronRight } from 'lucide-react';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    firstName: 'Rahul',
    lastName: 'Sharma',
    age: '21',
    state: 'Maharashtra',
    occupation: 'Student',
    occupationType: 'student',
    ownsVehicle: true,
  });
  const [digilockerStatus, setDigilockerStatus] = useState('idle'); // idle, connecting, consent, loading, done
  const [loadingDocs, setLoadingDocs] = useState(0);

  const handleDigilockerConnect = () => {
    setDigilockerStatus('connecting');
    setTimeout(() => setDigilockerStatus('consent'), 1200);
  };

  const handleDigilockerConsent = () => {
    setDigilockerStatus('loading');
    // Simulate document loading
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setLoadingDocs(count);
      if (count >= 7) {
        clearInterval(interval);
        setDigilockerStatus('done');
      }
    }, 300);
  };

  const handleFinish = () => {
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold border transition-all ${
                step >= s
                  ? 'bg-white text-slate-900 border-white'
                  : 'border-slate-700 text-slate-500'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span className={`text-[13px] font-medium hidden sm:inline ${step >= s ? 'text-slate-200' : 'text-slate-600'}`}>
                {s === 1 ? 'Profile' : 'Documents'}
              </span>
              {s < 2 && <div className={`w-12 h-px ${step > 1 ? 'bg-white' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="fade-in">
            <h1 className="text-2xl font-bold text-white mb-1">Tell us about yourself</h1>
            <p className="text-[14px] text-slate-500 mb-8">
              This helps DocAction identify documents and workflows that may be relevant to you.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">First name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Last name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">State</label>
                  <select
                    value={profile.state}
                    onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors appearance-none"
                  >
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Occupation</label>
                <div className="flex gap-2">
                  {['Student', 'Working', 'Other'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setProfile(p => ({ ...p, occupation: opt, occupationType: opt.toLowerCase() }))}
                      className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                        profile.occupation === opt
                          ? 'bg-white text-slate-900 border-white'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Do you own a vehicle?</label>
                <div className="flex gap-2">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => setProfile(p => ({ ...p, ownsVehicle: val }))}
                      className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                        profile.ownsVehicle === val
                          ? 'bg-white text-slate-900 border-white'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {val ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full flex items-center justify-center gap-2 py-2.5 bg-white text-slate-900 rounded-lg text-[14px] font-semibold hover:bg-slate-100 transition-colors"
            >
              Continue
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2: DigiLocker */}
        {step === 2 && (
          <div className="fade-in">
            <h1 className="text-2xl font-bold text-white mb-1">Bring your verified documents</h1>
            <p className="text-[14px] text-slate-500 mb-8">
              Connect your DigiLocker account to access documents you authorize.
            </p>

            {digilockerStatus === 'idle' && (
              <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Link2 size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-100">DigiLocker</p>
                    <p className="text-[12px] text-slate-500">Access your government-issued documents</p>
                  </div>
                </div>

                <p className="text-[13px] text-slate-400 mb-5 leading-relaxed">
                  DocAction is designed to integrate with DigiLocker through the official requester/consent flow.
                  This prototype uses demo documents to simulate the experience.
                </p>

                <button
                  onClick={handleDigilockerConnect}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[14px] font-semibold transition-colors"
                >
                  <Link2 size={15} />
                  Connect DigiLocker
                </button>
              </div>
            )}

            {digilockerStatus === 'connecting' && (
              <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-8 text-center fade-in">
                <Loader2 size={28} className="text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-[14px] text-slate-300 font-medium">Connecting to DigiLocker...</p>
                <p className="text-[12px] text-slate-500 mt-1">Establishing secure connection</p>
              </div>
            )}

            {digilockerStatus === 'consent' && (
              <div className="bg-[#0a0f1a] border border-blue-500/20 rounded-xl p-6 fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} className="text-blue-400" />
                  <p className="text-[14px] font-semibold text-slate-100">Authorization Required</p>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                  <p className="text-[13px] text-slate-300 mb-3">
                    <strong>DocAction</strong> is requesting access to the following from your DigiLocker:
                  </p>
                  <ul className="space-y-2">
                    {['Aadhaar Card', 'PAN Card', 'Driving Licence', '12th Marksheet'].map(doc => (
                      <li key={doc} className="flex items-center gap-2 text-[13px] text-slate-400">
                        <Check size={13} className="text-emerald-400" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] text-slate-500 mb-5 flex items-center gap-1.5">
                  <Shield size={11} />
                  OAuth 2.0 • User consent required • Revocable at any time
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDigilockerStatus('idle')}
                    className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg text-[13px] font-medium hover:bg-slate-800/50 transition-colors"
                  >
                    Deny
                  </button>
                  <button
                    onClick={handleDigilockerConsent}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[13px] font-semibold transition-colors"
                  >
                    Authorize
                  </button>
                </div>

                <div className="mt-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-[11px] text-amber-400 font-medium">
                    Demo connection — prototype. No real DigiLocker API call is made.
                  </p>
                </div>
              </div>
            )}

            {digilockerStatus === 'loading' && (
              <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-6 fade-in">
                <p className="text-[14px] font-semibold text-slate-100 mb-4">Importing documents...</p>
                <div className="space-y-3">
                  {['Aadhaar Card', 'PAN Card', 'Driving Licence', '12th Marksheet', 'College ID', 'Bank Proof', 'Vehicle Insurance'].map((doc, i) => (
                    <div key={doc} className="flex items-center gap-3">
                      {i < loadingDocs ? (
                        <Check size={14} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Loader2 size={14} className="text-slate-500 animate-spin shrink-0" />
                      )}
                      <span className={`text-[13px] ${i < loadingDocs ? 'text-slate-300' : 'text-slate-500'}`}>
                        {doc}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 w-full bg-slate-800 rounded-full h-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(loadingDocs / 7) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {digilockerStatus === 'done' && (
              <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-xl p-6 text-center fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={22} className="text-emerald-400" />
                </div>
                <p className="text-[15px] font-semibold text-white mb-1">7 documents imported</p>
                <p className="text-[13px] text-slate-400 mb-1">AI analysis complete</p>
                <p className="text-[11px] text-slate-600 mt-2">Demo connection — prototype</p>
              </div>
            )}

            {(digilockerStatus === 'done' || digilockerStatus === 'idle') && (
              <button
                onClick={handleFinish}
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-white text-slate-900 rounded-lg text-[14px] font-semibold hover:bg-slate-100 transition-colors"
              >
                {digilockerStatus === 'done' ? 'Go to Dashboard' : 'Skip for now'}
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
