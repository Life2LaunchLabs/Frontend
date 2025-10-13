/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button, Modal } from '@shared/components';
import { ActivityViewer } from '../components';

export const ActivitySessionPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();
  const [isCompletingActivity, setIsCompletingActivity] = useState(false);

  const handleBack = () => {
    navigate(`/activities/${activityId}`);
  };

  // Validate activityId exists
  if (!activityId) {
    return (
      <PageLayout
        pageName="Activity Session"
        layoutMode="utility"
        utilityHeader={{
          title: 'Activity',
          leftAction: { type: 'back', onClick: () => navigate('/quests') }
        }}
        panes={[
          {
            content: (
              <div css={{
                textAlign: 'center',
                padding: tokens.spacing[8],
                backgroundColor: colors.surfaceVariant,
                borderRadius: tokens.borderRadius.large,
                boxShadow: tokens.shadows.small,
              }}>
                <h1 css={{
                  ...tokens.typography.headline.large,
                  color: colors.onSurface,
                  marginBottom: tokens.spacing[4],
                }}>
                  Activity not found
                </h1>
                <Button variant="filled" onClick={() => navigate('/quests')}>
                  Return to Quests
                </Button>
              </div>
            ),
          },
        ]}
      />
    );
  }

  const handleComplete = async () => {
    // Show loading modal while saving
    setIsCompletingActivity(true);

    // Small delay to ensure backend has processed the completion
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Navigate to results page after completion
    navigate(`/activities/results/${activityId}`);
  };

  const handleError = (error: string) => {
    console.error('Activity error:', error);
    setIsCompletingActivity(false);
    // Could show a toast notification or error modal here
  };

  return (
    <>
      <PageLayout
        pageName="Activity Session"
        layoutMode="utility"
        utilityHeader={{
          title: 'Activity',
          leftAction: { type: 'back', onClick: handleBack }
        }}
        panes={[
          {
            content: (
              <ActivityViewer
                activityId={activityId}
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
        title="Saving Your Results"
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