import { useState } from 'react';
import { Lock, Unlock, Shield, Eye, Trash2, Plus, AlertCircle, FileText, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Vault({ documents = [], onAddDoc, onRefresh, addToast }) {
  const { isDemo } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  // Removal confirmation modal states
  const [targetDoc, setTargetDoc] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password) return;

    setVerifying(true);
    setError('');

    try {
      if (isDemo) {
        setIsUnlocked(true);
        setPassword('');
        if (addToast) addToast('Vault unlocked (Demo)', 'success');
      } else {
        await api.verifyPassword(password);
        setIsUnlocked(true);
        setPassword('');
        if (addToast) addToast('Vault unlocked successfully', 'success');
      }
    } catch (err) {
      setError(err.message || 'Incorrect password. Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveDoc = async (e) => {
    e.preventDefault();
    if (!targetDoc) return;

    setVerifying(true);
    setError('');

    try {
      if (!isDemo) {
        // Backend password verification
        await api.verifyPassword(confirmPassword);
        await api.deleteDocument(targetDoc._id || targetDoc.id);
      }
      if (addToast) addToast(`Removed ${targetDoc.title || 'document'} from vault`, 'info');
      setTargetDoc(null);
      setConfirmPassword('');
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Password verification failed. Document not removed.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Private Vault</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Encrypted storage for your sensitive government, identity, and financial documents.
          </p>
        </div>
        {isUnlocked && (
          <button
            onClick={onAddDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[13px] font-semibold transition-colors shrink-0"
          >
            <Plus size={15} />
            Add to Vault
          </button>
        )}
      </div>

      {/* LOCKED VAULT SCREEN */}
      {!isUnlocked ? (
        <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-5">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Vault Locked</h2>
          <p className="text-[13px] text-slate-400 mb-6 leading-relaxed">
            Re-enter your account password to verify authorization and access your sensitive documents.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              placeholder="Enter your account password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600"
            />
            <button
              type="submit"
              disabled={verifying || !password}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px] transition-colors shadow-lg shadow-emerald-950/20 disabled:opacity-50"
            >
              {verifying ? 'Verifying with Backend...' : 'Unlock Vault'}
            </button>
          </form>
        </div>
      ) : (
        /* UNLOCKED VAULT CONTENT */
        <div className="space-y-6 fade-in">
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <Unlock size={16} />
              Vault Unlocked — Authenticated Session Active
            </div>
            <button
              onClick={() => setIsUnlocked(false)}
              className="text-[12px] underline hover:text-emerald-300"
            >
              Lock Vault
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div
                key={doc._id || doc.id}
                className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      {doc.category || 'Protected'}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-slate-100 mb-1">{doc.title || doc.name}</h3>
                  <p className="text-[12px] text-slate-500 mb-3">{doc.documentType || 'Identity Document'}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{doc.source || 'Vault Storage'}</span>
                  <button
                    onClick={() => { setTargetDoc(doc); setConfirmPassword(''); setError(''); }}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove from vault"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-10 text-center">
              <Shield size={24} className="text-slate-500 mx-auto mb-3" />
              <p className="text-[14px] text-slate-300 font-medium">Vault is currently empty</p>
              <p className="text-[12px] text-slate-500 mt-1">Add important identity or financial documents to your protected vault.</p>
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION & SECURE PASSWORD VERIFICATION MODAL FOR REMOVAL */}
      {targetDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Remove Document</h3>
              <button onClick={() => setTargetDoc(null)}>
                <X size={16} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <p className="text-[13px] text-slate-300 mb-4">
              Are you sure you want to remove <span className="font-semibold text-white">"{targetDoc.title || targetDoc.name}"</span> from your vault?
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRemoveDoc} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">
                  Re-enter Account Password for Backend Verification:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Account password"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3.5 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTargetDoc(null)}
                  className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-[13px] hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying || !confirmPassword}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-[13px] transition-colors disabled:opacity-50"
                >
                  {verifying ? 'Verifying...' : 'Confirm Removal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
