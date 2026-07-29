import React, { useState } from 'react';
import { AuditLog, User } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { ShieldCheck, Users, Cpu, Database, History, CheckCircle2, Trash2, Plus } from 'lucide-react';

interface AdminPanelProps {
  auditLogs: AuditLog[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ai_models' | 'database' | 'audit'>('users');
  const [selectedModel, setSelectedModel] = useState<string>('Gemini 3.6 Flash (High)');
  const [usersList, setUsersList] = useState<User[]>(Object.values(DEMO_USERS));

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-7 text-white shadow-xl border border-purple-800/40 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Super Administrator Governance Hub</h2>
            <p className="text-xs text-purple-200 font-medium">User Accounts, RBAC Permissions, AI Model Routing & Audit Logs</p>
          </div>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/40">
          👑 Root Admin Permission Active
        </span>
      </div>

      <div className="flex space-x-3 border-b border-slate-200 pb-2 text-xs font-bold">
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
              className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md font-extrabold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Platform User Accounts & Roles</h3>
              <p className="text-xs text-slate-500 font-medium">Manage user credentials, role permissions, and assigned district scopes</p>
            </div>
            <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-sm flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create New User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">User Profile</th>
                  <th className="p-3.5">Role Title</th>
                  <th className="p-3.5">Assigned Scope</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-3.5 flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold border border-purple-200">
                        {user.roleTitle}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-800 font-bold">
                      {user.district || 'Statewide Gujarat'}
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">{user.department}</td>
                    <td className="p-3.5 text-right">
                      <button className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50">
                        <Trash2 className="w-4.5 h-4.5" />
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">AI Model Router Configuration</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { name: 'Gemini 3.6 Flash (High)', type: 'LLM Reasoning & RAG', status: 'Active Primary', provider: 'Google AI' },
              { name: 'OpenAI GPT-5.5 / GPT-4o', type: 'Executive Policy Assistant', status: 'Standby Engine', provider: 'OpenAI' },
              { name: 'XGBoost Hydraulic Forecasting', type: 'Time-Series Reservoir Model', status: 'Active ML Engine', provider: 'Scikit/XGB' },
              { name: 'Prophet Monsoon Trend Predictor', type: 'Seasonal Rainfall Anomaly', status: 'Active ML Engine', provider: 'Meta AI' }
            ].map((model) => (
              <div key={model.name} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-slate-900">{model.name}</h4>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {model.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{model.type} • {model.provider}</p>
                <button
                  onClick={() => setSelectedModel(model.name)}
                  className={`w-full py-2 text-xs font-extrabold rounded-xl border transition-colors ${
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

      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Database & Telemetry Infrastructure</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-extrabold">Relational Database</span>
              <div className="text-lg font-black text-slate-900">PostgreSQL 16 (Supabase)</div>
              <span className="text-xs text-emerald-600 font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Healthy • 12ms Latency
              </span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-extrabold">Vector Knowledge DB</span>
              <div className="text-lg font-black text-slate-900">Qdrant Cloud Cluster</div>
              <span className="text-xs text-emerald-600 font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Synced • 1,240 Policy Vectors
              </span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-extrabold">Cache Engine</span>
              <div className="text-lg font-black text-slate-900">Redis Sentinel Cache</div>
              <span className="text-xs text-emerald-600 font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Active • 99.9% Hit Rate
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Immutable Audit Trail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Audit Details</th>
                  <th className="p-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3.5 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3.5 font-bold text-slate-900">{log.userName}</td>
                    <td className="p-3.5 uppercase text-[11px] text-purple-700 font-bold">{log.role}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded bg-slate-100 font-bold text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans text-slate-800 font-medium">{log.details}</td>
                    <td className="p-3.5 text-slate-400">{log.ipAddress}</td>
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
