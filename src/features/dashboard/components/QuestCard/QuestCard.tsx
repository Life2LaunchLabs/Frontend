import React from 'react';
import { useTheme } from '../../../../styles';
import type { QuestEnrollment } from '../../api/types';

export interface QuestCardProps {
  quest: QuestEnrollment;
  onClick?: (quest: QuestEnrollment) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onClick,
}) => {
  const { colors, tokens } = useTheme();

  const getStyles = () => ({
    card: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[5],
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      position: 'relative' as const,
      minWidth: '280px',
      maxWidth: '320px',
      height: '160px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      flexShrink: 0,
      ':hover': onClick ? {
        backgroundColor: colors.surfaceVariant,
        borderColor: quest.quest_template.color,
        transform: 'translateY(-2px)',
        boxShadow: tokens.shadows.large,
      } : {},
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing[3],
    },
    title: {
      ...tokens.typography.headline.small,
      color: colors.onSurface,
      fontWeight: '600',
      lineHeight: 1.3,
      flex: 1,
      marginRight: tokens.spacing[3],
    },
    colorDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: quest.quest_template.color,
      flexShrink: 0,
      marginTop: tokens.spacing[1],
    },
    description: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      lineHeight: 1.4,
      marginBottom: tokens.spacing[4],
      height: '2.8em', // Fixed height for 2 lines
      overflow: 'hidden',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    category: {
      ...tokens.typography.label.small,
      color: colors.onSurfaceVariant,
      backgroundColor: colors.surfaceVariant,
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      fontWeight: '500',
    },
    progress: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    progressText: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      fontWeight: '500',
    },
    progressBar: {
      width: '60px',
      height: '4px',
      backgroundColor: colors.surfaceVariant,
      borderRadius: '2px',
      overflow: 'hidden' as const,
    },
    progressFill: {
      height: '100%',
      backgroundColor: quest.quest_template.color,
      borderRadius: '2px',
      transition: 'width 0.3s ease',
    },
  });

  const styles = getStyles();

  const progressPercentage = quest.progress_percentage;

  const handleClick = () => {
    if (onClick) {
      onClick(quest);
    }
  };

  return (
    <div
      style={styles.card}
      onClick={handleClick}
      data-testid="quest-card"
    >
      <div>
        <div style={styles.header}>
          <h3 style={styles.title}>{quest.quest_template.title}</h3>
          <div style={styles.colorDot} />
        </div>
        <p style={styles.description}>{quest.quest_template.description}</p>
      </div>

      <div style={styles.footer}>
        <div style={styles.category}>
          {quest.quest_template.category}
        </div>
        <div style={styles.progress}>
          <span style={styles.progressText}>
            {quest.completed_items || 0}/{quest.total_items || 0}
          </span>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};