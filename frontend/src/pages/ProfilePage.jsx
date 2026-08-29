import { useState, useEffect } from 'react';
import { User, Shield, Check, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
];

export default function ProfilePage({ navigate, addToast }) {
  const { user, profile, updateUserProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    age: profile?.age || 21,
    state: profile?.state || 'Maharashtra',
    city: profile?.city || '',
    occupation: profile?.occupation || 'Student',
    ownsVehicle: profile?.ownsVehicle ?? false,
    studying: profile?.studying ?? true,
    preparingForApplication: profile?.preparingForApplication ?? true,
    hasPassport: profile?.hasPassport ?? false,
    hasDrivingLicence: profile?.hasDrivingLicence ?? false,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm(prev => ({
        ...prev,
        age: profile.age ?? prev.age,
        state: profile.state ?? prev.state,
        city: profile.city ?? prev.city,
        occupation: profile.occupation ?? prev.occupation,
        ownsVehicle: profile.ownsVehicle ?? prev.ownsVehicle,
        studying: profile.studying ?? prev.studying,
        preparingForApplication: profile.preparingForApplication ?? prev.preparingForApplication,
        hasPassport: profile.hasPassport ?? prev.hasPassport,
        hasDrivingLicence: profile.hasDrivingLicence ?? prev.hasDrivingLicence,
      }));
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        age: Number(form.age),
        state: form.state,
        city: form.city,
        occupation: form.occupation,
        ownsVehicle: form.ownsVehicle,
        studying: form.studying,
        preparingForApplication: form.preparingForApplication,
        hasPassport: form.hasPassport,
        hasDrivingLicence: form.hasDrivingLicence,
        onboardingCompleted: true
      });
      if (addToast) addToast('Profile saved successfully!', 'success');
      // Redirect directly to Dashboard as specified
      navigate('overview');
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Profile & Life Context</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Manage your personal information and process preferences.</p>
        </div>
        <button
          onClick={() => navigate('overview')}
          className="text-[13px] text-slate-400 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Info */}
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-[14px] font-semibold text-slate-200 uppercase tracking-wider mb-2">Account Details</h2>

          <div>
            <label className="block text-[12px] font-medium text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={user?.name || form.name}
              disabled
              className="w-full bg-slate-800/30 border border-slate-700/40 rounded-lg px-4 py-2.5 text-[14px] text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={user?.email || 'user@example.com'}
              disabled
              className="w-full bg-slate-800/30 border border-slate-700/40 rounded-lg px-4 py-2.5 text-[14px] text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Life Context Info */}
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-[14px] font-semibold text-slate-200 uppercase tracking-wider mb-2">Personal Context</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1.5">State</label>
              <select
                value={form.state}
                onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
              >
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-400 mb-1.5">City</label>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Pune"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-400 mb-2">Occupation</label>
            <div className="grid grid-cols-2 gap-2">
              {['Student', 'Working professional', 'Self-employed', 'Other'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, occupation: opt }))}
                  className={`px-3 py-2 rounded-lg text-[13px] font-medium border text-left transition-all ${
                    form.occupation === opt
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

        {/* Document & Vehicle Toggles */}
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-[14px] font-semibold text-slate-200 uppercase tracking-wider mb-2">Process Preferences</h2>

          {[
            { key: 'ownsVehicle', label: 'Owns a motor vehicle' },
            { key: 'studying', label: 'Currently studying / student' },
            { key: 'preparingForApplication', label: 'Actively preparing for an application' },
            { key: 'hasPassport', label: 'Already has a valid passport' },
            { key: 'hasDrivingLicence', label: 'Already has a driving licence' },
          ].map(q => (
            <div key={q.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="text-[13px] text-slate-300">{q.label}</span>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, [q.key]: !f[q.key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  form[q.key] ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  form[q.key] ? 'translate-x-5.5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px] transition-colors shadow-lg shadow-emerald-950/20 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving changes...' : 'Save Profile & Return to Dashboard'}
        </button>
      </form>
    </div>
  );
}
