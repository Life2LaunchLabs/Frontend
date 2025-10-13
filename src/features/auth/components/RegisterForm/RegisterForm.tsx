/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../styles';
import { Button } from '@shared/components';
import { useRegister } from '../../api';
import type { RegisterCredentials } from '../../types';

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  className,
}) => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
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

  return (
    <form
      className={className}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[4],
      }}
      onSubmit={handleSubmit}
      data-testid="register-form"
    >
      {/* Name fields row */}
      <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing[4] }}>
        <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
          <label css={{ ...tokens.typography.body.medium, color: colors.textPrimary, fontWeight: 600 }} htmlFor="first_name">
            First Name
          </label>
          <input
            id="first_name"
            css={{
              backgroundColor: colors.surfaceContainer,
              color: colors.textPrimary,
              border: `1px solid ${colors.outline}`,
              borderRadius: tokens.borderRadius.medium,
              padding: tokens.spacing[3],
              fontSize: tokens.typography.body.medium.fontSize,
              outline: 'none',
              transition: tokens.transitions.normal,
              '&:focus': { borderColor: colors.accentPrimary },
            }}
            type="text"
            value={credentials.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            placeholder="John"
            autoComplete="given-name"
            data-testid="first-name-input"
          />
        </div>

        <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
          <label css={{ ...tokens.typography.body.medium, color: colors.textPrimary, fontWeight: 600 }} htmlFor="last_name">
            Last Name
          </label>
          <input
            id="last_name"
            css={{
              backgroundColor: colors.surfaceContainer,
              color: colors.textPrimary,
              border: `1px solid ${colors.outline}`,
              borderRadius: tokens.borderRadius.medium,
              padding: tokens.spacing[3],
              fontSize: tokens.typography.body.medium.fontSize,
              outline: 'none',
              transition: tokens.transitions.normal,
              '&:focus': { borderColor: colors.accentPrimary },
            }}
            type="text"
            value={credentials.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            placeholder="Doe"
            autoComplete="family-name"
            data-testid="last-name-input"
          />
        </div>
      </div>

      {/* Email field */}
      <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
        <label css={{ ...tokens.typography.body.medium, color: colors.textPrimary, fontWeight: 600 }} htmlFor="email">
          Email *
        </label>
        <input
          id="email"
          css={{
            backgroundColor: colors.surfaceContainer,
            color: colors.textPrimary,
            border: `1px solid ${errors.email ? colors.error : colors.outline}`,
            borderRadius: tokens.borderRadius.medium,
            padding: tokens.spacing[3],
            fontSize: tokens.typography.body.medium.fontSize,
            outline: 'none',
            transition: tokens.transitions.normal,
            '&:focus': { borderColor: colors.accentPrimary },
          }}
          type="email"
          value={credentials.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          data-testid="email-input"
        />
        {errors.email && (
          <div css={{ ...tokens.typography.body.small, color: colors.error }} data-testid="email-error">
            {errors.email}
          </div>
        )}
      </div>

      {/* Password fields row */}
      <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing[4] }}>
        <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
          <label css={{ ...tokens.typography.body.medium, color: colors.textPrimary, fontWeight: 600 }} htmlFor="password">
            Password *
          </label>
          <input
            id="password"
            css={{
              backgroundColor: colors.surfaceContainer,
              color: colors.textPrimary,
              border: `1px solid ${errors.password ? colors.error : colors.outline}`,
              borderRadius: tokens.borderRadius.medium,
              padding: tokens.spacing[3],
              fontSize: tokens.typography.body.medium.fontSize,
              outline: 'none',
              transition: tokens.transitions.normal,
              '&:focus': { borderColor: colors.accentPrimary },
            }}
            type="password"
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
            data-testid="password-input"
          />
          {errors.password && (
            <div css={{ ...tokens.typography.body.small, color: colors.error }} data-testid="password-error">
              {errors.password}
            </div>
          )}
        </div>

        <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
          <label css={{ ...tokens.typography.body.medium, color: colors.textPrimary, fontWeight: 600 }} htmlFor="confirmPassword">
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            css={{
              backgroundColor: colors.surfaceContainer,
              color: colors.textPrimary,
              border: `1px solid ${errors.confirmPassword ? colors.error : colors.outline}`,
              borderRadius: tokens.borderRadius.medium,
              padding: tokens.spacing[3],
              fontSize: tokens.typography.body.medium.fontSize,
              outline: 'none',
              transition: tokens.transitions.normal,
              '&:focus': { borderColor: colors.accentPrimary },
            }}
            type="password"
            value={credentials.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            autoComplete="new-password"
            data-testid="confirm-password-input"
          />
          {errors.confirmPassword && (
            <div css={{ ...tokens.typography.body.small, color: colors.error }} data-testid="confirm-password-error">
              {errors.confirmPassword}
            </div>
          )}
        </div>
      </div>

      <Button
        variant="filled"
        type="submit"
        disabled={registerMutation.isPending}
        data-testid="register-button"
        css={{ width: '100%', marginTop: tokens.spacing[2] }}
      >
        {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};