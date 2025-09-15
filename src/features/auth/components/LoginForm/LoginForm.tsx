import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../styles';
import { useLogin } from '../../api';
import type { LoginCredentials } from '../../types';

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  className,
  style,
}) => {
  const { theme, tokens } = useTheme();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useLogin();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await loginMutation.mutateAsync(credentials);
      // Redirect to home after successful login
      navigate('/home');
    } catch {
      // Error handled by the hook
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStyles = () => ({
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4] || '1rem',
      ...style,
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2] || '0.5rem',
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
      padding: tokens.spacing[3] || '0.75rem',
      fontSize: tokens.typography.body.medium.fontSize,
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    inputError: {
      borderColor: theme.error,
    },
    inputFocus: {
      borderColor: theme.primary,
    },
    error: {
      ...tokens.typography.body.small,
      color: theme.error,
      marginTop: tokens.spacing[1] || '0.25rem',
    },
    button: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[4] || '1rem'} ${tokens.spacing[6] || '1.5rem'}`,
      fontSize: tokens.typography.body.medium.fontSize,
      fontWeight: 600,
      cursor: loginMutation.isPending ? 'not-allowed' : 'pointer',
      opacity: loginMutation.isPending ? 0.6 : 1,
      transition: 'all 0.2s ease',
      marginTop: tokens.spacing[2] || '0.5rem',
    },
    switchText: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      marginTop: tokens.spacing[4] || '1rem',
    },
    switchLink: {
      color: theme.primary,
      textDecoration: 'none',
      cursor: 'pointer',
      fontWeight: 600,
    },
    demoHint: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      backgroundColor: theme.surfaceContainer,
      padding: tokens.spacing[3] || '0.75rem',
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
      textAlign: 'center' as const,
      fontStyle: 'italic',
      marginBottom: tokens.spacing[4] || '1rem',
    },
  });

  const styles = getStyles();

  return (
    <form 
      className={className}
      style={styles.form}
      onSubmit={handleSubmit}
      data-testid="login-form"
    >
      <div style={styles.demoHint}>
        💡 Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          style={{
            ...styles.input,
            ...(errors.username ? styles.inputError : {}),
          }}
          type="text"
          value={credentials.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          onFocus={(e) => e.target.style.borderColor = theme.primary}
          onBlur={(e) => e.target.style.borderColor = errors.username ? theme.error : theme.outline}
          placeholder="Enter your username"
          autoComplete="username"
          data-testid="username-input"
        />
        {errors.username && (
          <div style={styles.error} data-testid="username-error">
            {errors.username}
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          style={{
            ...styles.input,
            ...(errors.password ? styles.inputError : {}),
          }}
          type="password"
          value={credentials.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          onFocus={(e) => e.target.style.borderColor = theme.primary}
          onBlur={(e) => e.target.style.borderColor = errors.password ? theme.error : theme.outline}
          placeholder="Enter your password"
          autoComplete="current-password"
          data-testid="password-input"
        />
        {errors.password && (
          <div style={styles.error} data-testid="password-error">
            {errors.password}
          </div>
        )}
      </div>

      <button
        style={styles.button}
        type="submit"
        disabled={loginMutation.isPending}
        data-testid="login-button"
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </button>

      <div style={styles.switchText}>
        Don't have an account?{' '}
        <span
          style={styles.switchLink}
          onClick={onSwitchToRegister}
          data-testid="switch-to-register"
        >
          Create one here
        </span>
      </div>
    </form>
  );
};