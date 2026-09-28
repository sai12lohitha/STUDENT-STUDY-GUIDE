import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Clock,
  BookOpen,
  Code2,
  GraduationCap,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const AnalyticsView: React.FC = () => {
  const { studyStats, profile, exams, courses, tasks, dsaProblems } = useStudent();

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const missedTasksCount = tasks.filter(t => !t.completed && (t.isMissed || t.deadline < new Date().toISOString().split('T')[0])).length;
  const taskCompletionRate = Math.round(
    (completedTasksCount / Math.max(completedTasksCount + missedTasksCount, 1)) * 100
  );

  const weeklyDays = [
    { day: 'Mon', hours: 3.5, label: '3.5h' },
    { day: 'Tue', hours: 3.0, label: '3.0h' },
    { day: 'Wed', hours: 4.0, label: '4.0h' },
    { day: 'Thu', hours: 2.5, label: '2.5h' },
    { day: 'Fri', hours: 3.0, label: '3.0h' },
    { day: 'Sat', hours: 4.5, label: '4.5h' },
    { day: 'Sun', hours: 3.5, label: '3.5h' },
  ];

  const maxHours = Math.max(...weeklyDays.map(d => d.hours), 5);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Diagnostic Insights
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Smart Progress Analysis
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Weekly output trends, DSA difficulty distributions, cognitive load balance, and weak vs strong subjects.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span>{studyStats.streak} Day Habit Streak Active</span>
        </div>
      </div>

      {/* METRIC OVERVIEW ROW */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Weekly Study Volume</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {studyStats.weeklyStudyHours}h
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +2.4h vs last week
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Monthly Logged Hours</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {studyStats.monthlyStudyHours}h
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Goal: 85 hours/month
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Task Completion Rate</div>
          <div className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {taskCompletionRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {completedTasksCount} completed · {missedTasksCount} rescheduled
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Productivity Score</div>
          <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {studyStats.productivityScore}/100
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Consistent steady pacing
          </div>
        </div>
      </div>

      {/* WEEKLY STUDY HOURS BAR CHART */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Study Hours (Consistent 3–4.5h Pacing)
            </h2>
            <p className="text-xs text-slate-400">
              Balanced outside 9:00 - 16:00 college timetable to prevent mental burnout
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Avg: 3.4 hours / day
          </span>
        </div>

        <div className="flex h-52 items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-800 pb-2">
          {weeklyDays.map(item => {
            const heightPercent = Math.round((item.hours / maxHours) * 100);
            return (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <div className="w-full max-w-[42px] rounded-t-lg bg-indigo-100 dark:bg-slate-800 overflow-hidden h-full flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WEAK AREAS VS STRONG AREAS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Weak Areas Card */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 dark:border-rose-900/30 dark:bg-rose-950/20">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold">Weak Areas (Needs Active Focus)</h3>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Topics where confidence or accuracy is lower. The AI scheduler automatically prioritizes these in fresh mind slots.
          </p>

          <div className="mt-4 space-y-3">
            {profile.weakSubjects.map((subj, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-rose-200/80 bg-white p-3.5 shadow-xs dark:border-rose-900/40 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{subj}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    Needs Improvement
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Recommended action: 45-min active recall blocks with basic proofs and 2-pointer problem sets.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Areas Card */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Award className="h-5 w-5" />
            <h3 className="text-base font-bold">Strong Areas (High Mastery)</h3>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Consistent high accuracy and quick recall. Maintained using lightweight spaced repetition.
          </p>

          <div className="mt-4 space-y-3">
            {profile.strongSubjects.map((subj, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-emerald-200/80 bg-white p-3.5 shadow-xs dark:border-emerald-900/40 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{subj}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Solid Mastery ✓
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Retention cadence: Day 21 and Day 45 reviews only. Keeps focus open for weak areas.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
