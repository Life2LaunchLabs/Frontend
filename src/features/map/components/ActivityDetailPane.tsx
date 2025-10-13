import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { IconButton } from '../../../shared/components';
import { ActivityWithVersion } from '../api';
import { useHasCompletedActivity } from '../../activities/api';

export interface ActivityDetailPaneProps {
  activity: ActivityWithVersion | null;
  onClose: () => void;
  onStartActivity: (activityId: string) => void;
}

export const ActivityDetailPane: React.FC<ActivityDetailPaneProps> = ({
  activity,
  onClose,
  onStartActivity,
}) => {
  const { theme, tokens } = useTheme();
  const navigate = useNavigate();
  const { data: hasCompleted, isLoading: isCheckingCompletion } = useHasCompletedActivity(activity?.id || '');

  if (!activity) return null;

  const getStyles = () => ({
    backdrop: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 30,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'stretch',
    },
    pane: {
      width: '400px',
      maxWidth: '90vw',
      backgroundColor: theme.surface,
      borderLeft: `1px solid ${theme.outline}`,
      display: 'flex',
      flexDirection: 'column' as const,
      boxShadow: tokens.shadows.large,
    },
    header: {
      padding: tokens.spacing[6],
      borderBottom: `1px solid ${theme.outline}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: tokens.spacing[4],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: tokens.spacing[6],
      overflowY: 'auto' as const,
    },
    description: {
      ...tokens.typography.body.large,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[6],
      lineHeight: 1.5,
    },
    organizationInfo: {
      padding: tokens.spacing[4],
      backgroundColor: theme.surfaceVariant,
      borderRadius: tokens.borderRadius.medium,
      marginBottom: tokens.spacing[6],
    },
    organizationLabel: {
      ...tokens.typography.label.small,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[1],
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    organizationName: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      fontWeight: '600',
    },
    metaSection: {
      marginBottom: tokens.spacing[6],
    },
    metaTitle: {
      ...tokens.typography.label.medium,
      color: theme.onSurface,
      marginBottom: tokens.spacing[3],
      fontWeight: '600',
    },
    metaItem: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[2],
    },
    footer: {
      padding: tokens.spacing[6],
      borderTop: `1px solid ${theme.outline}`,
    },
    startButton: {
      width: '100%',
      padding: tokens.spacing[4],
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.medium,
      ...tokens.typography.label.large,
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    startButtonHover: {
      backgroundColor: theme.primaryContainer,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[3],
    },
    secondaryButton: {
      width: '100%',
      padding: tokens.spacing[3],
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      ...tokens.typography.label.medium,
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    secondaryButtonHover: {
      backgroundColor: theme.surfaceContainerHigh,
    },
  });

  const styles = getStyles();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStartActivity = () => {
    onStartActivity(activity.id);
  };

  const handleViewResults = () => {
    navigate(`/activities/results/${activity.id}`);
    onClose(); // Close the pane when navigating
  };

  const version = activity.latest_version;
  const meta = version?.meta || {};

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.pane}>
        <div style={styles.header}>
          <h2 style={styles.title}>{activity.title}</h2>
          <IconButton
            icon="close"
            onClick={onClose}
            variant="outlined"
          />
        </div>

        <div style={styles.content}>
          <p style={styles.description}>{activity.description}</p>

          {activity.organization && (
            <div style={styles.organizationInfo}>
              <div style={styles.organizationLabel}>Created by</div>
              <div style={styles.organizationName}>{activity.organization.name}</div>
            </div>
          )}

          {meta && Object.keys(meta).length > 0 && (
            <div style={styles.metaSection}>
              <div style={styles.metaTitle}>Details</div>
              {meta.estimated_duration && (
                <div style={styles.metaItem}>
                  <strong>Duration:</strong> {meta.estimated_duration}
                </div>
              )}
              {meta.difficulty && (
                <div style={styles.metaItem}>
                  <strong>Difficulty:</strong> {meta.difficulty.replace(/_/g, ' ')}
                </div>
              )}
              {meta.category && (
                <div style={styles.metaItem}>
                  <strong>Category:</strong> {meta.category}
                </div>
              )}
              {meta.topics && Array.isArray(meta.topics) && (
                <div style={styles.metaItem}>
                  <strong>Topics:</strong> {meta.topics.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <div style={styles.buttonContainer}>
            <button
              style={styles.startButton}
              onClick={handleStartActivity}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.startButtonHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = styles.startButton.backgroundColor;
              }}
            >
              {hasCompleted ? 'Take Again' : 'Start Activity'}
            </button>

            {!isCheckingCompletion && hasCompleted && (
              <button
                style={styles.secondaryButton}
                onClick={handleViewResults}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.secondaryButtonHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.secondaryButton.backgroundColor;
                }}
              >
                View Previous Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};