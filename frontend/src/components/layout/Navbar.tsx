import React, { useState } from 'react';
import { User, UserRole, SystemNotification } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { ShieldAlert, Bell, Sparkles, ChevronDown, Radio, UserCheck, CheckCircle2, LogOut, FileText, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  activeUser: User;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  isEmergencyMode: boolean;
  onToggleEmergencyMode: () => void;
  isLiveSimulating: boolean;
  onToggleLiveSimulation: () => void;
  notifications: SystemNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeUser,
  onSwitchRole,
  onLogout,
  isEmergencyMode,
  onToggleEmergencyMode,
  isLiveSimulating,
  onToggleLiveSimulation,
  notifications,
  onMarkNotificationRead
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
      isEmergencyMode 
        ? 'bg-red-950 border-red-800 text-white shadow-lg shadow-red-950/30' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left Brand */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-md transition-transform hover:scale-105 ${
              isEmergencyMode 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-700 text-white'
            }`}>
              🌊
            </div>
            {isLiveSimulating && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
                AquaMind <span className="text-cyan-500 font-black">AI</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800 border border-sky-200">
                Enterprise OS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Autonomous Water Intelligence Command OS • Govt of Gujarat</p>
          </div>
        </div>

        {/* Center Telemetry & Emergency Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={onToggleLiveSimulation}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              isLiveSimulating
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Radio className={`w-4 h-4 ${isLiveSimulating ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
            <span>Telemetry: <span className="font-mono font-extrabold">{isLiveSimulating ? 'LIVE 100Hz' : 'PAUSED'}</span></span>
          </button>

          <button
            onClick={onToggleEmergencyMode}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isEmergencyMode
                ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isEmergencyMode ? 'EMERGENCY MODE ACTIVE' : 'Trigger Emergency Mode'}</span>
          </button>
        </div>

        {/* Right Menu & Profile */}
        <div className="flex items-center space-x-4">
          
          {/* Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-50 border border-sky-200 hover:border-sky-300 text-sky-900 text-xs font-bold shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Role: <strong className="text-blue-900">{activeUser.roleTitle}</strong></span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Switch Role (Jury Quick Select)</span>
                  <UserCheck className="w-4 h-4 text-sky-500" />
                </div>
                {Object.values(DEMO_USERS).map((user) => (
                  <button
                    key={user.role}
                    onClick={() => {
                      onSwitchRole(user.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors ${
                      activeUser.role === user.role ? 'bg-sky-100/70 font-bold text-sky-900 border-l-4 border-sky-600' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold">{user.roleTitle}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    {activeUser.role === user.role && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live System Alerts ({notifications.length})</h4>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-sky-50/50 font-semibold' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5">
                        {notif.priority === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{notif.title}</p>
                          <p className="text-slate-500 text-xs mt-1">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
            <img src={activeUser.avatar} alt={activeUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-sky-500 shadow-xs" />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-extrabold text-slate-900">{activeUser.name}</div>
              <div className="text-[11px] text-slate-500 font-medium">{activeUser.department}</div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out of AquaMind OS"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
