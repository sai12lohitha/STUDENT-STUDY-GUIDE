import React, { useState } from 'react';
import {
  RotateCw,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { RevisionItem } from '../types';

export const RevisionView: React.FC = () => {
  const { revisions, markRevisionComplete, addRevisionItem } = useStudent();

  const [showAddModal, setShowAddModal] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [subject, setSubject] = useState('DSA');
  const [sourceType, setSourceType] = useState<RevisionItem['sourceType']>('DSA');

  const todayStr = new Date().toISOString().split('T')[0];

  const dueToday = revisions.filter(
    r => r.status !== 'Completed' && r.nextRevisionDate <= todayStr
  );
  const upcoming = revisions.filter(
    r => r.status !== 'Completed' && r.nextRevisionDate > todayStr
  );
  const completed = revisions.filter(r => r.status === 'Completed');

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    addRevisionItem({
      topicName,
      subject,
      sourceType,
      learnedDate: todayStr,
      stage: 1,
      nextRevisionDate: tomorrow.toISOString().split('T')[0],
      status: 'Upcoming',
    });

    setTopicName('');
    setShowAddModal(false);
  };

  const stageDescriptions = {
    0: 'Day 0: Initial Learning',
    1: 'Day 1: First Rapid Consolidation',
    2: 'Day 7: Weekly Retention Check',
    3: 'Day 21: Deep Memory Transfer',
    4: 'Day 45: Long-term Mastery Check',
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <RotateCw className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Ebbinghaus Spaced Repetition
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Automatic Revision System
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            When you solve a DSA problem or complete an exam lecture, revisions are automatically scheduled across scientific intervals (Day 1 → 7 → 21 → 45).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Topic</span>
        </button>
      </div>

      {/* Spaced Interval Concept Card */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          { day: 'Day 0', title: 'Learn Topic', desc: 'Active solve & notes' },
          { day: 'Day 1', title: 'First Recall', desc: '10 min flashcards' },
          { day: 'Day 7', title: 'Week 1 Review', desc: 'Resolve problem blind' },
          { day: 'Day 21', title: 'Month 1 Test', desc: 'Edge cases & variants' },
          { day: 'Day 45', title: 'Permanent Mastery', desc: 'Cements into memory' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
              {item.day}
            </div>
            <div className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
              {item.title}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Due Today Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Revisions Due Today ({dueToday.length})
            </h2>
            <p className="text-xs text-slate-400">
              Complete these active-recall reviews today to prevent forgetting curve decay
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {dueToday.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No revisions due right now! All past topics are up-to-date in your retention schedule.
            </div>
          ) : (
            dueToday.map(item => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50/40 p-4 transition sm:flex-row sm:items-center dark:border-purple-900/40 dark:bg-purple-950/20"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-purple-700 dark:text-purple-300">
                      Stage {item.stage} Review
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.sourceType}: {item.subject}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {item.topicName}
                  </h3>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Originally learned: {item.learnedDate} · Target: 15-20 min active recall
                  </div>
                </div>

                <button
                  onClick={() => markRevisionComplete(item.id)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Reviewed & Advance</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Revisions Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Upcoming Scheduled Revisions ({upcoming.length})
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Automatically queued based on spaced intervals
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {upcoming.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.topicName}
                </span>
                <span className="ml-2 text-slate-400">({item.subject})</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Stage {item.stage}</span>
                <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  Due {item.nextRevisionDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Revision Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Queue Spaced Revision
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRevision} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Topic / Question Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Programming 0/1 Knapsack"
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject / Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DSA or Operating Systems"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Source Type
                  </label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value as RevisionItem['sourceType'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Exam">Exam</option>
                    <option value="CS Fundamentals">CS Fundamentals</option>
                    <option value="Course">Course</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Schedule Spaced Intervals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
