import React from 'react';
import { District, OperationalTask, Reservoir } from '../../types';
import { Building2, Waves, CheckSquare, Activity, AlertTriangle, Users } from 'lucide-react';

interface DistrictDashboardProps {
  districtName: string;
  districtData: District | undefined;
  tasks: OperationalTask[];
  reservoirs: Reservoir[];
  onNavigateOperations: () => void;
}

export const DistrictDashboard: React.FC<DistrictDashboardProps> = ({
  districtName,
  districtData,
  tasks,
  reservoirs,
  onNavigateOperations
}) => {
  const districtTasks = tasks.filter(t => t.districtName.toLowerCase() === districtName.toLowerCase());
  const districtReservoirs = reservoirs.filter(r => r.district.toLowerCase() === districtName.toLowerCase() || districtName === 'Ahmedabad');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-white">{districtName} District Command Center</h2>
              <p className="text-xs text-slate-300 font-medium">District Water Officer Workspace • Local Supply, Assets & Field Engineers</p>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateOperations}
          className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all shrink-0"
        >
          View District Tasks ({districtTasks.length})
        </button>
      </div>

      {/* District KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400">Daily Demand</span>
          <div className="text-2xl font-black text-slate-900">{districtData?.waterDemandMLD || 1450} MLD</div>
          <span className="text-xs font-bold text-slate-500">Municipal & Agricultural</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400">Current Supply</span>
          <div className={`text-2xl font-black ${(districtData?.waterSupplyMLD || 1280) < (districtData?.waterDemandMLD || 1450) ? 'text-amber-600' : 'text-emerald-600'}`}>
            {districtData?.waterSupplyMLD || 1280} MLD
          </div>
          <span className="text-xs font-bold text-amber-600">
            Deficit: {Math.abs((districtData?.waterDemandMLD || 1450) - (districtData?.waterSupplyMLD || 1280))} MLD
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400">Groundwater Depth</span>
          <div className="text-2xl font-black text-slate-900">{districtData?.groundwaterLevelM || 38.5} m</div>
          <span className="text-xs font-bold text-slate-500">Monsoon aquifer depth</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400">Active Work Orders</span>
          <div className="text-2xl font-black text-sky-900">{districtTasks.length}</div>
          <span className="text-xs font-bold text-emerald-600">Lead Eng. Priya Desai</span>
        </div>
      </div>

      {/* District Reservoirs & Pipeline Health */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">District Reservoir Levels</h3>
            <span className="text-xs font-bold text-sky-600">Sabarmati Feeder Grid</span>
          </div>

          <div className="space-y-3">
            {districtReservoirs.map(r => (
              <div key={r.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{r.name}</span>
                  <span className="text-sky-700">{r.fillPercentage}% Storage</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${r.fillPercentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">District Field Maintenance Queue</h3>
            <span className="text-xs font-bold text-slate-500">Assign & Verify Work</span>
          </div>

          <div className="space-y-3">
            {districtTasks.map(t => (
              <div key={t.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between font-extrabold text-slate-900">
                  <span>Task #{t.id}</span>
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[11px] uppercase font-bold">{t.status}</span>
                </div>
                <p className="text-slate-600 font-medium">{t.title}</p>
                <div className="text-[11px] text-slate-400 pt-1">Assigned: {t.assignedEngineerName || 'Unassigned'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
