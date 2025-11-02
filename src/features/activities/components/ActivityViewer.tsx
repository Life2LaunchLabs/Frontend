/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';
import { ActivitiesService, PublicActivitiesService } from '../api';
import { useAllActivityPages, useCreateAttempt, useSubmitResponse } from '../hooks';
import { BlockRenderer } from './BlockRenderer';
import { ChatBuddy } from './ChatBuddy';
import { Attempt, ActivityPageResponse } from '../types';
import { ProgressBar } from '../../../shared/components';

export interface ActivityViewerProps {
  activityId?: string;
  activitySlug?: string;
  isPublic?: boolean;
  onComplete?: (submissionId?: string) => void;
  onError?: (error: string) => void;
}

export const ActivityViewer: React.FC<ActivityViewerProps> = ({
  activityId,
  activitySlug,
  isPublic = false,
  onComplete,
  onError
}) => {
  const { colors, tokens } = useTheme();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load all pages at once (only for authenticated mode)
  const { pages, loading: pagesLoading, error: pagesError } = useAllActivityPages(isPublic ? undefined : activityId);

  // For public mode, load page manually
  const [pageData, setPageData] = useState<any>(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [publicError, setPublicError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Hooks for attempt management (authenticated mode)
  const { createAttempt, loading: createLoading, error: createError } = useCreateAttempt();
  const { submitResponse } = useSubmitResponse();

  // Track if we've attempted to create an attempt to prevent infinite retries
  const [hasAttemptedCreate, setHasAttemptedCreate] = useState(false);

  // Load page data for public mode
  useEffect(() => {
    if (!isPublic || !activitySlug) return;

    const loadPage = async () => {
      try {
        // Only show loading indicator on initial page load
        if (isInitialLoad) {
          setPublicLoading(true);
        }
        setPublicError(null);
        const data = await PublicActivitiesService.getPublicActivityPage(activitySlug, currentPageIndex);
        setPageData(data);

        // Try to load next page to determine if we're on the last page
        try {
          await PublicActivitiesService.getPublicActivityPage(activitySlug, currentPageIndex + 1);
          setTotalPages(null);
        } catch {
          setTotalPages(currentPageIndex + 1);
        }
      } catch (err) {
        setPublicError(err instanceof Error ? err.message : 'Failed to load page');
        onError?.('Failed to load activity page');
      } finally {
        if (isInitialLoad) {
          setPublicLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    loadPage();
  }, [isPublic, activitySlug, currentPageIndex, onError, isInitialLoad]);

  // Set pageData for authenticated mode
  useEffect(() => {
    if (!isPublic && pages.length > 0) {
      setPageData(pages[currentPageIndex] || null);
      setTotalPages(pages.length);
    }
  }, [isPublic, pages, currentPageIndex]);

  // Create attempt when we first load the activity
  useEffect(() => {
    const initializeAttempt = async () => {
      if (pageData?.activity_version?.id && !attempt && !isCompleted && !hasAttemptedCreate) {
        setHasAttemptedCreate(true);
        try {
          const newAttempt = isPublic
            ? await PublicActivitiesService.createGuestAttempt(pageData.activity_version.id)
            : await createAttempt(pageData.activity_version.id);
          setAttempt(newAttempt);
        } catch (error) {
          console.error('Failed to create attempt:', error);
          onError?.('Failed to start activity session');
        }
      }
    };

    initializeAttempt();
  }, [pageData?.activity_version?.id, attempt, isCompleted, hasAttemptedCreate, isPublic]);

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
        const questionBlock = pageData.blocks.find((block: any) =>
          block.config.question_id === questionId
        );

        if (questionBlock) {
          // Use question_type from config, or fall back to block_type if needed
          const questionType = questionBlock.config.question_type || questionBlock.block_type;

          if (isPublic) {
            await PublicActivitiesService.submitGuestResponse(
              attempt.id,
              questionId,
              questionType,
              pageData.page.id,
              value,
              true
            );
          } else {
            await submitResponse(
              attempt.id,
              questionId,
              questionType,
              pageData.page.id,
              value,
              true
            );
          }
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
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = async () => {
    if (currentPageIndex > 0) {
      // Save progress only when navigating
      await saveProgressIfNeeded();
      setCurrentPageIndex(prev => prev - 1);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const saveProgressIfNeeded = async () => {
    if (attempt?.id && pageData) {
      try {
        if (isPublic) {
          await PublicActivitiesService.updateGuestPageProgress(
            attempt.id,
            pageData.page.id,
            true,
            { completed_at: new Date().toISOString() }
          );
        } else {
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
        }
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
      if (isPublic) {
        await PublicActivitiesService.completeGuestAttempt(attempt.id);
      } else {
        await ActivitiesService.completeAttempt(attempt.id);
      }

      setIsCompleted(true);
      onComplete?.(attempt.id);
    } catch (error) {
      console.error('Failed to complete activity:', error);
      onError?.('Failed to save your completion. Please try again.');
    }
  };

  // Styles
  const getStyles = () => ({
    wrapper: {
      width: '100%',
      maxWidth: '600px',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[6],
      '@media (max-width: 768px)': {
        gap: tokens.spacing[4],
      },
    },
    header: {
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      '@media (max-width: 768px)': {
        display: 'none',
      },
    },
    title: {
      ...tokens.typography.headline.large,
      color: colors.onSurface,
      margin: 0,
      textAlign: 'left' as const,
      '@media (max-width: 768px)': {
        display: 'none',
      },
    },
    contentCard: {
      flex: 1,
      overflow: 'auto',
      minHeight: 0,
    },
    navigation: {
      flexShrink: 0,
      display: 'flex',
      gap: tokens.spacing[4],
    },
    button: (variant: 'primary' | 'secondary' = 'primary', disabled = false) => ({
      flex: 1,
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
  const loading = isPublic ? publicLoading : (pagesLoading || createLoading);
  const error = isPublic ? publicError : (pagesError || createError);

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loadingState}>
          Loading activity...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.errorState}>
          Error loading activity: {error}
        </div>
      </div>
    );
  }

  // No data
  if (!pageData) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.errorState}>
          Activity not found
        </div>
      </div>
    );
  }

  // Completion state
  if (isCompleted) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.completionState}>
          <h1 style={styles.completionTitle}>Activity Completed!</h1>
          <p style={styles.completionMessage}>
            Your responses have been saved successfully.
          </p>
          <button
            style={styles.button('primary')}
            onClick={() => onComplete?.(attempt?.id)}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const { activity_version, page, blocks, media } = pageData;

  return (
    <div css={styles.wrapper}>
      {/* Header */}
      <div css={styles.header}>
        <h1 css={styles.title}>{activity_version.title}</h1>
        {totalPages && (
          <ProgressBar
            current={currentPageIndex + 1}
            total={totalPages}
          />
        )}
      </div>

      {/* Chat Buddy Message */}
      {page.message && (
        <ChatBuddy message={page.message} />
      )}

      {/* Content */}
      <div css={styles.contentCard}>
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
      <div css={styles.navigation}>
        <button
          css={styles.button('secondary', currentPageIndex === 0)}
          onClick={handlePreviousPage}
          disabled={currentPageIndex === 0}
        >
          ← Previous
        </button>

        <button
          css={styles.button('primary')}
          onClick={handleNextPage}
        >
          {isOnLastPage() ? 'Complete Activity' : 'Next →'}
        </button>
      </div>
    </div>
  );
};