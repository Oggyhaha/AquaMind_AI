import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { ShieldCheck, Lock, Mail, ArrowRight, UserPlus, LogIn, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
            🌊
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">AquaMind <span className="text-cyan-400">AI</span></h1>
            <p className="text-[11px] text-slate-400 font-medium">Government of Gujarat Water Intelligence OS</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-semibold text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>5-Layer Enterprise RBAC Security</span>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto my-8 grid lg:grid-cols-12 gap-8 items-center z-10">
        
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Maverick Effect AI Challenge • Gujarat</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight">
            Autonomous Water Intelligence & Command Portal
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Authorized access portal for Gujarat Water Resources Department officials, district officers, field engineers, and emergency coordinators.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">33 Districts Covered</span>
              <span className="text-slate-400">Real-time MLD telemetry & reservoir monitoring</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">Digital Approval Chain</span>
              <span className="text-slate-400">Audit stamps & executive signature verification</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                authMode === 'signin' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                authMode === 'signup' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up New Account</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-2xl text-red-200 text-xs font-bold">
              ⚠️ {errorMessage}
            </div>
          )}

          {authMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-extrabold block mb-1.5">Government Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. state@aquamind.ai or district@aquamind.ai"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-extrabold block mb-1.5">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (Demo password: Demo@123)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2"
              >
                <span>Sign In & Authenticate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-extrabold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-extrabold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. rajesh@gujarat.gov.in"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-extrabold block mb-1">Department Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="state_authority">🏛️ State Authority</option>
                    <option value="district_officer">🏙️ District Officer</option>
                    <option value="engineer">🔧 Lead Engineer</option>
                    <option value="emergency_officer">🚨 Emergency Officer</option>
                    <option value="researcher">📊 Researcher</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-extrabold block mb-1">Target District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Ahmedabad"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-extrabold block mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set account password"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
              >
                <span>Create Account & Sign In</span>
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
              <span>Quick Demo Accounts:</span>
              <span className="text-sky-400">Password: Demo@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                  className="p-2.5 bg-slate-950 hover:bg-sky-950 border border-slate-800 hover:border-sky-700 rounded-xl text-slate-300 hover:text-white text-[11px] font-bold text-left transition-all"
                >
                  <div>{demo.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{demo.email}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      <div className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs text-slate-500 z-10 border-t border-slate-900 pt-4">
        <span>© 2026 Water Resources Department, Government of Gujarat</span>
        <span>Maverick Effect AI Challenge Project</span>
      </div>

    </div>
  );
};
