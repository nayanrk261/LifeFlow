import { useState, useRef } from 'react';
import { ArrowRight, Check, Shield, FileText, Upload, Plus, Sparkles, Award, Globe, Car, Building2, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
];

const goalOptions = [
  { id: 'scholarship', title: 'Scholarship Application', category: 'Education', icon: Award, desc: 'Merit scholarship, college fee waiver, or fellowship' },
  { id: 'passport', title: 'Passport Application', category: 'Identity & Travel', icon: Globe, desc: 'Fresh passport or renewal' },
  { id: 'driving_licence', title: 'Driving Licence Renewal', category: 'Identity & Travel', icon: Car, desc: 'RTO licence renewal or learning permit' },
  { id: 'gov_scheme', title: 'Government Scheme', category: 'Government', icon: Building2, desc: 'State or central benefit applications' },
  { id: 'insurance', title: 'Insurance Renewal', category: 'Financial', icon: ShieldCheck, desc: 'Vehicle or health insurance' },
  { id: 'nothing', title: 'Nothing for now', category: 'None', icon: Sparkles, desc: 'Skip goal setup for now. You can pick a process anytime later.' },
];

export default function Onboarding({ onComplete }) {
  const { user, profile, updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  // Profile forms
  const [basicProfile, setBasicProfile] = useState({
    name: user?.name || '',
    age: profile?.age || 21,
    state: profile?.state || 'Maharashtra',
    city: profile?.city || '',
    occupation: profile?.occupation || 'Student',
  });

  const [lifeContext, setLifeContext] = useState({
    ownsVehicle: profile?.ownsVehicle ?? false,
    studying: profile?.studying ?? true,
    preparingForApplication: profile?.preparingForApplication ?? true,
    hasPassport: profile?.hasPassport ?? false,
    hasDrivingLicence: profile?.hasDrivingLicence ?? false,
  });

  const [selectedGoal, setSelectedGoal] = useState('scholarship');
  const [submitting, setSubmitting] = useState(false);

  // Document states in onboarding
  const [showManualModal, setShowManualModal] = useState(false);
  const [digiLockerNotice, setDigiLockerNotice] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Manual doc form
  const [manualDoc, setManualDoc] = useState({
    title: '',
    documentType: 'Aadhaar Card',
    category: 'Government',
    number: '',
    issueDate: '',
    expiryDate: '',
    notes: '',
  });

  const handleProfileSave = async () => {
    try {
      await updateUserProfile({
        age: Number(basicProfile.age),
        state: basicProfile.state,
        city: basicProfile.city,
        occupation: basicProfile.occupation,
      });
      setStep(3);
    } catch (e) {
      console.error('Failed to save profile step:', e);
      setStep(3);
    }
  };

  const handleContextSave = async () => {
    try {
      await updateUserProfile({
        ...lifeContext,
      });
      setStep(4);
    } catch (e) {
      console.error('Failed to save context step:', e);
      setStep(4);
    }
  };

  // Upload handler
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported file format. Please upload PDF, PNG, or JPG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    try {
      const docPayload = {
        title: file.name.replace(/\.[^/.]+$/, ''),
        documentType: file.type.includes('pdf') ? 'PDF Document' : 'ID Document',
        category: 'Personal',
        source: 'Browser Upload',
        status: 'healthy',
        aiSummary: `Uploaded ${file.name} (${Math.round(file.size / 1024)} KB). Document scanned and verified.`,
      };

      const created = await api.createDocument(docPayload);
      setUploadedDocs(prev => [...prev, created]);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  // Manual save
  const handleManualSave = async (e) => {
    e.preventDefault();
    if (!manualDoc.title.trim()) return;

    setUploading(true);
    try {
      const created = await api.createDocument({
        ...manualDoc,
        source: 'Manual Entry',
        status: 'healthy',
        aiSummary: `Manually added ${manualDoc.title} details.`,
      });
      setUploadedDocs(prev => [...prev, created]);
      setShowManualModal(false);
      setManualDoc({
        title: '',
        documentType: 'Aadhaar Card',
        category: 'Government',
        number: '',
        issueDate: '',
        expiryDate: '',
        notes: '',
      });
    } catch (err) {
      setUploadError(err.message || 'Failed to save manual document.');
    } finally {
      setUploading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      if (selectedGoal !== 'nothing') {
        const goalObj = goalOptions.find(g => g.id === selectedGoal) || goalOptions[0];
        await api.createGoal({
          processType: goalObj.id,
          title: goalObj.title,
          category: goalObj.category,
          description: goalObj.desc || '',
          readinessScore: 25,
          status: 'active',
          requirements: [
            { name: 'Aadhaar Card', status: 'missing' },
            { name: 'Identity Proof', status: 'missing' }
          ]
        });
      }

      await updateUserProfile({
        onboardingCompleted: true
      });

      if (onComplete) {
        await onComplete();
      }
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      if (onComplete) {
        await onComplete();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold border transition-all ${
                step >= s
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                  : 'border-slate-800 text-slate-600 bg-slate-900'
              }`}>
                {step > s ? <Check size={13} /> : s}
              </div>
              {s < 5 && <div className={`w-6 sm:w-10 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div className="fade-in text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Let's set up your LifeFlow.
            </h1>
            <p className="text-[15px] text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
              LifeFlow helps you understand what you need, what you have, and what to do next — for any life goal.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-[14px] font-semibold transition-colors shadow-lg shadow-emerald-950/20"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Basic Profile */}
        {step === 2 && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-white mb-1">Basic Profile</h2>
            <p className="text-[14px] text-slate-500 mb-6">
              Tell us a bit about yourself to personalize your processes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={basicProfile.name}
                  onChange={e => setBasicProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Age</label>
                  <input
                    type="number"
                    value={basicProfile.age}
                    onChange={e => setBasicProfile(p => ({ ...p, age: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">State</label>
                  <select
                    value={basicProfile.state}
                    onChange={e => setBasicProfile(p => ({ ...p, state: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors appearance-none"
                  >
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">City (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Mumbai, Delhi"
                  value={basicProfile.city}
                  onChange={e => setBasicProfile(p => ({ ...p, city: e.target.value }))}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-2">Occupation</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Student', 'Working professional', 'Self-employed', 'Other'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBasicProfile(p => ({ ...p, occupation: opt }))}
                      className={`px-3 py-2 rounded-lg text-[13px] font-medium border text-left transition-all ${
                        basicProfile.occupation === opt
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleProfileSave}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px] transition-colors"
            >
              Next: Life Context
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* STEP 3: Life Context */}
        {step === 3 && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-white mb-1">Life Context</h2>
            <p className="text-[14px] text-slate-500 mb-6">
              This information helps LifeFlow suggest relevant goals. You can update it later.
            </p>

            <div className="space-y-3">
              {[
                { key: 'ownsVehicle', label: 'Do you own a vehicle?' },
                { key: 'studying', label: 'Are you currently studying?' },
                { key: 'preparingForApplication', label: 'Are you preparing for any application?' },
                { key: 'hasPassport', label: 'Do you have a passport?' },
                { key: 'hasDrivingLicence', label: 'Do you have a driving licence?' },
              ].map(q => (
                <div key={q.key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
                  <span className="text-[13px] font-medium text-slate-200">{q.label}</span>
                  <div className="flex gap-2">
                    {[true, false].map(val => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => setLifeContext(c => ({ ...c, [q.key]: val }))}
                        className={`px-3 py-1 rounded-md text-[12px] font-medium border transition-all ${
                          lifeContext[q.key] === val
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {val ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleContextSave}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px] transition-colors"
            >
              Next: Add Documents
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* STEP 4: Connect / Add Documents */}
        {step === 4 && (
          <div className="fade-in space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Add Documents</h2>
              <p className="text-[14px] text-slate-500">
                Bring your documents into LifeFlow to start checking goal readiness.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-3">
              {/* DigiLocker Option */}
              <button
                type="button"
                onClick={() => setDigiLockerNotice(!digiLockerNotice)}
                className="w-full p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-left flex items-start gap-3 hover:border-blue-500/40 transition-colors"
              >
                <Shield className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-slate-100">Connect DigiLocker</p>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded">
                      Planned Integration
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    Integration not yet connected in this prototype. Designed for upcoming government OAuth API integration.
                  </p>
                </div>
              </button>

              {/* Upload Document Option */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 text-left flex items-center gap-3 hover:border-slate-600 transition-colors"
              >
                <Upload className="text-emerald-400" size={18} />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-slate-200">
                    {uploading ? 'Uploading & scanning document...' : 'Upload PDF or Image'}
                  </p>
                  <p className="text-[12px] text-slate-500">Supports PDF, PNG, JPG files up to 10MB</p>
                </div>
              </button>

              {/* Enter Manually Option */}
              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="w-full p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 text-left flex items-center gap-3 hover:border-slate-600 transition-colors"
              >
                <Plus className="text-amber-400" size={18} />
                <div>
                  <p className="text-[13px] font-semibold text-slate-200">Enter Manually</p>
                  <p className="text-[12px] text-slate-500">Manually add document title, dates, and numbers</p>
                </div>
              </button>
            </div>

            {/* List of uploaded documents in onboarding */}
            {uploadedDocs.length > 0 && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Added Documents ({uploadedDocs.length})</p>
                {uploadedDocs.map(d => (
                  <div key={d._id || d.id} className="flex items-center gap-2 text-[12px] text-slate-200">
                    <Check size={14} className="text-emerald-400" />
                    <span>{d.title} ({d.category})</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl text-[14px] font-medium hover:bg-slate-800/50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Choose First Goal */}
        {step === 5 && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-white mb-1">What would you like to prepare for?</h2>
            <p className="text-[14px] text-slate-500 mb-6">
              Select a goal to initialize your LifeFlow readiness tracker, or skip for now.
            </p>

            <div className="space-y-2.5 mb-8">
              {goalOptions.map(g => {
                const Icon = g.icon;
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/30 border-slate-700/40 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold">{g.title}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5">{g.desc}</p>
                      </div>
                    </div>
                    {isSelected && <Check size={18} className="text-emerald-400 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px] transition-colors shadow-lg shadow-emerald-950/20 disabled:opacity-50"
            >
              {submitting ? 'Setting up your LifeFlow...' : 'Go to My Dashboard'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Enter Document Manually</h3>
              <button onClick={() => setShowManualModal(false)}>
                <X size={16} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleManualSave} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Aadhaar Card, Income Certificate"
                  value={manualDoc.title}
                  onChange={e => setManualDoc(d => ({ ...d, title: e.target.value }))}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={manualDoc.category}
                    onChange={e => setManualDoc(d => ({ ...d, category: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-2.5 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                  >
                    <option value="Government">Government</option>
                    <option value="Education">Education</option>
                    <option value="Financial">Financial</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Identity Proof"
                    value={manualDoc.documentType}
                    onChange={e => setManualDoc(d => ({ ...d, documentType: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">Document Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. XXXX-XXXX-1234"
                  value={manualDoc.number}
                  onChange={e => setManualDoc(d => ({ ...d, number: e.target.value }))}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={manualDoc.issueDate}
                    onChange={e => setManualDoc(d => ({ ...d, issueDate: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={manualDoc.expiryDate}
                    onChange={e => setManualDoc(d => ({ ...d, expiryDate: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2 border border-slate-700 text-slate-300 rounded-lg text-[13px] hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-[13px]"
                >
                  {uploading ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
