import React, { useState, useRef, useEffect } from 'react';
import { User, SystemNotification } from '../../types';
import { ShieldAlert, Bell, Radio, LogOut, AlertTriangle, Sparkles, MessageSquare, CheckCircle2, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  activeUser: User;
  onLogout: () => void;
  isEmergencyMode: boolean;
  emergencyDetails: { title: string; description: string; district: string; isTakenOver: boolean; takenOverBy?: string } | null;
  onTriggerEmergencyClick: () => void;
  onDeactivateEmergencyClick: () => void;
  isLiveSimulating: boolean;
  onToggleLiveSimulation: () => void;
  notifications: SystemNotification[];
  onMarkNotificationRead: (id: string) => void;
  onToggleChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeUser,
  onLogout,
  isEmergencyMode,
  emergencyDetails,
  onTriggerEmergencyClick,
  onDeactivateEmergencyClick,
  isLiveSimulating,
  onToggleLiveSimulation,
  notifications,
  onMarkNotificationRead,
  onToggleChat
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;
  const isSecretary = activeUser.role === 'state_authority' || activeUser.role === 'super_admin';

  const { isDark: isDarkMode, toggleTheme } = useTheme();
  

  // Dismiss notification popup on click outside anywhere on the screen!
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
      isEmergencyMode
        ? 'bg-red-950 border-red-800 text-white shadow-lg shadow-red-950/30'
        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-none'
    }`}>

      {/* Global Emergency Alert Banner when Emergency Mode is Active */}
      {isEmergencyMode && emergencyDetails && (
        <div className="bg-red-600 text-white px-6 py-2.5 text-xs font-extrabold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-white shrink-0" />
            <span>STATEWIDE EMERGENCY CRISIS: <strong>{emergencyDetails.title}</strong> ({emergencyDetails.district} Zone) — "{emergencyDetails.description}"</span>
          </div>
          <div className="text-[11px] font-mono shrink-0 sm:ml-4">
            {emergencyDetails.isTakenOver ? (
              <span className="bg-emerald-800 px-3 py-1 rounded text-emerald-100 font-bold">
                ✓ Taken Over by {emergencyDetails.takenOverBy}
              </span>
            ) : (
              <span className="bg-red-800 px-3 py-1 rounded text-white font-bold">
                Awaiting District Officer Takeover
              </span>
            )}
          </div>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">

        {/* Left Brand */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-105 ${
              isEmergencyMode ? 'ring-2 ring-red-500 animate-pulse' : 'ring-2 ring-cyan-400/40'
            }`}>
              <img src="/logo.jpg" alt="AquaMind AI" className="w-full h-full object-cover" />
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
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-sky-600 to-blue-800 dark:from-cyan-400 dark:to-sky-500 bg-clip-text text-transparent">
                AquaMind <span className="text-cyan-500 font-black">AI</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Enterprise OS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Autonomous Water Intelligence Command OS • Govt of Gujarat</p>
          </div>
        </div>

        {/* Center Controls: Live Telemetry & Secretary Emergency Trigger */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={onToggleLiveSimulation}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
              isLiveSimulating
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Radio className={`w-4 h-4 ${isLiveSimulating ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : 'text-slate-400 dark:text-slate-500'}`} />
            <span>Telemetry: <span className="font-mono font-extrabold">{isLiveSimulating ? 'LIVE 100Hz' : 'PAUSED'}</span></span>
          </button>

          {isSecretary ? (
            isEmergencyMode ? (
              <button
                onClick={onDeactivateEmergencyClick}
                disabled={!emergencyDetails?.isTakenOver}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs ${
                  emergencyDetails?.isTakenOver
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md'
                    : 'bg-red-800 text-red-200 cursor-not-allowed border border-red-700'
                }`}
                title={emergencyDetails?.isTakenOver ? "Deactivate Emergency Mode" : "District Officer takeover required before deactivation"}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {emergencyDetails?.isTakenOver
                    ? 'Deactivate & Close Emergency'
                    : 'Emergency Active (Waiting for District Takeover)'}
                </span>
              </button>
            ) : (
              <button
                onClick={onTriggerEmergencyClick}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 transition-all duration-200"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>+ Declare Statewide Emergency</span>
              </button>
            )
          ) : (
            <div className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 border ${
              isEmergencyMode ? 'bg-red-600 text-white border-red-700 animate-bounce' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}>
              <ShieldAlert className="w-4 h-4" />
              <span>{isEmergencyMode ? '🚨 EMERGENCY MODE ACTIVE' : 'Emergency Grid Normal'}</span>
            </div>
          )}
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center space-x-4">

          {/* Inter-Department Chat Button */}
          <button
            onClick={onToggleChat}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-900 dark:text-sky-300 text-xs font-extrabold transition-all duration-200"
            title="Open Inter-Department Command Chat"
          >
            <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Inter-Dept Chat</span>
          </button>

          {/* Notifications Dropdown (With Click-Outside Dismiss & Spacious UI) */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors relative"
              title="System Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-[420px] max-w-[90vw] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none dark:ring-1 dark:ring-slate-800 border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Live System Alerts ({notifications.length})</h4>
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer space-y-1.5 ${
                        !notif.read
                          ? 'bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-2.5">
                          {notif.priority === 'critical' ? (
                            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">{notif.title}</p>
                            <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">{notif.message}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0 font-semibold">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-sky-600" />}
          </button>

          {/* User Profile Badge & Sign Out */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <img src={activeUser.avatar} alt={activeUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-sky-500 shadow-xs" />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">{activeUser.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{activeUser.roleTitle}</div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
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