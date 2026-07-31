import React, { useState, useEffect } from 'react';
import { UserRole, User, District, AIRecommendation, OperationalTask, AgentState, AuditLog, SystemNotification, TaskStatus, Priority } from './types';
import { DEMO_USERS, GUJARAT_DISTRICTS, RESERVOIRS, PIPELINES, AI_RECOMMENDATIONS, INITIAL_AGENTS } from './data/mockData';
import { 
  getStoredTasks, saveStoredTasks, 
  getStoredEmergency, saveStoredEmergency, EmergencyState,
  getStoredAuditLogs, saveStoredAuditLogs,
  getStoredNotifs, saveStoredNotifs,
  stateBus 
} from './utils/storage';

// Auth Screen
import { LoginScreen } from './components/auth/LoginScreen';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';

// Dashboards & Views
import { ExecutiveBrief } from './components/dashboard/ExecutiveBrief';
import { GujaratMap } from './components/dashboard/GujaratMap';
import { DistrictDashboard } from './components/dashboard/DistrictDashboard';
import { EngineerDashboard } from './components/dashboard/EngineerDashboard';
import { EmergencyDashboard } from './components/dashboard/EmergencyDashboard';
import { ResearchDashboard } from './components/dashboard/ResearchDashboard';
import { MultiAgentMissionControl } from './components/ai/MultiAgentMissionControl';
import { TaskBoard } from './components/operations/TaskBoard';
import { CreateTaskModal } from './components/operations/CreateTaskModal';
import { EmergencyModal } from './components/operations/EmergencyModal';
import { InterDeptChat } from './components/chat/InterDeptChat';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { AdminPanel } from './components/admin/AdminPanel';
import { ReportsView } from './components/reports/ReportsView';
import { ReservoirsView } from './components/views/ReservoirsView';
import { PipelinesView } from './components/views/PipelinesView';
import { SplashScreen } from './components/ui/SplashScreen';
import { ToastProvider, useToast as __useToastInternal } from './components/ui/Toast';
import { AnimatedKPI } from './components/ui/AnimatedKPI';
import { PrintDashboard } from './components/ui/PrintDashboard';

import { Sparkles, PlusCircle, Droplets, Brain, Gauge, ClipboardList } from 'lucide-react';

// Toast notification helper — will be initialized after ToastProvider renders
let globalToast: { showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void } | null = null;

function ToastInitializer() {
  const toast = __useToastInternal();
  React.useEffect(() => { globalToast = toast; }, [toast]);
  return null;
}

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeUserRole, setActiveUserRole] = useState<UserRole>('state_authority');
  const [authToken, setAuthToken] = useState<string>('');
  
  const activeUser: User = DEMO_USERS[activeUserRole];
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Real Persistent State loaded from LocalStorage & Synchronized across browser tabs
  const [tasks, setTasks] = useState<OperationalTask[]>(() => getStoredTasks());
  const [emergencyDetails, setEmergencyDetails] = useState<EmergencyState | null>(() => getStoredEmergency());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStoredAuditLogs());
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => getStoredNotifs());

  const isEmergencyMode = !!emergencyDetails;

  const [districts, setDistricts] = useState<District[]>(GUJARAT_DISTRICTS);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(AI_RECOMMENDATIONS);
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(GUJARAT_DISTRICTS[0]);

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState<boolean>(false);
  const [isInterDeptChatOpen, setIsInterDeptChatOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  // Cross-Tab Real-Time Event Sync via BroadcastChannel & LocalStorage Events
  useEffect(() => {
    const syncState = () => {
      setTasks(getStoredTasks());
      setEmergencyDetails(getStoredEmergency());
      setAuditLogs(getStoredAuditLogs());
      setNotifications(getStoredNotifs());
    };

    const handleBroadcastMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'TASKS_UPDATED') setTasks(e.data.tasks);
      if (e.data.type === 'EMERGENCY_UPDATED') setEmergencyDetails(e.data.emergency);
      if (e.data.type === 'AUDITS_UPDATED') setAuditLogs(e.data.logs);
      if (e.data.type === 'NOTIFS_UPDATED') setNotifications(e.data.notifs);
    };

    if (stateBus) {
      stateBus.onmessage = handleBroadcastMessage;
    }
    window.addEventListener('storage', syncState);

    return () => {
      window.removeEventListener('storage', syncState);
    };
  }, []);

  // Telemetry tick
  useEffect(() => {
    if (!isLiveSimulating || !isAuthenticated) return;

    const interval = setInterval(() => {
      setDistricts(prev => prev.map(d => {
        if (d.id === 'ahmedabad' || d.id === 'rajkot') {
          const delta = (Math.random() - 0.5) * 4;
          return { ...d, waterSupplyMLD: Math.max(100, Math.round(d.waterSupplyMLD + delta)) };
        }
        return d;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveSimulating, isAuthenticated]);

  const handleLoginSuccess = (user: User, token: string) => {
    setActiveUserRole(user.role);
    setAuthToken(token);
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
    setTimeout(() => globalToast?.showToast('success', `Welcome, ${user.name}`, `Authenticated as ${user.roleTitle}`), 500);

    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'USER_AUTHENTICATED',
      details: `Logged in as ${user.roleTitle}`,
      ipAddress: '10.24.1.88',
      status: 'SUCCESS'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveStoredAuditLogs(updatedLogs);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
  };

  // 1. Declare Statewide Emergency (Secretary Only)
  const handleConfirmEmergencyTrigger = async (title: string, description: string, district: string) => {
    const newEmergency: EmergencyState = {
      title,
      description,
      district,
      triggeredBy: activeUser.name,
      isTakenOver: false,
      triggeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setEmergencyDetails(newEmergency);
    saveStoredEmergency(newEmergency);

    // REST Sync to Python Backend
    try {
      await fetch('http://localhost:8000/api/emergency/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          district,
          triggeredBy: activeUser.name
        })
      });
    } catch (e) {}

    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '🚨 STATEWIDE EMERGENCY DECLARED',
      message: `Secretary Dr. Vikram Shah declared emergency: "${title}" in ${district}. District Officers require takeover.`,
      type: 'emergency',
      priority: 'critical',
      read: false,
      timestamp: 'Just now'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifs(updatedNotifs);
    globalToast?.showToast('error', '🚨 Emergency Declared', `"${title}" in ${district} — District Officers must take over.`);
  };
  const handleTakeoverEmergency = async () => {
    if (!emergencyDetails) return;
    const updated: EmergencyState = {
      ...emergencyDetails,
      isTakenOver: true,
      takenOverBy: `${activeUser.name} (${activeUser.roleTitle})`
    };

    setEmergencyDetails(updated);
    saveStoredEmergency(updated);

    try {
      await fetch('http://localhost:8000/api/emergency/takeover?officerName=' + encodeURIComponent(activeUser.name), { method: 'POST' });
    } catch (e) {}

    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '✓ Emergency Takeover Executed',
      message: `${activeUser.name} (${activeUser.district} District Officer) took over emergency crisis. Secretary may now deactivate.`,
      type: 'system',
      priority: 'high',
      read: false,
      timestamp: 'Just now'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifs(updatedNotifs);
    globalToast?.showToast('success', '✓ Emergency Takeover', `${activeUser.name} has taken over crisis operations.`);
  };
  const handleDeactivateEmergency = async () => {
    setEmergencyDetails(null);
    saveStoredEmergency(null);
    try {
      await fetch('http://localhost:8000/api/emergency/deactivate', { method: 'POST' });
    } catch (e) {}
    globalToast?.showToast('info', 'Emergency Resolved', 'Statewide emergency has been deactivated.');
  };

  // 4. Create Custom Work Order (Secretary or District Officer)
  const handleCreateCustomTask = async (taskData: {
    title: string;
    description: string;
    districtId: string;
    districtName: string;
    priority: Priority;
    assignedEngineerName: string;
    waterSavedLiters: number;
    populationBenefited: number;
  }) => {
    const newTask: OperationalTask = {
      id: `task_${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      districtId: taskData.districtId,
      districtName: taskData.districtName,
      priority: taskData.priority,
      status: 'assigned',
      assignedEngineerId: 'user_engineer',
      assignedEngineerName: taskData.assignedEngineerName,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date().toISOString(),
      approvedBy: `${activeUser.name} (${activeUser.roleTitle})`,
      approvedAt: new Date().toISOString(),
      waterSavedLiters: taskData.waterSavedLiters,
      populationBenefited: taskData.populationBenefited,
      slaHoursRemaining: 48
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);

    // REST Sync to Python Backend DB
    try {
      await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
    } catch (e) {}

    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '📋 Custom Work Order Dispatched',
      message: `Work Order "${taskData.title}" assigned to ${taskData.assignedEngineerName}.`,
      type: 'task',
      priority: taskData.priority,
      read: false,
      timestamp: 'Just now'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifs(updatedNotifs);
    globalToast?.showToast('success', 'Work Order Created', `"${taskData.title}" dispatched to ${taskData.assignedEngineerName}`);
  };
  const handleApproveRecommendation = (recId: string, approvalComment: string, digitalSignature: string) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => r.id === recId ? { 
      ...r, 
      status: 'approved',
      approvalComment,
      digitalSignature 
    } : r));

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
      approvalComment,
      digitalSignature,
      waterSavedLiters: rec.estimatedWaterSavedLiters,
      populationBenefited: rec.populationBenefited,
      slaHoursRemaining: 48
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus, extraData?: any) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus, ...extraData };
      }
      return t;
    });
    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updatedNotifs = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updatedNotifs);
    saveStoredNotifs(updatedNotifs);
  };

  const totalWaterSaved = tasks
    .filter(t => t.status === 'completed' || t.status === 'verified')
    .reduce((sum, t) => sum + (t.waterSavedLiters || 0), 6100000);

  const pendingApprovalsCount = recommendations.filter(r => r.status === 'ai_suggested').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'verified' && t.status !== 'closed').length;

  if (!isAuthenticated) {
    return <ToastProvider><ToastInitializer /><LoginScreen onLoginSuccess={handleLoginSuccess} /></ToastProvider>;
  }

  return (
    <ToastProvider>
    <ToastInitializer />
    <div
          className={`min-h-screen font-sans flex flex-col text-sm transition-colors duration-300 ${
            isEmergencyMode
              ? "bg-red-950/10 dark:bg-red-950/20"
              : "bg-slate-50 dark:bg-slate-950"
          } text-slate-900 dark:text-slate-100`}
        >
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {/* Top Navbar */}
      <Navbar
        activeUser={activeUser}
        onLogout={handleLogout}
        isEmergencyMode={isEmergencyMode}
        emergencyDetails={emergencyDetails}
        onTriggerEmergencyClick={() => setIsEmergencyModalOpen(true)}
        onDeactivateEmergencyClick={handleDeactivateEmergency}
        isLiveSimulating={isLiveSimulating}
        onToggleLiveSimulation={() => setIsLiveSimulating(!isLiveSimulating)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onToggleChat={() => setIsInterDeptChatOpen(!isInterDeptChatOpen)}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
      />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative">
        
        {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={activeUserRole}
          pendingTasksCount={pendingTasksCount}
          pendingApprovalsCount={pendingApprovalsCount}
          mobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace View */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-y-auto w-full min-w-0 max-w-full">
          
          {/* Create Work Order Header Bar (Secretary & District Officer) */}
          {(activeUserRole === 'state_authority' || activeUserRole === 'district_officer') && (
            <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-black/20 transition-colors">
              <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Logged in as <strong>{activeUser.roleTitle}</strong> • Real Cross-Tab Persistent Operational Workstation
              </div>
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-xl shadow-sm flex items-center space-x-2 shrink-0 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create New Work Order</span>
              </button>
            </div>
          )}

          {/* Inter-Department Chat View */}
          {isInterDeptChatOpen ? (
            <div className="animate-in fade-in duration-200">
              <InterDeptChat
                userRole={activeUserRole}
                userName={activeUser.name}
                userAvatar={activeUser.avatar}
              />
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {currentTab === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  <ExecutiveBrief
                    userRole={activeUserRole}
                    userName={activeUser.name}
                    onNavigateOperations={() => setCurrentTab('operations')}
                  />

                  {/* ROLE TAILORED DASHBOARDS */}
                  {activeUserRole === 'district_officer' ? (
                    <DistrictDashboard
                      districtName={activeUser.district || 'Ahmedabad'}
                      districtData={districts.find(d => d.name === (activeUser.district || 'Ahmedabad'))}
                      tasks={tasks}
                      reservoirs={RESERVOIRS}
                      isEmergencyMode={isEmergencyMode}
                      emergencyDetails={emergencyDetails}
                      onTakeoverEmergency={handleTakeoverEmergency}
                      onNavigateOperations={() => setCurrentTab('operations')}
                    />
                  ) : activeUserRole === 'engineer' ? (
                    <EngineerDashboard
                      tasks={tasks}
                      onNavigateOperations={() => setCurrentTab('operations')}
                    />
                  ) : activeUserRole === 'emergency_officer' ? (
                    <EmergencyDashboard />
                  ) : activeUserRole === 'researcher' ? (
                    <ResearchDashboard />
                  ) : activeUserRole === 'super_admin' ? (
                    <AdminPanel auditLogs={auditLogs} />
                  ) : (
                    /* STATE AUTHORITY / DEFAULT DASHBOARD */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Statewide KPIs — Live</span>
                        <PrintDashboard
                          districts={districts}
                          totalWaterSaved={totalWaterSaved}
                          tasksCount={tasks.length}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <AnimatedKPI
                          label="Water Health Index"
                          value={74}
                          suffix=" / 100"
                          trend="+2.4% vs last week"
                          trendPositive={true}
                          icon={<Gauge className="w-5 h-5 text-sky-500" />}
                          sparklineData={[68, 70, 69, 72, 71, 73, 74]}
                        />
                        <AnimatedKPI
                          label="AI Confidence Score"
                          value={95.4}
                          decimals={1}
                          suffix="%"
                          trend="4 Agents Active (LangGraph)"
                          trendPositive={true}
                          icon={<Brain className="w-5 h-5 text-violet-500" />}
                          sparklineData={[91, 92.5, 93, 94.1, 94.8, 95, 95.4]}
                        />
                        <AnimatedKPI
                          label="Verified Water Saved"
                          value={parseFloat((totalWaterSaved / 1000000).toFixed(1))}
                          decimals={1}
                          suffix=" M L"
                          trend="Verified by Field Engineers"
                          trendPositive={true}
                          icon={<Droplets className="w-5 h-5 text-cyan-500" />}
                          sparklineData={[4.2, 4.8, 5.1, 5.5, 5.7, 5.9, parseFloat((totalWaterSaved / 1000000).toFixed(1))]}
                        />
                        <AnimatedKPI
                          label="Active Tasks"
                          value={tasks.length}
                          trend={`${pendingApprovalsCount} Approvals Pending`}
                          trendPositive={false}
                          icon={<ClipboardList className="w-5 h-5 text-amber-500" />}
                          sparklineData={[3, 5, 4, 6, 5, 7, tasks.length]}
                        />
                      </div>

                      {/* Gujarat GIS Map */}
                      <GujaratMap
                        districts={districts}
                        reservoirs={RESERVOIRS}
                        selectedDistrict={selectedDistrict}
                        onSelectDistrict={setSelectedDistrict}
                      />
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: AI MISSION CONTROL */}
              {currentTab === 'ai_mission_control' && (
                <div className="animate-in fade-in duration-200">
                  <MultiAgentMissionControl
                    agents={agents}
                    recommendations={recommendations}
                    approverName={activeUser.name}
                    approverTitle={activeUser.roleTitle}
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

              {/* TAB 8 & 9: AUDIT & ADMIN */}
              {(currentTab === 'audit_logs' || currentTab === 'admin') && (
                <div className="animate-in fade-in duration-200">
                  <AdminPanel auditLogs={auditLogs} />
                </div>
              )}
            </>
          )}

        </main>
      </div>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        creatorName={activeUser.name}
        creatorRole={activeUser.roleTitle}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={handleCreateCustomTask}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onConfirmTrigger={handleConfirmEmergencyTrigger}
      />

      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 dark:from-sky-400 dark:to-blue-500 dark:hover:from-sky-300 dark:hover:to-blue-400 text-white shadow-2xl shadow-sky-500/40 dark:shadow-sky-900/50 z-40 flex items-center space-x-2 sm:space-x-3 transform hover:scale-105 active:scale-95 transition-all"
        title="Open Role-Adapted AI Assistant"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
        <span className="font-extrabold text-[11px] sm:text-xs">Ask AquaMind AI</span>
      </button>

      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        userRole={activeUserRole}
        userName={activeUser.name}
      />

    </div>
    </ToastProvider>
  );
}

export default App;