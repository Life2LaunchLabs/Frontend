import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';
import { useActivityPage, useCreateAttempt, useSubmitResponse, useAttemptProgress, BlockRenderer, Attempt } from '../../activities';

export interface ActivityViewerWithAttemptsProps {
  activityId: string;
}

export const ActivityViewerWithAttempts: React.FC<ActivityViewerWithAttemptsProps> = ({ activityId }) => {
  const { theme, tokens } = useTheme();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasTriedNextPage, setHasTriedNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const { pageData, loading: pageLoading, error: pageError } = useActivityPage(activityId, currentPageIndex);

  // Check if we're on the last page by attempting to fetch next page
  // This will naturally result in a 404 for the last page, which is expected behavior
  const { pageData: nextPageData, loading: nextPageLoading, error: nextPageError } = useActivityPage(activityId, currentPageIndex + 1);
  const { createAttempt, loading: createLoading, error: createError } = useCreateAttempt();
  const { submitResponse, loading: submitLoading, error: submitError } = useSubmitResponse();
  const { progress, updateProgress } = useAttemptProgress(currentAttempt?.id || null);

  // Create attempt when component mounts and pageData is available
  useEffect(() => {
    const initializeAttempt = async () => {
      if (pageData && pageData.activity_version && pageData.activity_version.id && !currentAttempt && !createLoading) {
        try {
          console.log('Creating attempt for activity version:', pageData.activity_version.id);
          const attempt = await createAttempt(pageData.activity_version.id);
          console.log('Attempt created:', attempt);
          console.log('Attempt keys:', Object.keys(attempt));
          console.log('Attempt.id:', attempt?.id);
          setCurrentAttempt(attempt);
        } catch (error) {
          console.error('Failed to create attempt:', error);
        }
      }
    };

    initializeAttempt();
  }, [pageData, currentAttempt, createAttempt, createLoading]);

  // Update page progress when navigating
  useEffect(() => {
    const markPageReached = async () => {
      if (currentAttempt && pageData && !isCompleted) {
        try {
          await updateProgress(pageData.page.id, true, {
            visited_at: new Date().toISOString(),
            page_index: currentPageIndex
          });
        } catch (error) {
          console.error('Failed to update progress:', error);
          // If we get a 404, the attempt might have been deleted after completion
          if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
            console.log('Attempt not found - likely completed and cleaned up');
          }
        }
      }
    };

    markPageReached();
  }, [currentAttempt, pageData, currentPageIndex, updateProgress, isCompleted]);

  // Determine if we're on the last page based on next page availability
  useEffect(() => {
    if (!nextPageLoading && nextPageError && currentPageIndex > 0) {
      // If next page fails to load and we're past the first page, we're likely on the last page
      setTotalPages(currentPageIndex + 1);
    } else if (nextPageData) {
      // If next page loads successfully, we're not on the last page yet
      setTotalPages(null);
    }
  }, [nextPageData, nextPageLoading, nextPageError, currentPageIndex]);

  const handleResponseChange = async (questionId: string, value: any) => {
    // Update local state immediately for UI responsiveness
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Submit to backend if we have an attempt
    if (currentAttempt && currentAttempt.id && pageData) {
      try {
        // Find the question block to get its type
        const questionBlock = pageData.blocks.find(block =>
          block.type === 'question' && block.config.question_id === questionId
        );

        if (questionBlock) {
          console.log('Submitting response:', {
            attemptId: currentAttempt.id,
            questionId,
            questionType: questionBlock.config.question_type,
            pageId: pageData.page.id,
            value
          });

          await submitResponse(
            currentAttempt.id,
            questionId,
            questionBlock.config.question_type,
            pageData.page.id,
            value,
            true // For now, assume all responses are valid
          );

          console.log('Response submitted successfully');
        }
      } catch (error) {
        console.error('Failed to submit response:', error);
        // Could show a toast notification here
      }
    } else {
      console.log('Cannot submit response - no attempt available:', {
        hasAttempt: !!currentAttempt,
        attemptId: currentAttempt?.id,
        hasPageData: !!pageData
      });
    }
  };

  const handleNextPage = () => {
    if (isOnLastPage()) {
      handleCompleteActivity();
    } else {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const isOnLastPage = () => {
    return totalPages !== null && currentPageIndex === totalPages - 1;
  };

  const handleCompleteActivity = async () => {
    if (currentAttempt) {
      try {
        // Call the complete attempt API using the same URL structure as other API calls
        const baseUrl = 'http://localhost:8000'; // For local development, always use HTTP

        await fetch(`${baseUrl}/api/activities/attempts/${currentAttempt.id}/complete/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });

        // Clear the current attempt since it's been deleted by the backend
        setCurrentAttempt(null);
        setIsCompleted(true);
      } catch (error) {
        console.error('Failed to complete attempt:', error);
        // Even if API call fails, clear the attempt and show completion screen
        setCurrentAttempt(null);
        setIsCompleted(true);
      }
    }
  };

  const handlePreviousPage = () => {
    setCurrentPageIndex(prev => Math.max(0, prev - 1));
  };

  const getContainerStyle = () => ({
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacing[6],
    backgroundColor: theme.surface,
    minHeight: '100vh',
  });

  const getHeaderStyle = () => ({
    marginBottom: tokens.spacing[8],
    textAlign: 'center' as const,
  });

  const getTitleStyle = () => ({
    ...tokens.typography.display.medium,
    color: theme.onSurface,
    margin: 0,
    marginBottom: tokens.spacing[2],
  });

  const getPageTitleStyle = () => ({
    ...tokens.typography.headline.large,
    color: theme.onSurfaceVariant,
    margin: 0,
    marginBottom: tokens.spacing[4],
  });

  const getProgressStyle = () => ({
    ...tokens.typography.body.small,
    color: theme.onSurfaceVariant,
    backgroundColor: theme.surfaceContainerLow,
    padding: `${tokens.spacing[1]}px ${tokens.spacing[3]}px`,
    borderRadius: tokens.borderRadius.full,
    display: 'inline-block',
    marginRight: tokens.spacing[3],
  });

  const getAttemptStatusStyle = () => ({
    ...tokens.typography.body.small,
    color: theme.onPrimaryContainer,
    backgroundColor: theme.primaryContainer,
    padding: `${tokens.spacing[1]}px ${tokens.spacing[3]}px`,
    borderRadius: tokens.borderRadius.full,
    display: 'inline-block',
  });

  const getContentStyle = () => ({
    marginBottom: tokens.spacing[8],
  });

  const getNavigationStyle = () => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: tokens.spacing[6],
    borderTop: `1px solid ${theme.outline}`,
  });

  const getButtonStyle = (variant: 'primary' | 'secondary' = 'primary', disabled = false) => ({
    backgroundColor: disabled
      ? theme.surfaceContainerLow
      : variant === 'primary' ? theme.primary : theme.surfaceContainerHighest,
    color: disabled
      ? theme.onSurfaceVariant
      : variant === 'primary' ? theme.onPrimary : theme.onSurface,
    border: variant === 'secondary' ? `1px solid ${theme.outline}` : 'none',
    borderRadius: tokens.borderRadius.medium,
    padding: `${tokens.spacing[3]}px ${tokens.spacing[6]}px`,
    fontSize: tokens.typography.body.medium.fontSize,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
  });

  const getLoadingStyle = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    ...tokens.typography.body.large,
    color: theme.onSurfaceVariant,
  });

  const getErrorStyle = () => ({
    padding: tokens.spacing[6],
    backgroundColor: theme.errorContainer,
    color: theme.onErrorContainer,
    borderRadius: tokens.borderRadius.medium,
    textAlign: 'center' as const,
    ...tokens.typography.body.medium,
  });

  const getDebugPanelStyle = () => ({
    marginTop: tokens.spacing[6],
    padding: tokens.spacing[4],
    backgroundColor: theme.surfaceContainerLow,
    borderRadius: tokens.borderRadius.medium,
    border: `1px solid ${theme.outline}`,
  });

  const getInfoPanelStyle = () => ({
    backgroundColor: theme.surfaceContainerLow,
    padding: tokens.spacing[4],
    marginBottom: tokens.spacing[4],
    borderRadius: tokens.borderRadius.medium,
    border: `1px solid ${theme.outline}`,
  });

  if (pageLoading || createLoading) {
    return (
      <div style={getContainerStyle()}>
        <div style={getLoadingStyle()}>
          Loading activity...
        </div>
      </div>
    );
  }

  if (pageError || createError) {
    return (
      <div style={getContainerStyle()}>
        <div style={getErrorStyle()}>
          Error loading activity: {pageError || createError}
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={getContainerStyle()}>
        <div style={getErrorStyle()}>
          No activity data found
        </div>
      </div>
    );
  }

  const { activity_version, page, blocks, media } = pageData;
  const visitedPages = progress.filter(p => p.reached).length;

  // If completed, show results screen
  if (isCompleted) {
    return (
      <div style={getContainerStyle()}>
        {/* Header */}
        <div style={getHeaderStyle()}>
          <h1 style={getTitleStyle()}>Activity Completed!</h1>
          <h2 style={getPageTitleStyle()}>{activity_version.title}</h2>
          <div>
            <span style={getAttemptStatusStyle()}>
              ✓ Completed | Responses: {Object.keys(responses).length} | Pages visited: {visitedPages}
            </span>
          </div>
        </div>

        {/* Results Summary */}
        <div style={getContentStyle()}>
          <div style={getInfoPanelStyle()}>
            <h3 style={{
              ...tokens.typography.headline.small,
              color: theme.onSurface,
              margin: 0,
              marginBottom: tokens.spacing[3],
            }}>
              Your Responses Summary
            </h3>
            {Object.keys(responses).length > 0 ? (
              <div style={{
                display: 'grid',
                gap: tokens.spacing[3],
              }}>
                {Object.entries(responses).map(([questionId, value], index) => (
                  <div key={questionId} style={{
                    padding: tokens.spacing[3],
                    backgroundColor: theme.surfaceContainerLow,
                    borderRadius: tokens.borderRadius.medium,
                    border: `1px solid ${theme.outline}`,
                  }}>
                    <h4 style={{
                      ...tokens.typography.body.medium,
                      margin: 0,
                      marginBottom: tokens.spacing[1],
                      color: theme.onSurface,
                    }}>
                      Question {index + 1}
                    </h4>
                    <div style={{
                      ...tokens.typography.body.large,
                      color: theme.onSurfaceVariant,
                      padding: tokens.spacing[2],
                      backgroundColor: theme.surface,
                      borderRadius: tokens.borderRadius.small,
                    }}>
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                ...tokens.typography.body.medium,
                color: theme.onSurfaceVariant,
                fontStyle: 'italic',
              }}>
                No responses recorded.
              </p>
            )}
          </div>

          {/* Completion Stats */}
          <div style={getInfoPanelStyle()}>
            <h3 style={{
              ...tokens.typography.headline.small,
              color: theme.onSurface,
              margin: 0,
              marginBottom: tokens.spacing[3],
            }}>
              Completion Statistics
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: tokens.spacing[4],
            }}>
              <div style={{
                textAlign: 'center',
                padding: tokens.spacing[3],
                backgroundColor: theme.primaryContainer,
                borderRadius: tokens.borderRadius.medium,
                color: theme.onPrimaryContainer,
              }}>
                <div style={{
                  ...tokens.typography.display.small,
                  margin: 0,
                  marginBottom: tokens.spacing[1],
                }}>
                  {visitedPages}
                </div>
                <div style={{
                  ...tokens.typography.body.small,
                }}>
                  Pages Visited
                </div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: tokens.spacing[3],
                backgroundColor: theme.secondaryContainer,
                borderRadius: tokens.borderRadius.medium,
                color: theme.onSecondaryContainer,
              }}>
                <div style={{
                  ...tokens.typography.display.small,
                  margin: 0,
                  marginBottom: tokens.spacing[1],
                }}>
                  {Object.keys(responses).length}
                </div>
                <div style={{
                  ...tokens.typography.body.small,
                }}>
                  Questions Answered
                </div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: tokens.spacing[3],
                backgroundColor: theme.tertiaryContainer,
                borderRadius: tokens.borderRadius.medium,
                color: theme.onTertiaryContainer,
              }}>
                <div style={{
                  ...tokens.typography.display.small,
                  margin: 0,
                  marginBottom: tokens.spacing[1],
                }}>
                  100%
                </div>
                <div style={{
                  ...tokens.typography.body.small,
                }}>
                  Completion Rate
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: tokens.spacing[4],
            marginTop: tokens.spacing[6],
          }}>
            <button
              style={getButtonStyle('primary')}
              onClick={() => window.location.reload()}
            >
              Take Activity Again
            </button>
            <button
              style={getButtonStyle('secondary')}
              onClick={() => setIsCompleted(false)}
            >
              Review Responses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={getContainerStyle()}>
      {/* Header */}
      <div style={getHeaderStyle()}>
        <h1 style={getTitleStyle()}>{activity_version.title}</h1>
        {page.title && (
          <h2 style={getPageTitleStyle()}>{page.title}</h2>
        )}
        <div>
          <span style={getProgressStyle()}>
            Page {page.index + 1}
          </span>
          {currentAttempt ? (
            <span style={getAttemptStatusStyle()}>
              Attempt: {currentAttempt.status || 'unknown'} | ID: {currentAttempt.id ? currentAttempt.id.slice(0, 8) + '...' : 'no-id'} | Visited: {visitedPages} pages
            </span>
          ) : (
            <span style={getAttemptStatusStyle()}>
              {createLoading ? 'Creating attempt...' : createError ? `Error: ${createError}` : 'No attempt'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={getContentStyle()}>
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            media={media}
            onResponseChange={handleResponseChange}
            responses={responses}
          />
        ))}
      </div>

      {/* Navigation */}
      <div style={getNavigationStyle()}>
        <button
          style={getButtonStyle('secondary', currentPageIndex === 0)}
          onClick={handlePreviousPage}
          disabled={currentPageIndex === 0}
        >
          ← Previous
        </button>

        <div style={{
          ...tokens.typography.body.medium,
          color: theme.onSurfaceVariant,
        }}>
          Page {currentPageIndex + 1}
        </div>

        <button
          style={getButtonStyle('primary')}
          onClick={handleNextPage}
        >
          {isOnLastPage() ? 'Complete Activity' : 'Next →'}
        </button>
      </div>

      {/* Submit Response Loading Indicator */}
      {submitLoading && (
        <div style={{
          marginTop: tokens.spacing[4],
          padding: tokens.spacing[2],
          backgroundColor: theme.primaryContainer,
          color: theme.onPrimaryContainer,
          borderRadius: tokens.borderRadius.medium,
          textAlign: 'center',
          ...tokens.typography.body.small,
        }}>
          Saving response...
        </div>
      )}

      {/* Submit Error */}
      {submitError && (
        <div style={{
          marginTop: tokens.spacing[4],
          padding: tokens.spacing[2],
          backgroundColor: theme.errorContainer,
          color: theme.onErrorContainer,
          borderRadius: tokens.borderRadius.medium,
          textAlign: 'center',
          ...tokens.typography.body.small,
        }}>
          Error saving response: {submitError}
        </div>
      )}

      {/* Debug Panel */}
      {Object.keys(responses).length > 0 && (
        <div style={getDebugPanelStyle()}>
          <h3 style={{
            ...tokens.typography.body.medium,
            margin: 0,
            marginBottom: tokens.spacing[2],
            color: theme.onSurface,
          }}>
            Debug: Current Responses
          </h3>
          <pre style={{
            ...tokens.typography.body.small,
            color: theme.onSurfaceVariant,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {JSON.stringify(responses, null, 2)}
          </pre>

          {currentAttempt && (
            <>
              <h4 style={{
                ...tokens.typography.body.medium,
                margin: `${tokens.spacing[3]}px 0 ${tokens.spacing[2]}px 0`,
                color: theme.onSurface,
              }}>
                Current Attempt
              </h4>
              <pre style={{
                ...tokens.typography.body.small,
                color: theme.onSurfaceVariant,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {JSON.stringify({
                  id: currentAttempt.id,
                  status: currentAttempt.status,
                  started_at: currentAttempt.started_at,
                  activity_version: currentAttempt.activity_version.title
                }, null, 2)}
              </pre>
            </>
          )}

          {progress.length > 0 && (
            <>
              <h4 style={{
                ...tokens.typography.body.medium,
                margin: `${tokens.spacing[3]}px 0 ${tokens.spacing[2]}px 0`,
                color: theme.onSurface,
              }}>
                Progress
              </h4>
              <pre style={{
                ...tokens.typography.body.small,
                color: theme.onSurfaceVariant,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {JSON.stringify(progress.map(p => ({
                  page_title: p.page.title,
                  page_index: p.page.index,
                  reached: p.reached,
                  last_seen: p.last_seen_at
                })), null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
};