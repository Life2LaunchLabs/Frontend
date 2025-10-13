/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { useQuestEnrollmentDetail } from '../api/hooks';
import type { QuestItemProgress } from '../types';

export const QuestDetailPage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const { data: quest, isLoading, error } = useQuestEnrollmentDetail(questId || '');

  const getStyles = () => ({
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[6],
      width: '100%',
    },
    header: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      boxShadow: tokens.shadows.small,
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    backButton: {
      color: colors.primary,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      ...tokens.typography.label.large,
      cursor: 'pointer',
    },
    backIcon: {
      fontFamily: '"Material Symbols Outlined"',
      fontSize: '20px',
    },
    titleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: tokens.spacing[4],
    },
    titleSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
      flex: 1,
    },
    title: {
      ...tokens.typography.headline.large,
      color: colors.onSurface,
      margin: 0,
    },
    statusBadge: (status: string) => ({
      padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.full,
      ...tokens.typography.label.small,
      alignSelf: 'flex-start',
      backgroundColor:
        status === 'active'
          ? colors.primaryContainer
          : status === 'completed'
          ? colors.tertiaryContainer
          : colors.secondaryContainer,
      color:
        status === 'active'
          ? colors.onPrimaryContainer
          : status === 'completed'
          ? colors.onTertiaryContainer
          : colors.onSecondaryContainer,
    }),
    description: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      margin: 0,
    },
    stats: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: tokens.spacing[4],
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[1],
    },
    statLabel: {
      ...tokens.typography.label.small,
      color: colors.onSurfaceVariant,
    },
    statValue: {
      ...tokens.typography.label.medium,
      color: colors.onSurface,
      fontWeight: 600,
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[8],
      boxShadow: tokens.shadows.small,
    },
    sectionTitle: {
      ...tokens.typography.title.medium,
      color: colors.onSurface,
      margin: 0,
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
    },
    emptyText: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[4],
    },
    progressBar: {
      width: '100%',
      height: '12px',
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.full,
      overflow: 'hidden',
      border: `1px solid ${colors.outline}`,
    },
    progressFill: (percentage: number) => ({
      width: `${percentage}%`,
      height: '100%',
      backgroundColor: colors.primary,
      transition: 'width 0.3s ease',
    }),
  });

  const styles = getStyles();

  if (isLoading) {
    return (
      <PageLayout
        pageName="Quest Detail"
        panes={[
          {
            content: <p>Loading quest...</p>,
          },
        ]}
      />
    );
  }

  if (error || !quest) {
    return (
      <PageLayout
        pageName="Quest Detail"
        panes={[
          {
            content: (
              <>
                <p css={{ color: colors.error }}>
                  {error ? `Failed to load quest: ${error.message}` : 'Quest not found'}
                </p>
                <Button variant="filled" onClick={() => navigate('/quests')}>
                  Back to Quests
                </Button>
              </>
            ),
          },
        ]}
      />
    );
  }

  const renderContent = () => {
    return (
      <div css={styles.contentWrapper}>
        <div style={styles.header}>
          <div style={styles.topBar}>
            <a
              href="#"
              style={styles.backButton}
              onClick={(e) => {
                e.preventDefault();
                navigate('/quests');
              }}
            >
              <span style={styles.backIcon}>arrow_back</span>
              Back to My Quests
            </a>
          </div>

          <div style={styles.titleRow}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>{quest.quest_template.title}</h1>
              <span style={styles.statusBadge(quest.status)}>{quest.status}</span>
            </div>
          </div>

          <p style={styles.description}>{quest.quest_template.description}</p>

          {/* Progress section */}
          <div>
            <div css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: tokens.spacing[2],
            }}>
              <span css={{ ...tokens.typography.label.medium, color: colors.onSurfaceVariant }}>
                Overall Progress
              </span>
              <span css={{ ...tokens.typography.label.medium, color: colors.onSurface, fontWeight: 600 }}>
                {Math.round(quest.progress_percentage)}%
              </span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(quest.progress_percentage)} />
            </div>
          </div>

          <div style={styles.stats}>
            {quest.completed_items !== undefined && quest.total_items !== undefined && (
              <div style={styles.stat}>
                <span style={styles.statLabel}>Items Completed:</span>
                <span style={styles.statValue}>{quest.completed_items} / {quest.total_items}</span>
              </div>
            )}
            <div style={styles.stat}>
              <span style={styles.statLabel}>Enrolled:</span>
              <span style={styles.statValue}>{new Date(quest.enrolled_at).toLocaleDateString()}</span>
            </div>
            {quest.completed_at && (
              <div style={styles.stat}>
                <span style={styles.statLabel}>Completed:</span>
                <span style={styles.statValue}>{new Date(quest.completed_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Quest Items</h2>

          {!quest.items || quest.items.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>
                No items in this quest yet.
              </p>
            </div>
          ) : (
            <QuestItemsList items={quest.items} />
          )}
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      pageName="Quest Detail"
      panes={[
        {
          content: renderContent(),
        },
      ]}
    />
  );
};

interface QuestItemsListProps {
  items: QuestItemProgress[];
}

const QuestItemsList: React.FC<QuestItemsListProps> = ({ items }) => {
  const { colors, tokens } = useTheme();

  const getStyles = () => ({
    list: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[3],
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.list}>
      {items.map((item) => (
        <QuestItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

interface QuestItemCardProps {
  item: QuestItemProgress;
}

const QuestItemCard: React.FC<QuestItemCardProps> = ({ item }) => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Only allow clicking on activities
    if (item.item_definition?.item_type === 'activity' && item.item_definition?.activity) {
      // Navigate to activity detail page
      navigate(`/activities/${item.item_definition.activity.id}`);
    }
  };

  const isClickable = item.item_definition?.item_type === 'activity' && item.item_definition?.activity;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'in_progress':
        return 'pending';
      default:
        return 'radio_button_unchecked';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.tertiary;
      case 'in_progress':
        return colors.primary;
      default:
        return colors.onSurfaceVariant;
    }
  };

  const getStyles = () => ({
    card: {
      backgroundColor: colors.surface,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      display: 'flex',
      gap: tokens.spacing[4],
      alignItems: 'flex-start',
      border: `1px solid ${colors.outline}`,
      cursor: isClickable ? 'pointer' : 'default',
      transition: 'background-color 0.2s, box-shadow 0.2s',
      opacity: item.status === 'completed' ? 0.7 : 1,
    } as React.CSSProperties,
    cardHover: {
      backgroundColor: colors.surfaceVariant,
      boxShadow: tokens.shadows.small,
    } as React.CSSProperties,
    statusIcon: {
      color: getStatusColor(item.status),
      fontFamily: '"Material Symbols Outlined"',
      fontSize: '24px',
      flexShrink: 0,
    },
    content: {
      flex: 1,
      minWidth: 0,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: tokens.spacing[2],
      gap: tokens.spacing[2],
    },
    title: {
      ...tokens.typography.title.small,
      color: colors.onSurface,
      margin: 0,
    },
    typeBadge: (type: string) => ({
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      ...tokens.typography.label.small,
      backgroundColor: type === 'activity' ? colors.primaryContainer : colors.secondaryContainer,
      color: type === 'activity' ? colors.onPrimaryContainer : colors.onSecondaryContainer,
      flexShrink: 0,
    }),
    description: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[2],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as any,
    },
    footer: {
      display: 'flex',
      gap: tokens.spacing[3],
      ...tokens.typography.label.small,
      color: colors.onSurfaceVariant,
      flexWrap: 'wrap' as const,
    },
  });

  const styles = getStyles();

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered && isClickable ? styles.cardHover : {}),
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={styles.statusIcon}>
        {getStatusIcon(item.status)}
      </span>

      <div style={styles.content}>
        <div style={styles.header}>
          <h4 style={styles.title}>{item.item_definition?.title || 'Untitled'}</h4>
          <span style={styles.typeBadge(item.item_definition?.item_type || 'milestone')}>
            {item.item_definition?.item_type || 'milestone'}
          </span>
        </div>

        <p style={styles.description}>{item.item_definition?.description || 'No description available'}</p>

        <div style={styles.footer}>
          <span>Duration: {item.item_definition?.estimated_duration_days || 0} days</span>
          {item.status === 'in_progress' && item.started_at && (
            <span>Started: {new Date(item.started_at).toLocaleDateString()}</span>
          )}
          {item.status === 'completed' && item.completed_at && (
            <span>Completed: {new Date(item.completed_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};
