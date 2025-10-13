import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';
import { ActivitiesService } from '../api';
import { useActivityPage, useCreateAttempt, useSubmitResponse } from '../hooks';
import { BlockRenderer } from './BlockRenderer';
import { Attempt, ActivityPageResponse } from '../types';

export interface ActivityViewerProps {
  activityId: string;
  onComplete?: (submissionId?: string) => void;
  onError?: (error: string) => void;
}

export const ActivityViewer: React.FC<ActivityViewerProps> = ({
  activityId,
  onComplete,
  onError
}) => {
  const { colors, tokens } = useTheme();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Current page data
  const { pageData, loading: pageLoading, error: pageError } = useActivityPage(activityId, currentPageIndex);

  // Check if we're on the last page by attempting to fetch next page
  const { pageData: nextPageData, error: nextPageError } = useActivityPage(activityId, currentPageIndex + 1);

  // Hooks for attempt management
  const { createAttempt, loading: createLoading, error: createError } = useCreateAttempt();
  const { submitResponse } = useSubmitResponse();

  // Track if we've attempted to create an attempt to prevent infinite retries
  const [hasAttemptedCreate, setHasAttemptedCreate] = useState(false);

  // Create attempt when we first load the activity
  useEffect(() => {
    const initializeAttempt = async () => {
      if (pageData?.activity_version?.id && !attempt && !createLoading && !isCompleted && !hasAttemptedCreate) {
        setHasAttemptedCreate(true);
        try {
          const newAttempt = await createAttempt(pageData.activity_version.id);
          setAttempt(newAttempt);
        } catch (error) {
          console.error('Failed to create attempt:', error);
          onError?.('Failed to start activity session');
        }
      }
    };

    initializeAttempt();
  }, [pageData?.activity_version?.id, attempt, createLoading, isCompleted, hasAttemptedCreate]);

  // Determine total pages based on next page availability
  useEffect(() => {
    if (nextPageError && currentPageIndex > 0) {
      // If next page fails to load and we're past the first page, we're likely on the last page
      setTotalPages(currentPageIndex + 1);
    } else if (nextPageData) {
      // If next page loads successfully, we're not on the last page yet
      setTotalPages(null);
    }
  }, [nextPageData, nextPageError, currentPageIndex]);

  const isOnLastPage = () => {
    return totalPages !== null && currentPageIndex === totalPages - 1;
  };

  const handleResponseChange = async (questionId: string, value: any) => {
    // Update local state immediately for UI responsiveness
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Submit to backend if we have an attempt and page data
    if (attempt?.id && pageData) {
      try {
        // Find the block with matching question_id (any question block type)
        const questionBlock = pageData.blocks.find(block =>
          block.config.question_id === questionId
        );

        if (questionBlock) {
          // Use question_type from config, or fall back to block_type if needed
          const questionType = questionBlock.config.question_type || questionBlock.block_type;

          await submitResponse(
            attempt.id,
            questionId,
            questionType,
            pageData.page.id,
            value,
            true
          );
        }
      } catch (error) {
        console.error('Failed to submit response:', error);
        // Continue - we have the response stored locally
      }
    }
  };

  const handleNextPage = async () => {
    if (isOnLastPage()) {
      await handleCompleteActivity();
    } else {
      // Save progress only when navigating
      await saveProgressIfNeeded();
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPageIndex > 0) {
      // Save progress only when navigating
      await saveProgressIfNeeded();
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const saveProgressIfNeeded = async () => {
    if (attempt?.id && pageData) {
      try {
        await ActivitiesService.updatePageProgress(
          attempt.id,
          pageData.page.id,
          true,
          {
            visited_at: new Date().toISOString(),
            page_index: currentPageIndex,
            responses_count: Object.keys(responses).length
          }
        );
      } catch (error) {
        console.error('Failed to save progress:', error);
        // Non-critical - continue
      }
    }
  };

  const handleCompleteActivity = async () => {
    if (!attempt?.id) {
      onError?.('No active session to complete');
      return;
    }

    try {
      // Save final progress
      await saveProgressIfNeeded();

      // Complete the attempt (this creates the submission and deletes the attempt)
      await ActivitiesService.completeAttempt(attempt.id);

      setIsCompleted(true);
      onComplete?.();
    } catch (error) {
      console.error('Failed to complete activity:', error);
      onError?.('Failed to save your completion. Please try again.');
    }
  };

  // Styles
  const getStyles = () => ({
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: tokens.spacing[6],
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[6],
    },
    header: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      boxShadow: tokens.shadows.small,
      textAlign: 'center' as const,
    },
    title: {
      ...tokens.typography.headline.large,
      color: colors.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2],
    },
    pageTitle: {
      ...tokens.typography.title.large,
      color: colors.onSurfaceVariant,
      margin: 0,
      marginBottom: tokens.spacing[4],
    },
    progressBadge: {
      ...tokens.typography.label.medium,
      color: colors.primary,
      backgroundColor: colors.primaryContainer,
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.full,
      display: 'inline-block',
    },
    contentCard: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      boxShadow: tokens.shadows.medium,
      border: `1px solid ${colors.outline}`,
      flex: 1,
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      boxShadow: tokens.shadows.small,
    },
    button: (variant: 'primary' | 'secondary' = 'primary', disabled = false) => ({
      backgroundColor: disabled
        ? colors.surfaceContainerLow
        : variant === 'primary' ? colors.primary : colors.surface,
      color: disabled
        ? colors.onSurfaceVariant
        : variant === 'primary' ? colors.onPrimary : colors.onSurface,
      border: variant === 'secondary' ? `1px solid ${colors.outline}` : 'none',
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
      ...tokens.typography.label.large,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      boxShadow: variant === 'primary' && !disabled ? tokens.shadows.small : 'none',
      '&:hover': !disabled && {
        boxShadow: variant === 'primary' ? tokens.shadows.medium : tokens.shadows.small,
        backgroundColor: variant === 'primary' ? colors.primary : colors.surfaceVariant,
      },
    }),
    pageIndicator: {
      ...tokens.typography.label.large,
      color: colors.onSurfaceVariant,
      backgroundColor: colors.surface,
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${colors.outline}`,
    },
    loadingState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
    },
    errorState: {
      padding: tokens.spacing[8],
      backgroundColor: colors.errorContainer,
      color: colors.onErrorContainer,
      borderRadius: tokens.borderRadius.large,
      textAlign: 'center' as const,
      ...tokens.typography.body.large,
      boxShadow: tokens.shadows.small,
    },
    completionState: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[12],
      textAlign: 'center' as const,
      boxShadow: tokens.shadows.medium,
    },
    completionTitle: {
      ...tokens.typography.headline.large,
      color: colors.primary,
      margin: 0,
      marginBottom: tokens.spacing[4],
    },
    completionMessage: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[8],
    },
  });

  const styles = getStyles();

  // Loading state
  if (pageLoading || createLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          Loading activity...
        </div>
      </div>
    );
  }

  // Error state
  if (pageError || createError) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          Error loading activity: {pageError || createError}
        </div>
      </div>
    );
  }

  // No data
  if (!pageData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          Activity not found
        </div>
      </div>
    );
  }

  // Completion state
  if (isCompleted) {
    return (
      <div style={styles.container}>
        <div style={styles.completionState}>
          <h1 style={styles.completionTitle}>Activity Completed!</h1>
          <p style={styles.completionMessage}>
            Your responses have been saved successfully.
          </p>
          <button
            style={styles.button('primary')}
            onClick={() => onComplete?.()}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const { activity_version, page, blocks, media } = pageData;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{activity_version.title}</h1>
        {page.title && (
          <h2 style={styles.pageTitle}>{page.title}</h2>
        )}
        <div style={styles.progressBadge}>
          Page {currentPageIndex + 1}{totalPages ? ` of ${totalPages}` : ''}
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentCard}>
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
      <div style={styles.navigation}>
        <button
          style={styles.button('secondary', currentPageIndex === 0)}
          onClick={handlePreviousPage}
          disabled={currentPageIndex === 0}
        >
          ← Previous
        </button>

        <div style={styles.pageIndicator}>
          Page {currentPageIndex + 1}
        </div>

        <button
          style={styles.button('primary')}
          onClick={handleNextPage}
        >
          {isOnLastPage() ? 'Complete Activity' : 'Next →'}
        </button>
      </div>
    </div>
  );
};