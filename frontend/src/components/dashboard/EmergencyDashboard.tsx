import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Truck, CheckCircle2, Radio } from 'lucide-react';

export const EmergencyDashboard: React.FC = () => {
  const [dispatched, setDispatched] = useState<boolean>(false);

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 dark:from-red-950 dark:via-[#0a0f1a] dark:to-amber-950/80 rounded-3xl p-7 text-white shadow-xl dark:shadow-none border border-red-800/40 dark:border-red-900/60 flex flex-col sm:flex-row justify-between sm:items-center gap-5">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-red-600/30 text-white animate-pulse shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Disaster Response &amp; Drought Emergency Grid</h2>
            <p className="text-xs text-red-200 font-medium">Fast-Track Emergency Dispatch • Water Tanker Deployment • Regional Crisis Management</p>
          </div>
        </div>

        <button
          onClick={() => setDispatched(true)}
          className="px-5 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-red-600/30 hover:shadow-red-500/40 transition-all duration-200 shrink-0 active:scale-[0.98]"
        >
          {dispatched ? '✓ Mobile Purification Tankers Dispatched' : 'Request Emergency Water Tanker Dispatch'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span>High-Priority Emergency Alerts</span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800">2 Critical</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60 space-y-2 text-xs">
              <div className="flex justify-between font-extrabold text-red-900 dark:text-red-200">
                <span>Rapar Taluka, Kachchh</span>
                <span className="px-2 py-0.5 rounded bg-red-200 dark:bg-red-900/70 text-red-900 dark:text-red-200 text-[11px]">TDS 2800 PPM</span>
              </div>
              <p className="text-red-800 dark:text-red-300/90 font-medium">Groundwater salinity elevation alert. Borewell water unsuitable for direct consumption.</p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
              <div className="flex justify-between font-extrabold text-amber-900 dark:text-amber-200">
                <span>Rajkot Urban Sector 4</span>
                <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 text-[11px]">12-Day Storage</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300/90 font-medium">Aaji-1 dam level at 24% capacity. Canal feeder opening recommended.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Mobile Emergency Fleet Status
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold text-slate-900 dark:text-white gap-3">
              <span>Rapar Sector Tanker Fleet</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-right">{dispatched ? 'En Route (ETA 45 mins)' : 'Standby at Gandhidham Hub'}</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold text-slate-900 dark:text-white gap-3">
              <span>Mobile Purification Plant #4</span>
              <span className="text-emerald-600 dark:text-emerald-400">Operational (10,000 L/h)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};