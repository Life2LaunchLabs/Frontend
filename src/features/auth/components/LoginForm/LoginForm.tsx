/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../styles';
import { Button } from '@shared/components';
import { useLogin } from '../../api';
import type { LoginCredentials } from '../../types';

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  className,
}) => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useLogin();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
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

  const handleDemoLogin = async () => {
    const demoCredentials = {
      email: 'sam@fake.com',
      password: 'samgarcia'
    };

    try {
      await loginMutation.mutateAsync(demoCredentials);
      navigate('/home');
    } catch {
      // Error handled by the hook
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
      data-testid="login-form"
    >

      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[2],
        }}
      >
        <label
          css={{
            ...tokens.typography.body.medium,
            color: colors.onSurface,
            fontWeight: 600,
          }}
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          css={{
            backgroundColor: colors.surfaceContainer,
            color: colors.onSurface,
            border: `1px solid ${errors.email ? colors.error : colors.outline}`,
            borderRadius: tokens.borderRadius.medium,
            padding: tokens.spacing[3],
            fontSize: tokens.typography.body.medium.fontSize,
            outline: 'none',
            transition: tokens.transitions.normal,
            '&:focus': {
              borderColor: colors.accentPrimary,
            },
          }}
          type="email"
          value={credentials.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          data-testid="email-input"
        />
        {errors.email && (
          <div
            css={{
              ...tokens.typography.body.small,
              color: colors.error,
            }}
            data-testid="email-error"
          >
            {errors.email}
          </div>
        )}
      </div>

      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[2],
        }}
      >
        <label
          css={{
            ...tokens.typography.body.medium,
            color: colors.onSurface,
            fontWeight: 600,
          }}
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          css={{
            backgroundColor: colors.surfaceContainer,
            color: colors.onSurface,
            border: `1px solid ${errors.password ? colors.error : colors.outline}`,
            borderRadius: tokens.borderRadius.medium,
            padding: tokens.spacing[3],
            fontSize: tokens.typography.body.medium.fontSize,
            outline: 'none',
            transition: tokens.transitions.normal,
            '&:focus': {
              borderColor: colors.accentPrimary,
            },
          }}
          type="password"
          value={credentials.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          data-testid="password-input"
        />
        {errors.password && (
          <div
            css={{
              ...tokens.typography.body.small,
              color: colors.error,
            }}
            data-testid="password-error"
          >
            {errors.password}
          </div>
        )}
      </div>

      <Button
        variant="filled"
        type="submit"
        disabled={loginMutation.isPending}
        data-testid="login-button"
        css={{ width: '100%', marginTop: tokens.spacing[2] }}
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </Button>

      <Button
        variant="tonal"
        type="button"
        onClick={handleDemoLogin}
        disabled={loginMutation.isPending}
        data-testid="demo-login-button"
        css={{ width: '100%' }}
      >
        🚀 Try Demo Account
      </Button>

    </form>
  );
};