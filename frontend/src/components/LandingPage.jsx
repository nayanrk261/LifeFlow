import { ArrowRight, Shield, Cpu, Zap, FileText, Eye, Bell, CheckCircle, ChevronRight, Lock, Smartphone, Sparkles } from 'lucide-react';

export default function LandingPage({ onGetStarted, onDemo }) {
  return (
    <div className="min-h-screen bg-[#020617] overflow-x-hidden">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-900/20">
            L
          </div>
          <span className="text-[16px] font-bold text-slate-100 tracking-tight">LifeFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onDemo}
            className="text-[13px] font-medium text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5"
          >
            Explore Demo
          </button>
          <button
            onClick={onGetStarted}
            className="text-[13px] font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg px-4 py-1.5 transition-colors shadow-md shadow-emerald-950/20"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 sm:px-10 pt-16 sm:pt-28 pb-16 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <Sparkles size={12} className="text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">AI-Powered Personal Life-Process Copilot</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight">
          Navigate life processes.
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-slate-200 bg-clip-text text-transparent">
            One clear step at a time.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          LifeFlow brings your goals, documents, and requirements together.
          Calculate application readiness, spot missing documents, and take action before deadlines pass.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[14px] font-bold transition-all shadow-lg shadow-emerald-950/30"
          >
            Get Started Free
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onDemo}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded-xl text-[14px] font-medium hover:bg-slate-800 hover:text-white transition-all"
          >
            Explore Demo Persona
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Product Loop Diagram */}
      <section className="px-6 sm:px-10 pb-20 max-w-4xl mx-auto">
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8">
          <p className="text-[12px] font-semibold text-emerald-400 uppercase tracking-wider text-center mb-6">The LifeFlow Core Product Loop</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { title: '1. Select Goal', desc: 'Scholarship, Passport, DL, Insurance' },
              { title: '2. Auto Match', desc: 'Compare documents vs requirements' },
              { title: '3. Spot Missing', desc: 'Identify missing certificates & proofs' },
              { title: '4. Take Action', desc: 'Reminders, generator & next steps' }
            ].map((step, i) => (
              <div key={i} className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4">
                <p className="text-[13px] font-bold text-white mb-1">{step.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="px-6 sm:px-10 pb-20 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-bold text-white tracking-tight mb-6">
          Beyond Document Storage
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="bg-slate-800/30 border border-slate-800/60 rounded-xl p-6">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">DigiLocker / Cloud Drive</p>
            <p className="text-[14px] text-slate-300 font-medium">"Access and store your raw files."</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">LifeFlow</p>
            <p className="text-[14px] text-white font-semibold">"Understand what your documents mean, what is missing, and guide your next action."</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-[10px]">
              L
            </div>
            <span className="text-[13px] text-slate-500">LifeFlow — Personal Process Copilot</span>
          </div>
          <p className="text-[12px] text-slate-600">Full-Stack Application • React + Node.js + Express + MongoDB</p>
        </div>
      </footer>
    </div>
  );
}
