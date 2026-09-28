import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  TrendingUp,
  GraduationCap,
  Briefcase,
  BookOpen,
  Code2,
  Calendar as CalendarIcon,
  ArrowRight,
  AlertCircle,
  Play,
  RotateCw,
  Plus,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenQuickAdd: () => void;
  onOpenDailySummary: () => void;
  onOpenAIChat: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenQuickAdd,
  onOpenDailySummary,
  onOpenAIChat,
}) => {
  const {
    profile,
    tasks,
    toggleTaskCompleted,
    exams,
    courses,
    applications,
    revisions,
    studyStats,
    recommendation,
    autoRescheduleMissedTasks,
    incrementCourseLecture,
  } = useStudent();

  // Determine greeting based on current time
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
      ? 'Good afternoon'
      : 'Good evening';

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Today's tasks
  const todayTasks = tasks.filter(t => t.deadline === todayStr || (!t.completed && t.isMissed));
  const missedTasks = tasks.filter(t => !t.completed && (t.isMissed || t.deadline < todayStr));

  // Upcoming placement tests/interviews
  const upcomingPlacementEvents = applications.filter(
    app => (app.testDate && app.testDate >= todayStr) || (app.interviewDate && app.interviewDate >= todayStr)
  );

  // Upcoming revisions due today
  const revisionsDueToday = revisions.filter(r => r.status === 'Due Today');

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {todayFormatted}
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {greeting}, {profile.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {profile.branch} · Semester {profile.currentYearSemester.split(' ')[0]} · Targeting{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {profile.targetCompanies.slice(0, 3).join(', ')}
            </span>
          </p>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('planner')}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 dark:text-indigo-200" />
            <span>AI Study Plan</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Missed Tasks Auto-Reschedule Alert (if any exist) */}
      {missedTasks.length > 0 && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:flex-row sm:items-center dark:border-amber-900/40 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {missedTasks.length} uncompleted task(s) from previous days
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                College schedules get busy. Instead of rebuilding your timetable, auto-reschedule them into today's buffer slots.
              </div>
            </div>
          </div>
          <button
            onClick={autoRescheduleMissedTasks}
            className="flex-shrink-0 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            Auto-Reschedule Gracefully
          </button>
        </div>
      )}

      {/* SECTION 1 HIGHLIGHT: "WHAT SHOULD I DO NOW?" */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/50 p-6 shadow-sm dark:border-indigo-500/20 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-md bg-indigo-600 px-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                <Sparkles className="h-3 w-3" /> What should I do now?
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Calculated from deadlines, weak areas & college timetable
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {recommendation.taskTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-indigo-500" />
                <span className="font-semibold">{recommendation.durationMins} minutes</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Priority:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {recommendation.priority}
                </span>
              </div>
              <span aria-hidden="true">·</span>
              <div>
                <span className="text-slate-400">Timing: </span>
                <span className="font-medium">{recommendation.deadlineText}</span>
              </div>
              <span aria-hidden="true">·</span>
              <div>
                <span className="text-slate-400">Category: </span>
                <span className="font-medium">{recommendation.category}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-200">Why this now: </strong>
              {recommendation.reason}
            </p>
          </div>

          {/* Action on recommendation */}
          <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
            {recommendation.taskId ? (
              <button
                onClick={() => toggleTaskCompleted(recommendation.taskId!)}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark Completed</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('tasks')}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Play className="h-4 w-4" />
                <span>Start Session</span>
              </button>
            )}

            <button
              onClick={onOpenAIChat}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Ask AI Alternative</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Today's Study Hours */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Today's Study</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {studyStats.todayStudyHours}h
            </span>
            <span className="text-xs text-slate-400">/ {profile.dailyStudyHours}h</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
              style={{
                width: `${Math.min(100, Math.round((studyStats.todayStudyHours / profile.dailyStudyHours) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Tasks Completed</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {studyStats.todayCompletedTasks}
            </span>
            <span className="text-xs text-slate-400">/ {todayTasks.length || 4}</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {todayTasks.length > 0
              ? `${Math.round((studyStats.todayCompletedTasks / todayTasks.length) * 100)}% on track`
              : 'Paced for today'}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Overall Progress</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {studyStats.overallProgress}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Average across goals
          </div>
        </div>

        {/* Streak Counter */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Consistency Streak</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {studyStats.streak}
            </span>
            <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
          </div>
          <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Active habit streak
          </div>
        </div>

        {/* Productivity Score */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Productivity Score</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {studyStats.productivityScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Top 10% consistency
          </div>
        </div>

        {/* DSA Solved */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">DSA Solved</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {studyStats.dsaSolvedCount.total}
            </span>
            <span className="text-xs text-slate-400">problems</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {studyStats.dsaSolvedCount.easy}E · {studyStats.dsaSolvedCount.medium}M · {studyStats.dsaSolvedCount.hard}H
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: Today's Tasks & Schedule vs Exams & Placements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Today's Task Checklist & Realistic Schedule */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Tasks Checklist */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's Scheduled Tasks
                </h3>
                <p className="text-xs text-slate-400">
                  Focused 3.5 hour study load outside college timetable
                </p>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>View all tasks</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  All tasks completed for today! Take a restful break.
                </div>
              ) : (
                todayTasks.map(task => (
                  <div
                    key={task.id}
                    className={`group flex items-start justify-between rounded-xl border p-3 transition ${
                      task.completed
                        ? 'border-slate-100 bg-slate-50/60 dark:border-slate-800/50 dark:bg-slate-950/40 opacity-70'
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskCompleted(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <div>
                        <div
                          className={`text-xs font-semibold ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          {task.timeSlot && (
                            <span className="font-mono font-medium text-slate-600 dark:text-slate-400">
                              {task.timeSlot}
                            </span>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{task.estimatedDurationMins} min</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {task.category}
                          </span>
                          {task.isMissed && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                Carried Over
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold ${
                          task.priority === 'High'
                            ? 'text-rose-600 dark:text-rose-400'
                            : task.priority === 'Medium'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Realistic Day Schedule Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Realistic Daily Schedule Blueprint
                </h3>
                <p className="text-xs text-slate-400">
                  Balanced with breaks & college slots (09:00 - 16:00)
                </p>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>Full Calendar</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-950">
                <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  06:30 – 07:30
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  DSA Problem Solving (Fresh Mind Session)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Completed ✓</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                <span className="font-mono text-slate-400">09:00 – 16:00</span>
                <span className="text-slate-600 dark:text-slate-300">
                  College Lectures & Operating Systems Lab
                </span>
                <span className="text-slate-400">Academic Slot</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-xs dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  17:00 – 18:00
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  GATE DA: Linear Algebra (Lecture 21)
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Next Up</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                <span className="font-mono text-slate-400">18:00 – 19:00</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Dinner, Workout & Rest Break
                </span>
                <span className="text-slate-400">Buffer</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                <span className="font-mono text-slate-400">20:30 – 21:00</span>
                <span className="text-slate-700 dark:text-slate-300">
                  Spaced Repetition: SQL Indexing & Normalization
                </span>
                <span className="text-slate-500">Scheduled</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                <span className="font-mono text-slate-400">21:15 – 22:00</span>
                <span className="text-slate-700 dark:text-slate-300">
                  Deep Learning Week 3 Lecture & Quiz
                </span>
                <span className="text-slate-500">Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Exams, Placement Tests, Spaced Revisions */}
        <div className="space-y-6">
          {/* Upcoming Exams Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Exams</h3>
              </div>
              <button
                onClick={() => onNavigate('exams')}
                className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Plan
              </button>
            </div>

            <div className="space-y-3">
              {exams.map(exam => {
                const examDateObj = new Date(exam.examDate);
                const daysRemaining = Math.max(
                  0,
                  Math.ceil((examDateObj.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
                );
                const syllabusPct = Math.round(
                  (exam.completedTopics / Math.max(exam.totalTopics, 1)) * 100
                );

                return (
                  <div
                    key={exam.id}
                    onClick={() => onNavigate('exams')}
                    className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {exam.name}
                      </div>
                      <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        {daysRemaining}d left
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Syllabus: {syllabusPct}%</span>
                      <span>Target: {exam.targetScore}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                        style={{ width: `${syllabusPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Placement Tests & Interviews */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Placements & OAs
                </h3>
              </div>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Track
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingPlacementEvents.length === 0 ? (
                <div className="py-3 text-center text-xs text-slate-400">
                  No immediate assessments in the next 48 hours.
                </div>
              ) : (
                upcomingPlacementEvents.slice(0, 3).map(app => (
                  <div
                    key={app.id}
                    onClick={() => onNavigate('applications')}
                    className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {app.company}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {app.status}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {app.role}
                    </div>
                    {app.testDate && (
                      <div className="mt-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 font-mono">
                        Test Date: {app.testDate}
                      </div>
                    )}
                    {app.interviewDate && (
                      <div className="mt-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 font-mono">
                        Interview: {app.interviewDate}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Spaced Revisions Due Today */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Spaced Revisions Due
                </h3>
              </div>
              <button
                onClick={() => onNavigate('revision')}
                className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Review
              </button>
            </div>

            <div className="space-y-2">
              {revisionsDueToday.length === 0 ? (
                <div className="py-3 text-center text-xs text-slate-400">
                  No revisions overdue. Memory curve is optimal!
                </div>
              ) : (
                revisionsDueToday.map(rev => (
                  <div
                    key={rev.id}
                    onClick={() => onNavigate('revision')}
                    className="cursor-pointer rounded-xl border border-purple-100 bg-purple-50/50 p-2.5 transition hover:bg-purple-50 dark:border-purple-900/30 dark:bg-purple-950/20"
                  >
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {rev.topicName}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{rev.subject}</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        Stage {rev.stage} (Ebbinghaus)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Courses Quick Continue */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Courses</h3>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Hub
              </button>
            </div>

            <div className="space-y-3">
              {courses.slice(0, 2).map(course => {
                const progressPct = Math.round(
                  (course.completedLectures / Math.max(course.totalLectures, 1)) * 100
                );
                return (
                  <div
                    key={course.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {course.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {course.platform} · {course.completedLectures}/{course.totalLectures} lectures
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-[10px] text-slate-400">
                        {Math.max(0, course.estimatedTotalHours - course.completedHours)}h remaining
                      </div>
                      <button
                        onClick={() => incrementCourseLecture(course.id)}
                        className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                      >
                        +1 Lecture Done
                      </button>
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
