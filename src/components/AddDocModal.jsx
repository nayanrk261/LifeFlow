import { useState, useEffect } from 'react';
import { X, Image, File, Link2, Lock, Loader2, Check, Cpu, FileText } from 'lucide-react';

const sources = [
  { id: 'gallery', label: 'Gallery', icon: Image, desc: 'Import from photos' },
  { id: 'files', label: 'Files', icon: File, desc: 'Browse local files' },
  { id: 'digilocker', label: 'DigiLocker', icon: Link2, desc: 'Authorized documents' },
  { id: 'vault', label: 'DocAction Vault', icon: Lock, desc: 'Existing vault documents' },
];

const processingSteps = [
  'Scanning document...',
  'Running layout analysis...',
  'Extracting text (OCR)...',
  'Classifying document type...',
  'Extracting entities & dates...',
  'Analyzing obligations...',
  'Document understood',
];

export default function AddDocModal({ onClose, onAdd }) {
  const [step, setStep] = useState('source'); // source, processing, done
  const [selectedSource, setSelectedSource] = useState(null);
  const [currentProcessStep, setCurrentProcessStep] = useState(0);

  const handleSourceSelect = (sourceId) => {
    setSelectedSource(sourceId);
    setStep('processing');
    setCurrentProcessStep(0);
  };

  useEffect(() => {
    if (step === 'processing' && currentProcessStep < processingSteps.length) {
      const timer = setTimeout(() => {
        if (currentProcessStep < processingSteps.length - 1) {
          setCurrentProcessStep(prev => prev + 1);
        } else {
          setStep('done');
        }
      }, 500 + Math.random() * 300);
      return () => clearTimeout(timer);
    }
  }, [step, currentProcessStep]);

  const handleAdd = () => {
    onAdd({
      name: 'Uploaded Document',
      type: 'Personal',
      subtype: 'General',
      status: 'healthy',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: null,
      actionRequired: false,
      action: null,
      priority: null,
      number: 'DOC-' + Date.now(),
      issuedBy: 'User Upload',
      aiSummary: 'This document has been analyzed and categorized. No immediate action is required.',
      icon: 'file-text',
      source: selectedSource === 'digilocker' ? 'DigiLocker' : 'Personal Upload',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
          <h2 className="text-[15px] font-semibold text-slate-100">
            {step === 'source' && 'Add Document'}
            {step === 'processing' && 'Analyzing Document'}
            {step === 'done' && 'Document Understood'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="p-5">
          {/* Source selection */}
          {step === 'source' && (
            <div className="space-y-2">
              <p className="text-[13px] text-slate-500 mb-4">Choose where to import from:</p>
              {sources.map(src => {
                const Icon = src.icon;
                return (
                  <button
                    key={src.id}
                    onClick={() => handleSourceSelect(src.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/50 hover:border-slate-600 transition-all text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-700/40 flex items-center justify-center">
                      <Icon size={17} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-slate-200">{src.label}</p>
                      <p className="text-[12px] text-slate-500">{src.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Processing animation */}
          {step === 'processing' && (
            <div className="py-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Cpu size={24} className="text-sky-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                {processingSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i < currentProcessStep ? (
                      <Check size={14} className="text-emerald-400 shrink-0" />
                    ) : i === currentProcessStep ? (
                      <Loader2 size={14} className="text-sky-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className={`text-[13px] ${
                      i <= currentProcessStep ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 w-full bg-slate-800 rounded-full h-1">
                <div
                  className="bg-sky-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${((currentProcessStep + 1) / processingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="py-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-[16px] font-semibold text-white mb-1">Document understood</h3>
              <p className="text-[13px] text-slate-400 mb-6">AI analysis complete</p>

              {/* Detected info */}
              <div className="bg-slate-800/30 rounded-xl p-4 text-left space-y-2 mb-6">
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-200 font-medium">Personal Document</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Date detected</span>
                  <span className="text-slate-200">{new Date().toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Action required</span>
                  <span className="text-emerald-400">No</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full py-2.5 bg-white text-slate-900 rounded-lg text-[14px] font-semibold hover:bg-slate-100 transition-colors"
              >
                Add to DocAction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
