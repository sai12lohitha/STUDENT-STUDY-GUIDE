import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Database,
  Cpu,
  Globe,
  Code,
  Shield,
  MessageSquare,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const PlacementPrepView: React.FC = () => {
  const {
    aptitudeTopics,
    updateAptitudeTopic,
    csFundamentals,
    updateCSFundamental,
    interviewQuestions,
    toggleInterviewQuestion,
    studyStats,
  } = useStudent();

  const [activeTab, setActiveTab] = useState<'cs' | 'aptitude' | 'interview'>('cs');

  const csSubjects = [
    'All',
    'DBMS',
    'SQL',
    'Operating Systems',
    'Computer Networks',
    'OOP',
    'Software Engineering',
  ];
  const [selectedCSSubject, setSelectedCSSubject] = useState('All');

  const filteredCS = csFundamentals.filter(item => {
    if (selectedCSSubject !== 'All' && item.subject !== selectedCSSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Career & Campus Readiness
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Placement Preparation
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            CS fundamentals, speed aptitude, SQL queries, and behavioral STAR stories for tech interviews.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('cs')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'cs'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            CS Fundamentals
          </button>
          <button
            onClick={() => setActiveTab('aptitude')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'aptitude'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Aptitude & Speed Math
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'interview'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Interview & Behavioral
          </button>
        </div>
      </div>

      {/* TAB 1: CS FUNDAMENTALS */}
      {activeTab === 'cs' && (
        <div className="space-y-6">
          {/* Subject Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {csSubjects.map(subj => (
              <button
                key={subj}
                onClick={() => setSelectedCSSubject(subj)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCSSubject === subj
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredCS.map(item => {
              const isReady = item.status === 'Interview Ready';
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {item.subject}
                    </span>
                    <select
                      value={item.status}
                      onChange={e =>
                        updateCSFundamental(item.id, {
                          status: e.target.value as any,
                        })
                      }
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none ${
                        isReady
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.status === 'Revised'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Revised">Revised</option>
                      <option value="Interview Ready">Interview Ready ✓</option>
                    </select>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    {item.topic}
                  </h3>

                  {item.notes && (
                    <div className="mt-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Interview Invariant:
                      </span>{' '}
                      {item.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: APTITUDE */}
      {activeTab === 'aptitude' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aptitudeTopics.map(topic => (
              <div
                key={topic.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    {topic.category}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      topic.masteryLevel === 'Mastered'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : topic.masteryLevel === 'Good'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {topic.masteryLevel}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  {topic.name}
                </h3>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {topic.problemsPracticed}
                    </span>{' '}
                    problems solved
                  </div>
                  <div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {topic.accuracy}%
                    </span>{' '}
                    accuracy
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateAptitudeTopic(topic.id, {
                        problemsPracticed: topic.problemsPracticed + 5,
                      })
                    }
                    className="flex-1 rounded-lg border border-slate-200 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    +5 Questions Practiced
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INTERVIEW & BEHAVIORAL QUESTIONS */}
      {activeTab === 'interview' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Target Interview & STAR Story Bank
            </h2>
            <p className="text-xs text-slate-400">
              Practice answering out loud using Situation, Task, Action, and Result framing.
            </p>
          </div>

          <div className="space-y-3">
            {interviewQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="flex items-start justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400 uppercase">
                      {q.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-400 font-mono">Q{idx + 1}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {q.question}
                  </div>
                </div>

                <button
                  onClick={() => toggleInterviewQuestion(q.id)}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    q.prepared
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {q.prepared ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Prepared</span>
                    </>
                  ) : (
                    <span>Practice Answer</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
