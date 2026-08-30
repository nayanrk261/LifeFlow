import { Check, X, Shield, Cpu, Zap, FileText } from 'lucide-react';

const features = [
  {
    name: 'Document Storage',
    digilocker: 'Yes (Government issued)',
    drive: 'Yes (Raw files)',
    ai: 'No',
    lifeflow: 'Yes (Encrypted Vault)',
  },
  {
    name: 'OCR & Classification',
    digilocker: 'No',
    drive: 'Limited',
    ai: 'Yes',
    lifeflow: 'Yes (On-Device)',
  },
  {
    name: 'Expiry Tracking',
    digilocker: 'No',
    drive: 'No',
    ai: 'No',
    lifeflow: 'Yes (Automatic)',
  },
  {
    name: 'Process Readiness Check',
    digilocker: 'No',
    drive: 'No',
    ai: 'No',
    lifeflow: 'Yes (Killer Feature)',
  },
  {
    name: 'Document Generation',
    digilocker: 'No',
    drive: 'No',
    ai: 'Generic text',
    lifeflow: 'Yes (Context-Aware)',
  },
  {
    name: 'Family Document Management',
    digilocker: 'No',
    drive: 'Manual sharing',
    ai: 'No',
    lifeflow: 'Yes (Integrated)',
  },
  {
    name: 'Privacy Architecture',
    digilocker: 'Government Cloud',
    drive: 'Cloud (Google)',
    ai: 'Cloud (OpenAI)',
    lifeflow: 'On-Device AI (Planned)',
  },
];

const competitors = [
  {
    name: 'LifeFlow',
    highlight: true,
    tagline: 'From Life Goal to Next Action',
    strengths: ['Goal readiness engine', 'Private Intelligence', 'Next action recommendations', 'Family readiness view'],
  },
  {
    name: 'DigiLocker',
    highlight: false,
    tagline: 'Official Government Document Wallet',
    strengths: ['Legally valid under IT Act', 'Direct issuer integration', 'Mass adoption in India'],
  },
  {
    name: 'Google Drive',
    highlight: false,
    tagline: 'Cloud Storage & Sync',
    strengths: ['Search', 'Ubiquitous access', 'Generous free tier'],
  },
  {
    name: 'ChatGPT / Claude',
    highlight: false,
    tagline: 'General Purpose AI',
    strengths: ['Reasoning capabilities', 'Natural language', 'Broad knowledge'],
  },
];

export default function Competitive() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">How LifeFlow Compares</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Understanding our differentiation against existing document and AI solutions.
        </p>
      </div>

      {/* Positioning Callout */}
      <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-6">
        <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">Strategic Positioning</p>
        <blockquote className="text-[15px] font-medium text-slate-200 leading-relaxed italic">
          "DigiLocker tells you <span className="text-emerald-400">where your documents are</span>. LifeFlow tells you <span className="text-emerald-400">what they mean</span> and <span className="text-emerald-400">what to do next</span>."
        </blockquote>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50">
                <th className="px-5 py-3.5 font-semibold text-slate-300">Feature</th>
                <th className="px-4 py-3.5 font-semibold text-slate-400">DigiLocker</th>
                <th className="px-4 py-3.5 font-semibold text-slate-400">Google Drive</th>
                <th className="px-4 py-3.5 font-semibold text-slate-400">Generic AI</th>
                <th className="px-4 py-3.5 font-bold text-emerald-400 bg-emerald-500/10">LifeFlow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-slate-800/20">
                  <td className="px-5 py-3 font-medium text-slate-200">{f.name}</td>
                  <td className="px-4 py-3 text-slate-400">{f.digilocker}</td>
                  <td className="px-4 py-3 text-slate-400">{f.drive}</td>
                  <td className="px-4 py-3 text-slate-400">{f.ai}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-400 bg-emerald-500/5">{f.lifeflow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ecosystem Note */}
      <div className="bg-slate-800/20 border border-slate-800/40 rounded-xl p-5 text-[13px] text-slate-400 leading-relaxed">
        <p className="font-semibold text-slate-200 mb-1">Ecosystem Relationship</p>
        <p>
          LifeFlow is not a replacement for DigiLocker. It is an intelligence and action layer around your document ecosystem.
          DigiLocker acts as the trusted issuer source. LifeFlow adds understanding, reasoning, and action on top of that foundation.
        </p>
      </div>
    </div>
  );
}
