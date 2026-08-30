import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, X, CheckCheck, AlertTriangle, Clock, CheckCircle2, Shield, ArrowRight, Sparkles, Menu } from 'lucide-react';

const pageContextMap = {
  'overview': { title: 'Dashboard', subtitle: 'Goal readiness overview & next actions' },
  'ask-lifeflow': { title: 'Ask LifeFlow Engine', subtitle: 'AI goal intelligence & action plan builder' },
  'documents': { title: 'Document Vault', subtitle: 'Personal document vault & AI analysis' },
  'doc-intelligence': { title: 'Document Intelligence', subtitle: 'Extracted metadata & privacy details' },
  'attention': { title: 'Needs Attention', subtitle: 'Expiring documents & missing requirement alerts' },
  'readiness': { title: 'Goal Readiness', subtitle: 'Check requirements for any life goal' },
  'assistant': { title: 'AI Assistant', subtitle: 'Document copilot & goal query engine' },
  'generator': { title: 'Document Generator', subtitle: 'Draft official applications & formal letters' },
  'reminders': { title: 'Reminders & Schedule', subtitle: 'Upcoming document deadlines & goal actions' },
  'family': { title: 'Family Workspace', subtitle: 'Shared document readiness & family members' },
  'vault': { title: 'Secure Vault', subtitle: 'Encrypted personal document storage' },
  'profile': { title: 'My Account', subtitle: 'Personal profile & security settings' },
  'notifications': { title: 'Notifications', subtitle: 'System alerts & family connection requests' },
  'architecture': { title: 'Technical Architecture', subtitle: 'Privacy layer & NPU companion roadmap' },
  'privacy': { title: 'Privacy & Security', subtitle: 'On-device processing & privacy principles' },
  'competitive': { title: 'Platform Comparison', subtitle: 'LifeFlow vs alternative document tools' },
  'goal-detail': { title: 'Goal Action Plan', subtitle: 'Detailed goal requirements & next steps' },
};

const LifeFlowLogoMark = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M5 22C5 13.5 10 7.5 16 7.5C22 7.5 27 13.5 27 22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="text-emerald-400"
    />
    <path
      d="M9 24C11.5 17.5 13.5 14.5 16 14.5C18.5 14.5 20.5 17.5 23 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-teal-300"
    />
    <circle cx="5" cy="22" r="2.5" className="fill-emerald-400" />
    <circle cx="16" cy="7.5" r="2.5" className="fill-emerald-400" />
    <circle cx="27" cy="22" r="2.5" className="fill-emerald-400" />
  </svg>
);

export default function Header({
  screen = 'overview',
  profile,
  notifications = [],
  markNotifRead,
  markAllNotifsRead,
  navigate,
  onSearch,
  onToggleMobileMenu,
  onAcceptFamilyRequest,
  onDeclineFamilyRequest,
}) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const currentContext = pageContextMap[screen] || { title: 'Dashboard', subtitle: 'Goal readiness & next actions' };

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <header className="h-16 shrink-0 border-b border-slate-800/80 bg-[#070c16]/95 backdrop-blur-md flex items-center px-4 sm:px-6 justify-between gap-4 z-30">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* DESKTOP PAGE CONTEXT (Title & Subtitle - visible on md+) */}
        <div className="hidden md:flex flex-col justify-center">
          <h1 className="text-[17px] font-extrabold text-white tracking-tight leading-snug">
            {currentContext.title}
          </h1>
          <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5 hidden lg:block">
            {currentContext.subtitle}
          </p>
        </div>

        {/* MOBILE BRANDING & HAMBURGER (visible on mobile <md) */}
        <div className="flex md:hidden items-center gap-2.5">
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={() => navigate('overview')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
              <LifeFlowLogoMark className="w-5 h-5" />
            </div>
            <span className="text-[15px] font-extrabold text-white tracking-tight">
              LifeFlow
            </span>
          </button>
        </div>

      </div>

      {/* CENTER: SEARCH BAR (Desktop) */}
      <div className="flex-1 max-w-sm hidden xl:block mx-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search goals, requirements, documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-[12px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-2.5">
        {/* Quick Action Button */}
        <button
          onClick={() => navigate('ask-lifeflow')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-[12px] font-bold transition-all shadow-sm"
        >
          <Sparkles size={14} />
          Ask LifeFlow
        </button>

        {/* Notifications Anchor */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative p-2 rounded-lg transition-colors ${
              showNotifs ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full text-[10px] font-bold text-slate-950 flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* FIXED / RESPONSIVE NOTIFICATION POPOVER */}
          {showNotifs && (
            <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] max-w-full bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl z-[100] fade-in overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-white tracking-tight">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && markAllNotifsRead && (
                    <button
                      onClick={markAllNotifsRead}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
                      title="Mark all as read"
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Scrollable Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                {notifications.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <Bell size={24} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-[13px] font-semibold text-slate-300">No notifications yet</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">We'll alert you here when documents require attention.</p>
                  </div>
                ) : (
                  notifications.map(n => {
                    const isUnread = !n.read;
                    const notifId = n._id || n.id;
                    const isFamilyReq = n.relatedEntity === 'family_request';

                    return (
                      <div
                        key={notifId}
                        className={`p-4 transition-colors relative text-left ${
                          isUnread ? 'bg-slate-800/40 border-l-2 border-emerald-400' : 'bg-transparent hover:bg-slate-800/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Type Icon */}
                          <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            n.type === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            n.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {n.type === 'urgent' ? <AlertTriangle size={14} /> :
                             n.type === 'warning' ? <Clock size={14} /> :
                             n.type === 'success' ? <CheckCircle2 size={14} /> :
                             <Bell size={14} />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-[13px] font-semibold truncate ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                                {n.title}
                              </p>
                              {n.createdAt && (
                                <span className="text-[11px] text-slate-500 shrink-0">
                                  {formatRelativeTime(n.createdAt)}
                                </span>
                              )}
                            </div>

                            <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">
                              {n.message}
                            </p>

                            {/* Interactive Family Connection Actions */}
                            {isFamilyReq && n.actionPayload && (
                              <div className="flex gap-2 mt-3 pt-2 border-t border-slate-800/40">
                                <button
                                  onClick={() => {
                                    if (onAcceptFamilyRequest) onAcceptFamilyRequest(n.actionPayload.connectionId);
                                    if (markNotifRead) markNotifRead(notifId);
                                  }}
                                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-md text-[11px] font-semibold transition-colors"
                                >
                                  Accept Request
                                </button>
                                <button
                                  onClick={() => {
                                    if (onDeclineFamilyRequest) onDeclineFamilyRequest(n.actionPayload.connectionId);
                                    if (markNotifRead) markNotifRead(notifId);
                                  }}
                                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] font-medium transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            )}

                            {isUnread && (
                              <button
                                onClick={() => markNotifRead && markNotifRead(notifId)}
                                className="mt-2 text-[11px] text-emerald-400 hover:underline font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/80 text-center">
                <button
                  onClick={() => { setShowNotifs(false); navigate('notifications'); }}
                  className="text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  View all notifications
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => navigate('profile')}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
          title="My Profile"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <User size={13} className="text-slate-300" />
          </div>
        </button>
      </div>
    </header>
  );
}
