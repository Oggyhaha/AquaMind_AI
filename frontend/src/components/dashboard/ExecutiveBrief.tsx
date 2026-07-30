import React from 'react';
import { UserRole } from '../../types';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExecutiveBriefProps {
  userRole: UserRole;
  userName: string;
  onNavigateOperations: () => void;
}

export const ExecutiveBrief: React.FC<ExecutiveBriefProps> = ({
  userRole,
  userName,
  onNavigateOperations
}) => {
  const getBriefContent = () => {
    switch (userRole) {
      case 'state_authority':
        return {
          title: "Today's Statewide AI Intelligence Brief",
          badge: "State Level Executive Summary",
          points: [
            "3 districts require immediate attention (Rajkot, Kachchh, Ahmedabad).",
            "2 critical pipeline leaks remain unresolved with high water loss.",
            "18.7 Million Liters estimated water saved from completed AI actions yesterday.",
            "Highest priority today: Vadodara industrial audit & Narmada branch canal gate discharge."
          ],
          actionLabel: "Review Approval Queue (2 Pending)"
        };
      case 'district_officer':
        return {
          title: "Ahmedabad District Executive Daily Brief",
          badge: "District Officer Overview",
          points: [
            "Sabarmati Reservoir intake level at 49% capacity; steady drawdown.",
            "Pipeline P-204 Naroda section detected with 91% leak probability.",
            "1 critical repair task assigned to Lead Engineer Priya Desai.",
            "1 completed task awaiting your official verification signature."
          ],
          actionLabel: "View District Task Board"
        };
      case 'engineer':
        return {
          title: "Hydraulic Maintenance Field Dispatch",
          badge: "Field Ops Dispatch",
          points: [
            "1 high-priority task assigned: Narmada Branch Canal Gate 4B calibration.",
            "Sabarmati intake valve repair completed & logged successfully.",
            "Acoustic telemetry tools pre-calibrated for Pipeline P-204 inspection."
          ],
          actionLabel: "Open Assigned Work Orders"
        };
      case 'emergency_officer':
        return {
          title: "Disaster Management & Crisis Brief",
          badge: "Emergency Grid Active",
          points: [
            "Rapar taluka (Kachchh) TDS alert level 2800 PPM; mobile tanker unit requested.",
            "Emergency dispatch protocol ready for immediate execution."
          ],
          actionLabel: "Trigger Emergency Dispatch"
        };
      default:
        return {
          title: "AquaMind AI Platform Operational Brief",
          badge: "System Hydrology Status",
          points: [
            "Statewide Water Health Index: 74/100 (Moderate Stress).",
            "Multi-Agent AI reasoning models operating at 95.4% confidence score."
          ],
          actionLabel: "Explore Command Dashboard"
        };
    }
  };

  const brief = getBriefContent();

  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 dark:from-[#0a0f1a] dark:via-sky-950 dark:to-blue-950 p-8 text-white shadow-xl dark:shadow-none border border-sky-800/40 dark:border-slate-800 relative overflow-hidden mb-6">
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            <span className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{brief.badge}</span>
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">• Updated 5 mins ago</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Good Morning, {userName}
          </h2>

          <ul className="grid sm:grid-cols-2 gap-3 text-xs text-slate-200 font-medium">
            {brief.points.map((point, i) => (
              <li key={i} className="flex items-start space-x-2.5 bg-white/5 dark:bg-white/[0.03] backdrop-blur-md p-3 rounded-2xl border border-white/10 dark:border-white/5 hover:bg-white/10 dark:hover:bg-white/[0.06] transition-colors duration-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0">
          <button
            onClick={onNavigateOperations}
            className="flex items-center space-x-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 dark:from-cyan-400 dark:to-sky-500 dark:hover:from-cyan-300 dark:hover:to-sky-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 dark:shadow-cyan-500/20 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span>{brief.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};