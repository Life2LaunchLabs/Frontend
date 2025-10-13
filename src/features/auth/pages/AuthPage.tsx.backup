import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { LoginForm, RegisterForm } from '../components';
import trainCarImage from '../../../shared/assets/images/train_car.png';
import type { AuthMode } from '../types';

export interface AuthPageProps {
  initialMode?: AuthMode;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
}) => {
  const { theme, tokens } = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const getStyles = () => ({
    pageContainer: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    },
    backgroundSvg: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    contentOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.spacing[6],
      boxSizing: 'border-box' as const,
    },
    authCard: {
      backgroundColor: `${theme.surfaceContainerHigh}F0`, // 94% opacity
      backdropFilter: 'blur(12px)',
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      border: `1px solid ${theme.outline}`,
      boxShadow: tokens.shadows.large,
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: tokens.spacing[6],
    },
    title: {
      ...tokens.typography.display.small,
      color: theme.onSurface,
      margin: `0 0 ${tokens.spacing[2]}px 0`,
    },
    subtitle: {
      ...tokens.typography.body.large,
      color: theme.onSurfaceVariant,
      margin: 0,
      lineHeight: 1.5,
    },
    modeToggle: {
      display: 'flex',
      backgroundColor: theme.surfaceContainer,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[1],
      marginBottom: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
    },
    modeButton: {
      flex: 1,
      backgroundColor: 'transparent',
      color: theme.onSurfaceVariant,
      border: 'none',
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]}px ${tokens.spacing[4]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    modeButtonActive: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      fontWeight: 600,
    },
    brandSection: {
      textAlign: 'center' as const,
      marginBottom: tokens.spacing[4],
    },
    brandTitle: {
      ...tokens.typography.headline.large,
      color: theme.primary,
      margin: `0 0 ${tokens.spacing[1]}px 0`,
      fontWeight: 700,
    },
    brandSubtitle: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      margin: 0,
    },
  });

  const styles = getStyles();

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    // Update URL to match the mode
    navigate(newMode === 'login' ? '/login' : '/register', { replace: true });
  };

  return (
    <div style={styles.pageContainer} data-testid="auth-page">
      {/* Background */}
      <svg
        style={styles.backgroundSvg}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="trainBackgroundAuth"
            patternUnits="userSpaceOnUse"
            width="1000"
            height="1000"
          >
            <image
              href={trainCarImage}
              x="0"
              y="0"
              width="1000"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#trainBackgroundAuth)" />
        {/* Dark overlay for better text readability */}
        <rect width="1000" height="1000" fill="rgba(0, 0, 0, 0.3)" />
      </svg>

      {/* Content */}
      <div style={styles.contentOverlay}>
        <div style={styles.authCard}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <h1 style={styles.brandTitle}>Launchpad</h1>
            <p style={styles.brandSubtitle}>Your AI-powered learning companion</p>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>
              {mode === 'login' ? 'Welcome Back!' : 'Join Launchpad'}
            </h2>
            <p style={styles.subtitle}>
              {mode === 'login' 
                ? 'Sign in to continue your learning journey' 
                : 'Create your account to get started'
              }
            </p>
          </div>

          {/* Mode Toggle */}
          <div style={styles.modeToggle}>
            <button
              style={{
                ...styles.modeButton,
                ...(mode === 'login' ? styles.modeButtonActive : {}),
              }}
              onClick={() => handleModeSwitch('login')}
              data-testid="login-tab"
            >
              Sign In
            </button>
            <button
              style={{
                ...styles.modeButton,
                ...(mode === 'register' ? styles.modeButtonActive : {}),
              }}
              onClick={() => handleModeSwitch('register')}
              data-testid="register-tab"
            >
              Create Account
            </button>
          </div>

          {/* Auth Form */}
          {mode === 'login' ? (
            <LoginForm
              onSwitchToRegister={() => navigate('/register')}
              data-testid="login-form-container"
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={() => navigate('/login')}
              data-testid="register-form-container"
            />
          )}
        </div>
      </div>
    </div>
  );
};