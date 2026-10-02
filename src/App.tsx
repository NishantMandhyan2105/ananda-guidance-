import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { DataProvider, useData } from './context/DataContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/landing/LoginPage';

// Role Dashboards & Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CoordinatorDashboard } from './components/coordinator/CoordinatorDashboard';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import { JuniorDashboard } from './components/junior/JuniorDashboard';

// Shared & Admin Views
import { MatchingCenter } from './components/admin/MatchingCenter';
import { UserManagement } from './components/admin/UserManagement';
import { PilotTimeline } from './components/admin/PilotTimeline';
import { SettingsView } from './components/admin/SettingsView';
import { AuditLogView } from './components/admin/AuditLogView';
import { EscalationCenter } from './components/shared/EscalationCenter';
import { SuccessStoriesView } from './components/shared/SuccessStoriesView';
import { InteractionHistory } from './components/shared/InteractionHistory';
import { ReportsView } from './components/shared/ReportsView';

// Modals
import { RecordInteractionModal } from './components/mentor/RecordInteractionModal';
import { MonthlyPulseModal } from './components/junior/MonthlyPulseModal';
import { RequestGuidanceModal } from './components/junior/RequestGuidanceModal';
import { AttentionItem } from './services/analyticsService';

const MainAppContent: React.FC = () => {
  const { currentUser, role, isAuthenticated, logout } = useAuth();
  const { toasts, removeToast } = useNotifications();
  const { programSettings } = useData();

  // Navigation state: 'landing' | 'login' | 'app'
  const [viewState, setViewState] = useState<'landing' | 'login' | 'app'>('app');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Quick modals triggers
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);

  // If user explicitly browses to landing page
  if (viewState === 'landing') {
    return (
      <LandingPage
        onLoginClick={() => setViewState('login')}
        onExploreDemo={() => setViewState('app')}
      />
    );
  }

  // If user is at login screen
  if (viewState === 'login' || !isAuthenticated) {
    return (
      <LoginPage
        onSuccessLogin={() => {
          setViewState('app');
          setActiveTab('dashboard');
        }}
        onBackToLanding={() => setViewState('landing')}
      />
    );
  }

  // Handle clicking items inside the Attention Required widget
  const handleSelectItemAlert = (item: AttentionItem) => {
    if (item.type === 'escalation') {
      setActiveTab('escalations');
    } else if (item.type === 'inactive_group') {
      setActiveTab('interactions');
    } else if (item.type === 'overdue_action') {
      if (role === 'mentor') setActiveTab('dashboard');
      else setActiveTab('interactions');
    } else if (item.type === 'low_feedback') {
      setActiveTab('reports');
    } else {
      setActiveTab('users');
    }
  };

  // Render role-specific Dashboard
  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return (
          <AdminDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectItemAlert={handleSelectItemAlert}
          />
        );
      case 'coordinator':
        return (
          <CoordinatorDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectItemAlert={handleSelectItemAlert}
          />
        );
      case 'mentor':
        return (
          <MentorDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'junior':
      default:
        return <JuniorDashboard />;
    }
  };

  // Tab content switcher
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'matching':
        return <MatchingCenter />;
      case 'users':
        return <UserManagement />;
      case 'interactions':
        return <InteractionHistory />;
      case 'pilot':
        return <PilotTimeline settings={programSettings} />;
      case 'escalations':
        return <EscalationCenter />;
      case 'stories':
        return <SuccessStoriesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'audit':
        return <AuditLogView />;
      case 'record':
        // For mentor: open modal and show dashboard
        return (
          <>
            {renderDashboard()}
            <RecordInteractionModal
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
            />
          </>
        );
      case 'actions':
      case 'pulse':
      case 'request_guidance':
        return <JuniorDashboard />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateLanding={() => setViewState('landing')}
        onSelectUserFromSearch={(userId, userRole) => {
          if (role === 'admin' || role === 'coordinator') {
            setActiveTab('users');
          }
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'record') {
              setIsRecordModalOpen(true);
            } else if (tab === 'pulse') {
              setIsPulseModalOpen(true);
            } else if (tab === 'request_guidance') {
              setIsGuidanceModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Quick Modals */}
      <RecordInteractionModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />

      <MonthlyPulseModal
        isOpen={isPulseModalOpen}
        onClose={() => setIsPulseModalOpen(false)}
      />

      <RequestGuidanceModal
        isOpen={isGuidanceModalOpen}
        onClose={() => setIsGuidanceModalOpen(false)}
      />

      {/* Toast Notifications Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none no-print">
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border text-left cursor-pointer transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' :
              toast.type === 'alert' || toast.type === 'warning' ? 'bg-rose-900 text-white border-rose-700' :
              'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <p className="text-xs font-bold leading-tight">{toast.title}</p>
            <p className="text-xs text-slate-200 mt-1 leading-snug">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DataProvider>
          <MainAppContent />
        </DataProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
