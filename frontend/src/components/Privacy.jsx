import { Shield, Lock, Eye, Cpu, Database, Server } from 'lucide-react';

const principles = [
  {
    title: 'Minimal Data Collection',
    desc: 'LifeFlow collects only the metadata necessary to provide document intelligence features. We do not collect, store, or analyze the full content of your documents on any server.',
    icon: Database,
  },
  {
    title: 'Local First Architecture',
    desc: 'Document OCR, classification, and entity extraction occur locally on your device using Snapdragon NPU acceleration. Document text never leaves your device.',
    icon: Cpu,
  },
  {
    title: 'Zero Permanent Document Storage',
    desc: 'LifeFlow is an intelligence layer, not a cloud drive. Documents uploaded during session analysis are processed in transient memory and discarded immediately after metadata extraction.',
    icon: Server,
  },
  {
    title: 'Consent-Based Integration',
    desc: 'You can disconnect DigiLocker or any other integration at any time. Revoking access removes all associated data from LifeFlow.',
    icon: Lock,
  },
];

export default function Privacy() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Privacy Architecture</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          How LifeFlow protects your personal documents and data.
        </p>
      </div>

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
