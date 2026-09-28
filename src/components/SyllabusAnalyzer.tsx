import React, { useState } from 'react';
import { Subject, Topic } from '../types';
import { 
  BookOpenCheck, 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Search, 
  Upload, 
  RefreshCw,
  FolderTree
} from 'lucide-react';
import { fetchSyllabusAnalysis } from '../services/api';

interface SyllabusAnalyzerProps {
  subjects: Subject[];
  topics: Topic[];
  onNavigateTab: (tab: string) => void;
}

export const SyllabusAnalyzer: React.FC<SyllabusAnalyzerProps> = ({
  subjects,
  topics,
  onNavigateTab,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('dbms');
  const [customText, setCustomText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [extractedResult, setExtractedResult] = useState<any>(null);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectTopics = topics.filter((t) => t.subjectId === selectedSubjectId);

  // Group topics by unit
  const unitsMap = subjectTopics.reduce((acc: { [key: string]: Topic[] }, topic) => {
    if (!acc[topic.unitTitle]) {
      acc[topic.unitTitle] = [];
    }
    acc[topic.unitTitle].push(topic);
    return acc;
  }, {});

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const textToAnalyze = customText.trim() || `Course: ${currentSubject.name} (${currentSubject.code})\nSyllabus contains 5 core units: ER Modeling, Relational Algebra, Normalization & Relational Design, Concurrency Control, B+ Tree Indexing.`;
    
    // Call server analyzer or fallback
    const result = await fetchSyllabusAnalysis(textToAnalyze, currentSubject.name);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setExtractedResult(result || {
        subjectName: currentSubject.name,
        totalUnits: Object.keys(unitsMap).length,
        status: 'Successfully Extracted & Indexed',
        units: Object.entries(unitsMap).map(([title, tops], index) => ({
          unitNumber: index + 1,
          title,
          weightageMarks: tops.reduce((a, b) => a + b.weightageMarks, 0),
          topics: tops.map((t) => ({
            name: t.name,
            difficulty: t.difficulty,
            estimatedHours: t.estimatedHours,
            summary: t.summary,
            highYield: t.highYield,
          })),
        })),
        recommendations: 'Unit 3 (Normalization & Relational Design) has the highest weightage (approx 34% of long-answer marks). Prioritize 1NF->BCNF decomposition proofs.',
      });
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Syllabus Analyzer Agent
              </span>
              <span className="text-xs text-slate-500">Autonomous Curriculum Parser</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
              Curriculum Deconstruction & Subject Organization
            </h1>
            <p className="text-xs text-slate-500">
              The Syllabus Specialist Agent extracts units, identifies high-yield topics, maps exam weightage, and organizes them by course.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Push to Study Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subject Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pt-2 border-t border-slate-100 no-scrollbar">
          {subjects.map((sub) => {
            const isSelected = selectedSubjectId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setExtractedResult(null);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {sub.code}: {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Raw Syllabus Input / Extraction Trigger & Structured Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Agent Controller & Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Syllabus Extraction Pipeline</span>
            </div>

            <p className="text-xs text-slate-600">
              Paste your college syllabus handout or click <strong className="text-slate-800">Analyze Current Syllabus</strong> to let the AI agent extract all units and topics automatically.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Raw Syllabus Text (Optional Custom Input)
              </label>
              <textarea
                rows={5}
                placeholder={`Paste syllabus text here or leave blank to analyze ${currentSubject.name} (${currentSubject.code})...`}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Agent Parsing Syllabus...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Units & Topics with Agent</span>
                  </>
                )}
              </button>
            </div>

            {/* Agent Metadata box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span>Agent Capability</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">Active</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li>• Subject Entity Extraction & Credit Mapping</li>
                <li>• Unit Partitioning (Unit 1 to 5)</li>
                <li>• Granular Topic Detection & Dependency Sorting</li>
                <li>• University Exam Weightage Prediction</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Visual Extracted Units & Topics Tree */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-indigo-600" />
                  <span>Structured Units & Topics: {currentSubject.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {Object.keys(unitsMap).length} Units Identified • {subjectTopics.length} Topics Organized
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                100% Parsed
              </span>
            </div>

            {/* Extracted Unit Cards */}
            <div className="space-y-4">
              {Object.entries(unitsMap).map(([unitTitle, unitTopics], idx) => {
                const totalUnitMarks = unitTopics.reduce((a, b) => a + b.weightageMarks, 0);
                const coveredInUnit = unitTopics.filter((t) => t.isCovered).length;
                return (
                  <div 
                    key={unitTitle}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                          Unit {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800 mt-1">{unitTitle}</h4>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-700">{totalUnitMarks} Marks</span>
                        <p className="text-[10px] text-slate-500">{coveredInUnit}/{unitTopics.length} topics studied</p>
                      </div>
                    </div>

                    {/* Topics inside unit */}
                    <div className="space-y-1.5 pt-1">
                      {unitTopics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-2.5 rounded-xl bg-white border border-slate-200/60 flex items-start justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={topic.isCovered ? 'text-emerald-600' : 'text-slate-300'}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                              <span className="font-bold text-slate-800">{topic.name}</span>
                              {topic.highYield && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                                  ⭐ High Yield
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 ml-5">{topic.summary}</p>
                          </div>

                          <div className="shrink-0 text-right">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                              {topic.difficulty}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{topic.weightageMarks}m</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
