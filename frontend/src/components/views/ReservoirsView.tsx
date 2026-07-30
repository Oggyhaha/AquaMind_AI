import React from 'react';
import { RESERVOIRS } from '../../data/mockData';
import { Waves } from 'lucide-react';

export const ReservoirsView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center space-x-2">
            <Waves className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Gujarat Reservoirs & Storage Volume</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live MCM storage levels, inflow/outflow Cusec rates, and storage percentages</p>
        </div>
        <span className="px-4 py-1.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 text-xs font-bold rounded-full shrink-0">
          6 Reservoirs Tracked
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESERVOIRS.map((res) => (
          <div key={res.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-black/20 space-y-4 transition-colors hover:shadow-md dark:hover:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{res.name}</h3>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{res.district} District</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shrink-0 ${
                res.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400' :
                res.status === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400'
              }`}>
                {res.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200">
                <span>Storage Volume ({res.currentLevelMCM} / {res.capacityMCM} MCM)</span>
                <span className="text-sky-700 dark:text-sky-400">{res.fillPercentage}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    res.fillPercentage < 35 ? 'bg-red-500 dark:bg-red-500' : res.fillPercentage < 60 ? 'bg-amber-500 dark:bg-amber-500' : 'bg-sky-500 dark:bg-sky-400'
                  }`}
                  style={{ width: `${res.fillPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-extrabold block">INFLOW</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{res.inflowCusecs.toLocaleString()} Cusecs</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-extrabold block">OUTFLOW</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{res.outflowCusecs.toLocaleString()} Cusecs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};