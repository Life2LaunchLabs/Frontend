import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, DashboardPage } from '../features/dashboard';
import { ProfilePage, AccountPage } from '../features/profile';
import { ExplorePage, QuestsListPage, QuestDetailPage } from '../features/quests';
import { MapPage } from '../features/map';
import { ChatPage } from '../features/chat';
import { DevPage, ChatSettingsPage, ActivityDemoPage } from '../features/dev';
import { AuthPage, AuthGuard, useAuth } from '../features/auth';
import { OrgSelectPage, AdminDashboard, AdminActivityDetailPage, AdminActivityEditPage, AdminQuestsPage, AdminQuestDetailPage, AdminAccountPage } from '../features/admin';
import { ActivityDetailPage, ActivitySessionPage, ActivityResultsPage, PublicActivitySessionPage } from '../features/activities';
import { LandingPage } from '../features/landing';
import { OnboardingFlowProvider, WelcomeResultsPage } from '../features/onboarding';
import './App.css';

// Component to handle home route redirects
function HomeRedirect() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route - landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public auth routes */}
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />

        {/* Public onboarding routes - no authentication required */}
        <Route
          path="/welcome"
          element={
            <OnboardingFlowProvider>
              <PublicActivitySessionPage />
            </OnboardingFlowProvider>
          }
        />
        <Route
          path="/welcome/results"
          element={
            <OnboardingFlowProvider>
              <WelcomeResultsPage />
            </OnboardingFlowProvider>
          }
        />
        <Route
          path="/welcome/:stepSlug"
          element={
            <OnboardingFlowProvider>
              <PublicActivitySessionPage />
            </OnboardingFlowProvider>
          }
        />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/home" 
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <HomePage />
            </AuthGuard>
          } 
        />
        <Route
          path="/chat"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ChatPage />
            </AuthGuard>
          }
        />

        {/* Folder page routes - also protected */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="/account"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <AccountPage />
            </AuthGuard>
          }
        />
        <Route
          path="/map"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <MapPage />
            </AuthGuard>
          }
        />
        <Route
          path="/explore"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ExplorePage />
            </AuthGuard>
          }
        />
        <Route
          path="/quests"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <QuestsListPage />
            </AuthGuard>
          }
        />
        <Route
          path="/quests/:questId"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <QuestDetailPage />
            </AuthGuard>
          }
        />

        {/* Dev route - also protected */}
        <Route
          path="/dev"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <DevPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dev/chat_settings"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ChatSettingsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dev/activities"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ActivityDemoPage />
            </AuthGuard>
          }
        />

        {/* Activity routes - also protected */}
        <Route
          path="/activities/:activityId"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ActivityDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/activities/active/:activityId/:pageIndex"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ActivitySessionPage />
            </AuthGuard>
          }
        />
        <Route
          path="/activities/active/:activityId"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ActivitySessionPage />
            </AuthGuard>
          }
        />
        <Route
          path="/activities/results/:activityId"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <ActivityResultsPage />
            </AuthGuard>
          }
        />

        {/* Admin routes - also protected */}
        <Route
          path="/admin/select-org"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <OrgSelectPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/activities/:id"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <AdminActivityDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/activities/:id/edit"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <AdminActivityEditPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/quests"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <AdminQuestsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/quests/:questId"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <AdminQuestDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/account"
          element={
            <AuthGuard fallback={<Navigate to="/login" replace />}>
              <AdminAccountPage />
            </AuthGuard>
          }
        />

        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
