import React from 'react';
import { PIPELINES } from '../../data/mockData';
import { Activity, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PipelinesView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Acoustic Leak & Pipeline Telemetry Radar</h2>
          </div>
          <p className="text-xs text-slate-500">Sub-surface vibration monitoring, pressure transducers, and burst risk scoring</p>
        </div>
        <span className="px-3 py-1 bg-red-50 text-red-800 border border-red-200 text-xs font-bold rounded-full">
          2 Active Leak Hazards
        </span>
      </div>

      <div className="space-y-4">
        {PIPELINES.map((pipe) => (
          <div key={pipe.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1 max-w-md">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-slate-900">{pipe.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  pipe.status === 'critical_leak' ? 'bg-red-100 text-red-800 animate-pulse' :
                  pipe.status === 'leak_risk' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {pipe.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Length: {pipe.lengthKm} km • District: {pipe.district} • Last Acoustic Inspection: {pipe.lastInspectionDate}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">PRESSURE</span>
                <span className="font-extrabold text-slate-800 text-sm">{pipe.pressureBar} Bar</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">HEALTH SCORE</span>
                <span className={`font-extrabold text-sm ${pipe.healthScore < 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {pipe.healthScore}/100
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">LEAK PROBABILITY</span>
                <span className={`font-extrabold text-sm ${pipe.leakProbability > 80 ? 'text-red-600' : 'text-slate-800'}`}>
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
