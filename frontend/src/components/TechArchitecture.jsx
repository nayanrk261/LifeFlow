import { Cpu, Smartphone, Shield, Zap, ArrowRight, Database, Server } from 'lucide-react';

export default function TechArchitecture() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">How LifeFlow Works</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          On-device NPU architecture designed for privacy-first personal document intelligence.
        </p>
      </div>

      <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white">System Architecture & Processing Pipeline</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Smartphone size={18} />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-200 mb-1">1. Document Capture & Selection</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Camera scan, PDF import, or DigiLocker consent API fetch on device.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
              <Cpu size={18} />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-200 mb-1">2. On-Device NPU Execution</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Snapdragon NPU runs quantized Llama 3.2 1B & OCR for instant entity extraction without cloud dependency.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Zap size={18} />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-200 mb-1">3. Process Readiness Engine</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Compares document dates & metadata against government application rules to output readiness scores and missing actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
