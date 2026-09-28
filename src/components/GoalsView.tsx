import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { Goal } from '../types';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, toggleGoalTopic } = useStudent();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New goal form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Goal['category']>('Placement');
  const [targetDate, setTargetDate] = useState('2026-12-15');
  const [priority, setPriority] = useState<Goal['priority']>('High');
  const [topicsInput, setTopicsInput] = useState('');
  const [dailyWeeklyTarget, setDailyWeeklyTarget] = useState('2 hrs daily study');
  const [description, setDescription] = useState('');

  const categories: Goal['category'][] = ['Placement', 'Exam', 'Project', 'Skill'];

  const filteredGoals = goals.filter(g => {
    if (categoryFilter !== 'All' && g.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const topicsArr = topicsInput
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    addGoal({
      name,
      category,
      targetDate,
      priority,
      requiredTopics: topicsArr.length > 0 ? topicsArr : ['Core Milestones'],
      completedTopics: [],
      dailyWeeklyTarget,
      description,
    });

    setName('');
    setTopicsInput('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Target className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Career & Milestone Roadmap
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Goals & Targets
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track big placement milestones, GATE targets, resume projects, and competitive exams with interactive sub-topic checklists.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setCategoryFilter('All')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            categoryFilter === 'All'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          All Goals ({goals.length})
        </button>
        {categories.map(cat => {
          const count = goals.filter(g => g.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredGoals.map(goal => {
          const remainingCount = Math.max(
            0,
            goal.requiredTopics.length - goal.completedTopics.length
          );

          return (
            <div
              key={goal.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                    <Layers className="h-3.5 w-3.5" />
                    <span>{goal.category}</span>
                  </div>

                  <span
                    className={`font-bold ${
                      goal.priority === 'High'
                        ? 'text-rose-600 dark:text-rose-400'
                        : goal.priority === 'Medium'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {goal.priority} Priority
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {goal.name}
                </h3>

                {goal.description && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {goal.description}
                  </p>
                )}

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Progress: {goal.progress}%
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {goal.completedTopics.length}/{goal.requiredTopics.length} milestones completed
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Cadence & Deadline */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Cadence: {goal.dailyWeeklyTarget}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>

                {/* Topic Checklist */}
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Required Sub-Topics ({remainingCount} remaining)
                  </div>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {goal.requiredTopics.map(topic => {
                      const isDone = goal.completedTopics.includes(topic);
                      return (
                        <div
                          key={topic}
                          onClick={() => toggleGoalTopic(goal.id, topic)}
                          className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs transition ${
                            isDone
                              ? 'bg-slate-50 text-slate-400 dark:bg-slate-950/40 dark:text-slate-500 line-through'
                              : 'bg-slate-50/70 text-slate-800 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600" />
                            )}
                            <span>{topic}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {remainingCount === 0 ? '🎉 Goal Completed!' : `${remainingCount} steps left`}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Set Strategic Goal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Striver DSA Sheet (150 Problems)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Goal['category'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Goal['priority'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Daily / Weekly Target Cadence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 problems/day"
                    value={dailyWeeklyTarget}
                    onChange={e => setDailyWeeklyTarget(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Required Topics / Milestones (one per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Arrays & Two Pointers&#10;Binary Search Patterns&#10;Sliding Window&#10;Trees & Graphs"
                  value={topicsInput}
                  onChange={e => setTopicsInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description / Motivation
                </label>
                <input
                  type="text"
                  placeholder="Why this goal matters for your career"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
