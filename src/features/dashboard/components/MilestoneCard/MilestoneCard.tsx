import React from 'react';
import { useTheme } from '../../../../styles';
import type { Milestone } from '../../api/types';

export interface MilestoneCardProps {
  milestone: Milestone;
  onClick?: (milestone: Milestone) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onClick,
}) => {
  const { theme, tokens } = useTheme();

  const getStyles = () => ({
    card: {
      backgroundColor: theme.surface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      marginBottom: tokens.spacing[3],
      position: 'relative' as const,
      ':hover': onClick ? {
        backgroundColor: theme.surfaceVariant,
        borderColor: theme.primary,
        transform: 'translateY(-1px)',
        boxShadow: tokens.shadows.medium,
      } : {},
    },
    questColor: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      backgroundColor: milestone.quest.color,
      borderRadius: `${tokens.borderRadius.small} 0 0 ${tokens.borderRadius.small}`,
    },
    content: {
      marginLeft: tokens.spacing[2],
    },
    title: {
      ...tokens.typography.body.large,
      fontWeight: '600',
      color: theme.onSurface,
      marginBottom: tokens.spacing[2],
      lineHeight: 1.3,
    },
    questTitle: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[1],
      fontWeight: '500',
    },
    dueDate: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[1],
    },
    statusIndicator: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: milestone.status === 'in_progress' ? theme.primary : theme.outline,
      flexShrink: 0,
    },
  });

  const styles = getStyles();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `Due in ${diffDays} days`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(milestone);
    }
  };

  return (
    <div
      style={styles.card}
      onClick={handleClick}
      data-testid="milestone-card"
    >
      <div style={styles.questColor} />
      <div style={styles.content}>
        <div style={styles.questTitle}>
          {milestone.quest.title}
        </div>
        <div style={styles.title}>
          {milestone.title}
        </div>
        <div style={styles.dueDate}>
          <div style={styles.statusIndicator} />
          {formatDate(milestone.finish_date)}
        </div>
      </div>
    </div>
  );
};