import React from 'react';
import { useAuth } from '../../api';
import { AuthPage } from '../../pages';

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Authentication guard component that protects routes requiring authentication
 * Shows login page if user is not authenticated, otherwise renders children
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback
}) => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Show loading state while auth is initializing
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

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <AuthPage />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
};