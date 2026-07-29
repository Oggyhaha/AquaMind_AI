import { User, District, Reservoir, Pipeline, AIRecommendation, OperationalTask, AgentState, AuditLog, SystemNotification } from '../types';

export const DEMO_USERS: Record<string, User> = {
  super_admin: {
    id: 'user_admin',
    name: 'Rajesh Patel',
    email: 'admin@aquamind.ai',
    role: 'super_admin',
    roleTitle: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'IT & AI Governance'
  },
  state_authority: {
    id: 'user_state',
    name: 'Dr. Vikram Shah',
    email: 'state@aquamind.ai',
    role: 'state_authority',
    roleTitle: 'Secretary, Water Resources Dept',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Government of Gujarat'
  },
  district_officer: {
    id: 'user_district',
    name: 'Amitabh Joshi',
    email: 'district@aquamind.ai',
    role: 'district_officer',
    roleTitle: 'District Water Officer',
    district: 'Ahmedabad',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Ahmedabad District Collectorate'
  },
  engineer: {
    id: 'user_engineer',
    name: 'Priya Desai',
    email: 'engineer@aquamind.ai',
    role: 'engineer',
    roleTitle: 'Lead Infrastructure Engineer',
    district: 'Ahmedabad',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Hydraulic Maintenance Division'
  },
  emergency_officer: {
    id: 'user_emergency',
    name: 'Sanjay Varma',
    email: 'emergency@aquamind.ai',
    role: 'emergency_officer',
    roleTitle: 'Disaster Response Coordinator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Gujarat Disaster Management Authority'
  },
  researcher: {
    id: 'user_research',
    name: 'Prof. Ananya Mehta',
    email: 'research@aquamind.ai',
    role: 'researcher',
    roleTitle: 'Senior Hydrological Researcher',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'GTU Water Innovation Council'
  }
};

export const GUJARAT_DISTRICTS: District[] = [
  { id: 'ahmedabad', name: 'Ahmedabad', region: 'Central Gujarat', riskLevel: 'high', population: 8400000, waterDemandMLD: 1450, waterSupplyMLD: 1280, groundwaterLevelM: 38.5, reservoirCount: 3, activeAlertsCount: 4, lat: 23.0225, lng: 72.5714 },
  { id: 'vadodara', name: 'Vadodara', region: 'Central Gujarat', riskLevel: 'moderate', population: 4200000, waterDemandMLD: 820, waterSupplyMLD: 790, groundwaterLevelM: 26.2, reservoirCount: 2, activeAlertsCount: 2, lat: 22.3072, lng: 73.1812 },
  { id: 'surat', name: 'Surat', region: 'South Gujarat', riskLevel: 'safe', population: 7500000, waterDemandMLD: 1350, waterSupplyMLD: 1380, groundwaterLevelM: 14.8, reservoirCount: 4, activeAlertsCount: 1, lat: 21.1702, lng: 72.8311 },
  { id: 'rajkot', name: 'Rajkot', region: 'Saurashtra', riskLevel: 'critical', population: 3800000, waterDemandMLD: 680, waterSupplyMLD: 520, groundwaterLevelM: 52.4, reservoirCount: 5, activeAlertsCount: 6, lat: 22.3039, lng: 70.8022 },
  { id: 'kachchh', name: 'Kachchh', region: 'Kachchh', riskLevel: 'critical', population: 2100000, waterDemandMLD: 490, waterSupplyMLD: 340, groundwaterLevelM: 64.1, reservoirCount: 8, activeAlertsCount: 7, lat: 23.2420, lng: 69.6669 },
  { id: 'gandhinagar', name: 'Gandhinagar', region: 'North Gujarat', riskLevel: 'moderate', population: 1500000, waterDemandMLD: 320, waterSupplyMLD: 310, groundwaterLevelM: 31.0, reservoirCount: 1, activeAlertsCount: 1, lat: 23.2156, lng: 72.6369 },
  { id: 'bhavnagar', name: 'Bhavnagar', region: 'Saurashtra', riskLevel: 'high', population: 2400000, waterDemandMLD: 430, waterSupplyMLD: 380, groundwaterLevelM: 44.8, reservoirCount: 4, activeAlertsCount: 3, lat: 21.7645, lng: 72.1519 },
  { id: 'mehsana', name: 'Mehsana', region: 'North Gujarat', riskLevel: 'high', population: 2000000, waterDemandMLD: 410, waterSupplyMLD: 350, groundwaterLevelM: 58.9, reservoirCount: 2, activeAlertsCount: 3, lat: 23.5880, lng: 72.3693 },
  { id: 'jamnagar', name: 'Jamnagar', region: 'Saurashtra', riskLevel: 'moderate', population: 2100000, waterDemandMLD: 390, waterSupplyMLD: 370, groundwaterLevelM: 41.2, reservoirCount: 6, activeAlertsCount: 2, lat: 22.4707, lng: 70.0577 },
  { id: 'bharuch', name: 'Bharuch', region: 'South Gujarat', riskLevel: 'safe', population: 1550000, waterDemandMLD: 340, waterSupplyMLD: 360, groundwaterLevelM: 18.4, reservoirCount: 3, activeAlertsCount: 0, lat: 21.7051, lng: 72.9959 },
  { id: 'junagadh', name: 'Junagadh', region: 'Saurashtra', riskLevel: 'moderate', population: 1520000, waterDemandMLD: 310, waterSupplyMLD: 295, groundwaterLevelM: 35.6, reservoirCount: 5, activeAlertsCount: 2, lat: 21.5222, lng: 70.4579 },
  { id: 'narmada', name: 'Narmada', region: 'South Gujarat', riskLevel: 'safe', population: 590000, waterDemandMLD: 120, waterSupplyMLD: 180, groundwaterLevelM: 12.1, reservoirCount: 2, activeAlertsCount: 0, lat: 21.8710, lng: 73.5700 },
];

export const RESERVOIRS: Reservoir[] = [
  { id: 'res_sardar_sarovar', name: 'Sardar Sarovar Dam', district: 'Narmada', capacityMCM: 9500, currentLevelMCM: 7410, fillPercentage: 78.0, inflowCusecs: 42500, outflowCusecs: 38000, status: 'optimal', trend: 'rising' },
  { id: 'res_ukai', name: 'Ukai Reservoir', district: 'Surat', capacityMCM: 7414, currentLevelMCM: 5857, fillPercentage: 79.0, inflowCusecs: 28400, outflowCusecs: 24100, status: 'optimal', trend: 'rising' },
  { id: 'res_dharoi', name: 'Dharoi Dam', district: 'Sabarkantha', capacityMCM: 813, currentLevelMCM: 398, fillPercentage: 49.0, inflowCusecs: 4200, outflowCusecs: 5800, status: 'warning', trend: 'falling' },
  { id: 'res_kadana', name: 'Kadana Reservoir', district: 'Mahisagar', capacityMCM: 1542, currentLevelMCM: 1048, fillPercentage: 68.0, inflowCusecs: 12000, outflowCusecs: 11500, status: 'optimal', trend: 'stable' },
  { id: 'res_shetrunji', name: 'Shetrunji Dam', district: 'Bhavnagar', capacityMCM: 308, currentLevelMCM: 117, fillPercentage: 38.0, inflowCusecs: 850, outflowCusecs: 1600, status: 'warning', trend: 'falling' },
  { id: 'res_aaji', name: 'Aaji-1 Dam', district: 'Rajkot', capacityMCM: 41, currentLevelMCM: 9.8, fillPercentage: 24.0, inflowCusecs: 120, outflowCusecs: 850, status: 'critical', trend: 'falling' },
];

export const PIPELINES: Pipeline[] = [
  { id: 'pipe_p204', name: 'Pipeline P-204 (Ahmedabad East Trunk)', district: 'Ahmedabad', lengthKm: 24.5, pressureBar: 2.1, flowLps: 480, leakProbability: 91, healthScore: 42, status: 'critical_leak', lastInspectionDate: '2026-07-25' },
  { id: 'pipe_narmada_main', name: 'Narmada Main Canal Feeder C-12', district: 'Gandhinagar', lengthKm: 48.0, pressureBar: 4.5, flowLps: 1850, leakProbability: 18, healthScore: 88, status: 'normal', lastInspectionDate: '2026-07-28' },
  { id: 'pipe_p108', name: 'Pipeline P-108 (Vadodara GIDC Feeder)', district: 'Vadodara', lengthKm: 16.2, pressureBar: 3.2, flowLps: 620, leakProbability: 67, healthScore: 61, status: 'leak_risk', lastInspectionDate: '2026-07-20' },
  { id: 'pipe_surat_south', name: 'Surat Southern Industrial Main', district: 'Surat', lengthKm: 32.0, pressureBar: 5.1, flowLps: 2100, leakProbability: 12, healthScore: 94, status: 'normal', lastInspectionDate: '2026-07-27' },
  { id: 'pipe_rajkot_feeder', name: 'Rajkot Bulk Water Line R-4', district: 'Rajkot', lengthKm: 28.4, pressureBar: 1.8, flowLps: 340, leakProbability: 84, healthScore: 49, status: 'critical_leak', lastInspectionDate: '2026-07-22' },
];

export const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec_204',
    title: 'Emergency Repair for Pipeline P-204 Acoustic Leak',
    description: 'Acoustic AI telemetry detected severe pressure drop and sub-surface vibration matching 91% leak signature on Ahmedabad East Trunk Line near Naroda Junction.',
    category: 'Infrastructure Repair',
    districtId: 'ahmedabad',
    districtName: 'Ahmedabad',
    priority: 'critical',
    confidenceScore: 95,
    estimatedWaterSavedLiters: 2400000,
    populationBenefited: 45000,
    rationale: 'Preventing 2.4M Liters/day non-revenue water loss and avoiding collapse of municipal supply to Naroda & Odhav wards within 48 hours.',
    agentName: 'Infrastructure Agent',
    status: 'ai_suggested',
    createdAt: '2026-07-29T10:15:00Z'
  },
  {
    id: 'rec_301',
    title: 'Dynamic Inter-District Canal Diversion to Rajkot',
    description: 'Prophet time-series model predicts Rajkot municipal reservoir depletion in 12 days due to monsoon gap. Recommend opening Narmada Branch Canal Gate 4B by 15%.',
    category: 'Inter-District Transfer',
    districtId: 'rajkot',
    districtName: 'Rajkot',
    priority: 'high',
    confidenceScore: 92,
    estimatedWaterSavedLiters: 8500000,
    populationBenefited: 380000,
    rationale: 'Synthesized with Sardar Sarovar surplus inflow (78% capacity) to prevent emergency tanker deployment costs in Saurashtra region.',
    agentName: 'Forecast Agent',
    status: 'approved',
    createdAt: '2026-07-28T14:30:00Z'
  },
  {
    id: 'rec_105',
    title: 'MSME Industrial Water Efficiency Audit in Vadodara GIDC',
    description: 'Intelligence Agent flagged 18% discrepancy in industrial effluent treatment intake vs bulk supply in Makarpura GIDC industrial cluster.',
    category: 'Water Rationing',
    districtId: 'vadodara',
    districtName: 'Vadodara',
    priority: 'medium',
    confidenceScore: 89,
    estimatedWaterSavedLiters: 1200000,
    populationBenefited: 12000,
    rationale: 'Ensures compliance with Gujarat Industrial Water Policy 2024 and recovers unmetered industrial consumption.',
    agentName: 'Intelligence Agent',
    status: 'task_created',
    createdAt: '2026-07-27T09:00:00Z'
  },
  {
    id: 'rec_402',
    title: 'Emergency Mobile Purification Deployment in Kachchh',
    description: 'Groundwater salinity sensor network alerted dangerous TDS elevation (>2800 PPM) in Rapar taluka borewells following heatwave.',
    category: 'Emergency Supply',
    districtId: 'kachchh',
    districtName: 'Kachchh',
    priority: 'critical',
    confidenceScore: 94,
    estimatedWaterSavedLiters: 650000,
    populationBenefited: 28000,
    rationale: 'Prevents waterborne illness outbreak; complies with National Rural Drinking Water Security Guidelines.',
    agentName: 'Recommendation Agent',
    status: 'approved',
    createdAt: '2026-07-29T08:45:00Z'
  }
];

export const INITIAL_TASKS: OperationalTask[] = [
  {
    id: 'task_1001',
    recommendationId: 'rec_301',
    title: 'Narmada Branch Canal Gate 4B Calibration & Opening',
    description: 'Execute controlled 15% gate lift on Narmada Canal Branch 4B to discharge 450 Cusecs towards Rajkot feeder stream.',
    districtId: 'rajkot',
    districtName: 'Rajkot',
    priority: 'high',
    status: 'assigned',
    assignedEngineerId: 'user_engineer',
    assignedEngineerName: 'Priya Desai',
    dueDate: '2026-07-30T18:00:00Z',
    createdAt: '2026-07-28T16:00:00Z',
    approvedBy: 'Dr. Vikram Shah (State Authority)',
    approvedAt: '2026-07-28T15:45:00Z',
    waterSavedLiters: 8500000,
    populationBenefited: 380000,
    slaHoursRemaining: 18
  },
  {
    id: 'task_1002',
    recommendationId: 'rec_105',
    title: 'Makarpura GIDC Industrial Flow Meter Inspection',
    description: 'Audit 14 high-volume chemical plant inflow valves in Vadodara to check for bypass meters and flow restrictions.',
    districtId: 'vadodara',
    districtName: 'Vadodara',
    priority: 'medium',
    status: 'in_progress',
    assignedEngineerId: 'eng_vado_2',
    assignedEngineerName: 'Rajesh Parmar',
    dueDate: '2026-07-31T12:00:00Z',
    createdAt: '2026-07-27T11:00:00Z',
    approvedBy: 'Dr. Vikram Shah (State Authority)',
    approvedAt: '2026-07-27T10:30:00Z',
    waterSavedLiters: 1200000,
    populationBenefited: 12000,
    slaHoursRemaining: 34
  },
  {
    id: 'task_1003',
    recommendationId: 'rec_legacy_99',
    title: 'Sabarmati Intake Valve V-12 Seal Replacement',
    description: 'Replaced degraded rubber gaskets on main river intake pump #3 following AI vibration warning.',
    districtId: 'ahmedabad',
    districtName: 'Ahmedabad',
    priority: 'high',
    status: 'completed',
    assignedEngineerId: 'user_engineer',
    assignedEngineerName: 'Priya Desai',
    dueDate: '2026-07-28T17:00:00Z',
    createdAt: '2026-07-26T08:00:00Z',
    approvedBy: 'Dr. Vikram Shah (State Authority)',
    approvedAt: '2026-07-26T09:15:00Z',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    evidenceNotes: 'New EPDM high-pressure seal installed. Pressure normalized to 3.8 bar. Zero leakage detected during 4-hour test run.',
    completedAt: '2026-07-28T14:20:00Z',
    waterSavedLiters: 1900000,
    populationBenefited: 32000,
    slaHoursRemaining: 0
  },
  {
    id: 'task_1004',
    recommendationId: 'rec_legacy_88',
    title: 'Dharoi Dam Spillway Gate #2 Maintenance',
    description: 'Annual lubrication and hydraulic cylinder seal overhaul on spillway gate 2 ahead of heavy rain alert.',
    districtId: 'gandhinagar',
    districtName: 'Gandhinagar',
    priority: 'low',
    status: 'verified',
    assignedEngineerId: 'eng_gandhi_1',
    assignedEngineerName: 'Hardik Solanki',
    dueDate: '2026-07-25T17:00:00Z',
    createdAt: '2026-07-22T08:00:00Z',
    approvedBy: 'Dr. Vikram Shah (State Authority)',
    approvedAt: '2026-07-22T09:00:00Z',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    evidenceNotes: 'Hydraulic pressure test completed at 150 PSI. Verified by District Officer Amitabh Joshi.',
    completedAt: '2026-07-24T16:00:00Z',
    verifiedBy: 'Amitabh Joshi (District Water Officer)',
    verifiedAt: '2026-07-25T10:00:00Z',
    waterSavedLiters: 4200000,
    populationBenefited: 75000,
    slaHoursRemaining: 0
  }
];

export const INITIAL_AGENTS: AgentState[] = [
  {
    id: 'agent_forecast',
    name: 'Forecast Agent',
    role: 'Time-Series & Climate Predictive Analytics',
    status: 'completed',
    confidence: 96,
    executionTimeMs: 420,
    summary: 'Analyzed 120-day monsoon radar, satellite soil moisture, and population consumption curves.',
    steps: [
      'Loaded historical rainfall dataset for 33 Gujarat districts',
      'Executed Prophet model to project 30-day reservoir depletion trajectories',
      'Identified critical water stress anomaly in Rajkot (-24% supply threshold in 12 days)',
      'Calculated projected urban water demand spike of +14% during upcoming heatwave'
    ]
  },
  {
    id: 'agent_infra',
    name: 'Infrastructure Agent',
    role: 'Acoustic Leak & Asset Health Monitoring',
    status: 'completed',
    confidence: 94,
    executionTimeMs: 380,
    summary: 'Processed acoustic telemetry from 1,420 canal sensors and pipeline pressure nodes.',
    steps: [
      'Scanned real-time pressure transducers across 84 trunk pipelines',
      'Detected acoustic frequency peak (420 Hz) on Pipeline P-204 at Naroda',
      'Evaluated pipe wall thickness decay index (42/100 health score)',
      'Calculated 91% probability of major burst if pressure exceeds 2.5 bar'
    ]
  },
  {
    id: 'agent_intel',
    name: 'Intelligence Agent',
    role: 'RAG Knowledge Synthesis & Policy Compliance',
    status: 'completed',
    confidence: 91,
    executionTimeMs: 650,
    summary: 'Cross-referenced state water allocation policies, drought SOPs, and GTU research manuals.',
    steps: [
      'Queried Qdrant vector database for Gujarat Water Allocation Policy 2024',
      'Retrieved Priority Rule #4: Municipal drinking water takes precedence over industrial allocation',
      'Verified regulatory compliance for inter-district Narmada canal transfer',
      'Formulated legal justification document for State Water Authority review'
    ]
  },
  {
    id: 'agent_recom',
    name: 'Recommendation Agent',
    role: 'Executive Decision Synthesis & Societal Impact Scoring',
    status: 'completed',
    confidence: 95,
    executionTimeMs: 290,
    summary: 'Synthesized multi-agent findings into 4 actionable priority recommendations.',
    steps: [
      'Weighted risk level, population impact, and water volume savings',
      'Scored Pipeline P-204 repair as Priority 1 (2.4M Liters saved, 45K citizens protected)',
      'Scored Rajkot Narmada Canal gate open as Priority 2 (8.5M Liters saved, 380K citizens protected)',
      'Generated standardized government action draft for instant one-click approval'
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log_101', timestamp: '2026-07-29T10:15:02Z', userId: 'user_state', userName: 'Dr. Vikram Shah', role: 'state_authority', action: 'APPROVAL_EXECUTED', details: 'Approved AI Recommendation #REC-301 (Rajkot Canal Diversion)', ipAddress: '10.24.1.88', status: 'SUCCESS' },
  { id: 'log_102', timestamp: '2026-07-29T09:40:18Z', userId: 'user_district', userName: 'Amitabh Joshi', role: 'district_officer', action: 'TASK_ASSIGNED', details: 'Assigned Task #TASK-1001 to Lead Engineer Priya Desai', ipAddress: '10.24.4.12', status: 'SUCCESS' },
  { id: 'log_103', timestamp: '2026-07-29T08:22:10Z', userId: 'user_engineer', userName: 'Priya Desai', role: 'engineer', action: 'EVIDENCE_UPLOADED', details: 'Uploaded high-res repair photos for Task #TASK-1003', ipAddress: '10.24.9.45', status: 'SUCCESS' },
  { id: 'log_104', timestamp: '2026-07-29T07:11:00Z', userId: 'user_admin', userName: 'Rajesh Patel', role: 'super_admin', action: 'MODEL_CONFIG_UPDATED', details: 'Switched Reasoning LLM to Gemini 3.6 Flash & Updated Qdrant Embeddings', ipAddress: '127.0.0.1', status: 'SUCCESS' }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  { id: 'notif_1', title: '🚨 Critical Acoustic Leak Signature Detected', message: 'Pipeline P-204 in Naroda (Ahmedabad) shows 91% burst probability. Immediate repair recommended.', type: 'ai', priority: 'critical', read: false, timestamp: '10 mins ago', actionUrl: '#ai-mission-control' },
  { id: 'notif_2', title: '✅ Task Verification Required', message: 'Engineer Priya Desai completed repair on Sabarmati Intake Valve V-12. Verification pending by District Officer.', type: 'task', priority: 'high', read: false, timestamp: '1 hour ago', actionUrl: '#operations' },
  { id: 'notif_3', title: '📊 Statewide Water Impact Daily Summary', message: 'Yesterday 18.7 Million Liters of water were saved across Gujarat through AI closed-loop actions.', type: 'system', priority: 'medium', read: true, timestamp: '4 hours ago' }
];
