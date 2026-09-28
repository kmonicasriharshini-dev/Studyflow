import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  BookOpenCheck, 
  Sparkles, 
  Trophy, 
  FileText, 
  Workflow, 
  GraduationCap, 
  Clock, 
  Flame,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAgentDemo: () => void;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAgentDemo,
  streakDays,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck2 },
    { id: 'syllabus', label: 'Syllabus Analyzer', icon: BookOpenCheck },
    { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'quiz', label: 'Quiz Mastery', icon: Trophy },
    { id: 'notes', label: 'Notes & RAG', icon: FileText },
    { id: 'agentic', label: 'Agentic Workflow', icon: Workflow, badge: 'Live Demo' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                    StudyFlow
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Agentic AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">College Study Portal & Agents</p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Trigger */}
            <button
              onClick={onOpenAgentDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 hover:from-indigo-100 hover:to-sky-100 text-indigo-700 border border-indigo-200/80 text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
              title="Demonstrate Multi-Agent Workflow: DBMS Exam in 10 Days"
            >
              <Workflow className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">DBMS Sprint Demo</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
            </button>

            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streakDays}d Streak</span>
            </div>

            {/* Student Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-200 via-indigo-100 to-sky-200 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-800 shadow-xs">
                MS
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Monica Sri Harshini</p>
                <p className="text-[10px] text-slate-500">Sem 5 • CSE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Nav */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
