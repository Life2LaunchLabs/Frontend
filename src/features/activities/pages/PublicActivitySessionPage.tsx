/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Modal } from '@shared/components';
import { ActivityViewer } from '../components';
import { useOnboardingFlow } from '../../onboarding';
import { getNextRoute, getActivitySlugFromRoute } from '../../onboarding';

/**
 * Public activity session page for unauthenticated users.
 * Used for onboarding activities before account creation.
 * Now supports multi-step onboarding flows.
 */
export const PublicActivitySessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();
  const { stepSlug } = useParams<{ stepSlug?: string }>();
  const [isCompletingActivity, setIsCompletingActivity] = useState(false);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);

  // Get flow context
  const { flowState, loading: flowLoading, error: flowError, updateProgress, completeFlow } = useOnboardingFlow();

  // Determine which activity to show
  const activitySlug = getActivitySlugFromRoute(stepSlug, flowState);

  // Track the current step based on activity slug
  const currentStep = flowState?.flow_config?.steps.find(
    step => step.activitySlug === activitySlug
  );

  const handleComplete = async (attemptId?: string) => {
    if (!flowState || !currentStep) {
      console.error('No flow state or current step available');
      navigate('/register?onboarding_complete=true');
      return;
    }

    try {
      // Show loading modal while saving
      setIsCompletingActivity(true);

      // Small delay to ensure backend has processed the activity completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update flow progress
      const updatedState = await updateProgress({
        step_id: currentStep.id,
        attempt_id: currentAttemptId || attemptId,
        action: 'complete'
      });

      // Check if flow is complete
      if (updatedState.is_complete) {
        // Mark entire flow as complete
        await completeFlow();

        // Navigate to registration
        navigate('/register?flow_complete=true');
      } else {
        // Navigate to next step
        const nextRoute = getNextRoute(updatedState);
        navigate(nextRoute);
      }
    } catch (error) {
      console.error('Failed to complete activity:', error);
      setIsCompletingActivity(false);
      // Fall back to direct registration
      navigate('/register?onboarding_complete=true');
    } finally {
      setIsCompletingActivity(false);
    }
  };

  const handleError = (error: string) => {
    console.error('Activity error:', error);
    setIsCompletingActivity(false);
    // Could show a toast notification or error modal here
  };

  // Show loading state while flow initializes
  if (flowLoading) {
    return (
      <PageLayout
        pageName="Loading..."
        layoutMode="activity"
        panes={[
          {
            invisible: true,
            content: (
              <div css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                ...tokens.typography.body.large,
                color: colors.onSurfaceVariant,
              }}>
                Initializing onboarding flow...
              </div>
            ),
          },
        ]}
      />
    );
  }

  // Show error state if flow failed to initialize
  if (flowError || !flowState) {
    return (
      <PageLayout
        pageName="Error"
        layoutMode="activity"
        panes={[
          {
            invisible: true,
            content: (
              <div css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                padding: tokens.spacing[6],
                gap: tokens.spacing[4],
              }}>
                <div css={{
                  ...tokens.typography.headline.medium,
                  color: colors.error,
                }}>
                  Failed to Initialize Onboarding
                </div>
                <div css={{
                  ...tokens.typography.body.large,
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                }}>
                  {flowError || 'Flow state is not available'}
                </div>
                <button
                  css={{
                    marginTop: tokens.spacing[4],
                    padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
                    backgroundColor: colors.primary,
                    color: colors.onPrimary,
                    border: 'none',
                    borderRadius: tokens.borderRadius.medium,
                    cursor: 'pointer',
                    ...tokens.typography.label.large,
                  }}
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ),
          },
        ]}
      />
    );
  }

  return (
    <>
      <PageLayout
        pageName={currentStep?.title || "Welcome to Launchpad"}
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
