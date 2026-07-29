import React, { useState, useEffect } from 'react';
import { UserRole, User, District, AIRecommendation, OperationalTask, AgentState, AuditLog, SystemNotification, TaskStatus } from './types';
import { DEMO_USERS, GUJARAT_DISTRICTS, RESERVOIRS, PIPELINES, AI_RECOMMENDATIONS, INITIAL_TASKS, INITIAL_AGENTS, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS } from './data/mockData';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';

// Dashboard & Components
import { ExecutiveBrief } from './components/dashboard/ExecutiveBrief';
import { GujaratMap } from './components/dashboard/GujaratMap';
import { MultiAgentMissionControl } from './components/ai/MultiAgentMissionControl';
import { TaskBoard } from './components/operations/TaskBoard';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { AdminPanel } from './components/admin/AdminPanel';
import { ReportsView } from './components/reports/ReportsView';
import { ReservoirsView } from './components/views/ReservoirsView';
import { PipelinesView } from './components/views/PipelinesView';

import { 
  ShieldAlert, 
  Bot, 
  CheckSquare, 
  MapPin, 
  Waves, 
  Activity, 
  TrendingUp, 
  Users, 
  Award,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export function App() {
  // Active User State (Default: State Water Authority)
  const [activeUserRole, setActiveUserRole] = useState<UserRole>('state_authority');
  const activeUser: User = DEMO_USERS[activeUserRole];

  // Active Tab Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Emergency & Simulation States
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);

  // Core App Datasets
  const [districts, setDistricts] = useState<District[]>(GUJARAT_DISTRICTS);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(AI_RECOMMENDATIONS);
  const [tasks, setTasks] = useState<OperationalTask[]>(INITIAL_TASKS);
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Selection states
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(GUJARAT_DISTRICTS[0]);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  // Telemetry simulation tick effect
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Slightly fluctuate a random district supply or reservoir level
      setDistricts(prev => prev.map(d => {
        if (d.id === 'ahmedabad' || d.id === 'rajkot') {
          const delta = (Math.random() - 0.5) * 4;
          return { ...d, waterSupplyMLD: Math.max(100, Math.round(d.waterSupplyMLD + delta)) };
        }
        return d;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Handle Role Switch
  const handleSwitchRole = (role: UserRole) => {
    setActiveUserRole(role);
    // Add audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: DEMO_USERS[role].id,
      userName: DEMO_USERS[role].name,
      role: role,
      action: 'USER_ROLE_SWITCHED',
      details: `Switched demo role context to ${DEMO_USERS[role].roleTitle}`,
      ipAddress: '127.0.0.1',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Closed-loop Workflow: Approve AI Recommendation -> Generate Task
  const handleApproveRecommendation = (recId: string) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    // Update recommendation status
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'approved' } : r));

    // Create new Operational Task
    const newTask: OperationalTask = {
      id: `task_${Date.now()}`,
      recommendationId: rec.id,
      title: rec.title,
      description: rec.description,
      districtId: rec.districtId,
      districtName: rec.districtName,
      priority: rec.priority,
      status: 'approved',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date().toISOString(),
      approvedBy: `${activeUser.name} (${activeUser.roleTitle})`,
      approvedAt: new Date().toISOString(),
      waterSavedLiters: rec.estimatedWaterSavedLiters,
      populationBenefited: rec.populationBenefited,
      slaHoursRemaining: 48
    };

    setTasks(prev => [newTask, ...prev]);

    // Add Audit Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      role: activeUser.role,
      action: 'RECOMMENDATION_APPROVED',
      details: `Approved AI Recommendation #${rec.id} (${rec.title}) and generated Task #${newTask.id}`,
      ipAddress: '10.24.1.88',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Push notification
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '✅ New Task Auto-Created',
      message: `Task #${newTask.id} generated for ${rec.districtName}. Awaiting engineer assignment.`,
      type: 'task',
      priority: rec.priority,
      read: false,
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update Task Status (Assign, Complete Evidence, Verify)
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus, extraData?: any) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          ...extraData
        };
      }
      return t;
    }));

    // Add Audit Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      role: activeUser.role,
      action: `TASK_STATUS_${newStatus.toUpperCase()}`,
      details: `Updated Task #${taskId} status to ${newStatus}`,
      ipAddress: '10.24.2.14',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Calculate Summary Metrics
  const totalWaterSaved = tasks
    .filter(t => t.status === 'completed' || t.status === 'verified')
    .reduce((sum, t) => sum + (t.waterSavedLiters || 0), 6100000);

  const totalCitizensBenefited = tasks
    .filter(t => t.status === 'completed' || t.status === 'verified')
    .reduce((sum, t) => sum + (t.populationBenefited || 0), 107000);

  const pendingApprovalsCount = recommendations.filter(r => r.status === 'ai_suggested').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'verified' && t.status !== 'closed').length;

  return (
    <div className={`min-h-screen font-sans ${isEmergencyMode ? 'bg-red-950/10' : 'bg-slate-50'} text-slate-900 flex flex-col`}>
      
      {/* Top Navbar */}
      <Navbar
        activeUser={activeUser}
        onSwitchRole={handleSwitchRole}
        isEmergencyMode={isEmergencyMode}
        onToggleEmergencyMode={() => setIsEmergencyMode(!isEmergencyMode)}
        isLiveSimulating={isLiveSimulating}
        onToggleLiveSimulation={() => setIsLiveSimulating(!isLiveSimulating)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={activeUserRole}
          pendingTasksCount={pendingTasksCount}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Main Command Workspace */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-full">
          
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Morning Executive Daily Brief Banner */}
              <ExecutiveBrief
                userRole={activeUserRole}
                userName={activeUser.name}
                onNavigateOperations={() => setCurrentTab('operations')}
              />

              {/* Core KPI Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] uppercase font-extrabold tracking-wider">Water Health Index</span>
                    <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">🌊</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">74 <span className="text-xs font-semibold text-slate-400">/ 100</span></div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                    ↑ +2.4% vs last week (Moderate Stress)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] uppercase font-extrabold tracking-wider">AI Confidence Score</span>
                    <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">🤖</span>
                  </div>
                  <div className="text-2xl font-black text-sky-900">95.4%</div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    4 Agents Active (LangGraph Orchestration)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] uppercase font-extrabold tracking-wider">Verified Water Saved</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">💧</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    {(totalWaterSaved / 1000000).toFixed(1)} M <span className="text-xs font-bold text-slate-500">Liters</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Impact verified by Field Engineers
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] uppercase font-extrabold tracking-wider">Active Closed Tasks</span>
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">📋</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{tasks.length}</div>
                  <span className="text-[10px] text-amber-600 font-bold">
                    {pendingApprovalsCount} Approvals Pending
                  </span>
                </div>

              </div>

              {/* Interactive Gujarat Map */}
              <GujaratMap
                districts={districts}
                reservoirs={RESERVOIRS}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
              />

              {/* Multi-Agent Quick Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-100 text-cyan-800 font-bold">
                    <Bot className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Multi-Agent AI Reasoning Grid</h3>
                    <p className="text-xs text-slate-500">Forecast, Infrastructure, Intelligence, and Recommendation agents running continuous evaluation.</p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentTab('ai_mission_control')}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 shrink-0"
                >
                  <span>Launch AI Mission Control</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: AI MISSION CONTROL */}
          {currentTab === 'ai_mission_control' && (
            <div className="animate-in fade-in duration-200">
              <MultiAgentMissionControl
                agents={agents}
                recommendations={recommendations}
                onApproveRecommendation={handleApproveRecommendation}
              />
            </div>
          )}

          {/* TAB 3: CLOSED-LOOP OPERATIONS */}
          {currentTab === 'operations' && (
            <div className="animate-in fade-in duration-200">
              <TaskBoard
                tasks={tasks}
                userRole={activeUserRole}
                userName={activeUser.name}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />
            </div>
          )}

          {/* TAB 4: GUJARAT GIS MAP */}
          {currentTab === 'gujarat_map' && (
            <div className="animate-in fade-in duration-200">
              <GujaratMap
                districts={districts}
                reservoirs={RESERVOIRS}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
              />
            </div>
          )}

          {/* TAB 5: RESERVOIRS */}
          {currentTab === 'reservoirs' && (
            <div className="animate-in fade-in duration-200">
              <ReservoirsView />
            </div>
          )}

          {/* TAB 6: PIPELINES */}
          {currentTab === 'pipelines' && (
            <div className="animate-in fade-in duration-200">
              <PipelinesView />
            </div>
          )}

          {/* TAB 7: REPORTS */}
          {currentTab === 'reports' && (
            <div className="animate-in fade-in duration-200">
              <ReportsView />
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {currentTab === 'audit_logs' && (
            <div className="animate-in fade-in duration-200">
              <AdminPanel auditLogs={auditLogs} />
            </div>
          )}

          {/* TAB 9: SUPER ADMIN */}
          {currentTab === 'admin' && (
            <div className="animate-in fade-in duration-200">
              <AdminPanel auditLogs={auditLogs} />
            </div>
          )}

        </main>
      </div>

      {/* Floating Action Button for AI Chat Assistant */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-2xl shadow-sky-500/40 z-40 flex items-center space-x-2.5 transform hover:scale-105 active:scale-95 transition-all"
        title="Open Role-Adapted AI Assistant"
      >
        <Sparkles className="w-5 h-5 animate-spin" />
        <span className="font-extrabold text-xs">Ask AquaMind AI</span>
      </button>

      {/* Role-Adapted AI Chat Drawer */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        userRole={activeUserRole}
        userName={activeUser.name}
      />

    </div>
  );
}

export default App;
