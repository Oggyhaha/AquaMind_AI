import React from 'react';
import { PIPELINES } from '../../data/mockData';
import { Activity } from 'lucide-react';

export const PipelinesView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Acoustic Leak Radar & Telemetry Nodes</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sub-surface acoustic vibration sensors, pressure transducers, and burst risk scoring</p>
        </div>
        <span className="px-4 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-xs font-bold rounded-full shrink-0">
          2 Active Leak Hazards
        </span>
      </div>

      <div className="space-y-4">
        {PIPELINES.map((pipe) => (
          <div key={pipe.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-black/20 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors hover:shadow-md dark:hover:border-slate-700">
            
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center space-x-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{pipe.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                  pipe.status === 'critical_leak' ? 'bg-red-100 text-red-800 animate-pulse dark:bg-red-500/15 dark:text-red-400' :
                  pipe.status === 'leak_risk' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400'
                }`}>
                  {pipe.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Length: {pipe.lengthKm} km • District: {pipe.district} • Last Acoustic Inspection: {pipe.lastInspectionDate}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-center">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-extrabold block">PRESSURE</span>
                <span className="font-black text-slate-900 dark:text-slate-100 text-base">{pipe.pressureBar} Bar</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-extrabold block">HEALTH SCORE</span>
                <span className={`font-black text-base ${pipe.healthScore < 50 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {pipe.healthScore}/100
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-extrabold block">LEAK PROBABILITY</span>
                <span className={`font-black text-base ${pipe.leakProbability > 80 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {pipe.leakProbability}%
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};