import React from 'react';
import { District, OperationalTask, Reservoir } from '../../types';
import { Building2, Waves, CheckSquare, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

interface DistrictDashboardProps {
  districtName: string;
  districtData: District | undefined;
  tasks: OperationalTask[];
  reservoirs: Reservoir[];
  isEmergencyMode: boolean;
  emergencyDetails: { title: string; description: string; district: string; isTakenOver: boolean; takenOverBy?: string } | null;
  onTakeoverEmergency: () => void;
  onNavigateOperations: () => void;
}

export const DistrictDashboard: React.FC<DistrictDashboardProps> = ({
  districtName,
  districtData,
  tasks,
  reservoirs,
  isEmergencyMode,
  emergencyDetails,
  onTakeoverEmergency,
  onNavigateOperations
}) => {
  const districtTasks = tasks.filter(t => t.districtName.toLowerCase() === districtName.toLowerCase());
  const districtReservoirs = reservoirs.filter(r => r.district.toLowerCase() === districtName.toLowerCase() || districtName === 'Ahmedabad');

  return (
    <div className="space-y-6">

      {/* Emergency Mode Takeover Card for District Officer */}
      {isEmergencyMode && emergencyDetails && (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-slate-900 dark:from-red-950 dark:via-red-950/90 dark:to-slate-950 rounded-3xl p-7 text-white shadow-xl shadow-red-950/30 border border-red-800 dark:border-red-900 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
          <div className="flex items-center space-x-3.5">
            <span className="p-3 rounded-2xl bg-red-600/40 text-white shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </span>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-xl font-extrabold text-white tracking-tight">Emergency Response Request</h3>
                <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-[11px] font-black uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-red-200 mt-1 font-medium">
                Secretary has declared emergency: <strong>"{emergencyDetails.title}"</strong> ({emergencyDetails.district} Zone).
              </p>
            </div>
          </div>

          {!emergencyDetails.isTakenOver ? (
            <button
              onClick={onTakeoverEmergency}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 transition-all duration-200 shrink-0 flex items-center space-x-2 active:scale-[0.98]"
            >
              <UserCheck className="w-5 h-5" />
              <span>Takeover Emergency &amp; Dispatch Field Unit</span>
            </button>
          ) : (
            <div className="px-5 py-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-bold rounded-2xl flex items-center space-x-2 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Taken Over by {emergencyDetails.takenOverBy}. Response sent to Secretary.</span>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 dark:from-sky-950 dark:via-blue-950 dark:to-[#0a0f1a] rounded-3xl p-7 text-white shadow-xl dark:shadow-none dark:border dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-5">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{districtName} District Command Center</h2>
              <p className="text-xs text-slate-300 font-medium">District Water Officer Workspace • Local Supply, Assets &amp; Field Engineers</p>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateOperations}
          className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-2xl shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-200 shrink-0 active:scale-[0.98]"
        >
          View District Tasks ({districtTasks.length})
        </button>
      </div>

      {/* District KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none hover:shadow-sm dark:hover:border-slate-700 transition-all duration-200 space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Daily Demand</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{districtData?.waterDemandMLD || 1450} MLD</div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Municipal &amp; Agricultural</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none hover:shadow-sm dark:hover:border-slate-700 transition-all duration-200 space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Current Supply</span>
          <div className={`text-2xl font-black ${(districtData?.waterSupplyMLD || 1280) < (districtData?.waterDemandMLD || 1450) ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {districtData?.waterSupplyMLD || 1280} MLD
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            Deficit: {Math.abs((districtData?.waterDemandMLD || 1450) - (districtData?.waterSupplyMLD || 1280))} MLD
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none hover:shadow-sm dark:hover:border-slate-700 transition-all duration-200 space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Groundwater Depth</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{districtData?.groundwaterLevelM || 38.5} m</div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Monsoon aquifer depth</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none hover:shadow-sm dark:hover:border-slate-700 transition-all duration-200 space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Active Work Orders</span>
          <div className="text-2xl font-black text-sky-900 dark:text-sky-400">{districtTasks.length}</div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Lead Eng. Priya Desai</span>
        </div>
      </div>

      {/* District Reservoirs & Pipeline Health */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">District Reservoir Levels</h3>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Sabarmati Feeder Grid</span>
          </div>

          <div className="space-y-3">
            {districtReservoirs.map(r => (
              <div key={r.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>{r.name}</span>
                  <span className="text-sky-700 dark:text-sky-400">{r.fillPercentage}% Storage</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 dark:bg-sky-500 rounded-full" style={{ width: `${r.fillPercentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">District Field Maintenance Queue</h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Assign &amp; Verify Work</span>
          </div>

          <div className="space-y-3">
            {districtTasks.map(t => (
              <div key={t.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between font-extrabold text-slate-900 dark:text-white">
                  <span>Task #{t.id}</span>
                  <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-[11px] uppercase font-bold border border-sky-200 dark:border-sky-800">{t.status}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{t.title}</p>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">Assigned: {t.assignedEngineerName || 'Unassigned'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};