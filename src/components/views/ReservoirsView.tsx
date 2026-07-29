import React from 'react';
import { RESERVOIRS } from '../../data/mockData';
import { Waves, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ReservoirsView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Waves className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Major Gujarat Reservoirs & Dam Storage</h2>
          </div>
          <p className="text-xs text-slate-500">Live storage volume, inflow/outflow cusec rates, and percentage capacity</p>
        </div>
        <span className="px-3 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold rounded-full">
          6 Reservoirs Tracked
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {RESERVOIRS.map((res) => (
          <div key={res.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-900">{res.name}</h3>
                <span className="text-xs text-slate-400 font-medium">{res.district} District</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                res.status === 'critical' ? 'bg-red-100 text-red-800' :
                res.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {res.status}
              </span>
            </div>

            {/* Capacity Radial Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Storage Volume ({res.currentLevelMCM} / {res.capacityMCM} MCM)</span>
                <span className="text-sky-700">{res.fillPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    res.fillPercentage < 35 ? 'bg-red-500' : res.fillPercentage < 60 ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${res.fillPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">INFLOW</span>
                <span className="font-bold text-slate-800">{res.inflowCusecs.toLocaleString()} Cusecs</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">OUTFLOW</span>
                <span className="font-bold text-slate-800">{res.outflowCusecs.toLocaleString()} Cusecs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
