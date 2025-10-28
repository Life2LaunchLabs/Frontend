/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button, Modal } from '@shared/components';
import { ActivityViewer } from '../components';

/**
 * Public activity session page for unauthenticated users.
 * Used for onboarding activities before account creation.
 */
export const PublicActivitySessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();
  const [isCompletingActivity, setIsCompletingActivity] = useState(false);

  // For now, hardcode to 'welcome' activity
  const activitySlug = 'welcome';

  const handleBack = () => {
    navigate('/', { replace: true });
  };

  const handleComplete = async () => {
    // Show loading modal while saving
    setIsCompletingActivity(true);

    // Small delay to ensure backend has processed the completion
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Navigate to registration page with onboarding complete flag
    navigate('/register?onboarding_complete=true');
  };

  const handleError = (error: string) => {
    console.error('Activity error:', error);
    setIsCompletingActivity(false);
    // Could show a toast notification or error modal here
  };

  return (
    <>
      <PageLayout
        pageName="Welcome to Launchpad"
        layoutMode="activity"
        panes={[
          {
            invisible: true,
            content: (
              <ActivityViewer
                activitySlug={activitySlug}
                isPublic={true}
                onComplete={handleComplete}
                onError={handleError}
              />
            ),
          },
        ]}
      />

      {/* Loading Modal */}
      <Modal
        isOpen={isCompletingActivity}
        onClose={() => {}}
        title="Saving Your Responses"
        showCloseButton={false}
      >
        <div css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: tokens.spacing[6],
          gap: tokens.spacing[4],
        }}>
          <div css={{
            width: '48px',
            height: '48px',
            border: `4px solid ${colors.surfaceVariant}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }} />
          <p css={{
            ...tokens.typography.body.large,
            color: colors.onSurface,
            textAlign: 'center',
          }}>
            Please wait while we save your responses...
          </p>
        </div>
      </Modal>
    </>
  );
};
