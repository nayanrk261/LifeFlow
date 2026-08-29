import { useState, useRef, useEffect } from 'react';
import { Send, Cpu, FileText, Sparkles, User } from 'lucide-react';
import { aiResponses } from '../data/mockData';

const suggestions = [
  'What documents need my attention?',
  'When does my insurance expire?',
  'What am I missing for my scholarship?',
  'Am I ready to apply?',
  'What should I do next?',
];

function findResponse(query) {
  const q = query.toLowerCase().trim();
  for (const key of Object.keys(aiResponses)) {
    if (key === 'default') continue;
    // Fuzzy match: check if query contains key words
    const words = key.split(' ');
    const matchCount = words.filter(w => q.includes(w)).length;
    if (matchCount >= words.length * 0.5) {
      return aiResponses[key];
    }
  }
  return aiResponses.default;
}

export default function Assistant({ documents, profile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = findResponse(query);
      setMessages(prev => [...prev, { role: 'assistant', text: response.text, sources: response.sources }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-sky-400" />
          Ask your documents
        </h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Get answers based on the documents and workflows in your DocAction profile.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-5">
              <Sparkles size={24} className="text-sky-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-200 mb-1">What would you like to know?</h2>
            <p className="text-[13px] text-slate-500 mb-6 max-w-sm">
              I can answer questions about your documents, deadlines, readiness, and recommended actions.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-[12px] text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''} fade-in`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={13} className="text-sky-400" />
              </div>
            )}
            <div className={`max-w-lg ${
              msg.role === 'user'
                ? 'bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tr-md px-4 py-3'
                : 'flex-1'
            }`}>
              {msg.role === 'user' ? (
                <p className="text-[14px] text-slate-200">{msg.text}</p>
              ) : (
                <div>
                  <div className="text-[14px] text-slate-300 leading-relaxed whitespace-pre-line">
                    {msg.text.split('\n').map((line, j) => {
                      // Bold text
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={j} className={line === '' ? 'h-2' : 'mb-1'}>
                          {parts.map((part, k) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={k} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                            }
                            return <span key={k}>{part}</span>;
                          })}
                        </p>
                      );
                    })}
                  </div>
                  {msg.sources && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-slate-600">Sources:</span>
                      {msg.sources.map((src, j) => (
                        <span key={j} className="text-[11px] px-2 py-0.5 bg-slate-800/50 border border-slate-700/50 rounded text-slate-400">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User size={13} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 fade-in">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-sky-400" />
            </div>
            <div className="flex items-center gap-1 py-3">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800/60 pt-4">
        {messages.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {suggestions.slice(0, 3).map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 bg-slate-800/40 border border-slate-700/40 rounded-lg text-[11px] text-slate-500 hover:text-slate-300 transition-all whitespace-nowrap shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your documents..."
            className="w-full bg-[#0a0f1a] border border-slate-800/60 rounded-xl pl-4 pr-12 py-3 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30"
          >
            <Send size={16} className="text-slate-400" />
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-600 mt-2">
          Responses are generated from your document data. This prototype uses deterministic responses.
        </p>
      </div>
    </div>
  );
}
