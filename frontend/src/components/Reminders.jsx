import { useState } from 'react';
import { Bell, Plus, Check, Clock, Calendar, AlertTriangle, X } from 'lucide-react';
import { formatDate, getDaysUntil, getPriorityColor } from '../data/mockData';

export default function Reminders({ reminders, toggleReminder, addReminder }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const today = reminders.filter(r => {
    const d = getDaysUntil(r.date);
    return d !== null && d <= 0;
  });
  const thisWeek = reminders.filter(r => {
    const d = getDaysUntil(r.date);
    return d !== null && d > 0 && d <= 7;
  });
  const upcoming = reminders.filter(r => {
    const d = getDaysUntil(r.date);
    return d !== null && d > 7;
  });

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addReminder({
      title: newTitle,
      date: newDate || new Date().toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
      category: 'upcoming',
    });
    setNewTitle('');
    setNewDate('');
    setShowAdd(false);
  };

  const ReminderItem = ({ r }) => {
    const days = getDaysUntil(r.date);
    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
        r.completed ? 'bg-slate-800/20 border-slate-800/30' : 'bg-[#0a0f1a] border-slate-800/60 hover:border-slate-700/60'
      }`}>
        <button
          onClick={() => toggleReminder(r.id)}
          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
            r.completed
              ? 'bg-emerald-500/20 border-emerald-500/40'
              : 'border-slate-600 hover:border-slate-400'
          }`}
        >
          {r.completed && <Check size={12} className="text-emerald-400" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-[14px] font-medium truncate ${r.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
            {r.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[12px] text-slate-500">{formatDate(r.date)}</span>
            {days !== null && days > 0 && !r.completed && (
              <span className={`text-[11px] ${days <= 7 ? 'text-amber-400' : 'text-slate-500'}`}>
                {days}d
              </span>
            )}
          </div>
        </div>
        {r.priority && !r.completed && (
          <span className={`text-[10px] font-medium uppercase ${getPriorityColor(r.priority)}`}>
            {r.priority}
          </span>
        )}
      </div>
    );
  };

  const Section = ({ title, icon: Icon, items }) => (
    <div>
      <h2 className="text-[14px] font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <Icon size={14} className="text-slate-500" />
        {title}
        <span className="text-[12px] text-slate-600 font-normal">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <p className="text-[13px] text-slate-600 py-3 px-4">Nothing scheduled</p>
      ) : (
        <div className="space-y-1.5">
          {items.map(r => <ReminderItem key={r.id} r={r} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Reminders</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Stay on top of your document deadlines.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/10 text-white rounded-lg text-[13px] font-medium hover:bg-white/15 transition-colors"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#0a0f1a] border border-slate-800/60 rounded-xl p-4 fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-slate-200">New Reminder</h3>
            <button onClick={() => setShowAdd(false)}>
              <X size={14} className="text-slate-500 hover:text-slate-300" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Reminder title..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-[13px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
            />
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
            />
            <button
              onClick={handleAdd}
              className="w-full py-2 bg-white text-slate-900 rounded-lg text-[13px] font-semibold hover:bg-slate-100 transition-colors"
            >
              Add Reminder
            </button>
          </div>
        </div>
      )}

      <Section title="Today" icon={AlertTriangle} items={today} />
      <Section title="This Week" icon={Clock} items={thisWeek} />
      <Section title="Upcoming" icon={Calendar} items={upcoming} />
    </div>
  );
}
