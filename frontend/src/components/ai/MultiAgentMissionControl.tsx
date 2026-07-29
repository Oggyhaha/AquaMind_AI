import React, { useState } from 'react';
import { AgentState, AIRecommendation } from '../../types';
import { Bot, Play, CheckCircle2, Sparkles, Cpu, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 rounded-3xl p-8 text-white shadow-xl border border-sky-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Bot className="w-7 h-7 animate-pulse" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-white">Multi-Agent AI Mission Control</h2>
              <p className="text-xs text-slate-300 font-medium">LangGraph Autonomous Orchestration for Gujarat Water Intelligence</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 max-w-3xl leading-relaxed font-medium">
            AquaMind AI deploys four specialized autonomous agents that collaborate in real time: predicting water shortages, detecting pipeline leaks, querying policy RAG databases, and proposing verified government actions.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isRunningSim}
          className={`flex items-center space-x-3 px-7 py-4 rounded-2xl font-extrabold text-xs shadow-lg transition-all transform ${
            isRunningSim
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/25 hover:scale-105 active:scale-95'
          }`}
        >
          {isRunningSim ? (
            <>
              <Cpu className="w-5 h-5 animate-spin text-cyan-300" />
              <span>Agents Reasoning in Progress...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Trigger Multi-Agent Re-Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Orchestration Pipeline Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
          <span>Agent Orchestration Pipeline Stream</span>
          <span className="text-cyan-600 font-mono">
            {isRunningSim ? `Executing Step ${activeStep}/4...` : 'Status: Synchronized & Live'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {agents.map((agent, index) => {
            const isCompleted = agent.status === 'completed';
            const isCurrent = isRunningSim && activeStep === index + 1;

            return (
              <div
                key={agent.id}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-50 border-cyan-500 shadow-md ring-2 ring-cyan-400/40 scale-105'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-2 text-xs font-extrabold mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-mono font-bold">
                      {index + 1}
                    </span>
                  )}
                  <span className="truncate">{agent.name}</span>
                </div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">
                  {isCurrent ? 'Processing...' : isCompleted ? `${agent.executionTimeMs}ms • ${agent.confidence}% Conf.` : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Agent Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 rounded-2xl border font-bold text-xs bg-sky-50 border-sky-200 text-sky-700">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{agent.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {agent.confidence}% Confidence
                </span>
                <span className="block text-[11px] text-slate-400 font-mono mt-1">{agent.executionTimeMs} ms</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-semibold">
              "{agent.summary}"
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Internal Reasoning Chain
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {agent.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-cyan-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Cards Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-extrabold text-slate-900">Synthesized Action Recommendations</h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">Ready for Digital Approval</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase ${
                    rec.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    🔴 {rec.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-slate-600">{rec.districtName} District</span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 leading-snug">{rec.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{rec.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">Est. Water Saved</span>
                    <span className="font-black text-sky-700 text-sm">{(rec.estimatedWaterSavedLiters / 1000000).toFixed(1)}M Liters</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">Population Impact</span>
                    <span className="font-black text-emerald-700 text-sm">{rec.populationBenefited.toLocaleString()} Citizens</span>
                  </div>
                </div>

                {rec.status === 'ai_suggested' ? (
                  <button
                    onClick={() => setSelectedRecForApproval(rec)}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Digital Approval & Task Dispatch</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold rounded-2xl space-y-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Approved with Digital Signature #{rec.digitalSignature || 'DIG-SIG-9904'}</span>
                    </div>
                    {rec.approvalComment && (
                      <p className="text-[11px] font-medium text-emerald-900 italic">
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
