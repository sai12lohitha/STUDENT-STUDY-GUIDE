import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Code2,
  Calendar,
  BookOpen,
  Briefcase,
  RotateCw,
  BarChart3,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const featureCards = [
    {
      title: 'AI Study Planner',
      description: 'Generates realistic daily routines with active recall, fatigue breaks, and urgent exam prioritization.',
      icon: Sparkles,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      title: 'Placement Tracker',
      description: 'Track OAs, interview rounds, and offers across Google, Microsoft, Atlassian, and top tech companies.',
      icon: Briefcase,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Exam Planner & Syllabus',
      description: 'Automated study plans that pace remaining GATE and semester topics before exams with mock buffer.',
      icon: GraduationCap,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Course Hub',
      description: 'Centralize YouTube, Coursera, Udemy, and NPTEL courses with live lecture completion & remaining hours.',
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'DSA Practice Tracker',
      description: 'Master all 12 key patterns from Arrays to DP with LeetCode/GFG links, accuracy tracking, and streak.',
      icon: Code2,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
    },
    {
      title: 'Smart Calendar',
      description: 'Realistic scheduling respecting 9–4 college hours, commute, sleep, and zero-burnout evening slots.',
      icon: Calendar,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    },
    {
      title: 'Spaced Revision System',
      description: 'Automated SuperMemo intervals (Day 0 → 1 → 7 → 21 → 45) so you never forget complex formulas or algorithms.',
      icon: RotateCw,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Progress Analytics',
      description: 'Visual breakdowns of weak subjects vs strong areas, daily hours, productivity score, and streak trend.',
      icon: BarChart3,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-500">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Student<span className="text-indigo-600 dark:text-indigo-400">Pilot</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Sign In
            </button>
            <button
              onClick={onEnterApp}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 text-center lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built for engineering, college & competitive exam students</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            One place for everything you need to become{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-sky-400">
              placement and exam ready.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Plan your studies, track courses, prepare for placements, manage exams, and let your personal AI assistant organize your day.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <button
              onClick={onEnterApp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onEnterApp}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span>View Live Dashboard</span>
            </button>
          </div>

          {/* Social Proof / Guarantee */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No unrealistic 12-hour timetables</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Auto-reschedules missed tasks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Spaced repetition memory curve</span>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section: Realistic Productivity */}
      <section className="border-y border-slate-200 bg-white px-6 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Our Core Product Principle
            </h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              "Tell the system what you want to achieve, and it helps you decide what to do today."
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Respects College Realities
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                You have 9 to 4 college, labs, commute, and fatigue. StudentPilot limits daily study targets to 3–4 realistic, high-impact hours so you stay consistent without burnout.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <RotateCw className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                One-Click Auto Rescheduling
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Missed yesterday's Linear Algebra lecture? Don't delete your schedule. One tap rebalances your pending task into tomorrow's available slot without snowballing guilt.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Grounded in Real Deadlines
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                "What should I do now?" prioritizes tasks using real exam dates, imminent online assessments, remaining syllabus, and your self-reported weak areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Everything in one unified student cockpit
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Say goodbye to juggling 6 different disconnected apps, messy spreadsheets, and lost notes.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feat.bg}`}>
                    <Icon className={`h-5 w-5 ${feat.color}`} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="border-t border-slate-200 bg-slate-900 px-6 py-16 text-white dark:border-slate-800 dark:bg-black">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to study with clarity, confidence, and peace of mind?
          </h2>
          <p className="text-sm text-slate-400">
            Join thousands of students who balanced college coursework, cracked tier-1 placements, and aced competitive exams.
          </p>
          <div>
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500"
            >
              <span>Open StudentPilot Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
