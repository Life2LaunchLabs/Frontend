import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, DashboardPage } from '../features/dashboard';
import { ProfilePage } from '../features/profile';
import { MapPage, ExplorePage } from '../features/quests';
import { ChatPage } from '../features/chat';
import { DevPage, ChatSettingsPage } from '../features/dev';
import { AuthPage, AuthGuard, useAuth } from '../features/auth';
import './App.css';

// Component to handle root route redirects
function RootRedirect() {
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
        {/* Root route - redirects based on auth status */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Public auth routes */}
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        
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
        
        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
