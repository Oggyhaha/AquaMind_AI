import React from 'react';
import { RESERVOIRS } from '../../data/mockData';
import { Waves } from 'lucide-react';

export const ReservoirsView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Waves className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-900">Gujarat Reservoirs & Storage Volume</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Live MCM storage levels, inflow/outflow Cusec rates, and storage percentages</p>
        </div>
        <span className="px-4 py-1.5 bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold rounded-full">
          6 Reservoirs Tracked
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESERVOIRS.map((res) => (
          <div key={res.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{res.name}</h3>
                <span className="text-xs text-slate-400 font-medium">{res.district} District</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                res.status === 'critical' ? 'bg-red-100 text-red-800' :
                res.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {res.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span>Storage Volume ({res.currentLevelMCM} / {res.capacityMCM} MCM)</span>
                <span className="text-sky-700">{res.fillPercentage}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    res.fillPercentage < 35 ? 'bg-red-500' : res.fillPercentage < 60 ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${res.fillPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-200">
                <span className="text-[11px] text-slate-400 font-extrabold block">INFLOW</span>
                <span className="font-extrabold text-slate-900">{res.inflowCusecs.toLocaleString()} Cusecs</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-200">
                <span className="text-[11px] text-slate-400 font-extrabold block">OUTFLOW</span>
                <span className="font-extrabold text-slate-900">{res.outflowCusecs.toLocaleString()} Cusecs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
