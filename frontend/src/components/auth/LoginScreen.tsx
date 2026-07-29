import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { ShieldCheck, Lock, Mail, ArrowRight, UserPlus, LogIn, Sparkles, Building2, MapPin, CheckCircle2, ShieldAlert, Waves } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User, token: string) => void;
}

const REGISTERED_USERS_KEY = 'aquamind_registered_users_v2';

export const getStoredRegisteredUsers = (): Record<string, User & { password?: string }> => {
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}

  const seeded: Record<string, User & { password?: string }> = {};
  Object.values(DEMO_USERS).forEach(u => {
    seeded[u.email.toLowerCase()] = {
      ...u,
      password: 'Demo@123'
    };
  });
  return seeded;
};

export const saveRegisteredUser = (newUser: User & { password?: string }) => {
  const users = getStoredRegisteredUsers();
  users[newUser.email.toLowerCase()] = newUser;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('district_officer');
  const [regDistrict, setRegDistrict] = useState('Ahmedabad');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetEmail = email.trim().toLowerCase();
    const registeredUsers = getStoredRegisteredUsers();
    const matchedUser = registeredUsers[targetEmail];

    if (!matchedUser) {
      setErrorMessage(`No account found for '${email}'. Please Sign Up or click a demo account below.`);
      return;
    }

    if (matchedUser.password && matchedUser.password !== password) {
      setErrorMessage('Incorrect password. Please enter the valid password.');
      return;
    }

    const token = `jwt_token_${matchedUser.role}_${Date.now()}`;
    onLoginSuccess(matchedUser, token);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetEmail = regEmail.trim().toLowerCase();
    const registeredUsers = getStoredRegisteredUsers();

    if (registeredUsers[targetEmail]) {
      setErrorMessage(`An account with email '${regEmail}' already exists. Please Sign In.`);
      return;
    }

    const roleTitles: Record<UserRole, string> = {
      state_authority: 'Secretary, Water Resources Dept',
      district_officer: 'District Water Officer',
      engineer: 'Lead Infrastructure Engineer',
      emergency_officer: 'Disaster Response Coordinator',
      super_admin: 'Super Administrator',
      researcher: 'Hydrology Researcher'
    };

    const newUser: User & { password?: string } = {
      id: `usr_${Date.now()}`,
      name: regName,
      email: regEmail.trim(),
      role: regRole,
      roleTitle: roleTitles[regRole],
      district: regDistrict,
      department: 'Water Resources Dept, Govt of Gujarat',
      status: 'active',
      permissions: ['read', 'write', 'approve'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      password: regPassword
    };

    saveRegisteredUser(newUser);

    const token = `jwt_token_${regRole}_${Date.now()}`;
    onLoginSuccess(newUser, token);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    const token = `jwt_token_${role}_${Date.now()}`;
    onLoginSuccess(demoUser, token);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row relative overflow-hidden font-sans select-none">
      
      {/* Background Radial Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* LEFT HALF: Full-Height Enterprise Hero Showcase */}
      <div className="lg:w-7/12 p-8 lg:p-16 flex flex-col justify-between relative z-10 space-y-8 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40 border-r border-slate-900">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-3xl shadow-xl shadow-sky-500/20">
              🌊
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">AquaMind <span className="text-cyan-400">AI</span></h1>
              <p className="text-xs text-slate-400 font-medium">Government of Gujarat Water Resources Department</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Maverick Effect AI Challenge</span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Government Operations Command Center</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Autonomous Water Intelligence & Closed-Loop Operations OS
          </h2>

          <p className="text-base text-slate-300 leading-relaxed font-medium">
            Bridging predictive AI analytics with verified government field execution across all 33 Gujarat districts, reservoirs, and trunk pipelines.
          </p>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-sm">
                <MapPin className="w-4 h-4" />
                <span>33 Districts Covered</span>
              </div>
              <p className="text-slate-400 text-xs">Real-time MLD telemetry, groundwater depth & drawdown curves</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digital Approval Chain</span>
              </div>
              <p className="text-slate-400 text-xs">Executive digital signatures & audit-stamped rationale logs</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-sky-400 font-extrabold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>4-Agent LangGraph Engine</span>
              </div>
              <p className="text-slate-400 text-xs">Groq Llama 3 70B & OpenAI policy synthesis for RAG search</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-red-400 font-extrabold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Statewide Emergency Grid</span>
              </div>
              <p className="text-slate-400 text-xs">Secretary emergency dispatch & District Officer takeover flow</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 border-t border-slate-900 pt-4 flex justify-between">
          <span>© 2026 Water Resources Department, Government of Gujarat</span>
          <span>Security Level 5 RBAC</span>
        </div>
      </div>

      {/* RIGHT HALF: Full-Height Interactive Sign In / Sign Up Panel */}
      <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center relative z-10 bg-slate-900/90 backdrop-blur-2xl">
        
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <h3 className="text-2xl font-black text-white">Government Access Workstation</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Select Sign In or Sign Up to access your assigned role workspace</p>
          </div>

          {/* Auth Tab Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                authMode === 'signin' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                authMode === 'signup' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up New Account</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 bg-red-950/90 border border-red-800 rounded-2xl text-red-200 text-xs font-bold animate-in fade-in">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* SIGN IN FORM */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-200 font-extrabold block mb-1.5">Government Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. state@aquamind.ai or district@aquamind.ai"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-200 font-extrabold block mb-1.5">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (Demo password: Demo@123)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <span>Sign In & Authenticate Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-200 font-extrabold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-200 font-extrabold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. rajesh@gujarat.gov.in"
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-200 font-extrabold block mb-1">Department Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-bold focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="state_authority">🏛️ State Authority</option>
                    <option value="district_officer">🏙️ District Officer</option>
                    <option value="engineer">🔧 Lead Engineer</option>
                    <option value="emergency_officer">🚨 Emergency Officer</option>
                    <option value="researcher">📊 Researcher</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-200 font-extrabold block mb-1">Target District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Ahmedabad"
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-200 font-extrabold block mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set account password"
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <span>Create Account & Authenticate</span>
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Jury Demo Accounts Selector */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
              <span>Quick Jury Demo Accounts:</span>
              <span className="text-sky-400 font-mono">Password: Demo@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { role: 'state_authority' as UserRole, label: '🏛️ State Sec.', email: 'state@aquamind.ai' },
                { role: 'district_officer' as UserRole, label: '🏙️ District Off.', email: 'district@aquamind.ai' },
                { role: 'engineer' as UserRole, label: '🔧 Lead Eng.', email: 'engineer@aquamind.ai' },
                { role: 'emergency_officer' as UserRole, label: '🚨 Emergency Off.', email: 'emergency@aquamind.ai' },
                { role: 'super_admin' as UserRole, label: '👑 Admin', email: 'admin@aquamind.ai' },
                { role: 'researcher' as UserRole, label: '📊 Researcher', email: 'research@aquamind.ai' }
              ].map(demo => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demo.role)}
                  className="p-3 bg-slate-950 hover:bg-sky-950/80 border border-slate-800 hover:border-sky-600 rounded-2xl text-slate-300 hover:text-white text-xs font-bold text-left transition-all"
                >
                  <div className="text-xs">{demo.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{demo.email}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
