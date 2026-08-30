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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CURRENT MVP */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[12px] font-extrabold text-emerald-400 uppercase tracking-wider">CURRENT MVP</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Web Build</span>
            </div>
            <div className="flex flex-col gap-2 text-[12px] font-semibold text-slate-200">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                <span>Web App</span>
                <span className="text-[11px] text-slate-400 font-mono">React Frontend</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                <span>Privacy Intelligence Layer</span>
                <span className="text-[11px] text-emerald-400 font-mono">Sensitivity Check</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                <span>Backend</span>
                <span className="text-[11px] text-slate-400 font-mono">Node / Express / Mongo</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                <span>Groq AI</span>
                <span className="text-[11px] text-slate-400 font-mono">Llama 3 Reasoning</span>
              </div>
            </div>
          </div>

          {/* FUTURE HACKATHON BUILD */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[12px] font-extrabold text-blue-400 uppercase tracking-wider">FUTURE HACKATHON BUILD</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">On-Device NPU</span>
            </div>
            <div className="flex flex-col gap-2 text-[12px] font-semibold text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <span>iQOO Device</span>
                <span className="text-[11px] text-blue-400 font-mono">Snapdragon Companion</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <span>On-device AI / Local Model</span>
                <span className="text-[11px] text-blue-400 font-mono">NPU Acceleration</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <span>Sensitive document intelligence</span>
                <span className="text-[11px] text-slate-400 font-mono">Local Parsing</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <span>Minimal structured context</span>
                <span className="text-[11px] text-slate-400 font-mono">Redacted Data</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <span>LifeFlow backend</span>
                <span className="text-[11px] text-slate-400 font-mono">Goal Engine</span>
              </div>
              <div className="text-center text-slate-600 font-bold">↓</div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <span>Cloud AI for complex reasoning</span>
                <span className="text-[11px] text-slate-400 font-mono">Groq Deep AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
