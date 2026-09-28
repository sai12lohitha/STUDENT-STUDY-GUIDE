import React, { useState } from 'react';
import {
  Library,
  Plus,
  ExternalLink,
  CheckCircle2,
  Circle,
  Search,
  Filter,
  FileText,
  Video,
  Globe,
  Book,
  Code,
  Trash2,
  X,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { ResourceItem } from '../types';

export const ResourceLibraryView: React.FC = () => {
  const { resources, addResource, toggleResourceCompleted, deleteResource } = useStudent();

  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New resource form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceItem['type']>('PDF');
  const [subject, setSubject] = useState('DSA');
  const [platform, setPlatform] = useState('takeUforward');
  const [difficulty, setDifficulty] = useState<ResourceItem['difficulty']>('Intermediate');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const types: ResourceItem['type'][] = [
    'Video',
    'PDF',
    'Website',
    'Book',
    'Notes',
    'Coding Problem',
  ];

  const getTypeIcon = (t: ResourceItem['type']) => {
    switch (t) {
      case 'Video':
        return <Video className="h-4 w-4 text-rose-500" />;
      case 'PDF':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'Website':
        return <Globe className="h-4 w-4 text-blue-500" />;
      case 'Book':
        return <Book className="h-4 w-4 text-emerald-500" />;
      case 'Coding Problem':
        return <Code className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-indigo-500" />;
    }
  };

  const filteredResources = resources.filter(item => {
    if (typeFilter !== 'All' && item.type !== typeFilter) return false;
    if (difficultyFilter !== 'All' && item.difficulty !== difficultyFilter) return false;
    if (
      searchQuery.trim() &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addResource({
      title,
      type,
      subject,
      platform,
      difficulty,
      url: url.trim() || 'https://google.com',
      completed: false,
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
            <Library className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Study Material Vault
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Resource Library
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Centralized hub for cheat sheets, Gilbert Strang notes, OSTEP chapters, and DSA roadmaps.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Save Resource</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources, topics, platforms..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All Formats</option>
            {types.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Difficulty filter */}
          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  {getTypeIcon(res.type)}
                  <span>{res.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{res.subject}</span>
                </div>

                <span
                  className={`text-[10px] font-bold ${
                    res.difficulty === 'Advanced'
                      ? 'text-rose-600 dark:text-rose-400'
                      : res.difficulty === 'Intermediate'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {res.difficulty}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                {res.title}
              </h3>

              <div className="mt-1 text-[11px] text-slate-400">
                Platform: <span className="font-medium text-slate-600 dark:text-slate-300">{res.platform}</span>
              </div>

              {res.notes && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                  "{res.notes}"
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleResourceCompleted(res.id)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {res.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span className="text-[11px] font-medium">
                    {res.completed ? 'Studied' : 'Mark Studied'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  onClick={() => deleteResource(res.id)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Save Learning Material
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems: Three Easy Pieces (OSTEP)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Format / Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ResourceItem['type'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {types.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject / Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linear Algebra, SQL"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Platform / Source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MIT OCW, YouTube"
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as ResourceItem['difficulty'])}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Resource URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Personal Study Notes
                </label>
                <input
                  type="text"
                  placeholder="Why this resource is helpful"
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
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
