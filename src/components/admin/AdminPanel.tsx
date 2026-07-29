import React, { useState } from 'react';
import { AuditLog, User } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { 
  ShieldCheck, 
  Users, 
  Cpu, 
  Database, 
  History, 
  SlidersHorizontal, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Activity,
  Key
} from 'lucide-react';

interface AdminPanelProps {
  auditLogs: AuditLog[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ai_models' | 'database' | 'audit'>('users');
  const [selectedModel, setSelectedModel] = useState<string>('Gemini 3.6 Flash (High)');
  const [usersList, setUsersList] = useState<User[]>(Object.values(DEMO_USERS));

  return (
    <div className="space-y-6">
      
      {/* Admin Panel Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-purple-800/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Super Administrator Control Center</h2>
            <p className="text-xs text-purple-200">System Governance, User Management, AI Model Tuning & Security Logs</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/40">
          👑 Root Permission Active
        </span>
      </div>

      {/* Tabs Bar */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'users', label: 'User & Role Management', icon: Users },
          { id: 'ai_models', label: 'AI Reasoning Engines', icon: Cpu },
          { id: 'database', label: 'Database & Infrastructure', icon: Database },
          { id: 'audit', label: 'Security & Audit Trail', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Users & RBAC Permissions</h3>
              <p className="text-xs text-slate-500">Manage user accounts, assign district scopes, and update security roles</p>
            </div>
            <button className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5">
              <Plus className="w-4 h-4" />
              <span>Create New Government User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Role & Title</th>
                  <th className="p-3">Assigned Scope</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-3 flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 font-bold border border-purple-200">
                        {user.roleTitle}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-bold">
                      {user.district || 'Statewide Gujarat'}
                    </td>
                    <td className="p-3 text-slate-500">{user.department}</td>
                    <td className="p-3 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: AI Models Control */}
      {activeTab === 'ai_models' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">AI Model Router & Telemetry Tuning</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Gemini 3.6 Flash (High)', type: 'LLM Reasoning & RAG', status: 'Active Default', provider: 'Google AI' },
              { name: 'OpenAI GPT-5.5 / GPT-4o', type: 'Executive Policy Assistant', status: 'Standby', provider: 'OpenAI' },
              { name: 'XGBoost Hydraulic Forecasting', type: 'Time-Series Reservoir Model', status: 'Active ML Engine', provider: 'Scikit/XGB' },
              { name: 'Prophet Monsoon Trend Predictor', type: 'Seasonal Rainfall Anomaly', status: 'Active ML Engine', provider: 'Meta AI' }
            ].map((model) => (
              <div key={model.name} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-900">{model.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {model.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{model.type} • {model.provider}</p>
                <button
                  onClick={() => setSelectedModel(model.name)}
                  className={`w-full py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    selectedModel === model.name ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {selectedModel === model.name ? 'Active Primary Engine' : 'Set as Primary Engine'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Database & Infrastructure */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Infrastructure Health & Database Status</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Relational Database</span>
              <div className="text-base font-extrabold text-slate-900 mt-1">PostgreSQL 16 (Supabase)</div>
              <span className="text-xs text-emerald-600 font-bold flex items-center mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Healthy • 12ms Latency
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Vector Knowledge DB</span>
              <div className="text-base font-extrabold text-slate-900 mt-1">Qdrant Cloud Cluster</div>
              <span className="text-xs text-emerald-600 font-bold flex items-center mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Synced • 1,240 Embeddings
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cache & Session Engine</span>
              <div className="text-base font-extrabold text-slate-900 mt-1">Redis Sentinel Cache</div>
              <span className="text-xs text-emerald-600 font-bold flex items-center mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active • 99.9% Hit Rate
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Immutable Audit Trail</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-bold text-slate-900">{log.userName}</td>
                    <td className="p-3 uppercase text-[10px] text-purple-700 font-bold">{log.role}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-slate-700">{log.details}</td>
                    <td className="p-3 text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
