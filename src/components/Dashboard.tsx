import React, { useState } from 'react';
import { 
  Subject, 
  Exam, 
  Task, 
  Topic 
} from '../types';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Sparkles, 
  Workflow, 
  ArrowRight, 
  TrendingUp, 
  Flame, 
  Plus, 
  Award, 
  Layers, 
  GraduationCap,
  Play
} from 'lucide-react';

interface DashboardProps {
  student: any;
  subjects: Subject[];
  exams: Exam[];
  tasks: Task[];
  topics: Topic[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAgenticDemo: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  student,
  subjects,
  exams,
  tasks,
  topics,
  onToggleTask,
  onAddTask,
  onNavigateTab,
  onOpenAgenticDemo,
}) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState<'dbms' | 'os' | 'cn' | 'daa' | 'se'>('dbms');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-10-02');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  // Computed metrics
  const totalTopicsCount = topics.length;
  const coveredTopicsCount = topics.filter((t) => t.isCovered).length;
  const overallProgressPercent = Math.round((coveredTopicsCount / totalTopicsCount) * 100);

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const ongoingTasks = tasks.filter((t) => t.status !== 'Completed');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const sub = subjects.find((s) => s.id === newTaskSubject);
    onAddTask({
      title: newTaskTitle,
      subjectId: newTaskSubject,
      subjectName: sub ? `${sub.code} - ${sub.name}` : 'DBMS',
      dueDate: newTaskDueDate,
      status: 'In Progress',
      priority: newTaskPriority,
      estimatedMinutes: 60,
    });

    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome & Profile Hero with Pastel Gradients */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-sky-50/70 border border-indigo-100 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-indigo-700 border border-indigo-100 shadow-2xs">
                🎓 Semester {student.semester}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/80 text-purple-700 border border-purple-100 shadow-2xs">
                {student.department}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/70 flex items-center gap-1 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {student.studyStreakDays} Day Streak Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Welcome back, {student.name} 👋
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Your syllabus coverage is at <span className="font-semibold text-indigo-700">{overallProgressPercent}%</span>. Next immediate milestone: <span className="font-semibold text-slate-900">DBMS End-Term Examination</span> in 10 days.
            </p>
          </div>

          {/* Quick Action Button for Agentic Workflow */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenAgenticDemo}
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer group"
            >
              <Workflow className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span>Run Agentic Workflow</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>
            <button
              onClick={() => onNavigateTab('planner')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/90 hover:bg-white text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>View Study Plan</span>
            </button>
          </div>
        </div>

        {/* Live Agentic Scenario Callout Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-white/80 border border-indigo-200/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Workshop Agent Demo</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Verified Multi-Agent Chain</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 mt-0.5">
                Student says: <span className="italic font-semibold text-indigo-800">“I have a DBMS exam in 10 days and I haven't studied normalization.”</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Executes Coordinator ➔ Syllabus Agent ➔ Schedule Optimizer ➔ Tool/RAG ➔ LLM Explanation ➔ Practice Set ➔ Progress Sync.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAgenticDemo}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
            <span>Launch Live Chain</span>
          </button>
        </div>
      </div>

      {/* Top Stat Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Syllabus Covered */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Syllabus Covered</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{overallProgressPercent}%</span>
            <span className="text-xs text-slate-500">({coveredTopicsCount}/{totalTopicsCount} topics)</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${overallProgressPercent}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: Upcoming Exam Urgency */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Exam</span>
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">10 Days</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">CS501 DBMS</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 truncate">Oct 8, 2026 • 100 Marks End-Term</p>
        </div>

        {/* Metric 3: Active Preparation Tasks */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preparation Tasks</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{ongoingTasks.length} Pending</span>
            <span className="text-xs text-slate-500">({completedTasks} done)</span>
          </div>
          <p className="mt-2 text-xs text-emerald-600 font-medium">2 High-Priority scheduled today</p>
        </div>

        {/* Metric 4: Study Time & Streak */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weekly Study Time</span>
            <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{student.weeklyStudyHours} hrs</span>
            <span className="text-xs font-medium text-emerald-600">+4.2 hrs vs last week</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{student.totalHoursStudied} total preparation hours</p>
        </div>
      </div>

      {/* Main Grid: Subjects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Subjects in Semester & Upcoming Exams */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subjects in Semester */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>Subjects in Semester {student.semester}</span>
                </h2>
                <p className="text-xs text-slate-500">Track progress and unit coverage across enrolled courses</p>
              </div>
              <button 
                onClick={() => onNavigateTab('syllabus')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {subjects.map((sub) => {
                const subTopics = topics.filter((t) => t.subjectId === sub.id);
                const covered = subTopics.filter((t) => t.isCovered).length;
                const total = subTopics.length || sub.totalTopics;
                const percent = Math.round((covered / total) * 100);

                return (
                  <div 
                    key={sub.id} 
                    className={`p-4 rounded-2xl border ${sub.color.border} ${sub.color.bg} transition-all hover:shadow-xs group`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sub.color.badge}`}>
                          {sub.code} • {sub.credits} Credits
                        </span>
                        <h3 className="font-bold text-sm text-slate-800 mt-1.5 group-hover:text-indigo-900 transition-colors">
                          {sub.name}
                        </h3>
                        <p className="text-[11px] text-slate-500">{sub.instructor}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">{percent}%</span>
                        <p className="text-[10px] text-slate-400">{covered}/{total} covered</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-white/70 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${percent}%`, 
                          backgroundColor: sub.color.accent 
                        }} 
                      />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">Exam: {sub.examDate}</span>
                      <button
                        onClick={() => onNavigateTab('tutor')}
                        className="font-semibold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Study with AI</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Exams Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-500" />
                  <span>Upcoming Examinations & Milestones</span>
                </h2>
                <p className="text-xs text-slate-500">Official university schedule with high-yield topic flags</p>
              </div>
            </div>

            <div className="space-y-3">
              {exams.map((exam) => (
                <div 
                  key={exam.id} 
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {exam.code}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800">{exam.subjectName}</h4>
                      <span className="text-xs text-slate-500">({exam.title})</span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-3">
                      <span>📅 {exam.date}</span>
                      <span>⏱️ {exam.duration}</span>
                      <span>🎯 {exam.totalMarks} Marks</span>
                    </p>

                    {/* Critical Topics Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Critical Topics:</span>
                      {exam.criticalTopics.map((topic, i) => (
                        <span 
                          key={i} 
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Days Countdown & CTA */}
                  <div className="flex md:flex-col items-center md:items-end justify-between shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-xl font-extrabold text-rose-600">{exam.daysLeft}</span>
                      <span className="text-xs font-bold text-rose-600 block md:inline md:ml-1">Days Left</span>
                    </div>
                    <button
                      onClick={() => onNavigateTab('planner')}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      Open Planner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Current & Ongoing Tasks */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span>Current & Ongoing Tasks</span>
                </h2>
                <p className="text-[11px] text-slate-500">{ongoingTasks.length} active tasks scheduled</p>
              </div>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Add New Study Task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                      isCompleted
                        ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                        : 'bg-white hover:bg-indigo-50/30 border-slate-200 hover:border-indigo-200 shadow-2xs'
                    }`}
                  >
                    <button 
                      type="button"
                      className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {task.subjectName}
                        </span>
                        
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          task.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                            : task.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/50'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority} Priority
                        </span>

                        <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Helper */}
            <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-center justify-between">
              <span>💡 Ticking tasks updates your syllabus progress!</span>
              <button
                onClick={() => onNavigateTab('quiz')}
                className="font-bold underline cursor-pointer"
              >
                Test with Quiz
              </button>
            </div>
          </div>

          {/* Quick AI Learning Shortcuts */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>StudyFlow AI Suite</span>
            </div>
            <h3 className="font-bold text-sm">Need help grasping a tough concept?</h3>
            <p className="text-xs text-slate-300">
              Ask our AI Tutor for step-by-step analogies, practice questions, or upload your professor's lecture notes for custom RAG explanation.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onNavigateTab('tutor')}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Ask AI Tutor (DBMS Normalization)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('notes')}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Search Uploaded Notes with RAG</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-800">Add New Preparation Task</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master BCNF Decomposition Algorithm"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newTaskSubject}
                    onChange={(e: any) => setNewTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="dbms">DBMS (CS501)</option>
                    <option value="os">Operating Systems (CS502)</option>
                    <option value="cn">Computer Networks (CS503)</option>
                    <option value="daa">Algorithms (CS504)</option>
                    <option value="se">Software Eng (CS505)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
