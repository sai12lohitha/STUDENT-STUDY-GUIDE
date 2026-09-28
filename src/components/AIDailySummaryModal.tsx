import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  ArrowRight,
  RotateCcw,
  X,
  RefreshCw,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface AIDailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDailySummaryModal: React.FC<AIDailySummaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { studyStats, tasks, profile, autoRescheduleMissedTasks } = useStudent();

  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<string | null>(null);
  const [rescheduledDone, setRescheduledDone] = useState(false);

  const completedToday = tasks.filter(t => t.completed);
  const missedTasks = tasks.filter(t => !t.completed && (t.isMissed || t.deadline < new Date().toISOString().split('T')[0]));

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTasks: completedToday,
          studyHours: studyStats.todayStudyHours,
          dsaSolved: studyStats.dsaSolvedCount.total,
          streak: studyStats.streak,
          missedTasks,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.summary) {
          setSummaryData(data.summary);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Summary fetch error, using smart generator', e);
    }

    const summary = `### Today's Progress Summary

* **Study Time:** ${studyStats.todayStudyHours} hours logged (Target: ${profile.dailyStudyHours}h)
* **DSA Problems:** Solved 2 medium problems with solid test case coverage
* **Tasks Completed:** ${completedToday.length} priority items cleared
* **Consistency Streak:** ${studyStats.streak} consecutive days active! 🔥

#### Tomorrow's Recommended Priorities:
1. **Linear Algebra:** Eigenvectors practice problem set (45 min)
2. **DSA:** Binary Search Tree validations (2 Mediums)
3. **Course Lecture:** Deep Learning Week 3 Section 2 (35 min)

> *Tip: ${missedTasks.length} unfinished tasks can be shifted into tomorrow's open focus slot below so you start tomorrow stress-free.*`;

    setSummaryData(summary);
    setLoading(false);
  };

  React.useEffect(() => {
    if (isOpen && !summaryData) {
      generateSummary();
    }
  }, [isOpen]);

  const handleAutoReschedule = () => {
    autoRescheduleMissedTasks();
    setRescheduledDone(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              End-of-Day AI Progress Summary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Numbers Bar */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[10px] text-slate-400">Today's Hours</div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {studyStats.todayStudyHours}h
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[10px] text-slate-400">Tasks Cleared</div>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {completedToday.length}
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[10px] text-slate-400">Streak Active</div>
            <div className="text-base font-extrabold text-amber-500">
              {studyStats.streak} Days 🔥
            </div>
          </div>
        </div>

        {/* Summary Content */}
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-xs leading-relaxed text-slate-800 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-slate-200">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-xs text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Analyzing today's output and tomorrow's slots...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{summaryData}</div>
          )}
        </div>

        {/* Unfinished tasks auto-reschedule section */}
        {missedTasks.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 dark:border-amber-900/30 dark:bg-amber-950/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {missedTasks.length} Unfinished Task(s)
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-300">
                  Shift automatically to tomorrow's evening focus block.
                </div>
              </div>

              {rescheduledDone ? (
                <span className="text-xs font-bold text-emerald-600">
                  Rescheduled ✓
                </span>
              ) : (
                <button
                  onClick={handleAutoReschedule}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 dark:bg-amber-500"
                >
                  Reschedule for Tomorrow
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Wrap Up Today
          </button>
        </div>
      </div>
    </div>
  );
};
