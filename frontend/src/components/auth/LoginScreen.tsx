import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserPlus,
  LogIn,
  Sparkles,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  Waves,
  Wrench,
  Crown,
  BarChart3,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';

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

  const { isDark: isDarkMode, toggleTheme } = useTheme();

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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0a0f1a] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative overflow-hidden font-sans select-none">

      {/* Background Radial Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Floating Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200 text-xs font-bold"
      >
        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
        <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* LEFT HALF: Full-Height Enterprise Hero Showcase */}
      <div className="lg:w-7/12 p-6 sm:p-8 lg:p-16 flex flex-col justify-between relative z-10 space-y-8 bg-white dark:bg-gradient-to-br dark:from-[#0a0f1a] dark:via-[#0c1424] dark:to-sky-950/30 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-900">

        {/* Brand Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pr-0 sm:pr-32">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-500 dark:to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 dark:shadow-sky-500/20 shrink-0 ring-1 ring-white/20">
              <Waves className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">AquaMind <span className="text-sky-600 dark:text-cyan-400">AI</span></h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Government of Gujarat Water Resources Department</p>
            </div>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-cyan-950/60 border border-sky-200 dark:border-cyan-800/50 text-sky-700 dark:text-cyan-300 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Official Government Operations Command Center</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Autonomous Water Intelligence &amp; Closed-Loop Operations OS
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Bridging predictive AI analytics with verified government field execution across all 33 Gujarat districts, reservoirs, and trunk pipelines.
          </p>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-semibold">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center space-x-2 text-sky-600 dark:text-cyan-400 font-extrabold text-sm">
                <MapPin className="w-4 h-4" />
                <span>33 Districts Covered</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Real-time MLD telemetry, groundwater depth &amp; drawdown curves</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digital Approval Chain</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Executive digital signatures &amp; audit-stamped rationale logs</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-extrabold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>4-Agent LangGraph Engine</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Groq Llama 3 70B &amp; OpenAI policy synthesis for RAG search</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 hover:border-red-300 dark:hover:border-red-800 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-extrabold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Statewide Emergency Grid</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Secretary emergency dispatch &amp; District Officer takeover flow</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-900 pt-4 flex flex-col sm:flex-row justify-between gap-1">
          <span>© 2026 Water Resources Department, Government of Gujarat</span>
          <span className="font-semibold text-slate-400 dark:text-slate-600">Security Level 5 RBAC</span>
        </div>
      </div>

      {/* RIGHT HALF: Full-Height Interactive Sign In / Sign Up Panel */}
      <div className="lg:w-5/12 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative z-10 bg-white dark:bg-slate-950/60 dark:backdrop-blur-2xl">

        <div className="max-w-md w-full mx-auto space-y-6">

          {/* Header */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Government Access Workstation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">Select Sign In or Sign Up to access your assigned role workspace</p>
          </div>

          {/* Auth Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
              className={`flex-1 py-3 rounded-lg text-xs font-extrabold flex items-center justify-center space-x-2 transition-all duration-200 ${
                authMode === 'signin' ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-3 rounded-lg text-xs font-extrabold flex items-center justify-center space-x-2 transition-all duration-200 ${
                authMode === 'signup' ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up New Account</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 rounded-xl text-red-700 dark:text-red-200 text-xs font-bold animate-in fade-in shadow-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-200 font-extrabold block mb-1.5">Government Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. state@aquamind.ai or district@aquamind.ai"
                    className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-200 font-extrabold block mb-1.5">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (Demo password: Demo@123)"
                    className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-black text-xs rounded-xl shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/30 flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.99]"
              >
                <span>Sign In &amp; Authenticate Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-200 font-extrabold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-200 font-extrabold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. rajesh@gujarat.gov.in"
                  className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-200 font-extrabold block mb-1">Department Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 dark:focus:border-sky-500 transition-colors cursor-pointer"
                  >
                    <option value="state_authority">State Authority</option>
                    <option value="district_officer">District Officer</option>
                    <option value="engineer">Lead Engineer</option>
                    <option value="emergency_officer">Emergency Officer</option>
                    <option value="researcher">Researcher</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-200 font-extrabold block mb-1">Target District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Ahmedabad"
                    className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-200 font-extrabold block mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set account password"
                  className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.99]"
              >
                <span>Create Account &amp; Authenticate</span>
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Accounts Selector */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>Quick Demo Accounts:</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md">Password: Demo@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { role: 'state_authority' as UserRole, label: 'State Sec.', email: 'state@aquamind.ai', icon: Building2 },
                { role: 'district_officer' as UserRole, label: 'District Off.', email: 'district@aquamind.ai', icon: MapPin },
                { role: 'engineer' as UserRole, label: 'Lead Eng.', email: 'engineer@aquamind.ai', icon: Wrench },
                { role: 'emergency_officer' as UserRole, label: 'Emergency Off.', email: 'emergency@aquamind.ai', icon: ShieldAlert },
                { role: 'super_admin' as UserRole, label: 'Admin', email: 'admin@aquamind.ai', icon: Crown },
                { role: 'researcher' as UserRole, label: 'Researcher', email: 'research@aquamind.ai', icon: BarChart3 }
              ].map(demo => {
                const DemoIcon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleQuickDemoLogin(demo.role)}
                    className="p-3 bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold text-left transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <DemoIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="truncate">{demo.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate mt-0.5">{demo.email}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};