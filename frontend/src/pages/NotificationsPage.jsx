import { Bell, CheckCheck, AlertTriangle, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function NotificationsPage({ notifications = [], markNotifRead, markAllNotifsRead, navigate, onAcceptFamilyRequest, onDeclineFamilyRequest }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">All Notifications</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Stay updated on your document status, process deadlines, and family connections.</p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && markAllNotifsRead && (
            <button
              onClick={markAllNotifsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-[12px] font-medium transition-colors"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
          <button
            onClick={() => navigate('overview')}
            className="text-[13px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      <div className="bg-[#0a0f1a] border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Bell size={32} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-[15px] font-semibold text-slate-200">No notifications yet</h3>
            <p className="text-[13px] text-slate-500 mt-1">LifeFlow will notify you when your documents expire or when family members connect.</p>
          </div>
        ) : (
          notifications.map(n => {
            const notifId = n._id || n.id;
            const isUnread = !n.read;
            const isFamilyReq = n.relatedEntity === 'family_request';

            return (
              <div
                key={notifId}
                className={`p-5 transition-colors flex items-start gap-4 ${
                  isUnread ? 'bg-slate-800/30' : 'bg-transparent'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  n.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {n.type === 'urgent' ? <AlertTriangle size={18} /> :
                   n.type === 'warning' ? <Clock size={18} /> :
                   n.type === 'success' ? <CheckCircle2 size={18} /> :
                   <Bell size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-[14px] font-semibold ${isUnread ? 'text-white' : 'text-slate-200'}`}>
                      {n.title}
                    </h3>
                    {n.createdAt && (
                      <span className="text-[11px] text-slate-500 shrink-0">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>

                  {isFamilyReq && n.actionPayload && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          if (onAcceptFamilyRequest) onAcceptFamilyRequest(n.actionPayload.connectionId);
                          if (markNotifRead) markNotifRead(notifId);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[12px] font-semibold transition-colors"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => {
                          if (onDeclineFamilyRequest) onDeclineFamilyRequest(n.actionPayload.connectionId);
                          if (markNotifRead) markNotifRead(notifId);
                        }}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[12px] font-medium transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {isUnread && (
                    <button
                      onClick={() => markNotifRead && markNotifRead(notifId)}
                      className="mt-2 text-[12px] text-emerald-400 hover:underline font-medium block"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
