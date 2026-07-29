export type UserRole = 
  | 'super_admin' 
  | 'state_authority' 
  | 'district_officer' 
  | 'engineer' 
  | 'emergency_officer' 
  | 'researcher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  district?: string;
  avatar: string;
  department: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export type RiskLevel = 'critical' | 'high' | 'moderate' | 'safe';

export interface District {
  id: string;
  name: string;
  region: 'North Gujarat' | 'Central Gujarat' | 'South Gujarat' | 'Saurashtra' | 'Kachchh';
  riskLevel: RiskLevel;
  population: number;
  waterDemandMLD: number;
  waterSupplyMLD: number;
  groundwaterLevelM: number;
  reservoirCount: number;
  activeAlertsCount: number;
  lat: number;
  lng: number;
}

export interface Reservoir {
  id: string;
  name: string;
  district: string;
  capacityMCM: number;
  currentLevelMCM: number;
  fillPercentage: number;
  inflowCusecs: number;
  outflowCusecs: number;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'rising' | 'falling' | 'stable';
}

export interface Pipeline {
  id: string;
  name: string;
  district: string;
  lengthKm: number;
  pressureBar: number;
  flowLps: number;
  leakProbability: number;
  healthScore: number;
  status: 'normal' | 'leak_risk' | 'critical_leak';
  lastInspectionDate: string;
}

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus = 
  | 'draft' 
  | 'ai_suggested' 
  | 'approved' 
  | 'assigned' 
  | 'in_progress' 
  | 'completed' 
  | 'verified' 
  | 'closed'
  | 'task_created';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'Infrastructure Repair' | 'Water Rationing' | 'Inter-District Transfer' | 'Emergency Supply' | 'Groundwater Recharge';
  districtId: string;
  districtName: string;
  priority: Priority;
  confidenceScore: number;
  estimatedWaterSavedLiters: number;
  populationBenefited: number;
  rationale: string;
  agentName: 'Forecast Agent' | 'Infrastructure Agent' | 'Intelligence Agent' | 'Recommendation Agent';
  status: TaskStatus;
  createdAt: string;
  approvalComment?: string;
  digitalSignature?: string;
}

export interface OperationalTask {
  id: string;
  recommendationId?: string;
  title: string;
  description: string;
  districtId: string;
  districtName: string;
  priority: Priority;
  status: TaskStatus;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  dueDate: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalComment?: string;
  digitalSignature?: string;
  evidencePhotoUrl?: string;
  evidenceNotes?: string;
  completedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  waterSavedLiters: number;
  populationBenefited: number;
  slaHoursRemaining: number;
}

export interface AgentState {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'running' | 'completed' | 'warning';
  confidence: number;
  executionTimeMs: number;
  summary: string;
  steps: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'ai' | 'task' | 'emergency' | 'system';
  priority: Priority;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}
