/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { useEnrolledQuests } from '../api/hooks';
import type { QuestEnrollment } from '../types';

export const QuestsListPage: React.FC = () => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const { data: quests, isLoading, error } = useEnrolledQuests();

  const handleQuestClick = (questId: string) => {
    navigate(`/quests/${questId}`);
  };

  if (isLoading) {
    return (
      <PageLayout
        pageName="My Quests"
        panes={[
          {
            content: <p>Loading quests...</p>,
          },
        ]}
      />
    );
  }

  if (error) {
    return (
      <PageLayout
        pageName="My Quests"
        panes={[
          {
            content: (
              <p css={{ color: colors.error }}>
                Failed to load quests: {error.message}
              </p>
            ),
          },
        ]}
      />
    );
  }

  return (
    <PageLayout
      pageName="My Quests"
      panes={[
        {
          content: (
            <>
              {/* Header */}
              <div css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: tokens.spacing[4],
                marginBottom: tokens.spacing[6],
              }}>
                <h1 css={{ margin: 0, flex: 1 }}>My Quests</h1>
              </div>

              {/* Content */}
              {!quests || quests.length === 0 ? (
                <div css={{ textAlign: 'center', padding: tokens.spacing[8] }}>
                  <p css={{ marginBottom: tokens.spacing[4], color: colors.onSurfaceVariant }}>
                    You haven't enrolled in any quests yet. Check out available quests to get started!
                  </p>
                  <Button variant="filled" icon="explore" onClick={() => navigate('/explore')}>
                    Explore Quests
                  </Button>
                </div>
              ) : (
                <div css={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: tokens.spacing[4],
                }}>
                  {quests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={() => handleQuestClick(quest.id)}
                    />
                  ))}
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

interface QuestCardProps {
  quest: QuestEnrollment;
  onClick: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick }) => {
  const { colors, tokens } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadgeStyle = (status: string) => ({
    padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
    borderRadius: tokens.borderRadius.full,
    fontSize: tokens.typography.label.small.fontSize,
    alignSelf: 'flex-start' as const,
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
  });

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[3],
        backgroundColor: colors.surface,
        borderRadius: tokens.borderRadius.large,
        padding: tokens.spacing[6],
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: `1px solid ${colors.outline}`,
        ...(isHovered && {
          transform: 'translateY(-2px)',
          boxShadow: tokens.shadows.medium,
        }),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
        <h3 css={{ margin: 0 }}>{quest.quest_template.title}</h3>
        <span css={getStatusBadgeStyle(quest.status)}>{quest.status}</span>
      </div>

      <p css={{
        margin: 0,
        color: colors.onSurfaceVariant,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical' as any,
      }}>
        {quest.quest_template.description}
      </p>

      {/* Progress bar */}
      <div css={{ marginTop: tokens.spacing[2] }}>
        <div css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: tokens.spacing[1],
          fontSize: tokens.typography.label.small.fontSize,
          color: colors.onSurfaceVariant,
        }}>
          <span>Progress</span>
          <span>{Math.round(quest.progress_percentage)}%</span>
        </div>
        <div css={{
          width: '100%',
          height: '8px',
          backgroundColor: colors.surfaceVariant,
          borderRadius: tokens.borderRadius.full,
          overflow: 'hidden',
        }}>
          <div css={{
            width: `${quest.progress_percentage}%`,
            height: '100%',
            backgroundColor: colors.primary,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      <div css={{
        display: 'flex',
        gap: tokens.spacing[4],
        paddingTop: tokens.spacing[3],
        borderTop: `1px solid ${colors.outline}`,
        marginTop: 'auto',
        fontSize: tokens.typography.label.medium.fontSize,
        color: colors.onSurfaceVariant,
      }}>
        {quest.completed_items !== undefined && quest.total_items !== undefined && (
          <div css={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
            <span css={{ fontFamily: '"Material Symbols Outlined"', fontSize: '18px' }}>task_alt</span>
            <span>{quest.completed_items} / {quest.total_items}</span>
          </div>
        )}
        <div css={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
          <span css={{ fontFamily: '"Material Symbols Outlined"', fontSize: '18px' }}>calendar_today</span>
          <span>{new Date(quest.enrolled_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
