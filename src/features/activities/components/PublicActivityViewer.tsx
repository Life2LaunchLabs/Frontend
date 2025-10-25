import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';
import { PublicActivitiesService } from '../api/PublicActivitiesService';
import { BlockRenderer } from './BlockRenderer';
import { Attempt } from '../types';

export interface PublicActivityViewerProps {
  activitySlug: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * Activity viewer for public (unauthenticated) users.
 * Similar to ActivityViewer but uses PublicActivitiesService.
 */
export const PublicActivityViewer: React.FC<PublicActivityViewerProps> = ({
  activitySlug,
  onComplete,
  onError
}) => {
  const { colors, tokens } = useTheme();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [hasAttemptedCreate, setHasAttemptedCreate] = useState(false);

  // Load page data
  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await PublicActivitiesService.getPublicActivityPage(activitySlug, currentPageIndex);
        setPageData(data);

        // Try to load next page to determine if we're on the last page
        try {
          await PublicActivitiesService.getPublicActivityPage(activitySlug, currentPageIndex + 1);
          setTotalPages(null); // Not on last page yet
        } catch {
          setTotalPages(currentPageIndex + 1); // This is the last page
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
        onError?.('Failed to load activity page');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [activitySlug, currentPageIndex, onError]);

  // Create attempt when we first load the activity
  useEffect(() => {
    const initializeAttempt = async () => {
      if (pageData?.activity_version?.id && !attempt && !isCompleted && !hasAttemptedCreate) {
        setHasAttemptedCreate(true);
        try {
          const newAttempt = await PublicActivitiesService.createGuestAttempt(pageData.activity_version.id);
          setAttempt(newAttempt);
        } catch (error) {
          console.error('Failed to create guest attempt:', error);
          onError?.('Failed to start activity session');
        }
      }
    };

    initializeAttempt();
  }, [pageData?.activity_version?.id, attempt, isCompleted, hasAttemptedCreate, onError]);

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
        const questionBlock = pageData.blocks.find((block: any) =>
          block.config.question_id === questionId
        );

        if (questionBlock) {
          const questionType = questionBlock.config.question_type || questionBlock.block_type;

          await PublicActivitiesService.submitGuestResponse(
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
      }
    }
  };

  const handleNext = async () => {
    if (attempt?.id && pageData) {
      try {
        await PublicActivitiesService.updateGuestPageProgress(
          attempt.id,
          pageData.page.id,
          true,
          { completed_at: new Date().toISOString() }
        );
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    }

    if (isOnLastPage()) {
      handleFinish();
    } else {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (attempt?.id) {
      try {
        await PublicActivitiesService.completeGuestAttempt(attempt.id);
        setIsCompleted(true);
        onComplete?.();
      } catch (error) {
        console.error('Failed to complete attempt:', error);
        onError?.('Failed to complete activity');
      }
    }
  };

  if (loading) {
    return (
      <div css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        ...tokens.typography.body.large,
        color: colors.onSurfaceVariant,
      }}>
        Loading...
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div css={{
        textAlign: 'center',
        padding: tokens.spacing[8],
        backgroundColor: colors.errorContainer,
        color: colors.onErrorContainer,
        borderRadius: tokens.borderRadius.large,
      }}>
        <p css={{ ...tokens.typography.body.large }}>
          {error || 'Failed to load activity'}
        </p>
      </div>
    );
  }

  return (
    <div css={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '60vh',
      maxWidth: '800px',
      margin: '0 auto',
      padding: tokens.spacing[4],
    }}>
      {/* Progress indicator */}
      {totalPages && (
        <div css={{
          marginBottom: tokens.spacing[6],
          ...tokens.typography.body.small,
          color: colors.onSurfaceVariant,
          textAlign: 'center',
        }}>
          Page {currentPageIndex + 1} of {totalPages}
        </div>
      )}

      {/* Page title */}
      {pageData.page?.title && (
        <h1 css={{
          ...tokens.typography.headline.large,
          color: colors.onSurface,
          marginBottom: tokens.spacing[6],
          textAlign: 'center',
        }}>
          {pageData.page.title}
        </h1>
      )}

      {/* Blocks */}
      <div css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[6],
        marginBottom: tokens.spacing[8],
      }}>
        {pageData.blocks?.map((block: any, index: number) => (
          <BlockRenderer
            key={`${block.id}-${index}`}
            block={block}
            onResponseChange={handleResponseChange}
            currentValue={block.config?.question_id ? responses[block.config.question_id] : undefined}
            media={pageData.media || []}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div css={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: tokens.spacing[4],
        paddingTop: tokens.spacing[6],
        borderTop: `1px solid ${colors.outline}`,
      }}>
        <button
          onClick={handlePrevious}
          disabled={currentPageIndex === 0}
          css={{
            padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
            backgroundColor: 'transparent',
            color: currentPageIndex === 0 ? colors.onSurfaceVariant : colors.primary,
            border: `1px solid ${currentPageIndex === 0 ? colors.outline : colors.primary}`,
            borderRadius: tokens.borderRadius.medium,
            cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
            ...tokens.typography.label.large,
            opacity: currentPageIndex === 0 ? 0.5 : 1,
            '&:hover': currentPageIndex > 0 ? {
              backgroundColor: colors.surfaceVariant,
            } : {},
          }}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          css={{
            padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
            backgroundColor: colors.primary,
            color: colors.onPrimary,
            border: 'none',
            borderRadius: tokens.borderRadius.medium,
            cursor: 'pointer',
            ...tokens.typography.label.large,
            '&:hover': {
              backgroundColor: colors.primaryContainer,
              color: colors.onPrimaryContainer,
            },
          }}
        >
          {isOnLastPage() ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};
