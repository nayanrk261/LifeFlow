import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, X } from 'lucide-react';

export default function Header({ profile, notifications = [], markNotifRead, navigate, onSearch }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

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

  return (
    <header className="h-14 shrink-0 border-b border-slate-800/60 bg-[#0a0f1a]/80 backdrop-blur-sm flex items-center px-4 sm:px-6 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search processes, documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-1.5 text-[13px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600 focus:bg-slate-800/70 transition-colors"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Copilot Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400 font-medium">LifeFlow Copilot</span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            title="Notifications"
          >
            <Bell size={17} className="text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl z-50 fade-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
                <h3 className="text-[13px] font-semibold text-slate-200">Notifications</h3>
                <button onClick={() => setShowNotifs(false)}>
                  <X size={14} className="text-slate-500 hover:text-slate-300" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[13px] text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <button
                      key={n.id || n._id}
                      onClick={() => { if (markNotifRead) markNotifRead(n.id || n._id); setShowNotifs(false); }}
                      className={`w-full text-left px-4 py-3 border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors ${!n.read ? 'bg-slate-800/20' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                          n.type === 'urgent' ? 'bg-red-400' :
                          n.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <div>
                          <p className="text-[13px] font-medium text-slate-200">{n.title}</p>
                          <p className="text-[12px] text-slate-500 mt-0.5">{n.message}</p>
                          {n.createdAt && <p className="text-[11px] text-slate-600 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
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
