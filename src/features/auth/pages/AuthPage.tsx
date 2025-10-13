/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { LoginForm, RegisterForm } from '../components';
import { useLogin } from '../api';
import type { AuthMode } from '../types';

export interface AuthPageProps {
  initialMode?: AuthMode;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
}) => {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    navigate(newMode === 'login' ? '/login' : '/register', { replace: true });
  };

  const loginMutation = useLogin();
  const handleDemoAdminLogin = async () => {
    const demoCredentials = {
      email: 'sam@fake.com',
      password: 'samgarcia'
    };

    try {
      await loginMutation.mutateAsync(demoCredentials);
      navigate('/admin/select-org');
    } catch {
      // Error handled by the hook
    }
  };

  return (
    <PageLayout
      pageName="Launchpad"
      verticalCenter
      data-testid="auth-page"
      layoutMode='auth'
      gridParams={{cols: [{ id:'a', width: `minmax(${tokens.paneWidths.large}, ${tokens.paneWidths.large})`}]}}
      panes={[
        {
          content: (
            <>
              {/* Header */}
              <div css={{ textAlign: 'center', marginBottom: tokens.spacing[6] }}>
                <h2>{mode === 'login' ? 'Welcome Back!' : 'Join Launchpad'}</h2>
                <p>
                  {mode === 'login'
                    ? 'Sign in to continue your learning journey'
                    : 'Create your account to get started'}
                </p>
              </div>

              {/* Mode Toggle - using Button components */}
              <div css={{ display: 'flex', gap: tokens.spacing[2], marginBottom: tokens.spacing[6] }}>
                <Button
                  variant={mode === 'login' ? 'filled' : 'outlined'}
                  onClick={() => handleModeSwitch('login')}
                  data-testid="login-tab"
                  css={{ flex: 1 }}
                >
                  Sign In
                </Button>
                <Button
                  variant={mode === 'register' ? 'filled' : 'outlined'}
                  onClick={() => handleModeSwitch('register')}
                  data-testid="register-tab"
                  css={{ flex: 1 }}
                >
                  Create Account
                </Button>
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
              <Button
                variant="tonal"
                type="button"
                onClick={handleDemoAdminLogin}
                data-testid="demo-admin-login-button"
                css={{ width: '100%' }}
              >
                Try admin account
              </Button>
            </>
          ),
        },
      ]}
    />
  );
};
