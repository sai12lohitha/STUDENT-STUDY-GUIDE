import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  Play,
  Calendar,
  Layers,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { Course } from '../types';

export const CourseHubView: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, incrementCourseLecture, markCourseComplete } =
    useStudent();

  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New course form
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Course['platform']>('YouTube');
  const [instructor, setInstructor] = useState('');
  const [courseUrl, setCourseUrl] = useState('');
  const [totalLectures, setTotalLectures] = useState(40);
  const [estimatedHours, setEstimatedHours] = useState(25);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('2026-11-30');
  const [priority, setPriority] = useState<Course['priority']>('High');
  const [notes, setNotes] = useState('');

  const platforms: Course['platform'][] = [
    'YouTube',
    'Coursera',
    'Udemy',
    'NPTEL',
    'edX',
    'Great Learning',
    'GeeksforGeeks',
    'GO Classes',
    'Other',
  ];

  const filteredCourses = courses.filter(c => {
    if (filterPlatform !== 'All' && c.platform !== filterPlatform) return false;
    return true;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCourse({
      name,
      platform,
      instructor: instructor || 'Online Instructor',
      courseUrl: courseUrl.trim() || 'https://youtube.com',
      totalLectures: Number(totalLectures) || 20,
      estimatedTotalHours: Number(estimatedHours) || 15,
      startDate,
      targetCompletionDate: targetDate,
      priority,
      notes,
    });

    setName('');
    setInstructor('');
    setCourseUrl('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Course Hub & Tracker
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Online Courses Tracker
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Keep all your YouTube playlists, Coursera specializations, NPTEL lectures, and Udemy courses organized in one place.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course URL</span>
        </button>
      </div>

      {/* Filter by Platform tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setFilterPlatform('All')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filterPlatform === 'All'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          All Platforms ({courses.length})
        </button>
        {platforms.map(p => {
          const count = courses.filter(c => c.platform === p).length;
          if (count === 0 && p !== 'YouTube' && p !== 'Coursera' && p !== 'NPTEL') return null;
          return (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterPlatform === p
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {p} ({count})
            </button>
          );
        })}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredCourses.map(course => {
          const progressPct = Math.round(
            (course.completedLectures / Math.max(course.totalLectures, 1)) * 100
          );
          const remainingHours = Math.max(
            0,
            parseFloat((course.estimatedTotalHours - course.completedHours).toFixed(1))
          );
          const isFinished = course.completedLectures >= course.totalLectures;

          return (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div>
                {/* Platform & Priority metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{course.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-normal text-slate-500">{course.instructor}</span>
                  </div>

                  <span
                    className={`font-bold ${
                      course.priority === 'High'
                        ? 'text-rose-600 dark:text-rose-400'
                        : course.priority === 'Medium'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {course.priority} Priority
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {course.name}
                </h3>

                {course.notes && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {course.notes}
                  </p>
                )}

                {/* Progress Bar & Lectures */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Progress: {progressPct}%
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {course.completedLectures}/{course.totalLectures} lectures
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFinished
                          ? 'bg-emerald-500'
                          : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Hours & Deadline */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{remainingHours} hours remaining</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Deadline: {course.targetCompletionDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <a
                    href={course.courseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Continue Learning</span>
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>

                  {!isFinished && (
                    <button
                      onClick={() => incrementCourseLecture(course.id)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Completed 1 more lecture"
                    >
                      +1 Lecture
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isFinished ? (
                    <button
                      onClick={() => markCourseComplete(course.id)}
                      className="text-xs font-medium text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Completed ✓
                    </span>
                  )}

                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                    aria-label="Delete course"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Track New Course
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MIT 18.06 Linear Algebra"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value as Course['platform'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {platforms.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Instructor
                  </label>
                  <input
                    type="text"
                    placeholder="Prof. Gilbert Strang"
                    value={instructor}
                    onChange={e => setInstructor(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course URL (YouTube, Coursera, NPTEL...)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={courseUrl}
                  onChange={e => setCourseUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Lectures
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalLectures}
                    onChange={e => setTotalLectures(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Estimated Total Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedHours}
                    onChange={e => setEstimatedHours(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Course['priority'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Key topics to focus on"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
