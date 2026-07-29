import React from 'react';
import { PIPELINES } from '../../data/mockData';
import { Activity } from 'lucide-react';

export const PipelinesView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-900">Acoustic Leak Radar & Telemetry Nodes</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Sub-surface acoustic vibration sensors, pressure transducers, and burst risk scoring</p>
        </div>
        <span className="px-4 py-1.5 bg-red-50 text-red-800 border border-red-200 text-xs font-bold rounded-full">
          2 Active Leak Hazards
        </span>
      </div>

      <div className="space-y-4">
        {PIPELINES.map((pipe) => (
          <div key={pipe.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center space-x-3">
                <h3 className="font-extrabold text-base text-slate-900">{pipe.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                  pipe.status === 'critical_leak' ? 'bg-red-100 text-red-800 animate-pulse' :
                  pipe.status === 'leak_risk' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {pipe.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Length: {pipe.lengthKm} km • District: {pipe.district} • Last Acoustic Inspection: {pipe.lastInspectionDate}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-center">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-400 font-extrabold block">PRESSURE</span>
                <span className="font-black text-slate-900 text-base">{pipe.pressureBar} Bar</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-400 font-extrabold block">HEALTH SCORE</span>
                <span className={`font-black text-base ${pipe.healthScore < 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {pipe.healthScore}/100
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-400 font-extrabold block">LEAK PROBABILITY</span>
                <span className={`font-black text-base ${pipe.leakProbability > 80 ? 'text-red-600' : 'text-slate-900'}`}>
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
