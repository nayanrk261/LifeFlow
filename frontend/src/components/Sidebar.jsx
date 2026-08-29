import { LayoutDashboard, FileText, AlertTriangle, CheckCircle, MessageSquare, Bell, Users, Lock, User, Cpu, Shield, BarChart3, PenTool, LogOut, Sparkles } from 'lucide-react';
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

export default function Sidebar({ screen, navigate, unreadNotifCount = 0 }) {
  const { user, profile, logout, isDemo } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('landing');
    }
  };

  const displayName = user?.name || profile?.firstName || 'User';

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-slate-800/60 bg-[#0a0f1a] h-screen shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/60 flex items-center justify-between">
        <button onClick={() => navigate('overview')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-900/20">
            L
          </div>
          <div className="text-left">
            <span className="text-[15px] font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              LifeFlow
            </span>
            {isDemo && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-medium border border-amber-500/20">
                Demo Mode
              </span>
            )}
          </div>
        </button>
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
                onClick={() => navigate(item.id)}
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
                  onClick={() => navigate(item.id)}
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
          onClick={() => navigate('profile')}
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
    </aside>
  );
}
