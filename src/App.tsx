import React, { useState } from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LandingPage } from './components/LandingPage';
import { AIStudyPlannerView } from './components/AIStudyPlannerView';
import { CalendarView } from './components/CalendarView';
import { CourseHubView } from './components/CourseHubView';
import { DSATrackerView } from './components/DSATrackerView';
import { ExamPlannerView } from './components/ExamPlannerView';
import { PlacementPrepView } from './components/PlacementPrepView';
import { TasksView } from './components/TasksView';
import { RevisionView } from './components/RevisionView';
import { GoalsView } from './components/GoalsView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { ResourceLibraryView } from './components/ResourceLibraryView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AIChatbotDrawer } from './components/AIChatbotDrawer';
import { AIDailySummaryModal } from './components/AIDailySummaryModal';
import { AuthModal } from './components/AuthModal';
import { QuickAddTaskModal } from './components/QuickAddTaskModal';
import { Bot, Sparkles, Home } from 'lucide-react';

function MainAppContent() {
  const [inApp, setInApp] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [dailySummaryOpen, setDailySummaryOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // If in Landing Page mode, render LandingPage
  if (!inApp) {
    return <LandingPage onEnterApp={() => setInApp(true)} />;
  }

  // Render the appropriate main view
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={view => setActiveView(view)}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onOpenDailySummary={() => setDailySummaryOpen(true)}
            onOpenAIChat={() => setAiChatOpen(true)}
          />
        );
      case 'goals':
        return <GoalsView />;
      case 'planner':
        return <AIStudyPlannerView />;
      case 'calendar':
        return <CalendarView />;
      case 'courses':
        return <CourseHubView />;
      case 'dsa':
        return <DSATrackerView />;
      case 'exams':
        return <ExamPlannerView />;
      case 'placement':
        return <PlacementPrepView />;
      case 'tasks':
        return <TasksView />;
      case 'revision':
        return <RevisionView />;
      case 'applications':
        return <ApplicationTrackerView />;
      case 'resources':
        return <ResourceLibraryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onNavigate={view => setActiveView(view)}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onOpenDailySummary={() => setDailySummaryOpen(true)}
            onOpenAIChat={() => setAiChatOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onSelectView={view => setActiveView(view)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAIChat={() => setAiChatOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          onOpenQuickAdd={() => setQuickAddOpen(true)}
          onOpenDailySummary={() => setDailySummaryOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onSearchSelect={view => setActiveView(view)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Bottom-Right AI Assistant Trigger */}
      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-105 hover:from-indigo-500 hover:to-violet-600 focus:outline-none dark:from-indigo-500 dark:to-violet-600"
        title="Open n8n AI Study Assistant"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
        </span>
        <Bot className="h-4 w-4" />
        <span className="hidden sm:inline">Ask n8n AI Assistant</span>
      </button>

      {/* Floating Button to switch to Landing Page preview */}
      <button
        onClick={() => setInApp(false)}
        className="fixed bottom-5 left-5 z-30 hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800"
        title="View Product Landing Page"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Landing Page</span>
      </button>

      {/* Modals & Drawers */}
      <AIChatbotDrawer
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        onNavigate={view => {
          setActiveView(view);
          setAiChatOpen(false);
        }}
      />

      <AIDailySummaryModal
        isOpen={dailySummaryOpen}
        onClose={() => setDailySummaryOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <QuickAddTaskModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <MainAppContent />
    </StudentProvider>
  );
}
