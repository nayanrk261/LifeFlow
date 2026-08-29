import { Smartphone, Cloud, ArrowDown, Cpu, Eye, FileText, Database, Bell, Shield, Lock, Wifi } from 'lucide-react';

export default function TechArchitecture() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white">How DocAction Works</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Planned architecture for on-device document intelligence.
        </p>
      </div>

      {/* Architecture Flow */}
      <div className="space-y-3">
        {/* User */}
        <ArchBlock icon={Smartphone} title="User" subtitle="iQOO smartphone with Snapdragon NPU" color="slate" />
        <Arrow />

        {/* Document Sources */}
        <ArchBlock icon={FileText} title="Document Sources" color="slate">
          <div className="flex flex-wrap gap-2 mt-2">
            {['DigiLocker', 'Gallery', 'Files', 'Share', 'Camera'].map(s => (
              <span key={s} className="px-2 py-0.5 text-[11px] bg-slate-700/40 rounded text-slate-400">{s}</span>
            ))}
          </div>
        </ArchBlock>
        <Arrow />

        {/* On-Device Section */}
        <div className="border-2 border-dashed border-sky-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={14} className="text-sky-400" />
            <span className="text-[12px] font-semibold text-sky-400 uppercase tracking-wider">On Device</span>
          </div>

          <ArchBlock icon={Eye} title="Document Processing" color="sky">
            <div className="flex flex-wrap gap-2 mt-2">
              {['PDF Parser', 'OCR Engine', 'Document Classifier', 'Layout Analysis'].map(s => (
                <span key={s} className="px-2 py-0.5 text-[11px] bg-sky-500/10 border border-sky-500/20 rounded text-sky-400">{s}</span>
              ))}
            </div>
          </ArchBlock>
          <Arrow />

          <ArchBlock icon={Cpu} title="On-Device AI Layer" subtitle="Snapdragon NPU acceleration" color="sky">
            <div className="flex flex-wrap gap-2 mt-2">
              {['Local AI Model (e.g. Llama 3.2 1B)', 'NPU Inference', 'Local Embeddings', 'Entity Extraction'].map(s => (
                <span key={s} className="px-2 py-0.5 text-[11px] bg-sky-500/10 border border-sky-500/20 rounded text-sky-400">{s}</span>
              ))}
            </div>
          </ArchBlock>
          <Arrow />

          <ArchBlock icon={Database} title="Document Intelligence" color="sky">
            <div className="flex flex-wrap gap-2 mt-2">
              {['Entities', 'Dates', 'Obligations', 'Requirements', 'Actions', 'Deadlines'].map(s => (
                <span key={s} className="px-2 py-0.5 text-[11px] bg-sky-500/10 border border-sky-500/20 rounded text-sky-400">{s}</span>
              ))}
            </div>
          </ArchBlock>
          <Arrow />

          <ArchBlock icon={Cpu} title="Reasoning Engine" color="sky">
            <div className="flex flex-wrap gap-2 mt-2">
              {['User Profile', 'Document Knowledge', 'Workflow Requirements', 'Readiness Logic'].map(s => (
                <span key={s} className="px-2 py-0.5 text-[11px] bg-sky-500/10 border border-sky-500/20 rounded text-sky-400">{s}</span>
              ))}
            </div>
          </ArchBlock>
        </div>

        <Arrow />

        {/* Product Actions */}
        <ArchBlock icon={Bell} title="Product Actions" color="emerald">
          <div className="flex flex-wrap gap-2 mt-2">
            {['Dashboard', 'Readiness Checker', 'Reminders', 'AI Assistant', 'Document Generation', 'Family'].map(s => (
              <span key={s} className="px-2 py-0.5 text-[11px] bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">{s}</span>
            ))}
          </div>
        </ArchBlock>

        {/* Cloud Section */}
        <div className="mt-6 border-2 border-dashed border-slate-700/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Cloud size={14} className="text-slate-500" />
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Cloud / Backend (Minimal)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Authentication', 'Encrypted Metadata Sync', 'Push Notifications', 'DigiLocker OAuth'].map(s => (
              <span key={s} className="px-2 py-0.5 text-[11px] bg-slate-800/50 border border-slate-700/40 rounded text-slate-500">{s}</span>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 mt-3">
            Sensitive document understanding happens locally on device. Cloud handles only authentication, sync metadata, and notifications.
          </p>
        </div>
      </div>

      {/* Key Principle */}
      <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-5">
        <h3 className="text-[14px] font-semibold text-sky-300 mb-2">Key Design Principle</h3>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          Document content never leaves the device. AI inference runs locally on the Snapdragon NPU.
          Only encrypted metadata (document names, dates, reminder schedules) syncs with the cloud when the user explicitly enables it.
        </p>
        <p className="text-[11px] text-slate-600 mt-3 italic">
          Planned for on-device execution on supported iQOO / Snapdragon hardware. This prototype simulates the intended architecture.
        </p>
      </div>
    </div>
  );
}

function ArchBlock({ icon: Icon, title, subtitle, color, children }) {
  const colors = {
    slate: 'bg-[#0a0f1a] border-slate-800/60',
    sky: 'bg-sky-500/5 border-sky-500/15',
    emerald: 'bg-emerald-500/5 border-emerald-500/15',
  };
  const iconColors = {
    slate: 'text-slate-400',
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2.5">
        <Icon size={16} className={iconColors[color]} />
        <div>
          <p className="text-[14px] font-semibold text-slate-200">{title}</p>
          {subtitle && <p className="text-[12px] text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-0.5">
      <ArrowDown size={16} className="text-slate-600" />
    </div>
  );
}
