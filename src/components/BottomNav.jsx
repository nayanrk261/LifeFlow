import { LayoutDashboard, FileText, AlertTriangle, MessageSquare, User } from 'lucide-react';

const items = [
  { id: 'overview', label: 'Home', icon: LayoutDashboard },
  { id: 'documents', label: 'Docs', icon: FileText },
  { id: 'attention', label: 'Attention', icon: AlertTriangle },
  { id: 'assistant', label: 'Assistant', icon: MessageSquare },
  { id: 'vault', label: 'Profile', icon: User },
];

export default function BottomNav({ screen, navigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f1a]/95 backdrop-blur-md border-t border-slate-800/60">
      <div className="flex items-center justify-around px-2 py-1.5">
        {items.map(item => {
          const Icon = item.icon;
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                active ? 'text-white' : 'text-slate-500'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.id === 'attention' && (
                <span className="absolute -top-0 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
