import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  X,
  Filter,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { CalendarEvent } from '../types';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useStudent();

  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(selectedDate);
  const [newStartTime, setNewStartTime] = useState('17:00');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('DSA');
  const [newDesc, setNewDesc] = useState('');

  const categories: CalendarEvent['category'][] = [
    'College',
    'Exam',
    'Placement',
    'DSA',
    'Course',
    'Revision',
    'Assignment',
    'Personal',
  ];

  const categoryColors: Record<CalendarEvent['category'], { bg: string; text: string; border: string }> = {
    College: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700' },
    Exam: { bg: 'bg-blue-50 dark:bg-blue-950/50', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    Placement: { bg: 'bg-emerald-50 dark:bg-emerald-950/50', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
    DSA: { bg: 'bg-indigo-50 dark:bg-indigo-950/50', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
    Course: { bg: 'bg-amber-50 dark:bg-amber-950/50', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    Revision: { bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    Assignment: { bg: 'bg-rose-50 dark:bg-rose-950/50', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
    Personal: { bg: 'bg-teal-50 dark:bg-teal-950/50', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
  };

  const filteredEvents = calendarEvents.filter(e => {
    if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      category: newCategory,
      description: newDesc,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const dayEvents = filteredEvents
    .filter(e => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Smart Schedule & Timetable
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Student Calendar
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Color-coded blocks for college, exams, placement prep, and DSA practice with realistic buffer times.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented view controls */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
            {(['day', 'week', 'month'] as const).map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  currentView === view
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter by category bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-2 flex items-center gap-1 text-xs font-semibold text-slate-400">
          <Filter className="h-3 w-3" /> Category:
        </span>
        <button
          onClick={() => setCategoryFilter('All')}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            categoryFilter === 'All'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Date Navigation Strip */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <button
            onClick={handleNextDay}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          Jump to Today
        </button>
      </div>

      {/* Day / Week / Month Render */}
      {currentView === 'day' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Day Schedule Timeline ({dayEvents.length} scheduled events)
          </h2>

          <div className="space-y-3">
            {dayEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No events scheduled for this day. Click "Add Event" to plan ahead.
              </div>
            ) : (
              dayEvents.map(event => {
                const styling = categoryColors[event.category] || categoryColors.Personal;
                return (
                  <div
                    key={event.id}
                    className={`flex items-start justify-between rounded-xl border p-4 transition ${styling.border} ${styling.bg}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {event.startTime} – {event.endTime}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${styling.text}`}>
                            {event.category}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {event.title}
                          </span>
                        </div>
                        {event.description && (
                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCalendarEvent(event.id, { completed: !event.completed })
                        }
                        className={`text-xs font-semibold ${
                          event.completed
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {event.completed ? 'Completed ✓' : 'Mark Done'}
                      </button>
                      <button
                        onClick={() => deleteCalendarEvent(event.id)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Week / Month Grid View */}
      {(currentView === 'week' || currentView === 'month') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 text-xs font-bold text-slate-800 dark:text-slate-200">
            {currentView === 'week' ? '7-Day Overview' : 'Monthly Planner Grid'}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - d.getDay() + i);
              const dateStr = d.toISOString().split('T')[0];
              const eventsForDay = filteredEvents.filter(e => e.date === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setCurrentView('day');
                  }}
                  className={`cursor-pointer rounded-xl border p-3 transition hover:border-indigo-400 ${
                    isToday
                      ? 'border-indigo-500 bg-indigo-50/30 dark:border-indigo-500/50 dark:bg-indigo-950/20'
                      : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span
                      className={
                        isToday
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }
                    >
                      {d.getDate()}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {eventsForDay.slice(0, 3).map(ev => {
                      const styling = categoryColors[ev.category] || categoryColors.Personal;
                      return (
                        <div
                          key={ev.id}
                          className={`truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${styling.bg} ${styling.text}`}
                        >
                          {ev.startTime} {ev.title}
                        </div>
                      );
                    })}
                    {eventsForDay.length > 3 && (
                      <div className="text-[10px] text-slate-400 font-medium">
                        +{eventsForDay.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Schedule New Event
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GATE DA Linear Algebra Lecture"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as CalendarEvent['category'])}
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
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes / Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Focus on Eigenvalues & Cayley-Hamilton"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
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
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
