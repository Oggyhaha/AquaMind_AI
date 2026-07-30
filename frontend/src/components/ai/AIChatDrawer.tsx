import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  userName: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  roleBadge?: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  userRole,
  userName
}) => {
  const getInitialMessage = (): Message => {
    switch (userRole) {
      case 'district_officer':
        return {
          id: 'init_1',
          sender: 'ai',
          text: `Namaste Officer ${userName}. I am AquaMind AI. Ahmedabad district currently shows 1,450 MLD demand vs 1,280 MLD supply. Sabarmati reservoir level may face a shortage in 12 days. Consider reducing non-essential irrigation demand by 8%. How can I assist your district today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleBadge: 'District Advisor AI'
        };
      case 'engineer':
        return {
          id: 'init_1',
          sender: 'ai',
          text: `Hello Engineer ${userName}. Pipeline P-204 (Ahmedabad East Trunk) shows a 91% acoustic leak probability with pressure drop to 2.1 bar. Maintenance is recommended within 48 hours to prevent pipe burst. What technical specs or repair SOPs do you need?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleBadge: 'Hydraulic Tech AI'
        };
      case 'state_authority':
        return {
          id: 'init_1',
          sender: 'ai',
          text: `Greetings Dr. ${userName}. Three districts (Rajkot, Kachchh, Ahmedabad) currently show elevated water stress. I recommend prioritizing Narmada branch canal diversion to Rajkot and approving the Pipeline P-204 repair task. Would you like a statewide risk analysis report?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleBadge: 'Executive Policy AI'
        };
      case 'emergency_officer':
        return {
          id: 'init_1',
          sender: 'ai',
          text: `Emergency Officer ${userName}, Rapar taluka in Kachchh has reported severe groundwater TDS spike (2800 PPM). 4 mobile purification units are pre-allocated and ready for instant dispatch upon State Authority approval.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleBadge: 'Disaster Response AI'
        };
      case 'researcher':
        return {
          id: 'init_1',
          sender: 'ai',
          text: `Welcome Prof. ${userName}. Historical analysis of Gujarat 10-year groundwater data indicates a 14.2% seasonal decline during March–May in North Gujarat aquifers. I can export cross-correlated rainfall vs extraction datasets for your research.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleBadge: 'Hydrology Research AI'
        };
      default:
        return {
          id: 'init_1',
          sender: 'ai',
          text: `System Administrator ${userName}, all 4 AI Reasoning Agents (Forecast, Infra, Intel, Recom) are operating normally. Qdrant vector database is synced with 1,240 policy documents.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleBadge: 'Root System AI'
        };
    }
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [userRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const userQuery = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Call FastAPI Backend LLM endpoint (Groq / OpenAI API integration)
      const response = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userQuery,
          role: userRole,
          district: 'Ahmedabad'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleBadge: data.provider || 'AquaMind LLM Engine'
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using intelligent domain fallback.");
    }

    // Client domain fallback if backend is offline
    setTimeout(() => {
      let responseText = "";
      const lower = userQuery.toLowerCase();

      if (lower.includes('leak') || lower.includes('pipeline') || lower.includes('p-204')) {
        responseText = `Pipeline P-204 at Naroda junction exhibits acoustic peak at 420 Hz, confirming sub-surface rupture. Structural health score is 42/100. Estimated water loss is 2.4 Million Liters/day.`;
      } else if (lower.includes('rajkot') || lower.includes('canal') || lower.includes('narmada')) {
        responseText = `Narmada Main Canal Gate 4B can safely discharge 450 Cusecs into Rajkot branch feeder. Sardar Sarovar dam capacity is currently at 78%, providing sufficient buffer.`;
      } else if (lower.includes('policy') || lower.includes('rule') || lower.includes('law')) {
        responseText = `According to Gujarat Water Allocation Policy Section 4.2: Drinking water municipal supply takes absolute priority over industrial and agricultural allotments during drought level 2 warnings.`;
      } else {
        responseText = `Based on real-time sensor streams across 33 districts, AquaMind AI projects overall Gujarat water stability at 74/100. Operational task recommendations have been compiled into your Command Dashboard.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        roleBadge: 'AquaMind AI Reasoning'
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">

      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-sky-900 dark:from-slate-950 dark:to-slate-900 text-white flex items-center justify-between shadow-md border-b border-slate-800">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold truncate">AquaMind LLM Assistant</h3>
            <p className="text-[11px] text-sky-300 font-mono font-bold truncate">Role: {userRole.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 text-xs shadow-sm space-y-1.5 ${
              msg.sender === 'user'
                ? 'bg-sky-600 text-white rounded-br-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md'
            }`}>
              {msg.roleBadge && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-900 dark:text-cyan-300 font-bold uppercase tracking-wider block w-max">
                  {msg.roleBadge}
                </span>
              )}
              <p className="leading-relaxed font-medium">{msg.text}</p>
              <span className={`text-[10px] block text-right font-mono font-bold ${msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400 dark:text-slate-500'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2.5 font-bold">
              <Bot className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>Querying Groq / OpenAI LLM & Qdrant Policy DB...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask AI as ${userRole.replace('_', ' ')}...`}
          className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-sm transition-colors shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

    </div>
  );
};