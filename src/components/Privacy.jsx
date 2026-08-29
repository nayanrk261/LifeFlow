import { Shield, Lock, Eye, Smartphone, RefreshCw, UserCheck } from 'lucide-react';

const principles = [
  {
    icon: Smartphone,
    title: 'Local-First AI',
    desc: 'Document analysis is designed to run entirely on your device using the Snapdragon NPU. Your documents are processed locally — not uploaded to a cloud server for AI analysis.',
  },
  {
    icon: Eye,
    title: 'Minimal Data Collection',
    desc: 'DocAction collects only the metadata necessary to provide document intelligence features. We do not collect, store, or analyze the full content of your documents on any server.',
  },
  {
    icon: UserCheck,
    title: 'Explicit Document Consent',
    desc: 'You choose which documents to import and which sources to connect. DigiLocker access follows the official OAuth 2.0 consent flow. You authorize every document individually.',
  },
  {
    icon: Lock,
    title: 'Encrypted Personal Data',
    desc: 'Any metadata that syncs with the cloud (reminders, document names, dates) is encrypted. Document content stays on your device.',
  },
  {
    icon: Shield,
    title: 'User-Controlled Sharing',
    desc: 'Family sharing, document exports, and any sharing action requires your explicit confirmation. No document is shared without your knowledge.',
  },
  {
    icon: RefreshCw,
    title: 'Revocable Integrations',
    desc: 'You can disconnect DigiLocker or any other integration at any time. Revoking access removes all associated data from DocAction.',
  },
];

export default function Privacy() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white">Privacy & Security</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          How DocAction protects your personal documents and data.
        </p>
      </div>

      {/* Core promise */}
      <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
          <Shield size={26} className="text-slate-300" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Your documents stay yours</h2>
        <p className="text-[14px] text-slate-400 max-w-lg mx-auto leading-relaxed">
          DocAction is designed so that your document content is never sent to cloud servers for AI processing.
          Document understanding happens locally on your device.
        </p>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {principles.map((p, i) => (
          <div key={i} className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center mb-3">
              <p.icon size={17} className="text-slate-400" />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-100 mb-1.5">{p.title}</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* DigiLocker integration */}
      <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5">
        <h3 className="text-[14px] font-semibold text-slate-100 mb-2">DigiLocker Integration</h3>
        <p className="text-[13px] text-slate-400 leading-relaxed mb-3">
          DocAction is designed to integrate with DigiLocker through the official requester/consent flow.
          Access is granted through OAuth 2.0, requiring explicit user authorization for each document type.
        </p>
        <div className="flex flex-wrap gap-2">
          {['OAuth 2.0', 'User Consent Required', 'Authorized Access Only', 'Revocable'].map(tag => (
            <span key={tag} className="px-2.5 py-1 text-[11px] bg-slate-800/50 border border-slate-700/40 rounded-lg text-slate-400 font-medium">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-slate-600 mt-3 italic">
          Official requester onboarding/credentials are required for production API access.
          This prototype uses demo documents.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-800/20 border border-slate-800/40 rounded-xl p-4">
        <p className="text-[12px] text-slate-500 leading-relaxed">
          This is a Phase 1 prototype. The privacy architecture described above represents the intended design for the
          production application. The current web prototype does not implement actual on-device processing, encryption,
          or DigiLocker API integration. These features are planned for the final implementation.
        </p>
      </div>
    </div>
  );
}
