import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BookOpen,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { Exam } from '../types';

export const ExamPlannerView: React.FC = () => {
  const { exams, addExam, toggleExamTopic, deleteExam } = useStudent();

  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // New exam form
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('2027-02-14');
  const [targetScore, setTargetScore] = useState('AIR < 300 (Score > 75)');
  const [subjectInput, setSubjectInput] = useState('Engineering Mathematics\nProbability & Statistics\nCore Computer Science');

  const activeExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subjectsArr = subjectInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(subjName => ({
        subjectName: subjName,
        progress: 0,
        topics: [
          {
            id: `top-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            name: `${subjName} Module 1 Fundamentals`,
            difficulty: 'Medium' as const,
            knowledgeLevel: 'Beginner' as const,
            weightagePercent: 15,
            completed: false,
          },
          {
            id: `top-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            name: `${subjName} Module 2 Advanced Concepts`,
            difficulty: 'Hard' as const,
            knowledgeLevel: 'Beginner' as const,
            weightagePercent: 20,
            completed: false,
          },
        ],
      }));

    addExam({
      name,
      examDate,
      targetScore,
      subjects: subjectsArr,
    });

    setName('');
    setShowAddModal(false);
  };

  // Calculations for active exam
  const examDateObj = activeExam ? new Date(activeExam.examDate) : new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((examDateObj.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  );

  const totalTopics = activeExam?.totalTopics || 1;
  const completedTopics = activeExam?.completedTopics || 0;
  const remainingTopics = Math.max(0, totalTopics - completedTopics);
  const syllabusCompletedPct = Math.round((completedTopics / Math.max(totalTopics, 1)) * 100);

  // Recommended weekly workload: keeping 14 days before exam for final revisions & full-length mock tests
  const availableStudyWeeks = Math.max(1, Math.floor((daysRemaining - 14) / 7));
  const recommendedWeeklyTopics = (remainingTopics / availableStudyWeeks).toFixed(1);
  const recommendedWeeklyHours = (parseFloat(recommendedWeeklyTopics) * 3.5).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Smart Exam Planner & Syllabus Engine
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Exam Preparation & Syllabus
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Automatically calculates days remaining, syllabus pace, and schedules remaining topics with mock test buffers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Exam</span>
        </button>
      </div>

      {/* Exam Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {exams.map(exam => {
          const isSelected = activeExam?.id === exam.id;
          return (
            <button
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-indigo-600'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {exam.name}
            </button>
          );
        })}
      </div>

      {activeExam && (
        <div className="space-y-6">
          {/* STATS METRIC ROW */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="text-[11px] font-semibold text-slate-400">Days Remaining</div>
              <div className="mt-1 text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {daysRemaining}
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Exam Date: {activeExam.examDate}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="text-[11px] font-semibold text-slate-400">Syllabus Completed</div>
              <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white font-mono">
                {syllabusCompletedPct}%
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {completedTopics}/{totalTopics} topics finished
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="text-[11px] font-semibold text-slate-400">Topics Remaining</div>
              <div className="mt-1 text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {remainingTopics}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">To be covered</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="text-[11px] font-semibold text-slate-400">Recommended Workload</div>
              <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white font-mono">
                {recommendedWeeklyTopics}
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                topics/week (~{recommendedWeeklyHours}h study)
              </div>
            </div>
          </div>

          {/* AUTOMATED STUDY PLAN & PACING NOTICE */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Automated Topic Pacing Schedule
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              The algorithm spreads your {remainingTopics} unfinished topics across {availableStudyWeeks} available study weeks (leaving the final 14 days exclusively for full-length mock tests, error log analysis, and formula memorization).
            </p>
          </div>

          {/* SUBJECTS & TOPICS BREAKDOWN */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subject & Topic Syllabus Breakdown
            </h3>

            <div className="space-y-4">
              {activeExam.subjects.map((subj, subjIdx) => (
                <div
                  key={subj.subjectName}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {subj.subjectName}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {subj.topics.filter(t => t.completed).length}/{subj.topics.length} topics mastered
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                        {subj.progress}%
                      </span>
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                          style={{ width: `${subj.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                    {subj.topics.map(topic => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleExamTopic(activeExam.id, subjIdx, topic.id)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {topic.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700" />
                            )}
                          </button>
                          <span
                            className={
                              topic.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'font-medium text-slate-800 dark:text-slate-200'
                            }
                          >
                            {topic.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px]">
                          <span
                            className={
                              topic.difficulty === 'Hard'
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : topic.difficulty === 'Medium'
                                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }
                          >
                            {topic.difficulty}
                          </span>
                          <span className="text-slate-400 font-mono">
                            ~{topic.weightagePercent}% marks
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              topic.knowledgeLevel === 'Proficient'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : topic.knowledgeLevel === 'Intermediate'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {topic.knowledgeLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Exam Target & Syllabus
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Exam Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semester 6 Final Exams or GATE CS"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Score / Rank
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CGPA > 9.0"
                    value={targetScore}
                    onChange={e => setTargetScore(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Syllabus Subjects (one per line)
                </label>
                <textarea
                  rows={4}
                  value={subjectInput}
                  onChange={e => setSubjectInput(e.target.value)}
                  placeholder="Subject 1&#10;Subject 2&#10;Subject 3"
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
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
