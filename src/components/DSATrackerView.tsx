import React, { useState } from 'react';
import {
  Code2,
  Plus,
  ExternalLink,
  CheckCircle2,
  Flame,
  Search,
  Filter,
  Trash2,
  X,
  Target,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { DSAProblem, DSATopicName } from '../types';

export const DSATrackerView: React.FC = () => {
  const { dsaProblems, addDSAProblem, updateDSAProblem, deleteDSAProblem, toggleDSAStatus, studyStats } =
    useStudent();

  const allTopics: DSATopicName[] = [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Stack',
    'Queue',
    'Binary Search',
    'Trees',
    'Graphs',
    'Recursion',
    'Dynamic Programming',
    'Greedy',
    'Bit Manipulation',
  ];

  const platforms: DSAProblem['platform'][] = [
    'LeetCode',
    'GeeksforGeeks',
    'HackerRank',
    'CodeChef',
    'Codeforces',
    'Other',
  ];

  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New problem form
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState<DSATopicName>('Arrays');
  const [difficulty, setDifficulty] = useState<DSAProblem['difficulty']>('Medium');
  const [platform, setPlatform] = useState<DSAProblem['platform']>('LeetCode');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const filteredProblems = dsaProblems.filter(p => {
    if (selectedTopic !== 'All' && p.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
    if (selectedPlatform !== 'All' && p.platform !== selectedPlatform) return false;
    if (searchQuery.trim() && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDSAProblem({
      title,
      topic,
      difficulty,
      platform,
      url: url.trim() || 'https://leetcode.com',
      status: 'To Do',
      notes,
    });

    setTitle('');
    setUrl('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Code2 className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              12 Core DSA Patterns
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            DSA Practice & Problem Tracker
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track solved problems across LeetCode, GeeksforGeeks, Codeforces, and HackerRank. Solving questions automatically schedules retention review.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Problem</span>
        </button>
      </div>

      {/* METRIC ROW */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400">Total Solved</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {studyStats.dsaSolvedCount.total}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Target: 250 problems
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Easy Problems
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {studyStats.dsaSolvedCount.easy}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Foundational speed</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Medium Problems
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {studyStats.dsaSolvedCount.medium}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Tier-1 interview core</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            Hard Problems
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {studyStats.dsaSolvedCount.hard}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Advanced competitions</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Test Case Accuracy
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {studyStats.dsaSolvedCount.accuracy}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">First submission rate</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] font-semibold text-amber-500">Practice Streak</div>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {studyStats.streak}
            </span>
            <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Consecutive days</div>
        </div>
      </div>

      {/* 12 TOPICS HORIZONTAL / GRID SELECTOR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
          <span>Topic Mastery Progress (Click to filter)</span>
          <button
            onClick={() => setSelectedTopic('All')}
            className={`text-xs ${selectedTopic === 'All' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Show All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {allTopics.map(t => {
            const countSolved = dsaProblems.filter(p => p.topic === t && p.status === 'Solved').length;
            const isSelected = selectedTopic === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTopic(isSelected ? 'All' : t)}
                className={`rounded-xl border p-2.5 text-left transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold truncate">{t}</div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {countSolved} solved
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Platform filter */}
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All Platforms</option>
            {platforms.map(pl => (
              <option key={pl} value={pl}>
                {pl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problems List / Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredProblems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching problems found. Click "Add Problem" to log your practice.
            </div>
          ) : (
            filteredProblems.map(p => {
              const isSolved = p.status === 'Solved';
              return (
                <div
                  key={p.id}
                  className="flex flex-col justify-between gap-3 p-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center dark:hover:bg-slate-800/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold ${
                          p.difficulty === 'Easy'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : p.difficulty === 'Medium'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{p.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span>{p.platform}</span>
                      {p.solvedAt && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Solved {p.solvedAt}</span>
                        </>
                      )}
                      {p.notes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="italic text-slate-600 dark:text-slate-300">
                            {p.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <span>Problem Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    {/* Status dropdown */}
                    <select
                      value={p.status}
                      onChange={e =>
                        toggleDSAStatus(p.id, e.target.value as DSAProblem['status'])
                      }
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none ${
                        isSolved
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : p.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Solved">Solved ✓</option>
                      <option value="Revisiting">Revisiting</option>
                    </select>

                    <button
                      onClick={() => deleteDSAProblem(p.id)}
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

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Practice Problem
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProblem} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Problem Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trapping Rain Water"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    DSA Topic
                  </label>
                  <select
                    value={topic}
                    onChange={e => setTopic(e.target.value as DSATopicName)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {allTopics.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as DSAProblem['difficulty'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Coding Platform
                  </label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value as DSAProblem['platform'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {platforms.map(pl => (
                      <option key={pl} value={pl}>
                        {pl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Problem URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Key Intuition / Solution Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monotonic stack; O(N) time and O(N) space"
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
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
