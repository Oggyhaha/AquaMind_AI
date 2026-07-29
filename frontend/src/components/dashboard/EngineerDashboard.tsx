import React from 'react';
import { OperationalTask, Pipeline } from '../../types';
import { PIPELINES } from '../../data/mockData';
import { Wrench, Camera, Clock, Activity, CheckCircle2 } from 'lucide-react';

interface EngineerDashboardProps {
  tasks: OperationalTask[];
  onNavigateOperations: () => void;
}

export const EngineerDashboard: React.FC<EngineerDashboardProps> = ({
  tasks,
  onNavigateOperations
}) => {
  const engineerTasks = tasks.filter(t => t.assignedEngineerName?.includes('Priya Desai') || t.status === 'assigned' || t.status === 'in_progress');

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-7 text-white shadow-xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Wrench className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white">Lead Hydraulic Engineer Field Workstation</h2>
            <p className="text-xs text-indigo-200 font-medium">Field Dispatch • Telemetry Calibration • Evidence Upload</p>
          </div>
        </div>

        <button
          onClick={onNavigateOperations}
          className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all shrink-0"
        >
          Open Work Orders ({engineerTasks.length})
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Assigned Work Orders
          </h3>

          <div className="space-y-3">
            {engineerTasks.map(t => (
              <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-extrabold text-slate-900">
                  <span>Task #{t.id}</span>
                  <span className="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase font-bold">{t.status}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                <p className="text-slate-600 font-medium">{t.description}</p>
                <div className="text-[11px] font-bold text-amber-600 pt-1">SLA Due: {t.slaHoursRemaining} hours left</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Trunk Pipeline Acoustic Health Radar
          </h3>

          <div className="space-y-3">
            {PIPELINES.slice(0, 3).map(p => (
              <div key={p.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between font-extrabold text-slate-900">
                  <span>{p.name}</span>
                  <span className={`font-bold ${p.leakProbability > 80 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {p.leakProbability}% Leak Risk
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Pressure: {p.pressureBar} Bar • Health: {p.healthScore}/100</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
