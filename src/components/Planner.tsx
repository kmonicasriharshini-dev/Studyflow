import React, { useState } from 'react';
import { 
  Topic, 
  Exam, 
  StudyPlanDay, 
  TopicDifficulty 
} from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  Plus, 
  Check, 
  Flame, 
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';

interface PlannerProps {
  exams: Exam[];
  topics: Topic[];
  planDays: StudyPlanDay[];
  onToggleTopicCovered: (topicId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAgenticDemo: () => void;
}

export const Planner: React.FC<PlannerProps> = ({
  exams,
  topics,
  planDays,
  onToggleTopicCovered,
  onNavigateTab,
  onOpenAgenticDemo,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<'dbms' | 'os' | 'cn'>('dbms');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [expandedDay, setExpandedDay] = useState<number>(1);

  const currentExam = exams.find((e) => e.subjectId === selectedSubjectId) || exams[0];
  const subjectTopics = topics.filter((t) => t.subjectId === selectedSubjectId);

  const filteredTopics = subjectTopics.filter((t) => {
    if (filterDifficulty === 'All') return true;
    return t.difficulty === filterDifficulty;
  });

  const coveredCount = subjectTopics.filter((t) => t.isCovered).length;
  const totalCount = subjectTopics.length;
  const coveragePercent = Math.round((coveredCount / (totalCount || 1)) * 100);

  const totalEstimatedHours = subjectTopics.reduce((acc, t) => acc + t.estimatedHours, 0);
  const coveredHours = subjectTopics
    .filter((t) => t.isCovered)
    .reduce((acc, t) => acc + t.estimatedHours, 0);

  // Helper for pastel badge colors
  const getDifficultyBadge = (difficulty: TopicDifficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
      case 'Medium':
        return 'bg-sky-50 text-sky-700 border-sky-200/70';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200/70';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Planner Header with Exam Selector */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Exam Preparation Engine
              </span>
              <span className="text-xs text-slate-500">Autonomous Study Planner</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
              Personalized Study & Sprint Planner
            </h1>
            <p className="text-xs text-slate-500">
              Paces your daily study hours, flags high-weightage topics, and tracks unit completion.
            </p>
          </div>

          {/* Subject Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 shrink-0">
            <button
              onClick={() => setSelectedSubjectId('dbms')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubjectId === 'dbms'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DBMS (10d)
            </button>
            <button
              onClick={() => setSelectedSubjectId('os')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubjectId === 'os'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OS (18d)
            </button>
            <button
              onClick={() => setSelectedSubjectId('cn')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubjectId === 'cn'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Networks (25d)
            </button>
          </div>
        </div>

        {/* Selected Exam Snapshot Banner with Pastel Background */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-sky-50/60 border border-indigo-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800">
                {currentExam.code}
              </span>
              <h3 className="font-bold text-base text-slate-800">{currentExam.subjectName}</h3>
            </div>
            <p className="text-xs text-slate-600 flex flex-wrap items-center gap-4 pt-0.5">
              <span>📅 <strong className="text-slate-800">Exam Date:</strong> {currentExam.date} ({currentExam.daysLeft} days remaining)</span>
              <span>⏱️ <strong className="text-slate-800">Daily Target:</strong> 2.5 hrs/day</span>
              <span>🎯 <strong className="text-slate-800">Total Paper Marks:</strong> {currentExam.totalMarks} Marks</span>
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Readiness Score</div>
              <div className="text-xl font-extrabold text-indigo-700">{coveragePercent}%</div>
            </div>

            <button
              onClick={onOpenAgenticDemo}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Topic Tracker & Day-by-Day Sprint Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Important Topics, Covered vs Pending Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-indigo-600" />
                  <span>Syllabus Topics Checklist & Difficulty</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {coveredCount} of {totalCount} topics mastered ({coveredHours} of {totalEstimatedHours} hours covered)
                </p>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      filterDifficulty === diff
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic List */}
            <div className="space-y-2.5">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => onToggleTopicCovered(topic.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                    topic.isCovered
                      ? 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200'
                      : 'bg-white hover:bg-indigo-50/20 border-slate-200 hover:border-indigo-200 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0"
                  >
                    {topic.isCovered ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold ${topic.isCovered ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {topic.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(topic.difficulty)}`}>
                        {topic.difficulty}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {topic.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-500 font-medium">{topic.unitTitle}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-indigo-700">{topic.weightageMarks} Marks in Exam</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">⏱️ ~{topic.estimatedHours} hrs</span>
                      {topic.highYield && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 font-semibold ml-auto">
                          ⭐ High Yield Topic
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
              <span>Need step-by-step guidance on unmastered topics?</span>
              <button
                onClick={() => onNavigateTab('tutor')}
                className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Launch AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Day-by-Day Interactive Roadmap */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>10-Day Sprint Roadmap</span>
                </h2>
                <p className="text-xs text-slate-500">DBMS End-Term Intensive Preparation</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/50">
                25 Total Hours
              </span>
            </div>

            {/* Day list accordion */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {planDays.map((day) => {
                const isExpanded = expandedDay === day.dayNumber;
                return (
                  <div
                    key={day.dayNumber}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'border-indigo-200 bg-indigo-50/20 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedDay(isExpanded ? 0 : day.dayNumber)}
                      className="w-full p-3.5 text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                          day.dayNumber <= 2
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {day.dayNumber}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{day.date} • {day.focus}</p>
                          <p className="text-[11px] text-slate-500">Allocated: {day.allocatedHours} Hours</p>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 space-y-2">
                        <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-xl border border-slate-100">
                          🎯 Strategy: {day.notes}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {day.topics.map((t) => (
                            <div
                              key={t.id}
                              className="p-2 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className={t.completed ? 'text-emerald-600' : 'text-slate-400'}>
                                  {t.completed ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                </span>
                                <span className={t.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                                  {t.name}
                                </span>
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${getDifficultyBadge(t.difficulty)}`}>
                                {t.difficulty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
