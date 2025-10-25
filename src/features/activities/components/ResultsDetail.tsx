import React, { useMemo } from 'react';
import { useTheme } from '../../../styles';
import { useSubmissionDetails } from '../api';
import {
  buildQuestionMetadataMap,
  formatResponseValue,
  getQuestionTitle,
  FormattedResponseValue,
} from '../utils/resultFormatting';

export interface ResultsDetailProps {
  activityId: string;
  submissionId: string | null;
  onTakeActivity: () => void;
}

export const ResultsDetail: React.FC<ResultsDetailProps> = ({
  activityId: _activityId,
  submissionId,
  onTakeActivity,
}) => {
  const { theme, tokens } = useTheme();
  const { data: submissionDetails, isLoading, error } = useSubmissionDetails(submissionId);

  const questionMetadata = useMemo(
    () => buildQuestionMetadataMap(submissionDetails || undefined),
    [submissionDetails]
  );

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainer,
      borderRadius: tokens.borderRadius.large,
      border: `1px solid ${theme.outline}`,
      height: 'fit-content',
      minHeight: '400px',
    },
    header: {
      backgroundColor: theme.surfaceContainerHigh,
      padding: tokens.spacing[4],
      borderBottom: `1px solid ${theme.outline}`,
    },
    headerTitle: {
      ...tokens.typography.title.medium,
      color: theme.onSurface,
      margin: 0,
    },
    content: {
      padding: tokens.spacing[4],
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.spacing[8],
      textAlign: 'center' as const,
      minHeight: '300px',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: tokens.spacing[4],
      opacity: 0.5,
    },
    emptyTitle: {
      ...tokens.typography.headline.small,
      color: theme.onSurface,
      marginBottom: tokens.spacing[2],
    },
    emptyDescription: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[4],
      maxWidth: '400px',
    },
    button: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[3]}px ${tokens.spacing[4]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    loadingState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.spacing[8],
      color: theme.onSurfaceVariant,
      ...tokens.typography.body.medium,
    },
    errorState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.spacing[8],
      color: theme.error,
      ...tokens.typography.body.medium,
    },
    responseItem: {
      marginBottom: tokens.spacing[6],
      paddingBottom: tokens.spacing[4],
      borderBottom: `1px solid ${theme.outlineVariant}`,
    },
    questionTitle: {
      ...tokens.typography.title.small,
      color: theme.onSurface,
      marginBottom: tokens.spacing[2],
    },
    responseCard: {
      backgroundColor: theme.surfaceContainerHighest,
      padding: tokens.spacing[4],
      borderRadius: tokens.borderRadius.medium,
      borderLeft: `4px solid ${theme.primary}`,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    responseText: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      margin: 0,
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-word' as const,
    },
    optionTitle: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      fontWeight: 600,
      margin: 0,
    },
    optionDescription: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      margin: 0,
    },
    optionItemContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[1],
    },
    responseList: {
      margin: 0,
      paddingLeft: tokens.spacing[4],
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    promptList: {
      margin: 0,
      paddingLeft: tokens.spacing[4],
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[3],
    },
    responseListItem: {
      listStyleType: 'disc' as const,
    },
    promptBadge: {
      ...tokens.typography.label.medium,
      color: theme.primary,
      backgroundColor: theme.primaryContainer,
      borderRadius: tokens.borderRadius.full,
      padding: `${tokens.spacing[1]}px ${tokens.spacing[2]}px`,
      alignSelf: 'flex-start' as const,
    },
    rawResponse: {
      ...tokens.typography.body.small,
      color: theme.onSurface,
      margin: 0,
      whiteSpace: 'pre-wrap' as const,
    },
    emptyResponseText: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      fontStyle: 'italic',
      margin: 0,
    },
    metadata: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: tokens.spacing[4],
      backgroundColor: theme.surfaceContainerHighest,
      borderTop: `1px solid ${theme.outline}`,
      borderRadius: `0 0 ${tokens.borderRadius.large}px ${tokens.borderRadius.large}px`,
    },
    metadataItem: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
    },
    completionBadge: {
      backgroundColor: theme.primaryContainer,
      color: theme.onPrimaryContainer,
      padding: `${tokens.spacing[1]}px ${tokens.spacing[2]}px`,
      borderRadius: tokens.borderRadius.small,
      fontSize: tokens.typography.body.small.fontSize,
      fontWeight: '500',
    },
  });

  const styles = getStyles();

  const renderResponseContent = (formatted: FormattedResponseValue) => {
    switch (formatted.type) {
      case 'text':
        return (
          <div style={styles.responseCard}>
            <p style={styles.responseText}>{formatted.text}</p>
          </div>
        );
      case 'option':
        return (
          <div style={styles.responseCard}>
            <div style={styles.optionTitle}>{formatted.option.title}</div>
            {formatted.option.description && (
              <div style={styles.optionDescription}>{formatted.option.description}</div>
            )}
          </div>
        );
      case 'list':
        return (
          <div style={styles.responseCard}>
            <ul style={styles.responseList}>
              {formatted.items.map((item) => (
                <li key={item.id} style={styles.responseListItem}>
                  <div style={styles.optionItemContent}>
                    <div style={styles.optionTitle}>{item.title}</div>
                    {item.description && (
                      <div style={styles.optionDescription}>{item.description}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'prompts':
        return (
          <div style={styles.responseCard}>
            <ul style={styles.promptList}>
              {formatted.prompts.map(({ prompt, label }) => (
                <li key={prompt.id} style={styles.responseListItem}>
                  <div style={styles.optionItemContent}>
                    <div style={styles.optionTitle}>{prompt.title}</div>
                    <span style={styles.promptBadge}>{label}</span>
                    {prompt.description && (
                      <div style={styles.optionDescription}>{prompt.description}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'raw':
        return (
          <div style={styles.responseCard}>
            <pre style={styles.rawResponse}>{formatted.raw}</pre>
          </div>
        );
      case 'empty':
      default:
        return (
          <div style={styles.responseCard}>
            <div style={styles.emptyResponseText}>No response provided</div>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
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

  // No submission selected - show empty state
  if (!submissionId) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Results Details</h3>
        </div>

        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h3 style={styles.emptyTitle}>No Results Yet</h3>
          <p style={styles.emptyDescription}>
            You haven't taken this activity yet. Click the button below to get started and see your personalized results.
          </p>
          <button style={styles.button} onClick={onTakeActivity}>
            Take Activity
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Results Details</h3>
        </div>
        <div style={styles.loadingState}>
          Loading your responses...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Results Details</h3>
        </div>
        <div style={styles.errorState}>
          Failed to load submission details
        </div>
      </div>
    );
  }

  // No data
  if (!submissionDetails) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Results Details</h3>
        </div>
        <div style={styles.errorState}>
          No details available for this submission
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>
          Results from {formatDate(submissionDetails.completed_at)}
        </h3>
      </div>

      <div style={styles.content}>
        {submissionDetails.responses && submissionDetails.responses.length > 0 ? (
          submissionDetails.responses.map((response, index) => {
            const metadata = questionMetadata.get(response.question_id);
            const questionTitle = getQuestionTitle(response, metadata);
            const formattedValue = formatResponseValue(response, metadata);

            return (
              <div key={response.id || index} style={styles.responseItem}>
                <h4 style={styles.questionTitle}>{questionTitle}</h4>
                {renderResponseContent(formattedValue)}
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <h3 style={styles.emptyTitle}>No Responses Yet</h3>
            <p style={styles.emptyDescription}>
              This submission doesn't have any recorded responses yet.
            </p>
          </div>
        )}
      </div>

      <div style={styles.metadata}>
        <div style={styles.metadataItem}>
          Started: {formatDate(submissionDetails.started_at)} • Completed: {formatDate(submissionDetails.completed_at)}
        </div>

        <div style={styles.completionBadge}>
          Completed
        </div>
      </div>
    </div>
  );
};