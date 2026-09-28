import React, { useState, useEffect } from 'react';
import { 
  AgentWorkflowStep, 
  AgentWorkflowResult 
} from '../types';
import { executeAgenticWorkflow } from '../services/agentWorkflowEngine';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Brain, 
  BookOpen, 
  Calendar, 
  Search, 
  TrendingUp, 
  ChevronRight, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Check, 
  Layers, 
  Send,
  Sliders,
  Copy,
  Terminal,
  Activity
} from 'lucide-react';

interface AgenticWorkflowProps {
  onApplyPlan: (plan: any) => void;
  onNavigateTab: (tab: string) => void;
}

export const AgenticWorkflow: React.FC<AgenticWorkflowProps> = ({
  onApplyPlan,
  onNavigateTab,
}) => {
  const defaultPrompt = "I have a DBMS exam in 10 days and I haven't studied normalization.";
  const [queryInput, setQueryInput] = useState<string>(defaultPrompt);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentRunningStepIndex, setCurrentRunningStepIndex] = useState<number>(-1);
  const [steps, setSteps] = useState<AgentWorkflowStep[]>([]);
  const [result, setResult] = useState<AgentWorkflowResult | null>(null);
  const [selectedInspectStep, setSelectedInspectStep] = useState<AgentWorkflowStep | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'overview' | 'plan' | 'rag' | 'tutor' | 'questions'>('overview');

  const presets = [
    {
      title: "DBMS 10-Day Normalization Sprint",
      query: "I have a DBMS exam in 10 days and I haven't studied normalization.",
      tag: "Workshop Demo (Default)",
    },
    {
      title: "OS 7-Day Memory & Paging Sprint",
      query: "I have an OS exam in 7 days and haven't covered Virtual Memory Paging vs Segmentation.",
      tag: "OS CS502",
    },
    {
      title: "Networks 3-Day Subnetting Crash Plan",
      query: "Computer Networks test in 3 days, need high-yield crash plan for Subnetting & CIDR.",
      tag: "Networks CS503",
    },
  ];

  const handleRunWorkflow = async (promptToRun?: string) => {
    const finalQuery = promptToRun || queryInput;
    setIsExecuting(true);
    setResult(null);
    setSelectedInspectStep(null);

    try {
      const res = await executeAgenticWorkflow(finalQuery, (updatedStep, allSteps) => {
        setSteps([...allSteps]);
        const runningIdx = allSteps.findIndex((s) => s.status === 'running');
        setCurrentRunningStepIndex(runningIdx !== -1 ? runningIdx : allSteps.length - 1);
        if (updatedStep.status === 'completed' && !selectedInspectStep) {
          setSelectedInspectStep(updatedStep);
        }
      });
      setResult(res);
      onApplyPlan(res.studyPlan);
    } catch (err) {
      console.error('Agent workflow execution failed:', err);
    } finally {
      setIsExecuting(false);
      setCurrentRunningStepIndex(-1);
    }
  };

  const getStepIcon = (agentRole: string) => {
    switch (agentRole) {
      case 'Coordinator Agent':
        return Brain;
      case 'Syllabus Specialist':
        return BookOpen;
      case 'Schedule Planner':
        return Calendar;
      case 'RAG Tool':
        return Search;
      case 'LLM Synthesis':
        return Sparkles;
      case 'Progress Sync':
        return TrendingUp;
      default:
        return Workflow;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Architectural Flow Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/70 flex items-center gap-1">
                <Workflow className="w-3.5 h-3.5" />
                Live Agentic Orchestration
              </span>
              <span className="text-xs text-slate-500">Multi-Agent & Tool Pipeline</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
              Autonomous Student Study Workflow
            </h1>
            <p className="text-xs text-slate-500">
              Demonstrates an actual multi-agent system coordinating task deconstruction, syllabus traversal, schedule optimization, vector RAG retrieval, and progress tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Multi-Agent Chain Active</span>
            </span>
          </div>
        </div>

        {/* The Exact Visual Chain Requested for Workshop:
            User → Coordinator Agent → Specialized Agent → Tool/RAG → LLM → Result → User */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-sky-50/60 border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Workshop Demonstration Chain
            </span>
            <span className="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
              User ➔ Coordinator ➔ Specialist ➔ Tool/RAG ➔ LLM ➔ Result ➔ User
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
            {[
              { label: '1. User Goal', sub: 'Natural query', icon: '👤', active: isExecuting && currentRunningStepIndex === 0 },
              { label: '2. Coordinator', sub: 'Intent & route', icon: '🧠', active: isExecuting && currentRunningStepIndex === 0 },
              { label: '3. Specialist', sub: 'Syllabus tree', icon: '📚', active: isExecuting && currentRunningStepIndex === 1 },
              { label: '4. Planner', sub: 'Sprint schedule', icon: '🗓️', active: isExecuting && currentRunningStepIndex === 2 },
              { label: '5. Tool / RAG', sub: 'Notes vector DB', icon: '🔍', active: isExecuting && currentRunningStepIndex === 3 },
              { label: '6. LLM Synthesis', sub: 'Analogy & tutor', icon: '✨', active: isExecuting && (currentRunningStepIndex === 4 || currentRunningStepIndex === 5) },
              { label: '7. Progress Sync', sub: 'Portal update', icon: '📈', active: isExecuting && currentRunningStepIndex === 6 },
            ].map((node, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  node.active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-102 ring-2 ring-indigo-200'
                    : result
                    ? 'bg-white/90 text-slate-800 border-indigo-200/80 shadow-2xs'
                    : 'bg-white/60 text-slate-600 border-slate-200/60'
                }`}
              >
                <div className="text-base">{node.icon}</div>
                <div className="text-[11px] font-bold mt-1 truncate">{node.label}</div>
                <div className={`text-[9px] truncate ${node.active ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {node.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workshop Prompt Presets */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-700">Workshop Quick Presets:</span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setQueryInput(p.query);
                  handleRunWorkflow(p.query);
                }}
                disabled={isExecuting}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left text-xs transition-all cursor-pointer group flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-indigo-900">{p.title}</span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-xs">{p.query}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Box */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type student scenario (e.g. 'I have a DBMS exam in 10 days and I haven't studied normalization')..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                disabled={isExecuting}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50"
              />
            </div>
            <button
              onClick={() => handleRunWorkflow()}
              disabled={isExecuting || !queryInput.trim()}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer shrink-0"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agents Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Agentic Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Execution Monitor: Step List & Real-Time Inspector */}
      {(steps.length > 0 || isExecuting) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 Cols): Live Step Cards with Status & Timers */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">Agent Chain Execution Steps</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {steps.filter((s) => s.status === 'completed').length} / {steps.length || 7} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {steps.map((step, idx) => {
                const Icon = getStepIcon(step.agentRole);
                const isSelected = selectedInspectStep?.id === step.id;

                let badgeColor = 'bg-slate-100 text-slate-500 border-slate-200';
                if (step.status === 'running') {
                  badgeColor = 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-100 animate-pulse';
                } else if (step.status === 'completed') {
                  badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                }

                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedInspectStep(step)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-300 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          step.status === 'running'
                            ? 'bg-amber-100 text-amber-800'
                            : step.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {step.status === 'running' ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : step.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{step.title}</p>
                          <span className="text-[10px] text-slate-500 font-medium">{step.agentRole}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {step.status.toUpperCase()}
                        </span>
                        {step.durationMs !== undefined && step.durationMs > 0 && (
                          <span className="block text-[9px] text-slate-400 mt-0.5 font-mono">
                            {step.durationMs}ms
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 Cols): Step Inspector Drawer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-800">
                    Agent Inspector: {selectedInspectStep ? selectedInspectStep.agentRole : 'Select a step'}
                  </span>
                </div>
                {selectedInspectStep?.durationMs && (
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    ⏱️ {selectedInspectStep.durationMs}ms
                  </span>
                )}
              </div>

              {selectedInspectStep ? (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                      Agent Internal Thought Log
                    </span>
                    <p className="text-xs text-slate-700 italic">
                      "{selectedInspectStep.thought}"
                    </p>
                  </div>

                  {selectedInspectStep.log && (
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 border-b border-slate-800 pb-1">
                        Execution Telemetry
                      </div>
                      {selectedInspectStep.log.map((line, i) => (
                        <div key={i} className="text-emerald-400 leading-relaxed">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedInspectStep.outputData && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Structured Agent Output Payload
                      </span>
                      <pre className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px] overflow-x-auto leading-relaxed">
                        {JSON.stringify(selectedInspectStep.outputData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Click on any step card on the left to inspect thoughts, parameters, and telemetry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assembled Multi-Agent Results View */}
      {result && (
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Workflow Execution Succeeded
                </span>
                <span className="text-xs text-slate-500">Autonomous Result Assembled</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                Generated Solution: {result.identifiedTopic}
              </h2>
              <p className="text-xs text-slate-500">
                Paced for {result.daysRemaining} days remaining ({result.availableHours} hours allocated). Grounded with uploaded notes.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateTab('planner')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Apply to Study Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('tutor')}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open in AI Tutor</span>
              </button>
              <button
                onClick={() => onNavigateTab('quiz')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Take Mastery Quiz</span>
              </button>
            </div>
          </div>

          {/* Results Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveResultTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeResultTab === 'overview'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Strategic Overview
            </button>
            <button
              onClick={() => setActiveResultTab('plan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeResultTab === 'plan'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗓️ 10-Day Sprint Plan
            </button>
            <button
              onClick={() => setActiveResultTab('rag')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeResultTab === 'rag'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔍 Retrieved RAG Excerpts ({result.retrievedNotes.length})
            </button>
            <button
              onClick={() => setActiveResultTab('tutor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeResultTab === 'tutor'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💡 AI Tutor Explanation
            </button>
            <button
              onClick={() => setActiveResultTab('questions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeResultTab === 'questions'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎯 Generated Practice Set
            </button>
          </div>

          {/* Results Tab 1: Overview */}
          {activeResultTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                  1. Goal Identification
                </span>
                <h4 className="font-bold text-sm text-slate-800">{result.identifiedSubject}</h4>
                <p className="text-xs text-slate-600">
                  Targeted Unit 3: Normalization & Functional Dependencies. 22% of total exam score.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  2. Study Time Budget
                </span>
                <h4 className="font-bold text-sm text-slate-800">{result.availableHours} Hours Allocated</h4>
                <p className="text-xs text-slate-600">
                  2.5 hrs/day across {result.daysRemaining} days. 14 hrs core normalization + 11 hrs revision.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
                  3. Vector RAG Grounding
                </span>
                <h4 className="font-bold text-sm text-slate-800">Prof. Rao DBMS Notes</h4>
                <p className="text-xs text-slate-600">
                  Indexed 3 critical excerpts on 1NF, 2NF, 3NF and BCNF decomposition.
                </p>
              </div>
            </div>
          )}

          {/* Results Tab 2: Plan */}
          {activeResultTab === 'plan' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Paced day-by-day roadmap generated by the Schedule Optimization Agent:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.studyPlan.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {day.date}
                      </span>
                      <span className="text-[10px] text-slate-500">⏱️ {day.allocatedHours} hrs</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800">{day.focus}</h4>
                    <p className="text-[11px] text-slate-500 italic">{day.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Tab 3: RAG Excerpts */}
          {activeResultTab === 'rag' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Exact lecture note passages retrieved by the RAG Vector Tool:
              </p>
              <div className="space-y-3">
                {result.retrievedNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{note.docTitle} (Page {note.page})</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {Math.round(note.relevanceScore * 100)}% Similarity
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-700 bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                      {note.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Tab 4: AI Tutor Explanation */}
          {activeResultTab === 'tutor' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <span className="text-xs font-bold text-indigo-900">💡 Simple English Analogy</span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {result.explanation.simpleIntuition}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800">Decomposition Steps:</span>
                {result.explanation.stepByStepPoints.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                    <strong className="text-slate-800 block mb-0.5">{s.title}</strong>
                    <p className="text-slate-600">{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Tab 5: Practice Questions */}
          {activeResultTab === 'questions' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Tailored exam questions synthesized by the Assessment Agent:
              </p>
              <div className="space-y-3">
                {result.practiceQuestions.map((pq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-800">Problem {idx + 1} ({pq.type})</span>
                    </div>
                    <p className="font-bold text-slate-800">{pq.question}</p>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 font-mono text-slate-700">
                      <strong>Expected Proof: </strong>
                      {pq.expectedAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
