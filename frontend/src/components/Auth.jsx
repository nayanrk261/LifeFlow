import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth({ onAuthSuccess, onBack }) {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak (Need 8+ chars, uppercase, number & symbol)', color: 'bg-red-500' };
    if (score <= 4) return { score: 66, label: 'Medium (Add special character or number)', color: 'bg-amber-400' };
    return { score: 100, label: 'Strong password', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (isSignup) {
      if (!name.trim()) {
        setError('Full name is required.');
        return false;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        setError('Password must contain at least one uppercase letter (A-Z).');
        return false;
      }
      if (!/[a-z]/.test(password)) {
        setError('Password must contain at least one lowercase letter (a-z).');
        return false;
      }
      if (!/\d/.test(password)) {
        setError('Password must contain at least one number (0-9).');
        return false;
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        setError('Password must contain at least one special character (e.g. !@#$%^&*).');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError('');

    try {
      if (isSignup) {
        const user = await signup(name.trim(), email.trim(), password, confirmPassword);
        onAuthSuccess(user, true);
      } else {
        const user = await login(email.trim(), password);
        onAuthSuccess(user, !user.onboardingCompleted);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to home
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-emerald-900/20">
            L
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">LifeFlow</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-[14px] text-slate-500 mb-8">
          {isSignup
            ? 'Know what you need. Know what you have. Know what to do next.'
            : 'Sign in to access your personal LifeFlow dashboard.'}
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2.5 text-[13px] fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="e.g. LifeFlow@2026"
                required
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-10 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password Strength Meter for Signup */}
            {isSignup && password.length > 0 && (
              <div className="mt-2 space-y-1 fade-in">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-slate-500" />
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {isSignup && (
            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-10 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-[14px] transition-colors shadow-md shadow-emerald-950/20 disabled:opacity-50 mt-2"
          >
            {submitting ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-slate-500">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
