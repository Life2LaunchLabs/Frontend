import React from 'react';
import { useTheme } from '../../../styles';
import { Activity } from '../../activities/types';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const { colors, tokens } = useTheme();

  const getStyles = () => ({
    card: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      boxShadow: tokens.shadows.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      border: `1px solid ${colors.outline}`,
      ':hover': {
        boxShadow: tokens.shadows.large,
        transform: 'translateY(-2px)',
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: tokens.spacing[4],
    },
    title: {
      ...tokens.typography.headline.small,
      color: colors.onSurface,
      marginBottom: tokens.spacing[2],
    },
    status: {
      ...tokens.typography.label.medium,
      color: colors.primary,
      backgroundColor: colors.primaryContainer,
      padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.small,
      textTransform: 'capitalize' as const,
    },
    description: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[4],
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metadata: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
    },
    slug: {
      ...tokens.typography.label.small,
      color: colors.secondary,
      backgroundColor: colors.secondaryContainer,
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      fontFamily: 'monospace',
    },
  });

  const styles = getStyles();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return { color: colors.tertiary, backgroundColor: colors.tertiaryContainer };
      case 'draft':
        return { color: colors.secondary, backgroundColor: colors.secondaryContainer };
      case 'archived':
        return { color: colors.error, backgroundColor: colors.errorContainer };
      default:
        return { color: colors.primary, backgroundColor: colors.primaryContainer };
    }
  };

  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = tokens.shadows.large;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = tokens.shadows.medium;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={styles.header}>
        <h3 style={styles.title}>{activity.title}</h3>
        <span style={{ ...styles.status, ...getStatusColor(activity.status) }}>
          {activity.status}
        </span>
      </div>

      {activity.description && (
        <p style={styles.description}>{activity.description}</p>
      )}

      <div style={styles.footer}>
        <div style={styles.metadata}>
          Created: {formatDate(activity.created_at)}
        </div>
        <div style={styles.slug}>
          {activity.slug}
        </div>
      </div>
    </div>
  );
};