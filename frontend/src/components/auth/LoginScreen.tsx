import React, { useState } from 'react';
import { DEMO_USERS } from '../../data/mockData';
import { User, UserRole } from '../../types';
import { ShieldCheck, Sparkles, Key, Lock, Mail, ArrowRight, CheckCircle2, Waves, Building2, UserCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('state@aquamind.ai');
  const [password, setPassword] = useState<string>('Demo@123');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      // Find matching demo user by email
      const matched = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        onLoginSuccess(matched, `jwt_token_${matched.role}_${Date.now()}`);
      } else {
        setErrorMsg('Invalid credentials. Please select one of the pre-created Demo Accounts below.');
      }
      setLoading(false);
    }, 600);
  };

  const handleQuickDemoSelect = (roleKey: string) => {
    const matched = DEMO_USERS[roleKey];
    if (matched) {
      setEmail(matched.email);
      setPassword('Demo@123');
      onLoginSuccess(matched, `jwt_token_${matched.role}_${Date.now()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Dynamic Background Mesh & Water Waves Graphic */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
            🌊
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black tracking-tight text-white">
                AquaMind <span className="text-cyan-400">AI</span>
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Govt Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Autonomous Water Intelligence Command OS</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-xs text-slate-300">
          <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Water Resources Dept, Govt of Gujarat</span>
          </span>
        </div>
      </header>

      {/* Main Login & Demo Grid */}
      <div className="max-w-6xl w-full mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: System Vision Banner */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Closed-Loop Decision Intelligence OS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Transforming Gujarat's Water Security from <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Prediction to Verified Action</span>.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            AquaMind AI combines 4 specialized autonomous agents (Forecast, Infrastructure, Policy RAG, and Recommendation) with an audited government task execution workflow.
          </p>

          {/* 5-Layer Auth Security Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-cyan-400 font-bold block">🔐 Enterprise RBAC</span>
              <span className="text-slate-400 text-[11px]">Strict role authorization & permission isolation</span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-cyan-400 font-bold block">📜 Immutable Audits</span>
              <span className="text-slate-400 text-[11px]">Digital signature approvals & maintenance proof</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Card */}
        <div className="lg:col-span-6 bg-slate-950/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white">Government Command Login</h3>
            <p className="text-xs text-slate-400 mt-1">Authenticate credentials or select a pre-seeded Demo Account</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Official Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  placeholder="name@aquamind.ai"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Account Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating Token...' : 'Authenticate & Open Command Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* HACKATHON JURY QUICK DEMO ACCOUNTS SELECTOR */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Quick Demo Accounts (Jury 1-Click Login)</span>
              <UserCheck className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { role: 'state_authority', label: '🏛️ State Authority', title: 'Statewide Secretary' },
                { role: 'district_officer', label: '🏙️ District Officer', title: 'Ahmedabad Command' },
                { role: 'engineer', label: '🔧 Lead Engineer', title: 'Hydraulic Maintenance' },
                { role: 'emergency_officer', label: '🚨 Emergency Officer', title: 'Disaster Response' },
                { role: 'super_admin', label: '👑 Super Admin', title: 'Root System Admin' },
                { role: 'researcher', label: '📊 Research User', title: 'GTU Hydrology Lab' }
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleQuickDemoSelect(item.role)}
                  className="p-2.5 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition-all group"
                >
                  <div className="font-bold text-slate-200 group-hover:text-cyan-300 text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-500">{item.title}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 z-10">
        AquaMind AI Autonomous Water Intelligence OS • Built for Maverick Effect AI Challenge 2026
      </footer>

    </div>
  );
};
