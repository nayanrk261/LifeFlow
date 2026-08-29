import { Check, X, Minus } from 'lucide-react';

const features = [
  'Document storage',
  'Document verification',
  'Expiry/deadline detection',
  'Missing document detection',
  'Application readiness check',
  'Personal context awareness',
  'Document-aware AI assistant',
  'Document generation',
  'Action recommendations',
  'On-device AI processing',
  'Privacy-first architecture',
  'Family document management',
];

const products = [
  {
    name: 'DigiLocker',
    desc: 'Government document access & verification',
    features: [true, true, false, false, false, false, false, false, false, false, 'partial', false],
  },
  {
    name: 'Google Drive',
    desc: 'Cloud file storage & search',
    features: [true, false, false, false, false, false, false, false, false, false, false, 'partial'],
  },
  {
    name: 'Generic AI',
    desc: 'General-purpose AI assistants',
    features: [false, false, false, false, false, false, 'partial', 'partial', 'partial', false, false, false],
  },
  {
    name: 'DocAction',
    desc: 'Personal document intelligence',
    features: [true, true, true, true, true, true, true, true, true, true, true, true],
    highlight: true,
  },
];

function FeatureIcon({ value }) {
  if (value === true) return <Check size={14} className="text-emerald-400" />;
  if (value === false) return <X size={14} className="text-slate-600" />;
  if (value === 'partial') return <Minus size={14} className="text-amber-400" />;
  return null;
}

export default function Competitive() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">How DocAction Compares</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Conceptual positioning — not a claim about competitor capabilities.
        </p>
      </div>

      {/* Key difference */}
      <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-5">
        <p className="text-[15px] text-white font-medium leading-relaxed">
          "DigiLocker tells you <span className="text-slate-400">where</span> your documents are.
          <br />
          DocAction tells you <span className="text-sky-400">what they mean</span> and <span className="text-sky-400">what to do next</span>."
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left text-[12px] font-medium text-slate-500 pb-3 pr-4 w-[200px]">Feature</th>
              {products.map(p => (
                <th key={p.name} className={`text-center text-[12px] font-semibold pb-3 px-3 ${
                  p.highlight ? 'text-sky-400' : 'text-slate-400'
                }`}>
                  <div>
                    <span className={`text-[13px] ${p.highlight ? 'text-white' : ''}`}>{p.name}</span>
                    <p className="text-[10px] text-slate-600 font-normal mt-0.5">{p.desc}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, i) => (
              <tr key={i} className="border-t border-slate-800/40">
                <td className="text-[13px] text-slate-300 py-3 pr-4">{feature}</td>
                {products.map(p => (
                  <td key={p.name} className={`text-center py-3 px-3 ${p.highlight ? 'bg-sky-500/3' : ''}`}>
                    <div className="flex justify-center">
                      <FeatureIcon value={p.features[i]} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[12px]">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Check size={12} /> Supported
        </span>
        <span className="flex items-center gap-1.5 text-amber-400">
          <Minus size={12} /> Partial / Generic
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <X size={12} /> Not available
        </span>
      </div>

      {/* Important note */}
      <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5">
        <h3 className="text-[14px] font-semibold text-slate-200 mb-2">Important note</h3>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          DocAction is not a replacement for DigiLocker. It is an intelligence and action layer around your document ecosystem.
          DigiLocker provides essential government document access and verification.
          DocAction adds understanding, reasoning, and action on top of that foundation.
        </p>
      </div>
    </div>
  );
}
