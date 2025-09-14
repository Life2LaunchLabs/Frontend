import React, { useState } from 'react';
import { useTheme } from '../../../../styles';
import { apiClient } from '../../../../lib/api';
import { authManager } from '../../../../lib/api/auth';

export interface DevAuthProps {
  onAuthSuccess: () => void;
}

export const DevAuth: React.FC<DevAuthProps> = ({ onAuthSuccess }) => {
  const { theme, tokens } = useTheme();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/auth/login/', {
        username,
        password
      });

      const { tokens: authTokens } = response.data as { tokens: { access: string; refresh: string } };
      authManager.setTokens(authTokens.access, authTokens.refresh);
      onAuthSuccess();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStyles = () => ({
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    container: {
      backgroundColor: theme.surfaceContainerHigh,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      border: `1px solid ${theme.outline}`,
      maxWidth: '400px',
      width: '90%',
      boxShadow: tokens.shadows.large,
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: `0 0 ${tokens.spacing[2]}px 0`,
      textAlign: 'center' as const,
    },
    subtitle: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      margin: `0 0 ${tokens.spacing[6]}px 0`,
      textAlign: 'center' as const,
      lineHeight: 1.5,
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    label: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      fontWeight: 600,
    },
    input: {
      backgroundColor: theme.surfaceContainer,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[3],
      fontSize: tokens.typography.body.medium.fontSize,
      outline: 'none',
    },
    button: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[4]}px ${tokens.spacing[6]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.6 : 1,
      marginTop: tokens.spacing[2],
    },
    error: {
      backgroundColor: '#FFEBEE',
      color: '#C62828',
      border: '1px solid #F44336',
      borderRadius: tokens.borderRadius.small,
      padding: tokens.spacing[3],
      ...tokens.typography.body.small,
      textAlign: 'center' as const,
    },
    hint: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      fontStyle: 'italic',
      textAlign: 'center' as const,
      backgroundColor: theme.surfaceContainer,
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2 style={styles.title}>Dev Authentication</h2>
        <p style={styles.subtitle}>
          Login to test the chat system endpoints. This is for development testing only.
        </p>

        <div style={styles.hint}>
          💡 Default credentials: admin / admin
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            style={styles.button}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};