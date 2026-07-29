import React, { useState } from 'react';
import { AgentState, AIRecommendation } from '../../types';
import { Bot, Play, CheckCircle2, AlertCircle, Sparkles, Cpu, ShieldCheck, Zap, ArrowRight, FileText } from 'lucide-react';

interface MultiAgentMissionControlProps {
  agents: AgentState[];
  recommendations: AIRecommendation[];
  onApproveRecommendation: (recId: string) => void;
}

export const MultiAgentMissionControl: React.FC<MultiAgentMissionControlProps> = ({
  agents: initialAgents,
  recommendations,
  onApproveRecommendation
}) => {
  const [agents, setAgents] = useState<AgentState[]>(initialAgents);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(4); // 4 = all complete

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setActiveStep(0);

    // Reset agents to running state sequentially
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));

    // Step 1: Forecast Agent
    setTimeout(() => {
      setActiveStep(1);
      setAgents(prev => prev.map((a, i) => i === 0 ? { ...a, status: 'completed' } : a));
    }, 800);

    // Step 2: Infra Agent
    setTimeout(() => {
      setActiveStep(2);
      setAgents(prev => prev.map((a, i) => i === 1 ? { ...a, status: 'completed' } : a));
    }, 1600);

    // Step 3: Intelligence Agent
    setTimeout(() => {
      setActiveStep(3);
      setAgents(prev => prev.map((a, i) => i === 2 ? { ...a, status: 'completed' } : a));
    }, 2400);

    // Step 4: Recommendation Agent
    setTimeout(() => {
      setActiveStep(4);
      setAgents(prev => prev.map((a, i) => i === 3 ? { ...a, status: 'completed' } : a));
      setIsRunningSim(false);
    }, 3200);
  };

  const getAgentColor = (name: string) => {
    if (name.includes('Forecast')) return 'border-cyan-500 text-cyan-700 bg-cyan-50';
    if (name.includes('Infra')) return 'border-blue-500 text-blue-700 bg-blue-50';
    if (name.includes('Intel')) return 'border-indigo-500 text-indigo-700 bg-indigo-50';
    return 'border-purple-500 text-purple-700 bg-purple-50';
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Run Trigger */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-sky-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">Multi-Agent AI Mission Control</h2>
              <p className="text-xs text-slate-300">LangGraph Agentic Orchestration for Gujarat Water Security</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            AquaMind AI deploys four specialized autonomous agents that collaborate in real time: predicting water shortages, detecting pipeline leaks, querying policy RAG databases, and proposing verified government actions.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isRunningSim}
          className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all transform ${
            isRunningSim
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/25 hover:scale-105 active:scale-95'
          }`}
        >
          {isRunningSim ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-cyan-300" />
              <span>Agents Reasoning in Progress...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Trigger Multi-Agent Re-Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Flow Pipeline Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Agent Orchestration Pipeline Stream</span>
          <span className="text-cyan-600 font-mono">
            {isRunningSim ? `Executing Step ${activeStep}/4...` : 'Status: Ready & Synchronized'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 relative">
          {agents.map((agent, index) => {
            const isCompleted = agent.status === 'completed';
            const isCurrent = isRunningSim && activeStep === index + 1;

            return (
              <div
                key={agent.id}
                className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-50 border-cyan-500 shadow-md ring-2 ring-cyan-400/40 scale-105'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5 text-xs font-bold mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Zap className="w-4 h-4 text-cyan-600 animate-bounce" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                  )}
                  <span className="truncate">{agent.name}</span>
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  {isCurrent ? 'Processing...' : isCompleted ? `${agent.executionTimeMs}ms • ${agent.confidence}% Conf.` : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Agent Cards Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl border font-bold text-xs ${getAgentColor(agent.name)}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                  <p className="text-xs text-slate-500">{agent.role}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {agent.confidence}% Confidence
                </span>
                <span className="block text-[10px] text-slate-400 mt-1">{agent.executionTimeMs} ms</span>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium">
              "{agent.summary}"
            </div>

            {/* Thinking Steps */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Internal Reasoning Chain
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
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

      {/* AI Recommendation Output Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Synthesized Executive Action Recommendations</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Ready for State Authority Approval</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    rec.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    🔴 {rec.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-slate-500">{rec.districtName} District</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{rec.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200/60">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">EST. WATER SAVED</span>
                    <span className="font-extrabold text-sky-700">{(rec.estimatedWaterSavedLiters / 1000000).toFixed(1)}M Liters</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">POPULATION BENEFIT</span>
                    <span className="font-extrabold text-emerald-700">{rec.populationBenefited.toLocaleString()} Citizens</span>
                  </div>
                </div>

                {rec.status === 'ai_suggested' ? (
                  <button
                    onClick={() => onApproveRecommendation(rec.id)}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Generate Operational Task</span>
                  </button>
                ) : (
                  <div className="py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approved • Task Auto-Created in Operations Board</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
