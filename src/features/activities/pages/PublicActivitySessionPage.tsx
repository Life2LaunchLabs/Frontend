/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Modal } from '@shared/components';
import { ActivityViewer } from '../components';

/**
 * Public activity session page for unauthenticated users.
 * Simple flow: welcome → pathways → results
 */
export const PublicActivitySessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();
  const location = useLocation();
  const [isCompletingActivity, setIsCompletingActivity] = useState(false);

  // Determine activity and page title based on route
  const isWelcome = location.pathname === '/welcome';
  const isPathways = location.pathname === '/pathways';

  const activitySlug = isWelcome ? 'welcome' : 'pathways-assessment';
  const pageTitle = isWelcome ? 'Welcome to Launchpad' : 'Career Pathways Assessment';

  const handleComplete = async (attemptId?: string) => {
    if (!attemptId) {
      console.error('No attempt ID provided to handleComplete');
      return;
    }

    try {
      // Show loading modal while saving
      setIsCompletingActivity(true);

      // Small delay to ensure backend has processed the activity completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to next step: welcome → pathways → results
      if (isWelcome) {
        navigate('/pathways');
      } else if (isPathways) {
        // Store pathways attempt ID in sessionStorage for the results page
        sessionStorage.setItem('pathways_attempt_id', attemptId);
        navigate('/welcome/results');
      }
    } catch (error) {
      console.error('Failed to complete activity:', error);
      setIsCompletingActivity(false);
    } finally {
      setIsCompletingActivity(false);
    }
  };

  const handleError = (error: string) => {
    console.error('Activity error:', error);
    setIsCompletingActivity(false);
  };

  return (
    <>
      <PageLayout
        pageName={pageTitle}
        layoutMode="activity"
        panes={[
          {
            invisible: true,
            content: (
              <ActivityViewer
                key={activitySlug}
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
