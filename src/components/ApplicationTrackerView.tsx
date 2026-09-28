import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  ExternalLink,
  Kanban,
  Table,
  Building,
  Calendar,
  Clock,
  Trash2,
  X,
  CheckCircle2,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { JobApplication, ApplicationStatus } from '../types';

export const ApplicationTrackerView: React.FC = () => {
  const { applications, addApplication, updateApplicationStatus, deleteApplication } = useStudent();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [showAddModal, setShowAddModal] = useState(false);

  // New application form
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Software Engineering Intern');
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('2026-10-31');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [testDate, setTestDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [salaryPackage, setSalaryPackage] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [notes, setNotes] = useState('');

  const statusColumns: ApplicationStatus[] = [
    'Wishlist',
    'Applied',
    'OA Scheduled',
    'OA Completed',
    'Interview',
    'Selected',
    'Rejected',
  ];

  const statusColors: Record<ApplicationStatus, { headerBg: string; text: string; badge: string }> = {
    Wishlist: { headerBg: 'border-slate-300 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    Applied: { headerBg: 'border-blue-400 dark:border-blue-700', text: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    'OA Scheduled': { headerBg: 'border-amber-400 dark:border-amber-700', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    'OA Completed': { headerBg: 'border-indigo-400 dark:border-indigo-700', text: 'text-indigo-600 dark:text-indigo-400', badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
    Interview: { headerBg: 'border-purple-400 dark:border-purple-700', text: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' },
    Selected: { headerBg: 'border-emerald-500 dark:border-emerald-700', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
    Rejected: { headerBg: 'border-rose-400 dark:border-rose-700', text: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
  };

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    addApplication({
      company,
      role,
      applicationDate: appDate,
      deadline,
      status,
      testDate: testDate || undefined,
      interviewDate: interviewDate || undefined,
      salaryPackage: salaryPackage || undefined,
      jobLink: jobLink || undefined,
      notes: notes || undefined,
    });

    setCompany('');
    setRole('Software Engineering Intern');
    setSalaryPackage('');
    setJobLink('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Campus & Off-Campus Pipeline
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Job & Internship Tracker
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage recruiter outreach, online assessment (OA) dates, interview rounds, and offers in Kanban or Table format.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map(col => {
            const colApps = applications.filter(a => a.status === col);
            const colStyle = statusColors[col];

            return (
              <div
                key={col}
                className="w-72 flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                {/* Column header */}
                <div className={`flex items-center justify-between border-b-2 pb-2.5 ${colStyle.headerBg}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${colStyle.text}`}>
                    {col}
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="mt-3 space-y-3">
                  {colApps.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      Empty stage
                    </div>
                  ) : (
                    colApps.map(app => (
                      <div
                        key={app.id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition hover:border-indigo-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {app.company}
                          </h4>
                          {app.jobLink && (
                            <a
                              href={app.jobLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-indigo-600"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {app.role}
                        </div>

                        {app.salaryPackage && (
                          <div className="mt-1 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {app.salaryPackage}
                          </div>
                        )}

                        {app.testDate && (
                          <div className="mt-2 text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                            OA Test: {app.testDate}
                          </div>
                        )}

                        {app.interviewDate && (
                          <div className="mt-1 text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                            Interview: {app.interviewDate}
                          </div>
                        )}

                        {app.notes && (
                          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                            "{app.notes}"
                          </p>
                        )}

                        {/* Move stage control */}
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                          <select
                            value={app.status}
                            onChange={e =>
                              updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                            }
                            className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {statusColumns.map(s => (
                              <option key={s} value={s}>
                                → {s}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Company & Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Dates (OA / Interview)</th>
                <th className="px-4 py-3">Package / CTC</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white">{app.company}</div>
                    <div className="text-[11px] text-slate-500">{app.role}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={e =>
                        updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                      }
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                    >
                      {statusColumns.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    {app.testDate && <div>OA: {app.testDate}</div>}
                    {app.interviewDate && <div className="text-indigo-600">Round: {app.interviewDate}</div>}
                    {!app.testDate && !app.interviewDate && <span className="text-slate-400">-</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {app.salaryPackage || '-'}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-[11px] text-slate-500">
                    {app.notes || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.jobLink && (
                        <a
                          href={app.jobLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-indigo-600"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Job / Internship Application
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Atlassian"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ApplicationStatus)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {statusColumns.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Salary / Stipend CTC
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1.2L/month or ₹22 LPA"
                    value={salaryPackage}
                    onChange={e => setSalaryPackage(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    OA Test Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={e => setTestDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Interview Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Careers Portal / Job URL
                </label>
                <input
                  type="url"
                  placeholder="https://careers.google.com/..."
                  value={jobLink}
                  onChange={e => setJobLink(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes / Referral Info
                </label>
                <input
                  type="text"
                  placeholder="e.g. Referred by senior engineer on LinkedIn"
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
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
