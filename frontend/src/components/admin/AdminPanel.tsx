import React, { useState } from 'react';
import { AuditLog, User } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { ShieldCheck, Users, Cpu, Database, History, CheckCircle2, Trash2, Plus, Crown } from 'lucide-react';

interface AdminPanelProps {
  auditLogs: AuditLog[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ai_models' | 'database' | 'audit'>('users');
  const [selectedModel, setSelectedModel] = useState<string>('Gemini 3.6 Flash (High)');
  const [usersList, setUsersList] = useState<User[]>(Object.values(DEMO_USERS));

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-black rounded-2xl p-5 sm:p-7 text-white shadow-md border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-300 shrink-0">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Super Administrator Governance Hub</h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">User Accounts, RBAC Permissions, AI Model Routing &amp; Audit Logs</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-500/15 text-sky-300 text-xs font-bold border border-sky-400/30 self-start sm:self-auto shrink-0">
          <Crown className="w-3.5 h-3.5" />
          Root Admin Permission Active
        </span>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'users', label: 'User & Permission Management', icon: Users },
          { id: 'ai_models', label: 'AI Reasoning Engines', icon: Cpu },
          { id: 'database', label: 'Database Infrastructure', icon: Database },
          { id: 'audit', label: 'Security & Audit Logs', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-sm font-extrabold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform User Accounts & Roles</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Manage user credentials, role permissions, and assigned district scopes</p>
            </div>
            <button className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors self-start sm:self-auto">
              <Plus className="w-4 h-4" />
              <span>Create New User</span>
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">User Profile</th>
                  <th className="p-3.5">Role Title</th>
                  <th className="p-3.5">Assigned Scope</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white text-xs">{user.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-500/30">
                        {user.roleTitle}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-800 dark:text-slate-200 font-bold">
                      {user.district || 'Statewide Gujarat'}
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">{user.department}</td>
                    <td className="p-3.5 text-right">
                      <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
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

      {activeTab === 'ai_models' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Model Router Configuration</h3>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              { name: 'Gemini 3.6 Flash (High)', type: 'LLM Reasoning & RAG', status: 'Active Primary', provider: 'Google AI' },
              { name: 'OpenAI GPT-5.5 / GPT-4o', type: 'Executive Policy Assistant', status: 'Standby Engine', provider: 'OpenAI' },
              { name: 'XGBoost Hydraulic Forecasting', type: 'Time-Series Reservoir Model', status: 'Active ML Engine', provider: 'Scikit/XGB' },
              { name: 'Prophet Monsoon Trend Predictor', type: 'Seasonal Rainfall Anomaly', status: 'Active ML Engine', provider: 'Meta AI' }
            ].map((model) => (
              <div key={model.name} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{model.name}</h4>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs font-bold shrink-0">
                    {model.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{model.type} • {model.provider}</p>
                <button
                  onClick={() => setSelectedModel(model.name)}
                  className={`w-full py-2 text-xs font-extrabold rounded-lg border transition-colors ${
                    selectedModel === model.name
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {selectedModel === model.name ? 'Active Primary Engine' : 'Set as Primary Engine'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Database & Telemetry Infrastructure</h3>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-extrabold">Relational Database</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">PostgreSQL 16 (Supabase)</div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Healthy • 12ms Latency
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-extrabold">Vector Knowledge DB</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">Qdrant Cloud Cluster</div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Synced • 1,240 Policy Vectors
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-extrabold">Cache Engine</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">Redis Sentinel Cache</div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Active • 99.9% Hit Rate
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Immutable Audit Trail</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Audit Details</th>
                  <th className="p-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 text-slate-500 dark:text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{log.userName}</td>
                    <td className="p-3.5 uppercase text-[11px] text-sky-700 dark:text-sky-400 font-bold">{log.role}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans text-slate-800 dark:text-slate-300 font-medium">{log.details}</td>
                    <td className="p-3.5 text-slate-400 dark:text-slate-500">{log.ipAddress}</td>
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