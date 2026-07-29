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
  Sparkles
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  pendingTasksCount,
  pendingApprovalsCount
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
      badgeColor: pendingApprovalsCount > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700',
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

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-[calc(100vh-4rem)]">
      {/* Role Context Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/50">
        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
          Active Workspace
        </div>
        <div className="text-xs font-bold text-white flex items-center justify-between">
          <span className="truncate">
            {userRole === 'state_authority' ? '🏛️ Statewide Operations' : 
             userRole === 'district_officer' ? '🏙️ District Command (Ahmedabad)' :
             userRole === 'engineer' ? '🔧 Hydraulic Maintenance Unit' :
             userRole === 'emergency_officer' ? '🚨 Emergency Response Grid' :
             userRole === 'super_admin' ? '👑 Platform Root Admin' : '📊 Hydrology Research Lab'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${item.badgeColor}`}>
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-3.5 h-3.5 text-white/80" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom AI Assistant Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>AI Reasoning Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Multi-agent system monitoring Gujarat 33 districts telemetry 24/7.
          </p>
        </div>
      </div>
    </aside>
  );
};
