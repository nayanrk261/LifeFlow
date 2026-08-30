import { LayoutDashboard, FileText, AlertTriangle, CheckCircle, MessageSquare, Bell, Users, Lock, User, Cpu, Shield, BarChart3, PenTool, LogOut, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'ask-lifeflow', label: 'Ask LifeFlow', icon: Sparkles, highlight: true },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'attention', label: 'Needs Attention', icon: AlertTriangle },
  { id: 'readiness', label: 'Readiness', icon: CheckCircle },
  { id: 'assistant', label: 'Assistant', icon: MessageSquare },
  { id: 'generator', label: 'Generator', icon: PenTool },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'vault', label: 'Vault', icon: Lock },
];

const bottomItems = [
  { id: 'architecture', label: 'How It Works', icon: Cpu },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'competitive', label: 'Compare', icon: BarChart3 },
];

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

export default function Sidebar({ screen, navigate, unreadNotifCount = 0, mobileOpen = false, onCloseMobile }) {
  const { user, profile, logout, isDemo } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      if (onCloseMobile) onCloseMobile();
      navigate('landing');
    }
  };

  const handleNavClick = (id) => {
    if (onCloseMobile) onCloseMobile();
    navigate(id);
  };

  const displayName = user?.name || profile?.firstName || 'User';

  const sidebarInner = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <button onClick={() => handleNavClick('overview')} className="flex items-center gap-2.5 group text-left">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors shadow-inner">
            <LifeFlowLogoMark className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                LifeFlow
              </span>
              {isDemo && (
                <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-bold border border-amber-500/20 uppercase">
                  Demo
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">From Life Goal to Next Action</p>
          </div>
        </button>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  item.highlight
                    ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 mb-1'
                    : active
                    ? 'bg-slate-800/80 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2 : 1.5} className={item.highlight ? 'text-emerald-400' : ''} />
                <span>{item.label}</span>
                {item.id === 'attention' && unreadNotifCount > 0 && (
                  <span className="ml-auto text-[11px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full font-medium">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/40">
          <p className="px-3 pb-2 text-[11px] font-medium text-slate-600 uppercase tracking-wider">About</p>
          <div className="space-y-0.5">
            {bottomItems.map(item => {
              const Icon = item.icon;
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    active
                      ? 'bg-slate-800/80 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Profile & Logout */}
      <div className="px-3 py-3 border-t border-slate-800/60 space-y-1">
        <button
          onClick={() => handleNavClick('profile')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <User size={14} className="text-slate-300" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[13px] font-medium text-slate-200 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email || 'My Account'}</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-60 border-r border-slate-800/80 bg-[#070c16] h-screen shrink-0">
        {sidebarInner}
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity fade-in"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-72 bg-[#070c16] border-r border-slate-800/90 h-full flex flex-col shadow-2xl fade-in">
            {sidebarInner}
          </aside>
        </div>
      )}
    </>
  );
}
