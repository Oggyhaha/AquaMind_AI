import React from 'react';
import { UserRole } from '../../types';
import { Sparkles, TrendingUp, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';

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
          title: "Hydraulic Maintenance Daily Brief",
          badge: "Field Ops Dispatch",
          points: [
            "1 high-priority task assigned: Narmada Branch Canal Gate 4B calibration.",
            "Sabarmati intake valve repair completed & logged successfully.",
            "Tooling & safety clearance pre-validated by AI safety agent."
          ],
          actionLabel: "Open Assigned Work Orders"
        };
      case 'emergency_officer':
        return {
          title: "Disaster Management & Drought Alert Brief",
          badge: "Emergency Grid Active",
          points: [
            "Rapal taluka (Kachchh) TDS alert level 2800 PPM; mobile tanker unit requested.",
            "All emergency protocols pre-loaded with fast-track approval workflow."
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
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 p-6 text-white shadow-xl border border-sky-800/40 relative overflow-hidden mb-6">
      {/* Decorative Background Glows */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{brief.badge}</span>
            </span>
            <span className="text-xs text-slate-400">• Updated 5 mins ago</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <span>Good Morning, {userName}</span>
          </h2>

          <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-200">
            {brief.points.map((point, i) => (
              <li key={i} className="flex items-start space-x-2 bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0">
          <button
            onClick={onNavigateOperations}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95"
          >
            <span>{brief.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
