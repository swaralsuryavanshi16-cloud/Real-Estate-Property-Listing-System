import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Send, X, Sparkles, MapPin, Bed, Square, RotateCcw, Minus } from 'lucide-react';
import { sendChatMessage } from '../../api/chatbot';
import { useAuth } from '../../context/AuthContext';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const SUGGESTIONS_BY_ROLE = {
  buyer: [
    '2 BHK apartment for rent in Pune',
    'How do I make an offer on a property?',
    'How does the map location work?',
  ],
  agent: [
    'How do I list a new property?',
    'How long does admin approval take?',
    'How does document verification work?',
  ],
  admin: [
    'How do I approve a pending listing?',
    'How do I manage users?',
    'How does document verification work?',
  ],
};

function PropertyMiniCard({ p }) {
  return (
    <Link
      to={`/properties/${p.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-2.5 hover:border-primary-400 hover:shadow-sm transition-all"
    >
      <p className="text-xs font-semibold text-gray-900 truncate">{p.title}</p>
      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{p.city}</span>
        {p.bedrooms > 0 && <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{p.bedrooms}</span>}
        <span className="flex items-center gap-0.5"><Square className="w-3 h-3" />{p.area}{p.areaUnit}</span>
      </div>
      <p className="text-xs font-bold text-primary-600 mt-1">₹{p.price?.toLocaleString('en-IN')}</p>
    </Link>
  );
}

export default function ChatbotWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const suggestions = SUGGESTIONS_BY_ROLE[user?.role] || SUGGESTIONS_BY_ROLE.buyer;
  const welcomeText = `Hi! I'm the PropEstate Assistant 🤖 Ask me to find a property, or how buying, map locations, and document verification work.`;
  const [messages, setMessages] = useState([
    { role: 'bot', text: welcomeText, properties: [] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;
    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await sendChatMessage(trimmed);
      setMessages((m) => [...m, { role: 'bot', text: data.data.text, properties: data.data.properties }]);
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: "Sorry, I couldn't reach the assistant service. Please try again in a moment.", properties: [] }]);
    }
    setLoading(false);
  };

  const resetChat = () => {
    setMessages([{ role: 'bot', text: welcomeText, properties: [] }]);
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all"
          title="Chat with PropEstate Assistant"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">PropEstate Assistant</p>
              <p className="text-[11px] text-primary-100 leading-tight">Always online • Instant answers</p>
            </div>
            <button onClick={resetChat} title="Start a new chat" className="p-1 rounded hover:bg-white/15">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/15">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${m.role === 'user' ? 'order-2' : ''}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.properties?.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {m.properties.map((p) => <PropertyMiniCard key={p.id} p={p} />)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-white border border-gray-200 rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions (shown while the conversation is still short) */}
          {messages.filter((m) => m.role === 'user').length < 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-2.5 border-t border-gray-100 flex items-center gap-2 flex-shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 input-field text-sm"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary p-2.5 rounded-full disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
