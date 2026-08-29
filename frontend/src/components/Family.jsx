import { useState } from 'react';
import { Users, User, Plus, X, Trash2, Edit2, Shield } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const relationshipOptions = [
  'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Other'
];

export default function Family({ familyMembers = [], onRefresh, addToast }) {
  const { isDemo } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Father');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setRelationship('Father');
    setDateOfBirth('');
    setShowModal(true);
  };

  const openEdit = (member) => {
    setEditingId(member._id || member.id);
    setName(member.name || '');
    setRelationship(member.relationship || member.relation || 'Father');
    setDateOfBirth(member.dateOfBirth || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        // Edit mode
        if (!isDemo) {
          await api.updateFamilyMember(editingId, {
            name: name.trim(),
            relationship,
            dateOfBirth,
          });
        } else {
          const m = familyMembers.find(f => (f._id === editingId || f.id === editingId));
          if (m) {
            m.name = name.trim();
            m.relationship = relationship;
            m.dateOfBirth = dateOfBirth;
          }
        }
        if (addToast) addToast('Family member updated', 'success');
      } else {
        // Add mode
        if (!isDemo) {
          await api.createFamilyMember({
            name: name.trim(),
            relationship,
            dateOfBirth,
          });
        } else {
          familyMembers.unshift({
            id: 'fam-' + Date.now(),
            name: name.trim(),
            relationship,
            dateOfBirth,
          });
        }
        if (addToast) addToast('Family member added', 'success');
      }

      if (onRefresh) onRefresh();
      setShowModal(false);
    } catch (err) {
      if (addToast) addToast(err.message || 'Action failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this family member?')) return;
    try {
      if (!isDemo) {
        await api.deleteFamilyMember(id);
        if (onRefresh) onRefresh();
      }
      if (addToast) addToast('Family member removed', 'info');
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to remove family member', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Family Members</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Manage document health and relationships for your family.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[13px] font-semibold transition-colors shrink-0"
        >
          <Plus size={15} />
          Add Member
        </button>
      </div>

      {/* FAMILY LIST */}
      <div className="space-y-3">
        {familyMembers.map(member => (
          <div
            key={member._id || member.id}
            className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <User size={18} className="text-slate-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] font-semibold text-slate-100">{member.name}</h3>
                  <span className="text-[11px] text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {member.relationship || member.relation}
                  </span>
                </div>
                {member.dateOfBirth && (
                  <p className="text-[12px] text-slate-500">DOB: {member.dateOfBirth}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openEdit(member)}
                className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Edit family member"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => handleDelete(member._id || member.id)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove family member"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {familyMembers.length === 0 && (
          <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-2xl p-10 text-center fade-in">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Users size={22} className="text-slate-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-1">No family members added</h3>
            <p className="text-[13px] text-slate-500 max-w-sm mx-auto mb-6">
              Add parents, siblings, or spouse to keep track of family document requirements and renewals.
            </p>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-[13px] transition-colors"
            >
              <Plus size={15} />
              Add family member
            </button>
          </div>
        )}
      </div>

      {/* ADD / EDIT MEMBER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Family Member' : 'Add Family Member'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={16} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Relationship</label>
                <select
                  value={relationship}
                  onChange={e => setRelationship(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600 appearance-none"
                >
                  {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Date of Birth (Optional)</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-[14px] text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg text-[13px] hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-[13px]"
                >
                  {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
