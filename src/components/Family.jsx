import { Users, User, ChevronRight, Shield, Clock, XCircle, FileText } from 'lucide-react';
import { familyMembers } from '../data/mockData';

export default function Family({ navigate }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Family</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Manage document health for your family members.</p>
      </div>

      <div className="space-y-3">
        {familyMembers.map(member => (
          <div
            key={member.id}
            className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0">
                <User size={18} className="text-slate-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[15px] font-semibold text-slate-100">{member.name}</h3>
                  <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/40">
                    {member.relation}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <FileText size={12} className="text-slate-500" />
                    <span className="text-[12px] text-slate-400">{member.documentsCount} docs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-emerald-400" />
                    <span className="text-[12px] text-emerald-400">{member.healthy} healthy</span>
                  </div>
                  {member.expiring > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-amber-400" />
                      <span className="text-[12px] text-amber-400">{member.expiring} expiring</span>
                    </div>
                  )}
                  {member.missing > 0 && (
                    <div className="flex items-center gap-1.5">
                      <XCircle size={12} className="text-red-400" />
                      <span className="text-[12px] text-red-400">{member.missing} missing</span>
                    </div>
                  )}
                </div>

                {/* Highlight */}
                {member.highlight && (
                  <p className="text-[12px] text-amber-400/70 mt-2 italic">{member.highlight}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Future note */}
      <div className="bg-slate-800/20 border border-slate-800/40 rounded-xl p-5 text-center">
        <Users size={20} className="text-slate-600 mx-auto mb-2" />
        <p className="text-[13px] text-slate-500">
          Family document management with sharing and permissions is planned for a future release.
        </p>
      </div>
    </div>
  );
}
