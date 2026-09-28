import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Save,
  Building,
  GraduationCap,
  Briefcase,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, resetToDemoData } = useStudent();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [degree, setDegree] = useState(profile.degree);
  const [branch, setBranch] = useState(profile.branch);
  const [college, setCollege] = useState(profile.college);
  const [semester, setSemester] = useState(profile.currentYearSemester);
  const [cgpa, setCgpa] = useState(profile.cgpa);
  const [gradYear, setGradYear] = useState(profile.graduationYear);
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal);
  const [companies, setCompanies] = useState(profile.targetCompanies.join(', '));
  const [exams, setExams] = useState(profile.targetExams.join(', '));
  const [studyHours, setStudyHours] = useState(profile.dailyStudyHours);
  const [studyTime, setStudyTime] = useState(profile.preferredStudyTime);
  const [strong, setStrong] = useState(profile.strongSubjects.join(', '));
  const [weak, setWeak] = useState(profile.weakSubjects.join(', '));
  const [collegeStart, setCollegeStart] = useState(profile.collegeStartTime);
  const [collegeEnd, setCollegeEnd] = useState(profile.collegeEndTime);
  const [travelHours, setTravelHours] = useState(profile.travelHoursDaily);
  const [sleepHours, setSleepHours] = useState(profile.sleepHours);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name,
      email,
      degree,
      branch,
      college,
      currentYearSemester: semester,
      cgpa: Number(cgpa) || 8.0,
      graduationYear: Number(gradYear) || 2027,
      careerGoal,
      targetCompanies: companies.split(',').map(c => c.trim()).filter(Boolean),
      targetExams: exams.split(',').map(e => e.trim()).filter(Boolean),
      dailyStudyHours: Number(studyHours) || 3.5,
      preferredStudyTime: studyTime as any,
      strongSubjects: strong.split(',').map(s => s.trim()).filter(Boolean),
      weakSubjects: weak.split(',').map(w => w.trim()).filter(Boolean),
      collegeStartTime: collegeStart,
      collegeEndTime: collegeEnd,
      travelHoursDaily: Number(travelHours) || 1,
      sleepHours: Number(sleepHours) || 7.5,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <User className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Student Identity & Preferences
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Student Profile
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure your college timetable, target companies, exams, and weak areas. StudentPilot grounds recommendations in this context.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToDemoData}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile changes successfully updated and saved!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Academics & College */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            1. Academic Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Degree & Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current Year / Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current CGPA
              </label>
              <input
                type="number"
                step="0.01"
                value={cgpa}
                onChange={e => setCgpa(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Career Targets & Exams */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            2. Career & Exam Aspirations
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Career Goal
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={e => setCareerGoal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Graduation Year
              </label>
              <input
                type="number"
                value={gradYear}
                onChange={e => setGradYear(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Companies (comma-separated)
              </label>
              <input
                type="text"
                value={companies}
                onChange={e => setCompanies(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Exams (comma-separated)
              </label>
              <input
                type="text"
                value={exams}
                onChange={e => setExams(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Study Habits & Realistic College Hours */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            3. Realistic Study Hours & Timetable Schedule
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Daily Study Target ({studyHours} hours)
              </label>
              <input
                type="range"
                min="1.5"
                max="6"
                step="0.5"
                value={studyHours}
                onChange={e => setStudyHours(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <div className="text-[11px] text-slate-400">Recommended: 3 to 4 hours</div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preferred Study Time
              </label>
              <select
                value={studyTime}
                onChange={e => setStudyTime(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Morning">Morning (Fresh mind)</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening (Post-college)</option>
                <option value="Night">Night (Deep focus)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                College Timetable
              </label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="time"
                  value={collegeStart}
                  onChange={e => setCollegeStart(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="time"
                  value={collegeEnd}
                  onChange={e => setCollegeEnd(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Daily Commute & Sleep
              </label>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {travelHours}h travel · {sleepHours}h sleep
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Strong & Weak Subjects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            4. Self-Assessed Subject Confidence
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Strong Subjects (comma-separated)
              </label>
              <input
                type="text"
                value={strong}
                onChange={e => setStrong(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="mt-1 text-[11px] text-slate-400">
                Topics scheduled primarily for maintenance reviews.
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Weak Subjects (comma-separated)
              </label>
              <input
                type="text"
                value={weak}
                onChange={e => setWeak(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="mt-1 text-[11px] text-slate-400">
                Prioritized during "What should I do now?" suggestions.
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile & Schedule Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
