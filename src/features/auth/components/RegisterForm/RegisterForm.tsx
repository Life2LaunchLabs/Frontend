import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../styles';
import { useRegister } from '../../api';
import type { RegisterCredentials } from '../../types';

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  className,
  style,
}) => {
  const { theme, tokens } = useTheme();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegister();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (credentials.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(credentials.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await registerMutation.mutateAsync(credentials);
      // Redirect to home after successful registration
      navigate('/home');
    } catch {
      // Error handled by the hook
    }
  };

  const handleInputChange = (field: keyof RegisterCredentials, value: string) => {
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
      gap: tokens.spacing[4],
      ...style,
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
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
      transition: 'border-color 0.2s ease',
    },
    inputError: {
      borderColor: theme.error,
    },
    error: {
      ...tokens.typography.body.small,
      color: theme.error,
      marginTop: tokens.spacing[1],
    },
    button: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[4]}px ${tokens.spacing[6]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      fontWeight: 600,
      cursor: registerMutation.isPending ? 'not-allowed' : 'pointer',
      opacity: registerMutation.isPending ? 0.6 : 1,
      transition: 'all 0.2s ease',
      marginTop: tokens.spacing[2],
    },
    switchText: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      marginTop: tokens.spacing[4],
    },
    switchLink: {
      color: theme.primary,
      textDecoration: 'none',
      cursor: 'pointer',
      fontWeight: 600,
    },
  });

  const styles = getStyles();

  return (
    <form 
      className={className}
      style={styles.form}
      onSubmit={handleSubmit}
      data-testid="register-form"
    >
      {/* Name fields row */}
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="first_name">
            First Name
          </label>
          <input
            id="first_name"
            style={styles.input}
            type="text"
            value={credentials.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = theme.primary}
            onBlur={(e) => e.target.style.borderColor = theme.outline}
            placeholder="John"
            autoComplete="given-name"
            data-testid="first-name-input"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="last_name">
            Last Name
          </label>
          <input
            id="last_name"
            style={styles.input}
            type="text"
            value={credentials.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = theme.primary}
            onBlur={(e) => e.target.style.borderColor = theme.outline}
            placeholder="Doe"
            autoComplete="family-name"
            data-testid="last-name-input"
          />
        </div>
      </div>

      {/* Username field */}
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="username">
          Username *
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
          placeholder="Choose a username"
          autoComplete="username"
          data-testid="username-input"
        />
        {errors.username && (
          <div style={styles.error} data-testid="username-error">
            {errors.username}
          </div>
        )}
      </div>

      {/* Email field */}
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="email">
          Email *
        </label>
        <input
          id="email"
          style={{
            ...styles.input,
            ...(errors.email ? styles.inputError : {}),
          }}
          type="email"
          value={credentials.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          onFocus={(e) => e.target.style.borderColor = theme.primary}
          onBlur={(e) => e.target.style.borderColor = errors.email ? theme.error : theme.outline}
          placeholder="your@email.com"
          autoComplete="email"
          data-testid="email-input"
        />
        {errors.email && (
          <div style={styles.error} data-testid="email-error">
            {errors.email}
          </div>
        )}
      </div>

      {/* Password fields row */}
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="password">
            Password *
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
            placeholder="Create a password"
            autoComplete="new-password"
            data-testid="password-input"
          />
          {errors.password && (
            <div style={styles.error} data-testid="password-error">
              {errors.password}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="confirmPassword">
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            style={{
              ...styles.input,
              ...(errors.confirmPassword ? styles.inputError : {}),
            }}
            type="password"
            value={credentials.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = theme.primary}
            onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? theme.error : theme.outline}
            placeholder="Confirm your password"
            autoComplete="new-password"
            data-testid="confirm-password-input"
          />
          {errors.confirmPassword && (
            <div style={styles.error} data-testid="confirm-password-error">
              {errors.confirmPassword}
            </div>
          )}
        </div>
      </div>

      <button
        style={styles.button}
        type="submit"
        disabled={registerMutation.isPending}
        data-testid="register-button"
      >
        {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
      </button>

      <div style={styles.switchText}>
        Already have an account?{' '}
        <span
          style={styles.switchLink}
          onClick={onSwitchToLogin}
          data-testid="switch-to-login"
        >
          Sign in here
        </span>
      </div>
    </form>
  );
};