import { OperationalTask, AuditLog, SystemNotification } from '../types';
import { INITIAL_TASKS, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS } from '../data/mockData';

const TASKS_KEY = 'aquamind_real_tasks_v2';
const EMERGENCY_KEY = 'aquamind_real_emergency_v2';
const MESSAGES_KEY = 'aquamind_real_messages_v2';
const AUDIT_LOGS_KEY = 'aquamind_real_audit_logs_v2';
const NOTIFS_KEY = 'aquamind_real_notifs_v2';

// HTML5 BroadcastChannel for multi-tab real-time state sync
export const stateBus = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('aquamind_state_bus')
  : null;

export interface EmergencyState {
  title: string;
  description: string;
  district: string;
  triggeredBy: string;
  isTakenOver: boolean;
  takenOverBy?: string;
  triggeredAt: string;
}

// 1. Tasks Persistence
export const getStoredTasks = (): OperationalTask[] => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load stored tasks", e);
  }
  return INITIAL_TASKS;
};

export const saveStoredTasks = (tasks: OperationalTask[]) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    stateBus?.postMessage({ type: 'TASKS_UPDATED', tasks });
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
};

// 2. Emergency Mode Persistence
export const getStoredEmergency = (): EmergencyState | null => {
  try {
    const data = localStorage.getItem(EMERGENCY_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load emergency state", e);
  }
  return null;
};

export const saveStoredEmergency = (emergency: EmergencyState | null) => {
  try {
    if (emergency) {
      localStorage.setItem(EMERGENCY_KEY, JSON.stringify(emergency));
    } else {
      localStorage.removeItem(EMERGENCY_KEY);
    }
    stateBus?.postMessage({ type: 'EMERGENCY_UPDATED', emergency });
  } catch (e) {
    console.error("Failed to save emergency state", e);
  }
};

// 3. Inter-Dept Messages Persistence
export const getStoredMessages = (): any[] => {
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load messages", e);
  }
  return [
    {
      id: 'msg_1',
      senderName: 'Dr. Vikram Shah',
      senderRole: 'state_authority',
      roleTitle: 'Secretary, Water Resources',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Good morning team. Rapar taluka TDS level reported high. District Officer Joshi, please confirm local status.',
      timestamp: '10:00 AM'
    },
    {
      id: 'msg_2',
      senderName: 'Amitabh Joshi',
      senderRole: 'district_officer',
      roleTitle: 'District Water Officer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      text: 'Acknowledged Secretary. Telemetry confirms groundwater salinity elevation. Directing Lead Engineer Priya Desai.',
      timestamp: '10:05 AM'
    }
  ];
};

export const saveStoredMessages = (messages: any[]) => {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    stateBus?.postMessage({ type: 'MESSAGES_UPDATED', messages });
  } catch (e) {
    console.error("Failed to save messages", e);
  }
};

// 4. Audit Logs Persistence
export const getStoredAuditLogs = (): AuditLog[] => {
  try {
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load audit logs", e);
  }
  return INITIAL_AUDIT_LOGS;
};

export const saveStoredAuditLogs = (logs: AuditLog[]) => {
  try {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
    stateBus?.postMessage({ type: 'AUDITS_UPDATED', logs });
  } catch (e) {
    console.error("Failed to save audit logs", e);
  }
};

// 5. Notifications Persistence
export const getStoredNotifs = (): SystemNotification[] => {
  try {
    const data = localStorage.getItem(NOTIFS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load notifs", e);
  }
  return INITIAL_NOTIFICATIONS;
};

export const saveStoredNotifs = (notifs: SystemNotification[]) => {
  try {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
    stateBus?.postMessage({ type: 'NOTIFS_UPDATED', notifs });
  } catch (e) {
    console.error("Failed to save notifs", e);
  }
};
