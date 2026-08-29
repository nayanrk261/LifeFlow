import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Auth({ onLogin, onBack }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-base">
            D
          </div>
          <span className="text-lg font-semibold text-slate-100 tracking-tight">DocAction</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-[14px] text-slate-500 mb-8">
          {isSignup ? 'Start organizing your document life.' : 'Sign in to continue to DocAction.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rahul@example.com"
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
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-10 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
              >
                {showPass ? <EyeOff size={15} className="text-slate-500" /> : <Eye size={15} className="text-slate-500" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-white text-slate-900 rounded-lg text-[14px] font-semibold hover:bg-slate-100 transition-colors mt-2"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-slate-500">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-slate-300 hover:text-white font-medium transition-colors"
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <p className="mt-8 text-center text-[11px] text-slate-600">
          This is a prototype. No real credentials are stored.
        </p>
      </div>
    </div>
  );
}
