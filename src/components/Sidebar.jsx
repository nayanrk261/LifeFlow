import { LayoutDashboard, FileText, AlertTriangle, CheckCircle, MessageSquare, Bell, Users, Lock, Settings, User, Cpu, Shield, BarChart3, PenTool } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
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

export default function Sidebar({ screen, navigate, profile }) {
  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-slate-800/60 bg-[#0a0f1a] h-screen shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <button onClick={() => navigate('overview')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <div>
            <span className="text-[15px] font-semibold text-slate-100 tracking-tight">DocAction</span>
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
                  active
                    ? 'bg-slate-800/80 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2 : 1.5} />
                <span>{item.label}</span>
                {item.id === 'attention' && (
                  <span className="ml-auto text-[11px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full font-medium">3</span>
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

      {/* Profile */}
      <div className="px-3 py-3 border-t border-slate-800/60">
        <button
          onClick={() => navigate('overview')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <User size={14} className="text-slate-300" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-medium text-slate-200">{profile?.firstName || 'User'}</p>
            <p className="text-[11px] text-slate-500">Personal</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
