import React, { useState, useRef, useEffect } from 'react';
import { User, SystemNotification } from '../../types';
import { ShieldAlert, Bell, Radio, LogOut, Sparkles, MessageSquare, X, Sun, Moon, Menu } from 'lucide-react';
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
  onToggleMobileMenu?: () => void;
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
  onToggleChat,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;
  const isSecretary = activeUser.role === 'state_authority' || activeUser.role === 'super_admin';

  const { isDark: isDarkMode, toggleTheme } = useTheme();

  // Dismiss notification popup on click outside anywhere on the screen
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
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="truncate">
              <strong>🚨 STATEWIDE EMERGENCY:</strong> {emergencyDetails.title} ({emergencyDetails.district} District)
            </span>
          </div>
          <div className="text-[11px] shrink-0">
            {emergencyDetails.isTakenOver ? (
              <span className="bg-emerald-800 px-2.5 py-0.5 rounded text-white font-extrabold">
                ✓ Taken Over by {emergencyDetails.takenOverBy}
              </span>
            ) : (
              <span className="bg-red-800 px-2.5 py-0.5 rounded text-white font-extrabold">
                Awaiting Takeover
              </span>
            )}
          </div>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

        {/* Left Brand Area */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          
          {/* Mobile Navigation Menu Toggle Button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative shrink-0">
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-105 ${
              isEmergencyMode ? 'ring-2 ring-red-500 animate-pulse' : 'ring-2 ring-cyan-400/40'
            }`}>
              <img src="/logo.jpg" alt="AquaMind AI" className="w-full h-full object-cover" />
            </div>
            {isLiveSimulating && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-sky-600 to-blue-800 dark:from-cyan-400 dark:to-sky-500 bg-clip-text text-transparent truncate">
                AquaMind <span className="text-cyan-500 font-black">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Enterprise OS
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              Autonomous Water Intelligence Command OS • Govt of Gujarat
            </p>
          </div>
        </div>

        {/* Center Desktop Controls (Live Telemetry & Emergency Button) */}
        <div className="hidden lg:flex items-center space-x-3">
          <button
            onClick={onToggleLiveSimulation}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
              isLiveSimulating
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveSimulating ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span>Telemetry: <span className="font-mono font-extrabold">{isLiveSimulating ? 'LIVE 100Hz' : 'PAUSED'}</span></span>
          </button>

          {isSecretary ? (
            isEmergencyMode ? (
              <button
                onClick={onDeactivateEmergencyClick}
                disabled={!emergencyDetails?.isTakenOver}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs ${
                  emergencyDetails?.isTakenOver
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md'
                    : 'bg-red-800 text-red-200 cursor-not-allowed border border-red-700'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{emergencyDetails?.isTakenOver ? 'Deactivate Emergency' : 'Awaiting Takeover'}</span>
              </button>
            ) : (
              <button
                onClick={onTriggerEmergencyClick}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-200"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>+ Declare Emergency</span>
              </button>
            )
          ) : (
            <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 border ${
              isEmergencyMode ? 'bg-red-600 text-white border-red-700 animate-bounce' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isEmergencyMode ? 'EMERGENCY ACTIVE' : 'Grid Normal'}</span>
            </div>
          )}
        </div>

        {/* Right Desktop Controls (Chat, Theme, Notifications, Profile) */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Inter-Dept Chat Button (Hidden on tiny mobile) */}
          <button
            onClick={onToggleChat}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-900 dark:text-sky-300 text-xs font-extrabold transition-all duration-200"
            title="Open Command Chat"
          >
            <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden md:inline">Inter-Dept Chat</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="System Alerts"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 max-w-[92vw] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Live System Alerts ({notifications.length})</h4>
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 font-medium">No alerts currently logged.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-sky-50/50 dark:bg-sky-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h5 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">{notif.title}</h5>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-medium">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal font-medium">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />}
          </button>

          {/* Active User Avatar & Role */}
          <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <img src={activeUser.avatar} alt={activeUser.name} className="w-8 h-8 rounded-xl object-cover ring-2 ring-sky-500/30 shrink-0" />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[120px]">{activeUser.name}</div>
              <div className="text-[10px] text-slate-400 font-bold truncate max-w-[120px]">{activeUser.roleTitle}</div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Quick Action Drawer Toggle (Visible on lg:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Mobile Actions"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
          </button>
        </div>
      </div>

      {/* Mobile Top Menu Overlay when Mobile Actions icon is clicked */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span>Quick Controls</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleLiveSimulation}
              className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center space-x-2 ${
                isLiveSimulating
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                  : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isLiveSimulating ? 'Live 100Hz' : 'Telemetry Paused'}</span>
            </button>

            <button
              onClick={onToggleChat}
              className="p-2.5 rounded-xl text-xs font-extrabold bg-sky-600 text-white flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inter-Dept Chat</span>
            </button>
          </div>

          {isSecretary && (
            <button
              onClick={isEmergencyMode ? onDeactivateEmergencyClick : onTriggerEmergencyClick}
              className={`w-full p-2.5 rounded-xl text-xs font-extrabold text-white flex items-center justify-center space-x-2 ${
                isEmergencyMode ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isEmergencyMode ? 'Deactivate Emergency' : 'Declare Statewide Emergency'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};