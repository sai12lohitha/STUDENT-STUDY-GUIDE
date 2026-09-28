import React, { useState } from 'react';
import {
  Settings,
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Moon,
  Sun,
  Shield,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const SettingsView: React.FC = () => {
  const {
    resetToDemoData,
    theme,
    toggleTheme,
    profile,
    goals,
    exams,
    courses,
    tasks,
    dsaProblems,
    applications,
  } = useStudent();

  const [exportSuccess, setExportSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportData = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      profile,
      goals,
      exams,
      courses,
      tasks,
      dsaProblems,
      applications,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studentpilot_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all student data back to initial demo state?')) {
      resetToDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Settings className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              System & Storage
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Settings & Data Management
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Export JSON backups, inspect table storage, toggle themes, or restore the demo sandbox.
          </p>
        </div>
      </div>

      {resetSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>Restored complete initial demo data with 84 solved DSA problems, GATE goals, and courses!</span>
        </div>
      )}

      {exportSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>Full JSON backup generated and downloaded to your device!</span>
        </div>
      )}

      {/* Database Tables Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Database Schema & Entity Records
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Local client-side and simulated Supabase tables maintaining complete persistence:
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { table: 'users', count: '1 Active Profile' },
            { table: 'goals', count: `${goals.length} Goals` },
            { table: 'exams', count: `${exams.length} Exams` },
            { table: 'courses', count: `${courses.length} Courses` },
            { table: 'tasks', count: `${tasks.length} Action Tasks` },
            { table: 'dsaproblems', count: `${dsaProblems.length} Problems` },
            { table: 'applications', count: `${applications.length} Job Apps` },
            { table: 'revisions', count: 'Spaced Intervals' },
          ].map(t => (
            <div
              key={t.table}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {t.table}
              </div>
              <div className="mt-1 text-slate-600 dark:text-slate-300">{t.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme & Data Controls */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Appearance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Appearance & Interface Theme
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Toggle between light and dark modes according to your study preference.
          </p>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
            <span>Active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} (Click to switch)</span>
          </button>
        </div>

        {/* Data Backup & Restore */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Backup & Reset Operations
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Export a full JSON backup file or restore default student data.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restore Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
