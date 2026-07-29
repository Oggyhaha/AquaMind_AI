import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import { Users, Send } from 'lucide-react';
import { getStoredMessages, saveStoredMessages, stateBus } from '../../utils/storage';

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: UserRole;
  roleTitle: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface InterDeptChatProps {
  userRole: UserRole;
  userName: string;
  userAvatar: string;
}

export const InterDeptChat: React.FC<InterDeptChatProps> = ({
  userRole,
  userName,
  userAvatar
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(getStoredMessages());
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for real-time messages from other open tabs
    const handleStateMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'MESSAGES_UPDATED') {
        setMessages(e.data.messages);
      }
    };

    if (stateBus) {
      stateBus.onmessage = handleStateMessage;
    }

    return () => {
      // Cleanup listener if needed
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getRoleTitle = (r: UserRole) => {
    switch (r) {
      case 'state_authority': return 'Secretary, Water Resources';
      case 'district_officer': return 'District Water Officer';
      case 'engineer': return 'Lead Hydraulic Engineer';
      case 'emergency_officer': return 'Disaster Response Coordinator';
      case 'super_admin': return 'Super Admin';
      default: return 'Hydrology Researcher';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: userName,
      senderRole: userRole,
      roleTitle: getRoleTitle(userRole),
      avatar: userAvatar,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveStoredMessages(updated);
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Inter-Department Command Messenger</h3>
            <p className="text-xs text-cyan-300 font-medium">Real-time cross-tab operational channel between Secretary, District Officer, Engineer & Emergency Coordinator</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
          ● 4 Department Heads Connected
        </span>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg) => {
          const isSelf = msg.senderName === userName;
          return (
            <div key={msg.id} className={`flex items-start space-x-3 ${isSelf ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <img src={msg.avatar} alt={msg.senderName} className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-xs shrink-0" />
              
              <div className={`max-w-[75%] space-y-1 ${isSelf ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <span>{msg.senderName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold uppercase">{msg.roleTitle}</span>
                </div>

                <div className={`p-4 rounded-2xl text-xs font-medium shadow-xs leading-relaxed ${
                  isSelf 
                    ? 'bg-sky-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                <span className="text-[10px] font-mono text-slate-400 block">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type command message as ${userName} (${getRoleTitle(userRole)})...`}
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center space-x-2 shrink-0"
        >
          <span>Send Message</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
