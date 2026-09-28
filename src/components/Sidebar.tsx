import React from 'react';
import {
  LayoutDashboard,
  Target,
  Sparkles,
  Calendar,
  BookOpen,
  Code2,
  GraduationCap,
  Briefcase,
  CheckSquare,
  RotateCw,
  Library,
  FileSpreadsheet,
  BarChart3,
  User,
  Settings,
  X,
  Flame,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAIChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  onOpenAIChat,
}) => {
  const { profile, studyStats } = useStudent();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'goals', label: 'My Goals', icon: Target, badge: null },
    { id: 'planner', label: 'AI Study Planner', icon: Sparkles, badge: 'AI' },
    { id: 'calendar', label: 'Smart Calendar', icon: Calendar, badge: null },
    { id: 'courses', label: 'Course Hub', icon: BookOpen, badge: null },
    { id: 'dsa', label: 'DSA Tracker', icon: Code2, badge: '12 Topics' },
    { id: 'exams', label: 'Exam Planner', icon: GraduationCap, badge: null },
    { id: 'placement', label: 'Placement Prep', icon: Briefcase, badge: null },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, badge: null },
    { id: 'revision', label: 'Spaced Revision', icon: RotateCw, badge: 'Due' },
    { id: 'applications', label: 'Job Applications', icon: FileSpreadsheet, badge: 'Kanban' },
    { id: 'resources', label: 'Resource Library', icon: Library, badge: null },
    { id: 'analytics', label: 'Progress Analytics', icon: BarChart3, badge: null },
    { id: 'profile', label: 'Student Profile', icon: User, badge: null },
    { id: 'settings', label: 'Settings & Data', icon: Settings, badge: null },
  ];

  const handleNavClick = (viewId: string) => {
    onSelectView(viewId);
    if (isOpenMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Top Logo & App Title */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-500">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-slate-900 dark:text-white">
                Student<span className="text-indigo-600 dark:text-indigo-400">Pilot</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Personal AI Assistant
              </div>
            </div>
          </div>
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Floating AI Assistant Banner in Sidebar */}
        <div className="p-3">
          <button
            onClick={() => {
              onOpenAIChat();
              if (isOpenMobile) onCloseMobile();
            }}
            className="group flex w-full items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 p-2.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900/30 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm dark:bg-indigo-500">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  AI Study Assistant
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ask recommendations
                </div>
              </div>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 transition group-hover:scale-110" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="max-h-[calc(100vh-270px)] space-y-0.5 overflow-y-auto px-3 py-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-medium tracking-tight ${
                      isActive
                        ? 'text-slate-300 dark:text-indigo-200'
                        : item.badge === 'AI'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Target status */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">{profile.name}</span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{studyStats.streak}d</span>
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{profile.degree} (Sem {profile.currentYearSemester.split(' ')[0]})</span>
            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              {profile.cgpa} CGPA
            </span>
          </div>
          <div className="mt-1 truncate text-[10px] text-slate-400">
            Target: {profile.targetCompanies.slice(0, 2).join(', ')} + {profile.targetExams[0]}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden h-screen w-64 flex-shrink-0 lg:block sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
