import React, { useState } from 'react';
import { User, UserRole, SystemNotification } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { 
  ShieldAlert, 
  Bell, 
  Activity, 
  UserCheck, 
  Sparkles, 
  ChevronDown, 
  Radio, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface NavbarProps {
  activeUser: User;
  onSwitchRole: (role: UserRole) => void;
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
        ? 'bg-red-950 border-red-800 text-white shadow-lg shadow-red-950/20' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-md transition-transform hover:scale-105 ${
              isEmergencyMode 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 text-white'
            }`}>
              🌊
            </div>
            {isLiveSimulating && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
                AquaMind <span className="text-cyan-500 font-black">AI</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                OS v2.4 Govt Ed.
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Autonomous Water Intelligence Command Center • Govt of Gujarat
            </p>
          </div>
        </div>

        {/* Center: Live Telemetry & Emergency Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Live Telemetry Simulator Toggle */}
          <button
            onClick={onToggleLiveSimulation}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isLiveSimulating
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle Live IoT Sensor Simulation Feed"
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveSimulating ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
            <span>Telemetry Stream: <span className="font-bold">{isLiveSimulating ? 'LIVE 100Hz' : 'PAUSED'}</span></span>
          </button>

          {/* Emergency Mode Toggle */}
          <button
            onClick={onToggleEmergencyMode}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isEmergencyMode
                ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isEmergencyMode ? 'EMERGENCY MODE ACTIVE' : 'Trigger Emergency Mode'}</span>
          </button>
        </div>

        {/* Right: Demo Role Switcher, Notifications & Profile */}
        <div className="flex items-center space-x-3">
          
          {/* DEMO ROLE SWITCHER (Crucial for Hackathon Jury Demo!) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-sky-50 border border-sky-200 hover:border-sky-300 text-sky-900 text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Role: <strong className="text-blue-900">{activeUser.roleTitle}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Switch Demo Role (Jury Quick-Select)</span>
                  <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                </div>
                {Object.values(DEMO_USERS).map((user) => (
                  <button
                    key={user.role}
                    onClick={() => {
                      onSwitchRole(user.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors ${
                      activeUser.role === user.role ? 'bg-sky-100/70 font-bold text-sky-900 border-l-4 border-sky-600' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-semibold">{user.roleTitle}</div>
                        <div className="text-[10px] text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    {activeUser.role === user.role && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="System Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live System Alerts ({notifications.length})</h4>
                  <span className="text-[11px] text-sky-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-sky-50/50 font-medium' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {notif.priority === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        ) : notif.type === 'ai' ? (
                          <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 leading-tight">{notif.title}</p>
                          <p className="text-slate-500 text-[11px] mt-1 leading-normal">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-sky-500 shadow-sm"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{activeUser.name}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{activeUser.department}</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
