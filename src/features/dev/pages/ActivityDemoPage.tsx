import React, { useState } from 'react';
import { useTheme } from '../../../styles';
import { useLogout } from '../../auth';
import { ActivityViewerWithAttempts } from '../components';
import { useActivitiesHealthCheck, useCreateDemoActivity } from '../hooks';

export const ActivityDemoPage: React.FC = () => {
  const { theme, tokens } = useTheme();
  const logoutMutation = useLogout();
  const [demoSlug, setDemoSlug] = useState<string>('demo-mindful-morning');

  const { healthStatus, loading: healthLoading, error: healthError, checkHealth } = useActivitiesHealthCheck();
  const { activity: demoActivity, loading: demoLoading, error: demoError, createDemo } = useCreateDemoActivity();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getContainerStyle = () => ({
    minHeight: '100vh',
    backgroundColor: theme.surface,
  });

  const getHeaderStyle = () => ({
    backgroundColor: theme.surfaceContainerLow,
    borderBottom: `1px solid ${theme.outline}`,
    padding: tokens.spacing[6],
  });

  const getHeaderContentStyle = () => ({
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const getTitleStyle = () => ({
    ...tokens.typography.display.small,
    color: theme.onSurface,
    margin: 0,
  });

  const getControlsStyle = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing[4],
  });

  const getButtonStyle = (variant: 'primary' | 'secondary' = 'primary') => ({
    backgroundColor: variant === 'primary' ? theme.primary : theme.surfaceContainerHighest,
    color: variant === 'primary' ? theme.onPrimary : theme.onSurface,
    border: variant === 'secondary' ? `1px solid ${theme.outline}` : 'none',
    borderRadius: tokens.borderRadius.medium,
    padding: `${tokens.spacing[2]}px ${tokens.spacing[4]}px`,
    fontSize: tokens.typography.body.small.fontSize,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const getStatusStyle = (status: 'success' | 'error' | 'loading') => ({
    ...tokens.typography.body.small,
    padding: `${tokens.spacing[1]}px ${tokens.spacing[3]}px`,
    borderRadius: tokens.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing[1],
    backgroundColor: status === 'success' ? '#E8F5E8' : status === 'error' ? theme.errorContainer : theme.surfaceContainerLow,
    color: status === 'success' ? '#2E7D32' : status === 'error' ? theme.onErrorContainer : theme.onSurfaceVariant,
  });

  const getInfoPanelStyle = () => ({
    backgroundColor: theme.surfaceContainerLow,
    padding: tokens.spacing[4],
    marginBottom: tokens.spacing[4],
    borderRadius: tokens.borderRadius.medium,
    border: `1px solid ${theme.outline}`,
  });

  const handleCreateDemo = async () => {
    await createDemo();
    if (!demoError) {
      // Demo was created successfully, you can now view it
      setDemoSlug('demo-mindful-morning');
    }
  };

  return (
    <div style={getContainerStyle()}>
      {/* Header */}
      <div style={getHeaderStyle()}>
        <div style={getHeaderContentStyle()}>
          <h1 style={getTitleStyle()}>Activities Demo</h1>

          <div style={getControlsStyle()}>
            {/* Health Check */}
            <button
              style={getButtonStyle('secondary')}
              onClick={checkHealth}
              disabled={healthLoading}
            >
              {healthLoading ? 'Checking...' : 'Health Check'}
            </button>

            {healthStatus && (
              <div style={getStatusStyle('success')}>
                <span>●</span>
                API Connected
              </div>
            )}

            {healthError && (
              <div style={getStatusStyle('error')}>
                <span>●</span>
                API Error
              </div>
            )}

            {/* Create Demo */}
            <button
              style={getButtonStyle('primary')}
              onClick={handleCreateDemo}
              disabled={demoLoading}
            >
              {demoLoading ? 'Creating...' : 'Create Demo Activity'}
            </button>

            {/* Logout */}
            <button
              style={getButtonStyle('secondary')}
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: tokens.spacing[6] }}>
        <div style={getInfoPanelStyle()}>
          <h3 style={{
            ...tokens.typography.headline.small,
            color: theme.onSurface,
            margin: 0,
            marginBottom: tokens.spacing[2],
          }}>
            Activities System Demo
          </h3>
          <p style={{
            ...tokens.typography.body.medium,
            color: theme.onSurfaceVariant,
            margin: 0,
            marginBottom: tokens.spacing[3],
            lineHeight: 1.6,
          }}>
            This demo showcases the Activities feature - a robust system for creating multipage forms
            with rich media, custom input types, and interactive content blocks. The demo activity
            includes text blocks, question blocks, and response tracking.
          </p>

          {/* Demo Selector */}
          <div style={{
            marginBottom: tokens.spacing[4],
            padding: tokens.spacing[3],
            backgroundColor: theme.surfaceContainerHigh,
            borderRadius: tokens.borderRadius.medium,
            border: `1px solid ${theme.outline}`,
          }}>
            <h4 style={{
              ...tokens.typography.body.medium,
              margin: 0,
              marginBottom: tokens.spacing[2],
              color: theme.onSurface,
            }}>
              Choose Demo Activity:
            </h4>
            <div style={{
              display: 'flex',
              gap: tokens.spacing[2],
              flexWrap: 'wrap',
            }}>
              <button
                style={{
                  ...getButtonStyle(demoSlug === 'demo-mindful-morning' ? 'primary' : 'secondary'),
                  padding: `${tokens.spacing[2]}px ${tokens.spacing[3]}px`,
                  fontSize: tokens.typography.body.small.fontSize,
                }}
                onClick={() => setDemoSlug('demo-mindful-morning')}
              >
                Basic Demo (3 pages)
              </button>
              <button
                style={{
                  ...getButtonStyle(demoSlug === 'comprehensive-mindfulness-journey' ? 'primary' : 'secondary'),
                  padding: `${tokens.spacing[2]}px ${tokens.spacing[3]}px`,
                  fontSize: tokens.typography.body.small.fontSize,
                }}
                onClick={() => setDemoSlug('comprehensive-mindfulness-journey')}
              >
                Comprehensive Demo (5 pages + Media)
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gap: tokens.spacing[2],
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            marginBottom: tokens.spacing[3],
          }}>
            <div>
              <strong>Block Types:</strong> Text, Media, Questions
            </div>
            <div>
              <strong>Question Types:</strong> Multiple Choice, Text Input, Single Choice
            </div>
            <div>
              <strong>Features:</strong> Progress Tracking, Response Validation, Media Integration
            </div>
          </div>

          {demoActivity && (
            <div style={{
              padding: tokens.spacing[3],
              backgroundColor: theme.primaryContainer,
              borderRadius: tokens.borderRadius.small,
              ...tokens.typography.body.small,
              color: theme.onPrimaryContainer,
            }}>
              ✓ Demo activity created: {demoActivity.title} (slug: {demoActivity.slug})
            </div>
          )}

          {demoError && (
            <div style={{
              padding: tokens.spacing[3],
              backgroundColor: theme.errorContainer,
              borderRadius: tokens.borderRadius.small,
              ...tokens.typography.body.small,
              color: theme.onErrorContainer,
            }}>
              Error creating demo: {demoError}
            </div>
          )}
        </div>

        {/* Activity Viewer with Attempt Tracking */}
        <ActivityViewerWithAttempts
          slug={demoSlug}
        />
      </div>
    </div>
  );
};