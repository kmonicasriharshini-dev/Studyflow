import React, { useState } from 'react';
import { TutorExplanation, Topic } from '../types';
import { DEFAULT_TUTOR_NORMALIZATION } from '../data/mockData';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  ArrowRight, 
  FileText, 
  Lightbulb, 
  AlertTriangle,
  Code
} from 'lucide-react';
import { fetchTopicExplanation } from '../services/api';

interface AiTutorProps {
  topics: Topic[];
  onNavigateTab: (tab: string) => void;
}

export const AiTutor: React.FC<AiTutorProps> = ({ topics, onNavigateTab }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('Relational Normalization (1NF, 2NF, 3NF, BCNF)');
  const [activeTab, setActiveTab] = useState<'intuition' | 'steps' | 'pitfalls' | 'practice'>('intuition');
  const [tutorData, setTutorData] = useState<TutorExplanation>(DEFAULT_TUTOR_NORMALIZATION);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentQuestion, setStudentQuestion] = useState<string>('');
  const [revealedHints, setRevealedHints] = useState<{ [key: number]: boolean }>({});
  const [revealedSolutions, setRevealedSolutions] = useState<{ [key: number]: boolean }>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const presetTopics = [
    'Relational Normalization (1NF, 2NF, 3NF, BCNF)',
    '3NF vs BCNF: When does BCNF lose dependency preservation?',
    'Banker’s Algorithm for Deadlock Avoidance (OS)',
    'Virtual Memory Paging & Inverted Page Tables',
    'TCP Congestion Control (Tahoe vs Reno)',
  ];

  const handleSelectTopic = async (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    setIsLoading(true);
    const result = await fetchTopicExplanation(topicTitle, 'Database Management Systems');
    setTutorData(result);
    setIsLoading(false);
    setRevealedHints({});
    setRevealedSolutions({});
  };

  const handleAskCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentQuestion.trim()) return;

    setIsLoading(true);
    const result = await fetchTopicExplanation(studentQuestion, 'College Computer Science');
    setTutorData(result);
    setSelectedTopic(studentQuestion);
    setStudentQuestion('');
    setIsLoading(false);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = `${tutorData.topic}. ${tutorData.simpleIntuition}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Tutor Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Subject Tutor
              </span>
              <span className="text-xs text-slate-500">Step-by-Step Interactive Professor</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
              Plain English Explanations & Exam Mastery
            </h1>
            <p className="text-xs text-slate-500">
              Breaks down intricate university concepts into friendly analogies, schema steps, and practice problems.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeech}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isSpeaking
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Stop Reading' : 'Listen to Tutor'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('quiz')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Test Knowledge on Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Preset Topic Quick Chips */}
        <div className="flex overflow-x-auto gap-2 pt-2 border-t border-slate-100 no-scrollbar">
          {presetTopics.map((pt) => {
            const isSelected = selectedTopic === pt;
            return (
              <button
                key={pt}
                onClick={() => handleSelectTopic(pt)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-100/80 text-indigo-800 border border-indigo-300/80'
                    : 'bg-slate-100/70 hover:bg-slate-200/70 text-slate-600 border border-transparent'
                }`}
              >
                {pt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Explanation Panel & Ask Tutor Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): Tutor Explanation Engine */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Active Topic
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">
                  {tutorData.topic}
                </h2>
              </div>

              {/* RAG Grounding Badge */}
              {tutorData.groundedNoteReference && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium shrink-0">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Grounded in Prof. Rao Notes (p. {tutorData.groundedNoteReference.page})</span>
                </div>
              )}
            </div>

            {/* Explanation Section Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('intuition')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'intuition'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💡 Simple Intuition
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'steps'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🪜 Step-by-Step Breakdown
              </button>
              <button
                onClick={() => setActiveTab('pitfalls')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'pitfalls'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚠️ Exam Traps & Pitfalls
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'practice'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎯 Practice Problems
              </button>
            </div>

            {/* Content Display based on active tab */}
            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-600">AI Tutor is synthesizing step-by-step guidance...</p>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {/* TAB 1: Intuition & Analogy */}
                {activeTab === 'intuition' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                        <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>The "In Plain English" Analogy</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {tutorData.simpleIntuition}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Formal University Definition
                      </span>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {tutorData.formalDefinition}
                      </p>
                    </div>

                    {tutorData.groundedNoteReference && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Direct Excerpt from {tutorData.groundedNoteReference.documentTitle}:</span>
                        </div>
                        <p className="italic text-slate-600 text-[11px]">
                          "{tutorData.groundedNoteReference.quote}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Step-by-Step Breakdown */}
                {activeTab === 'steps' && (
                  <div className="space-y-3">
                    {tutorData.stepByStepPoints?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {item.step}
                          </span>
                          <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-8">
                          {item.detail}
                        </p>
                        {item.exampleOrCode && (
                          <div className="ml-8 mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono whitespace-pre-wrap leading-relaxed">
                            {item.exampleOrCode}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: Exam Pitfalls */}
                {activeTab === 'pitfalls' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Examiners frequently test these edge cases to distinguish top scorers. Keep these committed to memory!
                    </p>
                    {tutorData.examPitfalls?.map((pitfall, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-3"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-950 font-medium leading-relaxed">
                          {pitfall}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: Practice Problems */}
                {activeTab === 'practice' && (
                  <div className="space-y-4">
                    {tutorData.practiceQuestions?.map((pq, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                              Question {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {pq.difficulty}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-slate-800 leading-relaxed">
                          {pq.question}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() =>
                              setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }))
                            }
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            {revealedHints[idx] ? 'Hide Hint' : '💡 Show Hint'}
                          </button>

                          <button
                            onClick={() =>
                              setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }))
                            }
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            {revealedSolutions[idx] ? 'Hide Solution' : '👁️ Reveal Solution'}
                          </button>
                        </div>

                        {revealedHints[idx] && (
                          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900 italic">
                            Hint: {pq.hint}
                          </div>
                        )}

                        {revealedSolutions[idx] && (
                          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800 space-y-1 font-mono">
                            <strong className="text-emerald-800 font-sans block">Official Solution Derivation:</strong>
                            <p className="leading-relaxed">{pq.solution}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right (4 Cols): Ask Custom Question & Learning Tools */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Ask Tutor Anything</span>
            </h3>

            <p className="text-xs text-slate-500">
              Stuck on a homework proof or lecture slide? Enter your topic to receive a tailored breakdown.
            </p>

            <form onSubmit={handleAskCustom} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="e.g. Explain why 3NF can always preserve dependencies but BCNF might not..."
                value={studentQuestion}
                onChange={(e) => setStudentQuestion(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask AI Tutor</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recommended Study Drills
              </span>
              <button
                onClick={() => handleSelectTopic('Relational Normalization (1NF, 2NF, 3NF, BCNF)')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>Normalization Full Sprint</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelectTopic('Banker’s Algorithm for Deadlock Avoidance (OS)')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>OS Banker's Safety Algorithm</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
