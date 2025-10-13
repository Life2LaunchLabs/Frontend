/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { QuestAdminService } from '../api';
import { QuestTemplate } from '../types';

export const AdminQuestsPage: React.FC = () => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const [quests, setQuests] = useState<QuestTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuestAdminService.listQuestTemplates();
      setQuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuest = () => {
    navigate('/admin/quests/new');
  };

  const handleQuestClick = (questId: string) => {
    navigate(`/admin/quests/${questId}`);
  };

  if (loading) {
    return (
      <PageLayout
        pageName="Quests"
        navMode="admin"
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
        pageName="Quests"
        navMode="admin"
        panes={[
          {
            content: (
              <>
                <p css={{ color: colors.error, marginBottom: tokens.spacing[4] }}>{error}</p>
                <Button variant="filled" onClick={loadQuests}>
                  Retry
                </Button>
              </>
            ),
          },
        ]}
      />
    );
  }

  return (
    <PageLayout
      pageName="Quests"
      navMode="admin"
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
                <h1 css={{ margin: 0, flex: 1 }}>Quest Templates</h1>
                <Button variant="filled" icon="add" onClick={handleCreateQuest}>
                  Create Quest
                </Button>
              </div>

              {/* Content */}
              {quests.length === 0 ? (
                <div css={{ textAlign: 'center', padding: tokens.spacing[8] }}>
                  <p css={{ marginBottom: tokens.spacing[4] }}>
                    No quest templates yet. Create your first quest to get started!
                  </p>
                  <Button variant="filled" icon="add" onClick={handleCreateQuest}>
                    Create Your First Quest
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
  quest: QuestTemplate;
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
      status === 'published'
        ? colors.primaryContainer
        : status === 'draft'
        ? colors.secondaryContainer
        : colors.errorContainer,
    color:
      status === 'published'
        ? colors.onPrimaryContainer
        : status === 'draft'
        ? colors.onSecondaryContainer
        : colors.onErrorContainer,
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
        <h3 css={{ margin: 0 }}>{quest.title}</h3>
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
        {quest.description}
      </p>

      <div css={{
        display: 'flex',
        gap: tokens.spacing[4],
        paddingTop: tokens.spacing[3],
        borderTop: `1px solid ${colors.outline}`,
        marginTop: 'auto',
        fontSize: tokens.typography.label.medium.fontSize,
        color: colors.onSurfaceVariant,
      }}>
        <div css={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
          <span css={{ fontFamily: '"Material Symbols Outlined"', fontSize: '18px' }}>list_alt</span>
          <span>{quest.items_count} items</span>
        </div>
        <div css={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
          <span css={{ fontFamily: '"Material Symbols Outlined"', fontSize: '18px' }}>flag</span>
          <span>{quest.milestones_count} milestones</span>
        </div>
        <div css={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
          <span css={{ fontFamily: '"Material Symbols Outlined"', fontSize: '18px' }}>school</span>
          <span>{quest.activities_count} activities</span>
        </div>
      </div>
    </div>
  );
};