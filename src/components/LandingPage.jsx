import { ArrowRight, Shield, Cpu, Zap, FileText, Eye, Bell, CheckCircle, ChevronRight, Lock, Smartphone } from 'lucide-react';

export default function LandingPage({ onGetStarted, onDemo }) {
  return (
    <div className="min-h-screen bg-[#020617] overflow-x-hidden">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <span className="text-[15px] font-semibold text-slate-100 tracking-tight">DocAction</span>
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
            className="text-[13px] font-medium text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-4 py-1.5 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 sm:px-10 pt-20 sm:pt-32 pb-16 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 mb-8">
          <Cpu size={12} className="text-sky-400" />
          <span className="text-[11px] font-medium text-sky-400">Designed for on-device AI • iQOO Hackathon 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
          Your documents.
          <br />
          <span className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
            Your next action.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          DocAction understands your important documents, finds what needs attention,
          and helps you act before you miss it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-[14px] font-semibold hover:bg-slate-100 transition-colors shadow-lg shadow-white/5"
          >
            Get Started
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onDemo}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-[14px] font-medium hover:bg-white/10 transition-colors"
          >
            Explore Demo
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Product Preview — Document → AI → Action */}
      <section className="px-6 sm:px-10 pb-24 max-w-4xl mx-auto">
        <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-6 sm:p-8 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Document */}
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-slate-400" />
                <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Document</span>
              </div>
              <p className="text-[15px] font-semibold text-slate-100">Vehicle Insurance</p>
              <p className="text-[12px] text-slate-500 mt-1">Policy: POL-2025-MH-98765</p>
              <p className="text-[12px] text-slate-500">Issued by ICICI Lombard</p>
            </div>

            {/* AI Understanding */}
            <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-5 relative">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={16} className="text-sky-400" />
                <span className="text-[12px] font-medium text-sky-400 uppercase tracking-wider">AI Understands</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-400">Expires</span>
                  <span className="text-amber-400 font-medium">Oct 12, 2026</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-400">Action</span>
                  <span className="text-slate-200 font-medium">Renew</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-400">Priority</span>
                  <span className="text-red-400 font-medium">High</span>
                </div>
              </div>
              {/* Connector arrows for desktop */}
              <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2">
                <ChevronRight size={16} className="text-sky-500/40" />
              </div>
              <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2">
                <ChevronRight size={16} className="text-sky-500/40" />
              </div>
            </div>

            {/* Action */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-emerald-400" />
                <span className="text-[12px] font-medium text-emerald-400 uppercase tracking-wider">Action</span>
              </div>
              <p className="text-[14px] text-slate-200 mb-4">Renew your vehicle insurance before Oct 12.</p>
              <button className="w-full px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[13px] font-medium hover:bg-emerald-500/20 transition-colors">
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 sm:px-10 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Not just storage. Intelligence.
          </h2>
          <p className="mt-3 text-slate-400 text-[15px] max-w-xl mx-auto">
            DocAction reasons over your documents, your profile, and real-world workflows to surface what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Eye,
              title: 'Document Understanding',
              desc: 'AI extracts entities, dates, obligations, and requirements from every document.',
            },
            {
              icon: Bell,
              title: 'Expiry & Deadline Detection',
              desc: 'Never miss a renewal date or application deadline. Get reminders before it is too late.',
            },
            {
              icon: CheckCircle,
              title: 'Application Readiness',
              desc: '"Am I ready?" — check if you have all required documents for any application.',
            },
            {
              icon: FileText,
              title: 'Missing Document Detection',
              desc: 'DocAction identifies documents you may need but do not currently have.',
            },
            {
              icon: Shield,
              title: 'Private & Secure',
              desc: 'Designed for on-device AI processing. Your documents stay on your phone.',
            },
            {
              icon: Zap,
              title: 'Document Generation',
              desc: 'Generate applications, complaints, and request letters from your document data.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center mb-4 group-hover:bg-slate-800/80 transition-colors">
                <feature.icon size={17} className="text-slate-400" />
              </div>
              <h3 className="text-[14px] font-semibold text-slate-100 mb-1.5">{feature.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Positioning */}
      <section className="px-6 sm:px-10 pb-24 max-w-3xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-8">
          The difference
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-800/60 rounded-xl p-6 text-left">
            <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider mb-2">DigiLocker</p>
            <p className="text-[15px] text-slate-300 font-medium">"Access your documents."</p>
          </div>
          <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-6 text-left">
            <p className="text-[12px] font-medium text-sky-400 uppercase tracking-wider mb-2">DocAction</p>
            <p className="text-[15px] text-white font-medium">"Understand what your documents mean and what you should do next."</p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="px-6 sm:px-10 pb-24 max-w-3xl mx-auto">
        <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Designed for privacy</h3>
          <p className="text-[14px] text-slate-400 max-w-lg mx-auto leading-relaxed">
            DocAction is designed for private, on-device document intelligence.
            Planned for execution on supported iQOO / Snapdragon hardware using local AI models and NPU acceleration.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5">
              <Smartphone size={14} className="text-slate-500" />
              <span className="text-[12px] text-slate-500">On-device AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-slate-500" />
              <span className="text-[12px] text-slate-500">Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-slate-500" />
              <span className="text-[12px] text-slate-500">Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              D
            </div>
            <span className="text-[13px] text-slate-500">DocAction — Personal Document Intelligence</span>
          </div>
          <p className="text-[12px] text-slate-600">Phase 1 Prototype • iQOO Hackathon 2026</p>
        </div>
      </footer>
    </div>
  );
}
