import { Cpu, Smartphone, Shield, Zap, ArrowRight, Database, Server, Activity, CheckCircle2, Lock } from 'lucide-react';

export default function TechArchitecture() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Technical Architecture</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Modular strategy architecture designed for privacy-first document intelligence and future mobile NPU integration.
        </p>
      </div>

      {/* DEVICE AI STATUS */}
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-white text-[14px]">
            <Activity size={18} className="text-emerald-400" />
            <span>DEVICE AI STATUS</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
            Web Application Mode
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px] pt-1">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Current Processing</span>
            <span className="font-bold text-emerald-400">Web Application Mode</span>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">On-Device AI</span>
            <span className="font-bold text-amber-400">Not connected</span>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Future Support</span>
            <span className="font-semibold text-slate-200">LifeFlow can connect to an on-device intelligence provider.</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white">System Architecture & Processing Pipeline</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Shield size={18} />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-200 mb-1">1. Sensitivity Check & Selection</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              LifeFlow Private Intelligence evaluates sensitivity levels (Low/Medium/High) and identifies sensitive categories.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
              <Cpu size={18} />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-200 mb-1">2. Provider Strategy Abstraction</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Routes processing to LocalPrivateProcessor or CloudAiProcessor. Built to seamlessly register a mobile NPU provider.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Zap size={18} />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-200 mb-1">3. Action & Readiness Engine</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Compares document dates & metadata against active goal requirements to output readiness scores (e.g. 80% → 100%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
