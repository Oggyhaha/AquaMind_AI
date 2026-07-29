import React, { useState } from 'react';
import { User, UserRole, SystemNotification } from '../../types';
import { ShieldAlert, Bell, Radio, LogOut, AlertTriangle, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';

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
  const unreadCount = notifications.filter(n => !n.read).length;
  const isSecretary = activeUser.role === 'state_authority' || activeUser.role === 'super_admin';

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
      isEmergencyMode 
        ? 'bg-red-950 border-red-800 text-white shadow-lg shadow-red-950/30' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      
      {/* Global Emergency Alert Banner when Emergency Mode is Active */}
      {isEmergencyMode && emergencyDetails && (
        <div className="bg-red-600 text-white px-6 py-2 text-xs font-extrabold flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>STATEWIDE EMERGENCY CRISIS: <strong>{emergencyDetails.title}</strong> ({emergencyDetails.district} Zone) — "{emergencyDetails.description}"</span>
          </div>
          <div className="text-[11px] font-mono">
            {emergencyDetails.isTakenOver ? (
              <span className="bg-emerald-800 px-2.5 py-0.5 rounded text-emerald-100 font-bold">
                ✓ Taken Over by {emergencyDetails.takenOverBy}
              </span>
            ) : (
              <span className="bg-red-800 px-2.5 py-0.5 rounded text-white font-bold">
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

        {/* Center Controls: Live Telemetry & Secretary-Only Emergency Trigger */}
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

          {/* Emergency Trigger Button Logic (Secretary Only!) */}
          {isSecretary ? (
            isEmergencyMode ? (
              <button
                onClick={onDeactivateEmergencyClick}
                disabled={!emergencyDetails?.isTakenOver}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
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
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>+ Declare Statewide Emergency</span>
              </button>
            )
          ) : (
            <div className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 border ${
              isEmergencyMode ? 'bg-red-600 text-white border-red-700 animate-bounce' : 'bg-slate-100 text-slate-500 border-slate-200'
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
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-900 text-xs font-extrabold transition-all"
            title="Open Inter-Department Command Chat"
          >
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span>Inter-Dept Chat</span>
          </button>

          {/* Notifications Dropdown */}
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

          {/* User Profile Badge & Sign Out */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
            <img src={activeUser.avatar} alt={activeUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-sky-500 shadow-xs" />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-extrabold text-slate-900">{activeUser.name}</div>
              <div className="text-[11px] text-slate-500 font-medium">{activeUser.roleTitle}</div>
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
