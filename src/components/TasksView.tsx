import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { Task } from '../types';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompleted, autoRescheduleMissedTasks } =
    useStudent();

  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'week' | 'upcoming' | 'completed'>(
    'today'
  );
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('High');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('17:00 - 18:00');
  const [duration, setDuration] = useState(45);
  const [category, setCategory] = useState<Task['category']>('DSA');
  const [isRecurring, setIsRecurring] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const missedTasks = tasks.filter(t => !t.completed && (t.isMissed || t.deadline < todayStr));

  const filteredTasks = tasks.filter(task => {
    // Priority filter
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
    // Category filter
    if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;

    if (activeTab === 'completed') {
      return task.completed;
    }

    if (task.completed) return false;

    if (activeTab === 'today') {
      return task.deadline <= todayStr;
    }
    if (activeTab === 'tomorrow') {
      return task.deadline === tomorrowStr;
    }
    if (activeTab === 'week') {
      return task.deadline >= todayStr && task.deadline <= weekEndStr;
    }
    if (activeTab === 'upcoming') {
      return task.deadline > weekEndStr;
    }

    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      priority,
      deadline,
      timeSlot,
      estimatedDurationMins: Number(duration) || 45,
      category,
      isRecurring,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Focus & Action Plan
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Task Management
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Organize tasks by Today, Tomorrow, This Week, or Upcoming. Unfinished tasks can be auto-rescheduled with buffer time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Missed Tasks Auto-Reschedule Banner */}
      {missedTasks.length > 0 && (
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 sm:flex-row sm:items-center dark:border-amber-900/40 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {missedTasks.length} unfinished tasks detected from earlier schedules
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                Instead of cramming 10 extra hours, our algorithm automatically shifts them into realistic open slots today and tomorrow.
              </div>
            </div>
          </div>

          <button
            onClick={autoRescheduleMissedTasks}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Auto-Reschedule All</span>
          </button>
        </div>
      )}

      {/* View Tabs: Today, Tomorrow, This Week, Upcoming, Completed */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
          {(['today', 'tomorrow', 'week', 'upcoming', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              {tab === 'week' ? 'This Week' : tab}
            </button>
          ))}
        </div>

        {/* Priority & Category Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All Categories</option>
            <option value="DSA">DSA</option>
            <option value="Exam">Exam</option>
            <option value="Placement">Placement</option>
            <option value="Course">Course</option>
            <option value="Revision">Revision</option>
            <option value="College">College</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No tasks in this view. Enjoy your free time or add a new goal item!
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-start justify-between p-4 transition ${
                  task.completed
                    ? 'bg-slate-50/50 opacity-60 dark:bg-slate-950/30'
                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
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

                  <div className="space-y-1">
                    <div
                      className={`text-xs font-bold ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      {task.timeSlot && (
                        <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
                          {task.timeSlot}
                        </span>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{task.estimatedDurationMins} min</span>
                      <span aria-hidden="true">·</span>
                      <span>Deadline: {task.deadline}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {task.category}
                      </span>
                      {task.isRecurring && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                            Recurring Daily
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold ${
                      task.priority === 'High'
                        ? 'text-rose-600 dark:text-rose-400'
                        : task.priority === 'Medium'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create Action Task
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 2 LeetCode Mediums on Dynamic Programming"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description / Sub-topics
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coin Change & Longest Common Subsequence"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                    onChange={e => setCategory(e.target.value as Task['category'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Exam">Exam</option>
                    <option value="Placement">Placement</option>
                    <option value="Course">Course</option>
                    <option value="Revision">Revision</option>
                    <option value="College">College</option>
                    <option value="Project">Project</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Task['priority'])}
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
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Time Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g. 17:00 - 18:00 or Evening"
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={e => setIsRecurring(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="recurring" className="text-xs text-slate-700 dark:text-slate-300">
                  Recurring daily habit (e.g. Morning DSA)
                </label>
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
