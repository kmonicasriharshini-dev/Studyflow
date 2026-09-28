/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Subject, 
  Topic, 
  Exam, 
  Task, 
  StudyPlanDay, 
  NoteDocument, 
  TopicQuiz 
} from './types';
import { 
  INITIAL_STUDENT, 
  INITIAL_SUBJECTS, 
  INITIAL_EXAMS, 
  INITIAL_TASKS, 
  INITIAL_TOPICS, 
  INITIAL_NOTES, 
  INITIAL_QUIZZES, 
  INITIAL_PLAN_DAYS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Planner } from './components/Planner';
import { SyllabusAnalyzer } from './components/SyllabusAnalyzer';
import { AiTutor } from './components/AiTutor';
import { QuizMastery } from './components/QuizMastery';
import { NotesRAG } from './components/NotesRAG';
import { AgenticWorkflow } from './components/AgenticWorkflow';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [student, setStudent] = useState(INITIAL_STUDENT);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [notes, setNotes] = useState<NoteDocument[]>(INITIAL_NOTES);
  const [quizzes, setQuizzes] = useState<TopicQuiz[]>(INITIAL_QUIZZES);
  const [planDays, setPlanDays] = useState<StudyPlanDay[]>(INITIAL_PLAN_DAYS);

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Add new task
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [task, ...prev]);
  };

  // Toggle topic covered state
  const handleToggleTopicCovered = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const nextCovered = !t.isCovered;
          return { ...t, isCovered: nextCovered };
        }
        return t;
      })
    );
  };

  // Complete a quiz and unlock next level
  const handleCompleteQuiz = (topicId: string, score: number, nextTopicIdToUnlock?: string) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.topicId === topicId) {
          return { ...q, isCompleted: true, score };
        }
        if (nextTopicIdToUnlock && q.topicId === nextTopicIdToUnlock) {
          return { ...q, isUnlocked: true };
        }
        return q;
      })
    );

    // Also mark topic as covered in topic list
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return { ...t, isCovered: true };
        }
        if (nextTopicIdToUnlock && t.id === nextTopicIdToUnlock) {
          return { ...t, isUnlocked: true };
        }
        return t;
      })
    );
  };

  // Upload note
  const handleUploadNote = (newNote: NoteDocument) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  // Teach with note excerpt
  const handleTeachWithNote = (topic: string, noteTitle: string, noteContent: string) => {
    setActiveTab('tutor');
  };

  // Apply generated agentic plan
  const handleApplyPlan = (generatedPlanDays: StudyPlanDay[]) => {
    if (generatedPlanDays && generatedPlanDays.length > 0) {
      setPlanDays(generatedPlanDays);

      // Add high-priority sprint tasks into dashboard
      const sprintTask: Task = {
        id: `task-sprint-${Date.now()}`,
        title: 'Master 1NF, 2NF, 3NF & BCNF Normalization (AI Sprint)',
        subjectId: 'dbms',
        subjectName: 'DBMS (CS501)',
        dueDate: '2026-10-02',
        status: 'In Progress',
        priority: 'High',
        estimatedMinutes: 90,
      };

      setTasks((prev) => [sprintTask, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAgentDemo={() => setActiveTab('agentic')}
        streakDays={student.studyStreakDays}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            student={student}
            subjects={subjects}
            exams={exams}
            tasks={tasks}
            topics={topics}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onNavigateTab={setActiveTab}
            onOpenAgenticDemo={() => setActiveTab('agentic')}
          />
        )}

        {activeTab === 'planner' && (
          <Planner
            exams={exams}
            topics={topics}
            planDays={planDays}
            onToggleTopicCovered={handleToggleTopicCovered}
            onNavigateTab={setActiveTab}
            onOpenAgenticDemo={() => setActiveTab('agentic')}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusAnalyzer
            subjects={subjects}
            topics={topics}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'tutor' && (
          <AiTutor
            topics={topics}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizMastery
            quizzes={quizzes}
            onCompleteQuiz={handleCompleteQuiz}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'notes' && (
          <NotesRAG
            notes={notes}
            onUploadNote={handleUploadNote}
            onTeachWithNote={handleTeachWithNote}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'agentic' && (
          <AgenticWorkflow
            onApplyPlan={handleApplyPlan}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Modern Pastel Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">StudyFlow</span>
            <span>•</span>
            <span>AI-Powered College Study Portal & Multi-Agent Framework</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              Coordinator ➔ Specialist ➔ RAG ➔ LLM
            </span>
            <span>Active Semester 5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
