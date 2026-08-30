import { Shield, Lock, Eye, Cpu, Database, Server, Smartphone, ArrowRight, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

const principles = [
  {
    title: 'Minimal Data Collection',
    desc: 'LifeFlow processes only the minimum metadata necessary for document intelligence and goal tracking. Full raw document texts are filtered locally whenever possible.',
    icon: Database,
  },
  {
    title: 'Privacy-First Provider Abstraction',
    desc: 'LifeFlow features a modular processing architecture allowing users to choose between Private Mode (local metadata handling) and Enhanced AI Analysis.',
    icon: Shield,
  },
  {
    title: 'Zero Permanent Raw Storage',
    desc: 'LifeFlow operates as an action & readiness engine. Documents uploaded during session analysis are processed in transient memory for metadata extraction.',
    icon: Server,
  },
  {
    title: 'Consent-Based Integration',
    desc: 'You maintain full authority over document sharing and processing choices. You can revoke shared access or disconnect integrations at any time.',
    icon: Lock,
  },
];

export default function Privacy() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Privacy & Intelligence Architecture</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          How LifeFlow Private Intelligence balances document awareness with complete privacy control.
        </p>
      </div>

      {/* 1. DEVICE AI STATUS SECTION */}
      <div className="bg-[#0a0f1a] border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold text-white tracking-wide">DEVICE AI STATUS</h2>
              <p className="text-[11px] text-slate-400">Hardware & Execution Mode Diagnostics</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold">
            Web App Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Processing</span>
            <p className="text-[13px] font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Web Application Mode
            </p>
            <p className="text-[11px] text-slate-500">Browser execution with server-side provider strategy.</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">On-Device AI</span>
            <p className="text-[13px] font-bold text-amber-400 flex items-center gap-1.5">
              <AlertCircle size={14} />
              Not connected
            </p>
            <p className="text-[11px] text-slate-500">No mobile hardware NPU bridge attached in web browser mode.</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Future Support</span>
            <p className="text-[13px] font-semibold text-slate-200">
              LifeFlow can connect to an on-device intelligence provider.
            </p>
            <p className="text-[11px] text-slate-500">Architecture is NPU & companion-ready.</p>
          </div>
        </div>
      </div>

      {/* 2. HYBRID AI ARCHITECTURE VISUALIZATION */}
      <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Hybrid AI Architecture Roadmap</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Transparent view of how LifeFlow processes documents today versus our future mobile NPU design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* TODAY IMPLEMENTATION */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[12px] font-extrabold text-emerald-400 uppercase tracking-wider">TODAY — WEB APP MODE</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active MVP</span>
            </div>
            <ul className="space-y-2.5 text-[12px] text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center gap-2 font-semibold">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Web Application Mode</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center gap-2 font-semibold">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Privacy-aware local processing architecture</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center gap-2 font-semibold">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Cloud AI available for deeper reasoning</span>
              </li>
            </ul>
          </div>

          {/* FUTURE PHONE-FIRST MODE */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[12px] font-extrabold text-blue-400 uppercase tracking-wider">FUTURE PHONE-FIRST MODE</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Mobile & Hardware</span>
            </div>
            <ul className="space-y-2.5 text-[12px] text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2 font-semibold text-slate-300">
                <Smartphone size={15} className="text-blue-400 shrink-0" />
                <span>On-device AI provider support</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2 font-semibold text-slate-300">
                <Cpu size={15} className="text-blue-400 shrink-0" />
                <span>Lightweight sensitive document intelligence closer to the user&apos;s device</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2 font-semibold text-slate-300">
                <Shield size={15} className="text-blue-400 shrink-0" />
                <span>Potential hardware acceleration when available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. CORE PRIVACY PRINCIPLES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {principles.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center text-emerald-400 mb-3">
                <Icon size={18} />
              </div>
              <h3 className="text-[14px] font-semibold text-slate-100 mb-1">{p.title}</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
