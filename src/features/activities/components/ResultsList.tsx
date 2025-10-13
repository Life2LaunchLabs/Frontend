import React from 'react';
import { useTheme } from '../../../styles';
import { useActivityResults } from '../api';

export interface ResultsListProps {
  activityId: string;
  selectedSubmissionId: string | null;
  onSelectSubmission: (submissionId: string | null) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  activityId,
  selectedSubmissionId,
  onSelectSubmission,
}) => {
  const { theme, tokens } = useTheme();
  const { data: results, isLoading, error } = useActivityResults(activityId);

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainer,
      borderRadius: tokens.borderRadius.large,
      border: `1px solid ${theme.outline}`,
      overflow: 'hidden',
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
      padding: tokens.spacing[2],
    },
    loadingState: {
      padding: tokens.spacing[6],
      textAlign: 'center' as const,
      color: theme.onSurfaceVariant,
      ...tokens.typography.body.medium,
    },
    errorState: {
      padding: tokens.spacing[6],
      textAlign: 'center' as const,
      color: theme.error,
      ...tokens.typography.body.medium,
    },
    emptyState: {
      padding: tokens.spacing[6],
      textAlign: 'center' as const,
      color: theme.onSurfaceVariant,
      ...tokens.typography.body.medium,
    },
    resultItem: (isSelected: boolean) => ({
      padding: tokens.spacing[3],
      margin: `${tokens.spacing[1]}px 0`,
      borderRadius: tokens.borderRadius.medium,
      cursor: 'pointer',
      border: `1px solid ${isSelected ? theme.primary : 'transparent'}`,
      backgroundColor: isSelected ? theme.primaryContainer : 'transparent',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: theme.surfaceContainerHighest,
      },
    }),
    resultDate: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      fontWeight: '500',
    },
    resultTime: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      marginTop: tokens.spacing[1],
    },
    resultStatus: {
      ...tokens.typography.body.small,
      color: theme.primary,
      marginTop: tokens.spacing[1],
      fontWeight: '500',
    },
  });

  const styles = getStyles();

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Previous Results</h3>
      </div>

      <div style={styles.content}>
        {isLoading && (
          <div style={styles.loadingState}>
            Loading your results...
          </div>
        )}

        {error && (
          <div style={styles.errorState}>
            Failed to load results
          </div>
        )}

        {!isLoading && !error && (!results || results.length === 0) && (
          <div style={styles.emptyState}>
            No completed submissions yet
          </div>
        )}

        {!isLoading && !error && results && results.length > 0 && (
          <>
            {results.map((submission) => (
              <div
                key={submission.id}
                style={styles.resultItem(selectedSubmissionId === submission.id)}
                onClick={() => onSelectSubmission(submission.id)}
              >
                <div style={styles.resultDate}>
                  {formatDate(submission.completed_at)}
                </div>
                <div style={styles.resultTime}>
                  {formatTime(submission.completed_at)}
                </div>
                <div style={styles.resultStatus}>
                  Completed
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};