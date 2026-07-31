import React from 'react';
import { UserRole } from '../../types';
import { 
  LayoutDashboard, 
  Bot, 
  CheckSquare, 
  Map, 
  Waves, 
  Activity, 
  FileSpreadsheet, 
  History, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'ai_mission_control'
  | 'operations'
  | 'gujarat_map'
  | 'reservoirs'
  | 'pipelines'
  | 'reports'
  | 'audit_logs'
  | 'admin';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  pendingTasksCount: number;
  pendingApprovalsCount: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  pendingTasksCount,
  pendingApprovalsCount,
  mobileOpen = false,
  onCloseMobile
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'state_authority', 'district_officer', 'engineer', 'emergency_officer', 'researcher']
    },
    {
      id: 'ai_mission_control' as NavTab,
      label: 'AI Mission Control',
      icon: Bot,
      badge: '4 Agents',
      badgeColor: 'bg-cyan-500 text-white',
      roles: ['super_admin', 'state_authority', 'district_officer', 'engineer', 'emergency_officer', 'researcher']
    },
    {
      id: 'operations' as NavTab,
      label: 'Closed-Loop Operations',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Action Required` : `${pendingTasksCount} Active`,
      badgeColor: pendingApprovalsCount > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      roles: ['super_admin', 'state_authority', 'district_officer', 'engineer', 'emergency_officer']
    },
    {
      id: 'gujarat_map' as NavTab,
      label: 'Gujarat GIS Map',
      icon: Map,
      roles: ['super_admin', 'state_authority', 'district_officer', 'engineer', 'emergency_officer', 'researcher']
    },
    {
      id: 'reservoirs' as NavTab,
      label: 'Reservoirs & Dams',
      icon: Waves,
      roles: ['super_admin', 'state_authority', 'district_officer', 'engineer', 'emergency_officer', 'researcher']
    },
    {
      id: 'pipelines' as NavTab,
      label: 'Pipeline Leak Radar',
      icon: Activity,
      roles: ['super_admin', 'state_authority', 'district_officer', 'engineer', 'emergency_officer', 'researcher']
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports & Analytics',
      icon: FileSpreadsheet,
      roles: ['super_admin', 'state_authority', 'district_officer', 'engineer', 'researcher']
    },
    {
      id: 'audit_logs' as NavTab,
      label: 'Audit & Governance',
      icon: History,
      roles: ['super_admin', 'state_authority']
    },
    {
      id: 'admin' as NavTab,
      label: 'Super Admin Control',
      icon: ShieldCheck,
      badge: 'Admin Only',
      badgeColor: 'bg-purple-600 text-white',
      roles: ['super_admin']
    }
  ];

  const allowedItems = menuItems.filter(item => item.roles.includes(userRole));

  const navContent = (
    <div className="flex flex-col h-full select-none">
      {/* Role Workspace Context */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 shrink-0 transition-colors flex items-center justify-between">
        <div>
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 mb-0.5">
            Active Role Workspace
          </div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-white">
            <span className="truncate block max-w-[200px] sm:max-w-[220px]">
              {userRole === 'state_authority' ? '🏛️ Statewide Governance' : 
               userRole === 'district_officer' ? '🏙️ District Command (Ahmedabad)' :
               userRole === 'engineer' ? '🔧 Hydraulic Maintenance Unit' :
               userRole === 'emergency_officer' ? '🚨 Emergency Grid' :
               userRole === 'super_admin' ? '👑 Platform Root Admin' : '📊 Hydrology Research Lab'}
            </span>
          </div>
        </div>

        {/* Close Button for Mobile Drawer */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 sm:px-4 space-y-1.5 overflow-y-auto">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-600/30 dark:shadow-sky-600/40'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge ? (
                <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-extrabold shadow-xs shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shrink-0 transition-colors">
        <div className="rounded-2xl bg-white dark:bg-slate-800/80 p-3 sm:p-3.5 border border-blue-200 dark:border-slate-700/60 shadow-sm dark:shadow-none space-y-1">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-cyan-400 font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Multi-Agent System Active</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Monitoring Gujarat 33 districts hydrology stream 24/7.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on lg screens) */}
      <aside className="hidden lg:flex w-72 bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300 flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 select-none h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto transition-colors">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />

          {/* Drawer Container */}
          <aside className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};