/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, NavButton } from '@shared/components';
import { useActivityResults, useSubmissionDetails } from '../api';

export const ActivityResultsPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Fetch all submissions for this activity
  const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = useActivityResults(activityId || '');

  // Fetch details for the selected submission
  const { data: submissionDetails, isLoading: detailsLoading, error: detailsError } = useSubmissionDetails(selectedSubmissionId);

  // Auto-select the most recent submission
  useEffect(() => {
    if (submissions && submissions.length > 0 && !selectedSubmissionId) {
      setSelectedSubmissionId(submissions[0].id);
    }
  }, [submissions, selectedSubmissionId]);

  const handleBack = () => {
    // Navigate back to detail page, replacing history to prevent loop
    navigate(`/activities/${activityId}`, { replace: true });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Sidebar with submission dates
  const renderSidebar = () => {
    if (submissionsLoading) {
      return (
        <div css={{
          padding: tokens.spacing[4],
          ...tokens.typography.body.medium,
          color: colors.onSurfaceVariant,
        }}>
          Loading submissions...
        </div>
      );
    }

    if (submissionsError) {
      return (
        <div css={{
          padding: tokens.spacing[4],
          ...tokens.typography.body.medium,
          color: colors.error,
        }}>
          Failed to load submissions
        </div>
      );
    }

    if (!submissions || submissions.length === 0) {
      return (
        <div css={{
          padding: tokens.spacing[4],
          textAlign: 'center',
        }}>
          <p css={{
            ...tokens.typography.body.medium,
            color: colors.onSurfaceVariant,
            marginBottom: tokens.spacing[4],
          }}>
            No completions yet
          </p>
        </div>
      );
    }

    return (
      <div css={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[2],
      }}>
        <h3 css={{
          ...tokens.typography.title.medium,
          color: colors.onSurface,
          margin: 0,
          marginBottom: tokens.spacing[2],
          padding: `0 ${tokens.spacing[2]}`,
        }}>
          Submissions
        </h3>
        {submissions.map((submission) => (
          <NavButton
            key={submission.id}
            variant="text"
            align="left"
            active={selectedSubmissionId === submission.id}
            onClick={() => setSelectedSubmissionId(submission.id)}
          >
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: tokens.spacing[1],
            }}>
              <span css={{ ...tokens.typography.label.large }}>
                {formatDate(submission.completed_at)}
              </span>
              <span css={{
                ...tokens.typography.body.small,
                color: colors.onSurfaceVariant,
              }}>
                {formatTime(submission.completed_at)}
              </span>
            </div>
          </NavButton>
        ))}
      </div>
    );
  };

  // Main content area showing responses
  const renderPanes = () => {
    if (!selectedSubmissionId) {
      return [
        {
          content: (
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: tokens.spacing[8],
              textAlign: 'center',
              minHeight: '400px',
            }}>
              <span css={{
                fontSize: '48px',
                marginBottom: tokens.spacing[4],
                opacity: 0.5,
              }}>
                📊
              </span>
              <h3 css={{
                ...tokens.typography.headline.small,
                color: colors.onSurface,
                marginBottom: tokens.spacing[2],
              }}>
                Select a Submission
              </h3>
              <p css={{
                ...tokens.typography.body.medium,
                color: colors.onSurfaceVariant,
              }}>
                Choose a date from the sidebar to view your responses
              </p>
            </div>
          ),
        },
      ];
    }

    if (detailsLoading) {
      return [
        {
          content: (
            <div css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: tokens.spacing[8],
              ...tokens.typography.body.large,
              color: colors.onSurfaceVariant,
            }}>
              Loading responses...
            </div>
          ),
        },
      ];
    }

    if (detailsError) {
      return [
        {
          content: (
            <div css={{
              padding: tokens.spacing[8],
              textAlign: 'center',
              ...tokens.typography.body.large,
              color: colors.error,
            }}>
              Failed to load submission details
            </div>
          ),
        },
      ];
    }

    if (!submissionDetails) {
      return [
        {
          content: (
            <div css={{
              padding: tokens.spacing[8],
              textAlign: 'center',
              ...tokens.typography.body.large,
              color: colors.onSurfaceVariant,
            }}>
              No details available
            </div>
          ),
        },
      ];
    }

    // Title pane
    const titlePane = {
      content: (
        <>
          <h2 css={{
            ...tokens.typography.headline.medium,
            color: colors.onSurface,
            margin: 0,
            marginBottom: tokens.spacing[2],
          }}>
            {submissionDetails.activity_version.title}
          </h2>
          <p css={{
            ...tokens.typography.body.medium,
            color: colors.onSurfaceVariant,
            margin: 0,
          }}>
            Completed on {formatFullDate(submissionDetails.completed_at)}
          </p>
        </>
      ),
    };

    // Responses pane
    const responsesPane = {
      content: (
        <>
          <h3 css={{
            ...tokens.typography.title.large,
            color: colors.onSurface,
            margin: 0,
            marginBottom: tokens.spacing[4],
          }}>
            Your Responses
          </h3>
          {submissionDetails.responses && submissionDetails.responses.length > 0 ? (
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[4],
            }}>
              {submissionDetails.responses.map((response, index) => (
                <div
                  key={response.id || index}
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacing[2],
                  }}
                >
                  <h4 css={{
                    ...tokens.typography.label.large,
                    color: colors.onSurfaceVariant,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {response.question_id}
                  </h4>
                  <div css={{
                    ...tokens.typography.body.medium,
                    color: colors.onSurface,
                    backgroundColor: colors.surfaceVariant,
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.medium,
                    borderLeft: `4px solid ${colors.primary}`,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {typeof response.value === 'string'
                      ? response.value
                      : JSON.stringify(response.value, null, 2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: tokens.spacing[8],
              textAlign: 'center',
            }}>
              <span css={{
                fontSize: '48px',
                marginBottom: tokens.spacing[4],
                opacity: 0.5,
              }}>
                📝
              </span>
              <h4 css={{
                ...tokens.typography.headline.small,
                color: colors.onSurface,
                marginBottom: tokens.spacing[2],
              }}>
                No Responses
              </h4>
              <p css={{
                ...tokens.typography.body.medium,
                color: colors.onSurfaceVariant,
              }}>
                This submission doesn't have any recorded responses
              </p>
            </div>
          )}
        </>
      ),
    };

    return [titlePane, responsesPane];
  };

  return (
    <PageLayout
      pageName="Activity Results"
      layoutMode="utility"
      utilityHeader={{
        title: submissionDetails?.activity_version.title || 'Activity Results',
        leftAction: { type: 'back', onClick: handleBack }
      }}
      sidebar={renderSidebar()}
      panes={renderPanes()}
    />
  );
};
