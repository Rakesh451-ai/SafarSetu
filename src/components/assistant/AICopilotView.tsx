import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AIMessage } from '../../types';
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AICopilotView: React.FC = () => {
  const { setSelectedDestinationId, setCurrentPage } = useApp();

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: "Namaste! 🙏 I am **SafarSetu AI**, your personal travel assistant for India.\n\nI can help you plan safe itineraries, recommend verified monuments, find transport options, and check real-time crowd schedules.\n\nHow can I help you today?",
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: '📅 Plan my trip', query: 'Plan a 2-day safe trip to Jaipur.' },
    { label: '📍 Places near me', query: 'What are the top verified places to visit in Agra?' },
    { label: '🛡️ Safe route', query: 'What is the safest travel route from Delhi to Jaipur?' },
    { label: '💰 Budget travel', query: 'What are budget-friendly tips for visiting the Taj Mahal?' },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simple, helpful assistant responses
    setTimeout(() => {
      let reply: string;
      let card: any = null;

      const lower = text.toLowerCase();

      if (lower.includes('jaipur') || lower.includes('plan')) {
        reply = "Here is a simple **2-Day Jaipur Itinerary**:\n\n• **Day 1**: Amber Fort (Morning) ➔ City Palace (Afternoon) ➔ Hawa Mahal (Sunset)\n• **Day 2**: Nahargarh Fort ➔ Jantar Mantar ➔ Local Crafts Market\n\nAll routes are in verified green safe zones.";
        card = {
          title: 'Amber Fort & Palace',
          subtitle: 'Jaipur, Rajasthan • Open 08:00 AM - 06:00 PM',
          destId: 'amber-fort',
        };
      } else if (lower.includes('agra') || lower.includes('places') || lower.includes('near')) {
        reply = "In **Agra**, the top verified destinations are:\n\n1. **Taj Mahal** (East & West Gates)\n2. **Agra Fort** (2.5 km away)\n3. **Mehtab Bagh** (Sunset viewpoint across the Yamuna River)\n\nAll locations have active tourist police assistance booths.";
        card = {
          title: 'Taj Mahal',
          subtitle: 'Agra, Uttar Pradesh • 🟢 Safe Zone',
          destId: 'taj-mahal',
        };
      } else if (lower.includes('safe') || lower.includes('route')) {
        reply = "The safest and fastest route from **Delhi to Jaipur** is via the **Delhi-Mumbai Expressway (NE4)** by car/cab (approx. 3.5 hours) or via the **Vande Bharat Express** train (approx. 3 hours 15 mins).";
      } else if (lower.includes('budget')) {
        reply = "💡 **Budget Tips for Taj Mahal**:\n\n• Entry ticket for Indian nationals is ₹50 (ASI standard).\n• Use government battery electric shuttles (₹10) from the parking lot to the monument gate.\n• Early morning (06:30 AM) offers the lowest crowd levels and best photography lighting.";
      } else {
        reply = `Here is helpful guidance for "${text}":\n\nAll destinations on SafarSetu are verified by tourism authorities. Let me know if you would like route directions, timings, or safety details.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: reply,
          cards: card ? [card] : undefined,
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col safar-card overflow-hidden my-4">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#172033] flex items-center gap-2">
            <span>SafarSetu AI</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Online
            </span>
          </h1>
          <p className="text-xs text-slate-500">Your personal travel assistant.</p>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'reset',
                sender: 'assistant',
                timestamp: 'Just now',
                text: "Chat cleared. What journey shall we plan next?",
              }
            ]);
          }}
          className="text-xs text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50"
          title="Clear chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                isUser ? 'bg-[#12355B] text-white' : 'bg-[#168A72] text-white'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-lg space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#12355B] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-subtle'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Structured recommendation card */}
                {msg.cards && msg.cards.map((c: any, ci: number) => (
                  <div key={ci} className="safar-card p-3 space-y-2 bg-white text-xs">
                    <h4 className="font-bold text-[#172033]">{c.title}</h4>
                    <p className="text-slate-500">{c.subtitle}</p>
                    {c.destId && (
                      <button
                        onClick={() => {
                          setSelectedDestinationId(c.destId);
                          setCurrentPage('destination');
                        }}
                        className="text-xs font-semibold text-[#12355B] hover:underline flex items-center gap-1"
                      >
                        View Guide <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#168A72] animate-pulse" />
            <span>SafarSetu AI is thinking...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 4 Quick Prompts */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.query)}
            className="px-3 py-1 rounded-lg text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a travel question (e.g. Where should I go in Jaipur?)..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#12355B]"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="p-2.5 rounded-xl bg-[#12355B] hover:bg-[#0E2845] disabled:opacity-50 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
