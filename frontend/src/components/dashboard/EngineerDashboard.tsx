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

      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-[#0a0f1a] dark:via-indigo-950 dark:to-blue-950 rounded-3xl p-7 text-white shadow-xl dark:shadow-none dark:border dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-5">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
            <Wrench className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Lead Hydraulic Engineer Field Workstation</h2>
            <p className="text-xs text-indigo-200 font-medium">Field Dispatch • Telemetry Calibration • Evidence Upload</p>
          </div>
        </div>

        <button
          onClick={onNavigateOperations}
          className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-400/30 transition-all duration-200 shrink-0 active:scale-[0.98]"
        >
          Open Work Orders ({engineerTasks.length})
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Assigned Work Orders
          </h3>

          <div className="space-y-3">
            {engineerTasks.map(t => (
              <div key={t.id} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-200">
                <div className="flex justify-between font-extrabold text-slate-900 dark:text-white">
                  <span>Task #{t.id}</span>
                  <span className="px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 uppercase font-bold border border-indigo-200 dark:border-indigo-800">{t.status}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.title}</h4>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{t.description}</p>
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 pt-1">SLA Due: {t.slaHoursRemaining} hours left</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Trunk Pipeline Acoustic Health Radar
          </h3>

          <div className="space-y-3">
            {PIPELINES.slice(0, 3).map(p => (
              <div key={p.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs hover:border-sky-300 dark:hover:border-sky-700 transition-colors duration-200">
                <div className="flex justify-between font-extrabold text-slate-900 dark:text-white">
                  <span>{p.name}</span>
                  <span className={`font-bold ${p.leakProbability > 80 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {p.leakProbability}% Leak Risk
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pressure: {p.pressureBar} Bar • Health: {p.healthScore}/100</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};