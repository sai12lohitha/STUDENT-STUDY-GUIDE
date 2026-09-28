import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Search,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Code2,
  Briefcase,
  User,
  LogOut,
  Flame,
  Menu,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  onOpenDailySummary: () => void;
  onOpenAuth: () => void;
  onOpenMobileMenu: () => void;
  onSearchSelect: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickAdd,
  onOpenDailySummary,
  onOpenAuth,
  onOpenMobileMenu,
  onSearchSelect,
}) => {
  const {
    profile,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    studyStats,
    authUser,
    logout,
  } = useStudent();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const quickSearchItems = [
    { title: 'Dashboard & What should I do now?', view: 'dashboard', category: 'Overview' },
    { title: 'DSA Practice Tracker (12 Topics)', view: 'dsa', category: 'Placement' },
    { title: 'AI Study Planner (Custom Hours)', view: 'planner', category: 'AI Tools' },
    { title: 'Exam Planner & Syllabus', view: 'exams', category: 'Academics' },
    { title: 'Course Hub (Lectures & Hours)', view: 'courses', category: 'Learning' },
    { title: 'Job & Internship Applications', view: 'applications', category: 'Career' },
    { title: 'Spaced Repetition Revisions', view: 'revision', category: 'Retention' },
    { title: 'Smart Schedule & Calendar', view: 'calendar', category: 'Schedule' },
    { title: 'Task Manager (Today & Backlogs)', view: 'tasks', category: 'Tasks' },
    { title: 'CS Fundamentals & Aptitude', view: 'placement', category: 'Placement' },
    { title: 'Resource Library (PDFs, Notes)', view: 'resources', category: 'Resources' },
    { title: 'Student Profile & College Timetable', view: 'profile', category: 'Settings' },
  ];

  const filteredSearch = quickSearchItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-48 sm:w-64 md:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks, DSA, exams, courses..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          />

          {showSearchResults && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="px-2 py-1 text-xs font-semibold text-slate-400">Quick Jump</div>
              {filteredSearch.length === 0 ? (
                <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No matching section found</div>
              ) : (
                filteredSearch.map(item => (
                  <button
                    key={item.view}
                    onClick={() => {
                      onSearchSelect(item.view);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span>{item.title}</span>
                    <span className="text-xs text-slate-400">{item.category}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak indicator */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 sm:flex dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span>{studyStats.streak} Day Streak</span>
        </div>

        {/* AI Daily Summary Button */}
        <button
          onClick={onOpenDailySummary}
          className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 md:flex dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          title="Review today's study progress and auto-reschedule backlogs"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Daily AI Summary</span>
        </button>

        {/* Quick Add Task */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:w-96">
              <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Notifications ({notifications.length})
                </span>
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">No active notifications</p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`cursor-pointer rounded-lg p-2.5 transition ${
                        notif.read
                          ? 'bg-transparent text-slate-500 dark:text-slate-400'
                          : 'bg-indigo-50/70 text-slate-800 dark:bg-indigo-950/40 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm dark:bg-indigo-500">
              {profile.name ? profile.name.charAt(0) : 'S'}
            </div>
            <span className="hidden text-xs font-semibold text-slate-700 md:inline dark:text-slate-200">
              {profile.name.split(' ')[0]}
            </span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{profile.name}</div>
                <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">{profile.email}</div>
                <div className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400">
                  {profile.degree} · CGPA {profile.cgpa}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onSearchSelect('profile');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Student Profile</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuth();
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Account & Auth</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
