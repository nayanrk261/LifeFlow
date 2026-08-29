import { useState } from 'react';
import { FileText, AlertCircle, Mail, FileCheck, Copy, Download, Edit3, ChevronRight } from 'lucide-react';
import { documentTemplates } from '../data/mockData';

const iconMap = { 'file-text': FileText, 'alert-circle': AlertCircle, 'mail': Mail, 'file-check': FileCheck };

export default function DocGenerator({ profile, addToast }) {
  const [selected, setSelected] = useState(null);
  const [generated, setGenerated] = useState(null);
  const [editing, setEditing] = useState(false);

  const handleGenerate = (tpl) => {
    setSelected(tpl);
    // Fill in template with profile data
    let content = tpl.content
      .replace(/\{name\}/g, profile.name || 'Rahul Sharma')
      .replace(/\{firstName\}/g, profile.firstName || 'Rahul')
      .replace(/\{fatherName\}/g, 'Suresh Sharma')
      .replace(/\{age\}/g, profile.age || '21')
      .replace(/\{address\}/g, 'Flat 204, Green Park Society, Pune, Maharashtra 411038')
      .replace(/\{taluka\}/g, 'Pune City')
      .replace(/\{district\}/g, 'Pune')
      .replace(/\{income\}/g, '2,50,000')
      .replace(/\{date\}/g, new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }))
      .replace(/\{place\}/g, 'Pune, Maharashtra')
      .replace(/\{authority\}/g, 'The District Collector')
      .replace(/\{department\}/g, 'Revenue Department')
      .replace(/\{subject\}/g, 'Income Certificate')
      .replace(/\{idType\}/g, 'Aadhaar')
      .replace(/\{idNumber\}/g, 'XXXX XXXX 4521')
      .replace(/\{phone\}/g, '+91 98765 43210')
      .replace(/\{purpose\}/g, 'Scholarship Application')
      .replace(/\{refNumber\}/g, 'SCH-MH-2026-789')
      .replace(/\{requestDetails\}/g, 'issuance of an Income Certificate')
      .replace(/\{complaintDetails\}/g, '[Your complaint details here]')
      .replace(/\{previousAttempts\}/g, '[Previous attempts]')
      .replace(/\{attachedDocs\}/g, '1. Aadhaar Card\n2. PAN Card')
      .replace(/\{declarationPoint1\}/g, 'The information provided is true to the best of my knowledge.')
      .replace(/\{declarationPoint2\}/g, 'I have not submitted any false documents.')
      .replace(/\{declarationPoint3\}/g, 'I understand the consequences of providing false information.');

    setGenerated(content);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated).then(() => {
      addToast('Copied to clipboard', 'success');
    }).catch(() => {
      addToast('Could not copy — try selecting manually', 'error');
    });
  };

  if (generated) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => { setGenerated(null); setSelected(null); setEditing(false); }}
          className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Back to templates
        </button>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">{selected.name}</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Generated from your DocAction profile data</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-[12px] font-medium hover:bg-slate-800 transition-colors"
            >
              <Edit3 size={13} />
              {editing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-[12px] font-medium hover:bg-slate-800 transition-colors"
            >
              <Copy size={13} />
              Copy
            </button>
            <button
              onClick={() => addToast('PDF export simulated', 'info')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/10 text-white rounded-lg text-[12px] font-medium hover:bg-white/15 transition-colors"
            >
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl overflow-hidden">
          {editing ? (
            <textarea
              value={generated}
              onChange={e => setGenerated(e.target.value)}
              className="w-full min-h-[500px] bg-transparent text-[14px] text-slate-300 leading-relaxed p-6 font-mono focus:outline-none resize-none"
            />
          ) : (
            <div className="p-6 sm:p-8">
              <pre className="text-[14px] text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {generated}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Create a document</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Generate applications, complaints, and request letters using your profile data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {documentTemplates.map(tpl => {
          const Icon = iconMap[tpl.icon] || FileText;
          return (
            <button
              key={tpl.id}
              onClick={() => handleGenerate(tpl)}
              className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-all text-left group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-100">{tpl.name}</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">{tpl.type}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
