import { useState, useEffect } from 'react';
import { Users, User, Plus, X, Trash2, Edit2, Shield, Lock, Eye, Share2, Copy, Mail, CheckCircle2, Clock, Check, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const relationshipOptions = [
  'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Other'
];

export default function Family({ familyData = {}, userDocuments = [], onRefresh, addToast }) {
  const { user, isDemo } = useAuth();

  const {
    manualMembers = [],
    connectedMembers = [],
    pendingOutbound = [],
    incomingRequests = [],
  } = familyData;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState('email'); // 'email', 'invite', 'manual'

  // Add by Email states
  const [connectEmail, setConnectEmail] = useState('');
  const [connectRel, setConnectRel] = useState('Brother');
  const [submitting, setSubmitting] = useState(false);
  const [nonUserResult, setNonUserResult] = useState(null);

  // Invite states
  const [inviteLinkResult, setInviteLinkResult] = useState(null);

  // Manual entry states
  const [manualName, setManualName] = useState('');
  const [manualRel, setManualRel] = useState('Father');
  const [manualDob, setManualDob] = useState('');

  // Shared Documents viewing modal
  const [selectedMember, setSelectedMember] = useState(null);
  const [sharedDocsFromMember, setSharedDocsFromMember] = useState([]);
  const [loadingShared, setLoadingShared] = useState(false);

  // Manage My Shared Documents with a connected member
  const [showManageSharing, setShowManageSharing] = useState(false);
  const [sharingTarget, setSharingTarget] = useState(null);

  // Fetch documents shared by connected member
  const handleOpenMember = async (member) => {
    setSelectedMember(member);
    setLoadingShared(true);
    try {
      if (isDemo) {
        setSharedDocsFromMember([
          { _id: 's-1', title: 'Vehicle Insurance Policy', documentType: 'Insurance', category: 'Financial' },
          { _id: 's-2', title: 'Property Tax Receipt', documentType: 'Tax Receipt', category: 'Government' },
        ]);
      } else {
        const res = await api.getSharedDocumentsFromMember(member.userId);
        setSharedDocsFromMember(res);
      }
    } catch (err) {
      if (addToast) addToast(err.message || 'Error fetching shared documents', 'error');
    } finally {
      setLoadingShared(false);
    }
  };

  // Connect user by email
  const handleConnectByEmail = async (e) => {
    e.preventDefault();
    if (!connectEmail.trim()) return;

    setSubmitting(true);
    setNonUserResult(null);

    try {
      if (isDemo) {
        if (addToast) addToast(`Connection request sent to ${connectEmail} (Demo)`, 'success');
        setShowAddModal(false);
      } else {
        const res = await api.connectFamilyByEmail(connectEmail.trim(), connectRel);
        if (addToast) addToast(res.message, 'success');
        if (onRefresh) onRefresh();
        setShowAddModal(false);
      }
    } catch (err) {
      if (err.message.includes('not on LifeFlow')) {
        setNonUserResult({ email: connectEmail.trim(), relationship: connectRel });
      } else {
        if (addToast) addToast(err.message || 'Failed to send connection request', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Create invitation link for non-user
  const handleCreateInvite = async (relToUse, emailToUse) => {
    setSubmitting(true);
    try {
      if (isDemo) {
        const fakeToken = 'demo-token-' + Date.now();
        setInviteLinkResult(`${window.location.origin}/invite/${fakeToken}`);
      } else {
        const res = await api.createFamilyInvite(emailToUse || null, relToUse || 'Brother');
        setInviteLinkResult(res.inviteLink);
        if (onRefresh) onRefresh();
      }
      setNonUserResult(null);
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to generate invitation link', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Save manual unlinked family member
  const handleSaveManual = async (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    setSubmitting(true);
    try {
      if (!isDemo) {
        await api.createManualFamilyMember({
          name: manualName.trim(),
          relationship: manualRel,
          dateOfBirth: manualDob,
        });
      }
      if (addToast) addToast('Family member added', 'success');
      if (onRefresh) onRefresh();
      setShowAddModal(false);
      setManualName('');
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to add family member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Accept Connection Request
  const handleAcceptRequest = async (connectionId) => {
    try {
      if (!isDemo) {
        await api.acceptFamilyRequest(connectionId);
      }
      if (addToast) addToast('Family connection accepted!', 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to accept connection', 'error');
    }
  };

  // Decline Connection Request
  const handleDeclineRequest = async (connectionId) => {
    try {
      if (!isDemo) {
        await api.declineFamilyRequest(connectionId);
      }
      if (addToast) addToast('Connection request declined', 'info');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to decline connection', 'error');
    }
  };

  // Remove Connection
  const handleRemoveConnection = async (connectionId) => {
    if (!window.confirm('Remove this family connection? Shared document access will be revoked.')) return;
    try {
      if (!isDemo) {
        await api.removeFamilyConnection(connectionId);
      }
      if (addToast) addToast('Family connection removed', 'info');
      if (onRefresh) onRefresh();
      setSelectedMember(null);
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to remove connection', 'error');
    }
  };

  // Toggle explicit document sharing
  const handleToggleDocShare = async (docId, isShared, targetUserId) => {
    try {
      if (isShared) {
        await api.unshareDocumentWithFamily(docId, targetUserId);
        if (addToast) addToast('Revoked document access', 'info');
      } else {
        await api.shareDocumentWithFamily(docId, targetUserId);
        if (addToast) addToast('Document shared with family member', 'success');
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to update sharing permission', 'error');
    }
  };

  // Web Share or Clipboard Copy for Invitation
  const handleShareInviteLink = async (link) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on LifeFlow',
          text: 'Join me on LifeFlow to manage important documents and life processes together.',
          url: link,
        });
        if (addToast) addToast('Shared invitation link successfully!', 'success');
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(link);
        if (addToast) addToast('Invitation link copied to clipboard!', 'success');
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Family</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Connect with family on LifeFlow, manage invitations, and share documents with privacy controls.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setNonUserResult(null);
            setInviteLinkResult(null);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[13px] font-semibold transition-colors shrink-0"
        >
          <Plus size={15} />
          Add Family Member
        </button>
      </div>

      {/* 1. INCOMING CONNECTION REQUESTS */}
      {incomingRequests.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 space-y-3 fade-in">
          <h2 className="text-[14px] font-bold text-blue-300 flex items-center gap-2">
            <Sparkles size={16} />
            Incoming Family Connection Requests ({incomingRequests.length})
          </h2>
          <div className="space-y-2">
            {incomingRequests.map(req => (
              <div key={req._id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-white">
                    {req.name} ({req.email})
                  </p>
                  <p className="text-[12px] text-slate-400">Wants to connect with you as <span className="text-emerald-400 font-medium">{req.relationship}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptRequest(req.connectionId)}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[12px] font-semibold transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(req.connectionId)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[12px] font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CONNECTED LIFEFLOW FAMILY MEMBERS */}
      <div>
        <h2 className="text-[14px] font-semibold text-slate-300 uppercase tracking-wider mb-3">Connected LifeFlow Family</h2>

        <div className="space-y-3">
          {connectedMembers.map(member => (
            <div
              key={member._id}
              className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-500/30 flex items-center justify-center shrink-0 text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-slate-100">{member.name}</h3>
                    <span className="text-[11px] text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {member.relationship}
                    </span>
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Connected User
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-400">
                    Documents shared with you: <span className="font-semibold text-slate-200">{member.sharedDocumentsCount || 0}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenMember(member)}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <Eye size={14} /> View Shared Docs
                </button>

                <button
                  onClick={() => { setSharingTarget(member); setShowManageSharing(true); }}
                  className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <Share2 size={14} /> Share My Docs
                </button>

                <button
                  onClick={() => handleRemoveConnection(member.connectionId)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove Connection"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {connectedMembers.length === 0 && (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/40 text-slate-500 text-[13px] text-center">
              No connected LifeFlow family members yet. Add family members by email to connect accounts.
            </div>
          )}
        </div>
      </div>

      {/* 3. PENDING OUTBOUND INVITATIONS & REQUESTS */}
      {pendingOutbound.length > 0 && (
        <div>
          <h2 className="text-[14px] font-semibold text-slate-300 uppercase tracking-wider mb-3">Pending Invitations & Requests</h2>
          <div className="space-y-2">
            {pendingOutbound.map(item => (
              <div key={item._id} className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-slate-200">{item.name || item.email}</p>
                    <span className="text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {item.relationship}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock size={12} className="text-amber-400" />
                    Status: <span className="text-amber-400 font-medium">{item.status}</span>
                  </p>
                </div>

                {item.token && (
                  <button
                    onClick={() => handleShareInviteLink(`${window.location.origin}/invite/${item.token}`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Copy size={13} /> Copy / Share Link
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. UNLINKED / MANUAL FAMILY MEMBERS */}
      {manualMembers.length > 0 && (
        <div>
          <h2 className="text-[14px] font-semibold text-slate-300 uppercase tracking-wider mb-3">Other Family Records</h2>
          <div className="space-y-2">
            {manualMembers.map(member => (
              <div key={member._id} className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User size={15} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-200">{member.name}</p>
                    <p className="text-[12px] text-slate-500">{member.relationship}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD FAMILY MEMBER (BY EMAIL OR INVITE OR MANUAL) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
          <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Add Family Member</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={18} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl mb-5">
              <button
                onClick={() => { setAddMode('email'); setNonUserResult(null); setInviteLinkResult(null); }}
                className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
                  addMode === 'email' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Add by Email
              </button>
              <button
                onClick={() => { setAddMode('invite'); setNonUserResult(null); setInviteLinkResult(null); }}
                className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
                  addMode === 'invite' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Generate Invite Link
              </button>
              <button
                onClick={() => { setAddMode('manual'); setNonUserResult(null); setInviteLinkResult(null); }}
                className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
                  addMode === 'manual' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Manual Record
              </button>
            </div>

            {/* MODE 1: ADD BY EMAIL */}
            {addMode === 'email' && !nonUserResult && !inviteLinkResult && (
              <form onSubmit={handleConnectByEmail} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Family Member's LifeFlow Email</label>
                  <input
                    type="email"
                    placeholder="e.g. brother@example.com"
                    value={connectEmail}
                    onChange={e => setConnectEmail(e.target.value)}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Relationship</label>
                  <select
                    value={connectRel}
                    onChange={e => setConnectRel(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                  >
                    {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[12px] text-slate-400">
                  <p className="font-semibold text-slate-300 mb-1">Privacy Notice:</p>
                  <p>Connecting with a family member does NOT expose your documents. Every document remains private until explicitly shared.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-[13px] hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[13px]"
                  >
                    {submitting ? 'Searching User...' : 'Send Connection Request'}
                  </button>
                </div>
              </form>
            )}

            {/* NON-USER FOUND PROMPT */}
            {nonUserResult && (
              <div className="space-y-4 text-center py-2 fade-in">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white">This person isn't on LifeFlow yet</h3>
                  <p className="text-[13px] text-slate-400 mt-1">
                    No account registered for <span className="font-semibold text-slate-200">{nonUserResult.email}</span>. You can generate a secure invitation link to join.
                  </p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setNonUserResult(null)}
                    className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-[13px]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleCreateInvite(nonUserResult.relationship, nonUserResult.email)}
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[13px]"
                  >
                    {submitting ? 'Generating...' : 'Invite to LifeFlow'}
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: GENERATE INVITE LINK DIRECTLY */}
            {addMode === 'invite' && !inviteLinkResult && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Relationship</label>
                  <select
                    value={connectRel}
                    onChange={e => setConnectRel(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                  >
                    {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Recipient Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. sister@example.com"
                    value={connectEmail}
                    onChange={e => setConnectEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>

                <button
                  onClick={() => handleCreateInvite(connectRel, connectEmail)}
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[14px]"
                >
                  {submitting ? 'Generating Link...' : 'Generate Secure Invitation Link'}
                </button>
              </div>
            )}

            {/* INVITATION LINK GENERATED DISPLAY */}
            {inviteLinkResult && (
              <div className="space-y-4 text-center py-2 fade-in">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-[16px] font-bold text-white">Invitation Link Ready</h3>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left">
                  <p className="text-[11px] font-semibold text-slate-400 mb-1 uppercase">Invitation Link:</p>
                  <p className="text-[12px] font-mono text-emerald-400 break-all">{inviteLinkResult}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleShareInviteLink(inviteLinkResult)}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[13px] flex items-center justify-center gap-1.5"
                  >
                    <Share2 size={15} /> Share / Copy Link
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[13px]"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* MODE 3: MANUAL RECORD */}
            {addMode === 'manual' && (
              <form onSubmit={handleSaveManual} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Relationship</label>
                  <select
                    value={manualRel}
                    onChange={e => setManualRel(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                  >
                    {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-[13px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-[13px]"
                  >
                    {submitting ? 'Saving...' : 'Add Record'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW SHARED DOCUMENTS FROM CONNECTED MEMBER */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
          <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedMember.name}'s Shared Documents</h3>
                <p className="text-[12px] text-slate-400">Only documents explicitly shared with you by {selectedMember.name} are visible.</p>
              </div>
              <button onClick={() => setSelectedMember(null)}>
                <X size={18} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {loadingShared ? (
              <p className="text-[13px] text-slate-400 text-center py-8">Verifying permissions and fetching shared documents...</p>
            ) : sharedDocsFromMember.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <Lock size={24} className="text-slate-500 mx-auto mb-2" />
                <p className="text-[14px] text-slate-300 font-medium">No documents shared with you yet</p>
                <p className="text-[12px] text-slate-500 mt-1 max-w-xs mx-auto">
                  {selectedMember.name} has not granted permission for any private documents yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {sharedDocsFromMember.map(doc => (
                  <div key={doc._id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Shield size={16} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-slate-100">{doc.title}</p>
                        <p className="text-[12px] text-slate-500">{doc.category} • {doc.documentType}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded">
                      Shared View
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: MANAGE MY SHARED DOCUMENTS WITH CONNECTED MEMBER */}
      {showManageSharing && sharingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
          <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Share My Documents with {sharingTarget.name}</h3>
                <p className="text-[12px] text-slate-400">Select which of your documents {sharingTarget.name} is permitted to view.</p>
              </div>
              <button onClick={() => setShowManageSharing(false)}>
                <X size={18} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {userDocuments.length === 0 ? (
                <p className="text-[13px] text-slate-400 text-center py-6">You have no documents in your vault yet.</p>
              ) : (
                userDocuments.map(doc => {
                  const docId = doc._id || doc.id;
                  const isSharedWithMember = (doc.sharedWith || []).some(s => String(s.userId || s) === String(sharingTarget.userId));

                  return (
                    <div key={docId} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-semibold text-slate-100">{doc.title || doc.name}</p>
                        <p className="text-[12px] text-slate-500">{doc.category} • {doc.documentType}</p>
                      </div>

                      <button
                        onClick={() => handleToggleDocShare(docId, isSharedWithMember, sharingTarget.userId)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1.5 ${
                          isSharedWithMember
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40'
                            : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-emerald-500 hover:text-slate-950'
                        }`}
                      >
                        {isSharedWithMember ? (
                          <>
                            <Check size={14} /> Shared
                          </>
                        ) : (
                          'Share'
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
