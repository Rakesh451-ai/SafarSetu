import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AIMessage } from '../../types';
import {
  Bot,
  Send,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  CalendarDays,
  IndianRupee,
  Compass,
  ArrowRight,
  Plus,
  RefreshCw,
  User,
  Zap
} from 'lucide-react';

export const AICopilotView: React.FC = () => {
  const { setCurrentPage, setSelectedDestinationId, showToast, setItinerary } = useApp();
  
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: "Namaste Aarav! 🙏 I am your **SafarSetu AI Travel Copilot**. I can craft safety-aware itineraries, recommend certified guides, check live monument crowd levels, and assist with real-time weather and transport across India.\n\nWhere would you like to explore today?",
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: 'Plan a 2-day trip to Jaipur', query: 'Plan a 2-day trip to Jaipur with optimal travel times and safe routes.' },
    { label: 'What can I visit nearby in Agra?', query: 'What are the top verified places to visit near the Taj Mahal?' },
    { label: 'Find safe places for family', query: 'Recommend family-friendly destinations with high safety ratings and wheelchair access.' },
    { label: 'Cheapest way to reach Jaipur', query: 'What is the most cost-effective and safe transport to reach Jaipur from Delhi?' },
    { label: 'Show accessible attractions', query: 'List monuments equipped with battery cars and wheelchair ramps.' },
    { label: 'What should I avoid right now?', query: 'Are there any active crowd advisories or caution zones currently reported?' },
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

    // AI Response Simulation with realistic smart output
    setTimeout(() => {
      let aiResponse: AIMessage;

      const lower = text.toLowerCase();

      if (lower.includes('jaipur') || lower.includes('2-day') || lower.includes('plan')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: "Here is an optimized **2-Day Royal Jaipur Itinerary** designed for morning coolness, minimal traffic congestion, and verified safe transit:",
          cards: [
            {
              type: 'route',
              title: 'Day 1: Amber Fort & Pink City Royalty',
              subtitle: 'Amber Palace (09:00 AM) ➔ City Palace (12:30 PM) ➔ Hawa Mahal (03:30 PM)',
              rating: 4.9,
              cost: '₹1,450 est. per person',
              safetyLevel: 'safe',
              tags: ['RTDC Certified', 'E-Rickshaw Route', 'Audio Guide Ready'],
              actionLabel: 'Add to Itinerary',
              destinationId: 'amber-fort'
            },
            {
              type: 'route',
              title: 'Day 2: Hill Forts & Cultural Heritage',
              subtitle: 'Nahargarh Fort (08:30 AM) ➔ Jantar Mantar (11:30 AM) ➔ Chokhi Dhani (06:30 PM)',
              rating: 4.8,
              cost: '₹1,900 est. per person',
              safetyLevel: 'safe',
              tags: ['Sunset Viewpoint', 'UNESCO Site', 'Traditional Feast'],
              actionLabel: 'Add to Itinerary',
              destinationId: 'amber-fort'
            }
          ]
        };
      } else if (lower.includes('agra') || lower.includes('taj')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: "You are currently in **Agra**. Here are the top verified attractions along with real-time crowd status and safety ratings:",
          cards: [
            {
              type: 'destination',
              title: 'Taj Mahal (East & West Gates)',
              subtitle: 'Ivory-white marble mausoleum • 62% Moderate Crowd',
              rating: 4.9,
              cost: '₹50 Domestic / ₹1100 Foreign',
              safetyLevel: 'safe',
              tags: ['UNESCO', 'Tourist Police Post', 'Battery Carts'],
              actionLabel: 'View Audio Guide',
              destinationId: 'taj-mahal'
            },
            {
              type: 'destination',
              title: 'Agra Fort & Diwan-i-Am',
              subtitle: 'Red sandstone Mughal stronghold • 2.5 km from Taj Mahal',
              rating: 4.8,
              cost: '₹50 Domestic / ₹650 Foreign',
              safetyLevel: 'safe',
              tags: ['ASI Certified', 'Fast-Track Pass Ready'],
              actionLabel: 'View Details',
              destinationId: 'taj-mahal'
            }
          ]
        };
      } else if (lower.includes('avoid') || lower.includes('caution') || lower.includes('safety') || lower.includes('danger')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: "Here is your live **Safety Intelligence Briefing** for your current region:",
          cards: [
            {
              type: 'safety',
              title: '⚠️ Caution Zone: Fatehabad Road Commercial Strip',
              subtitle: 'Heavy evening rush (05:00 PM - 08:30 PM). Use Inner Ring Road bypass.',
              safetyLevel: 'caution',
              tags: ['Traffic Advisory', 'Safe Detour Active'],
              actionLabel: 'View On Map'
            },
            {
              type: 'safety',
              title: '⛔ Restricted: Yamuna North Riverbed (Unlit Sandbar)',
              subtitle: 'Entry strictly prohibited after 06:00 PM due to river currents and low lighting.',
              safetyLevel: 'danger',
              tags: ['Strict No-Go', 'Police Monitored'],
              actionLabel: 'View Safe Zone'
            }
          ]
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: `I have analyzed your query regarding "${text}". Here are verified recommendations compliant with SafarSetu tourism safety standards:`,
          cards: [
            {
              type: 'destination',
              title: 'Varanasi Sacred Riverfront & Ganga Aarti',
              subtitle: '84 historic ghats • Verified prepaid boat fleet',
              rating: 4.9,
              cost: 'Free Entry / Boat ₹200',
              safetyLevel: 'safe',
              tags: ['Spiritual Hub', 'River Police Patrol'],
              actionLabel: 'Explore Ghats',
              destinationId: 'varanasi-ghats'
            }
          ]
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1100);
  };

  const handleCardAction = (card: any) => {
    if (card.destinationId) {
      setSelectedDestinationId(card.destinationId);
      setCurrentPage('destination');
    } else if (card.actionLabel === 'Add to Itinerary') {
      setCurrentPage('itinerary');
      showToast({
        title: 'Added to Itinerary',
        message: `${card.title} added to your active trip timeline.`,
        type: 'success',
      });
    } else {
      setCurrentPage('map');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-9.5rem)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-fade-in">
      
      {/* Copilot Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-safar-saffron-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-safar-saffron-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
                SafarSetu AI Travel Copilot
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Online 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Safety-aware itinerary planner, certified guides & live crowd insights
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'msg-reset',
                sender: 'assistant',
                timestamp: 'Just now',
                text: "Chat cleared. What journey shall we plan next?",
              }
            ]);
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Chat History"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser
                  ? 'bg-safar-navy-900 text-white'
                  : 'bg-safar-saffron-500 text-white shadow-md shadow-safar-saffron-500/20'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble & Cards */}
              <div className={`max-w-xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-safar-navy-950 to-safar-navy-800 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Structured Cards in Assistant message */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 pt-1">
                    {msg.cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              {card.safetyLevel === 'safe' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  🟢 Safe Zone
                                </span>
                              )}
                              {card.safetyLevel === 'caution' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                  ⚠️ Caution Advisory
                                </span>
                              )}
                              {card.safetyLevel === 'danger' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                  ⛔ Restriction
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {card.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {card.subtitle}
                            </p>
                          </div>

                          {card.cost && (
                            <span className="font-bold text-xs text-safar-teal-600 dark:text-safar-teal-400 shrink-0">
                              {card.cost}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        {card.tags && (
                          <div className="flex flex-wrap gap-1.5">
                            {card.tags.map((t, ti) => (
                              <span key={ti} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                          <button
                            onClick={() => handleCardAction(card)}
                            className="px-3 py-1.5 rounded-xl bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <span>{card.actionLabel || 'Explore'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-safar-saffron-500 text-white flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-safar-saffron-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-safar-saffron-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-safar-saffron-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Quick Ask:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.query)}
            className="px-3 py-1 rounded-xl text-xs bg-white dark:bg-slate-800 hover:bg-safar-saffron-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask SafarSetu Copilot about travel plans, safety, crowd levels..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-safar-saffron-500 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-3 rounded-2xl bg-safar-saffron-500 hover:bg-safar-saffron-600 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-safar-saffron-500/30 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
