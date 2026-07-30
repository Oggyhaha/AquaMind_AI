import React, { useState } from 'react';
import { AgentState, AIRecommendation } from '../../types';
import { Bot, Play, CheckCircle2, Sparkles, Cpu, ShieldCheck, AlertCircle } from 'lucide-react';
import { DigitalApprovalModal } from '../operations/DigitalApprovalModal';

interface MultiAgentMissionControlProps {
  agents: AgentState[];
  recommendations: AIRecommendation[];
  approverName: string;
  approverTitle: string;
  onApproveRecommendation: (recId: string, approvalComment: string, digitalSignature: string) => void;
}

export const MultiAgentMissionControl: React.FC<MultiAgentMissionControlProps> = ({
  agents: initialAgents,
  recommendations,
  approverName,
  approverTitle,
  onApproveRecommendation
}) => {
  const [agents, setAgents] = useState<AgentState[]>(initialAgents);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(4);
  const [selectedRecForApproval, setSelectedRecForApproval] = useState<AIRecommendation | null>(null);

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setActiveStep(0);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));

    setTimeout(() => {
      setActiveStep(1);
      setAgents(prev => prev.map((a, i) => i === 0 ? { ...a, status: 'completed' } : a));
    }, 800);

    setTimeout(() => {
      setActiveStep(2);
      setAgents(prev => prev.map((a, i) => i === 1 ? { ...a, status: 'completed' } : a));
    }, 1600);

    setTimeout(() => {
      setActiveStep(3);
      setAgents(prev => prev.map((a, i) => i === 2 ? { ...a, status: 'completed' } : a));
    }, 2400);

    setTimeout(() => {
      setActiveStep(4);
      setAgents(prev => prev.map((a, i) => i === 3 ? { ...a, status: 'completed' } : a));
      setIsRunningSim(false);
    }, 3200);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-5 sm:p-8 text-white shadow-md border border-sky-800/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-xl bg-sky-500/15 text-sky-300 border border-sky-400/30 shrink-0">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Multi-Agent AI Mission Control</h2>
              <p className="text-xs text-slate-300 font-medium mt-0.5">LangGraph Autonomous Orchestration for Gujarat Water Intelligence</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 max-w-3xl leading-relaxed font-medium">
            AquaMind AI deploys four specialized autonomous agents that collaborate in real time: predicting water shortages, detecting pipeline leaks, querying policy RAG databases, and proposing verified government actions.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isRunningSim}
          className={`flex items-center justify-center space-x-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-extrabold text-xs shadow-md transition-all shrink-0 ${
            isRunningSim
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20 active:scale-95'
          }`}
        >
          {isRunningSim ? (
            <>
              <Cpu className="w-5 h-5 animate-spin text-sky-400" />
              <span>Agents Reasoning in Progress...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>Trigger Multi-Agent Re-Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Orchestration Pipeline Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-extrabold text-slate-800 dark:text-slate-200">
          <span>Agent Orchestration Pipeline Stream</span>
          <span className="text-sky-600 dark:text-sky-400 font-mono">
            {isRunningSim ? `Executing Step ${activeStep}/4...` : 'Status: Synchronized & Live'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {agents.map((agent, index) => {
            const isCompleted = agent.status === 'completed';
            const isCurrent = isRunningSim && activeStep === index + 1;

            return (
              <div
                key={agent.id}
                className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-500 dark:border-sky-500 shadow-sm ring-2 ring-sky-400/40 scale-[1.02]'
                    : isCompleted
                    ? 'bg-emerald-50/60 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2 text-xs font-extrabold mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-mono font-bold">
                      {index + 1}
                    </span>
                  )}
                  <span className="truncate">{agent.name}</span>
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  {isCurrent ? 'Processing...' : isCompleted ? `${agent.executionTimeMs}ms • ${agent.confidence}% Conf.` : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Agent Cards Grid */}
      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md dark:hover:border-slate-700 transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="p-3 rounded-xl border font-bold text-xs bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-400 shrink-0">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{agent.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{agent.role}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
                  {agent.confidence}% Confidence
                </span>
                <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1">{agent.executionTimeMs} ms</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
              "{agent.summary}"
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Internal Reasoning Chain
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {agent.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-sky-500 dark:text-sky-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Cards Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Synthesized Action Recommendations</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Ready for Digital Approval</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold uppercase ${
                    rec.priority === 'critical'
                      ? 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400'
                      : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400'
                  }`}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {rec.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{rec.districtName} District</span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{rec.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{rec.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold block uppercase">Est. Water Saved</span>
                    <span className="font-black text-sky-700 dark:text-sky-400 text-sm">{(rec.estimatedWaterSavedLiters / 1000000).toFixed(1)}M Liters</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold block uppercase">Population Impact</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">{rec.populationBenefited.toLocaleString()} Citizens</span>
                  </div>
                </div>

                {rec.status === 'ai_suggested' ? (
                  <button
                    onClick={() => setSelectedRecForApproval(rec)}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Digital Approval & Task Dispatch</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-extrabold rounded-xl space-y-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Approved with Digital Signature #{rec.digitalSignature || 'DIG-SIG-9904'}</span>
                    </div>
                    {rec.approvalComment && (
                      <p className="text-[11px] font-medium text-emerald-900 dark:text-emerald-300 italic">
                        "{rec.approvalComment}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Approval Chain Modal */}
      <DigitalApprovalModal
        isOpen={!!selectedRecForApproval}
        recommendation={selectedRecForApproval}
        approverName={approverName}
        approverTitle={approverTitle}
        onClose={() => setSelectedRecForApproval(null)}
        onConfirmApproval={(recId, comment, sig) => {
          onApproveRecommendation(recId, comment, sig);
          setSelectedRecForApproval(null);
        }}
      />

    </div>
  );
};