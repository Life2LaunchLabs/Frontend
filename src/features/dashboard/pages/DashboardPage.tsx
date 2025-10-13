/** @jsxImportSource @emotion/react */
import React from 'react';
import { PageLayout } from '@shared/components';
import { useTheme } from '../../../styles';
import { useUpcomingQuestItems, useActiveQuests, useUserProfile } from '../api/hooks';
import { MilestoneCard, QuestCard, MilestoneCalendar } from '../components';

export const DashboardPage: React.FC = () => {
  const { colors, tokens } = useTheme();
  const { data: upcomingItems, isLoading, error } = useUpcomingQuestItems();
  const { data: quests, isLoading: questsLoading, error: questsError } = useActiveQuests();
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useUserProfile();

  const handleMilestoneClick = (milestone: any) => {
    console.log('Milestone clicked:', milestone);
  };

  const handleQuestClick = (quest: any) => {
    console.log('Quest clicked:', quest);
  };

  const allItems = upcomingItems || [];

  return (
    <PageLayout
      pageName="Dashboard"
      panes={[
        {
          area: 'a',
          content: (
            <div css={{ display: 'flex', gap: tokens.spacing[6], minHeight: 0 }}>
              {profileLoading || questsLoading ? (
                <p css={{ textAlign: 'center', padding: tokens.spacing[4] }}>Loading...</p>
              ) : profileError || questsError ? (
                <p css={{ color: colors.error, textAlign: 'center', padding: tokens.spacing[4] }}>
                  Failed to load data
                </p>
              ) : (
                <>
                  <div css={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing[4] }}>
                    <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
                      <h3 css={{ fontWeight: 600 }}>Your North Star</h3>
                      <p css={{ color: colors.onSurfaceVariant, lineHeight: 1.5 }}>
                        {userProfile?.bio || 'No bio set yet. Add your goals and aspirations in your profile.'}
                      </p>
                    </div>
                    <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
                      <h3 css={{ fontWeight: 600 }}>Today</h3>
                      <p css={{ color: colors.onSurfaceVariant, fontStyle: 'italic' }}>Work in Progress</p>
                    </div>
                  </div>
                  <MilestoneCalendar milestones={allItems} />
                </>
              )}
            </div>
          ),
        },
        {
          area: 'b',
          content: (
            <div css={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <h2 css={{ marginBottom: tokens.spacing[4] }}>Active Quests</h2>
              {questsLoading ? (
                <p css={{ textAlign: 'center', padding: tokens.spacing[4] }}>Loading quests...</p>
              ) : questsError ? (
                <p css={{ color: colors.error, textAlign: 'center', padding: tokens.spacing[4] }}>Failed to load quests</p>
              ) : !quests || quests.length === 0 ? (
                <div css={{ textAlign: 'center', padding: tokens.spacing[8] }}>
                  No active quests yet.<br />Start your journey by creating your first quest!
                </div>
              ) : (
                <div
                  css={{
                    display: 'flex',
                    gap: tokens.spacing[4],
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    paddingBottom: tokens.spacing[2],
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${colors.outline} transparent`,
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: colors.outline, borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: colors.onSurfaceVariant },
                  }}
                >
                  {quests.map((q) => (
                    <QuestCard key={q.id} quest={q} onClick={handleQuestClick} />
                  ))}
                </div>
              )}
            </div>
          ),
        },
        {
          area: 'c',
          content: (
            <div css={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <h2 css={{ marginBottom: tokens.spacing[4] }}>Upcoming Quest Items</h2>
              {isLoading ? (
                <p css={{ textAlign: 'center', padding: tokens.spacing[4] }}>Loading upcoming items...</p>
              ) : error ? (
                <p css={{ color: colors.error, textAlign: 'center', padding: tokens.spacing[4] }}>
                  Failed to load quest items
                </p>
              ) : !upcomingItems || upcomingItems.length === 0 ? (
                <div css={{ textAlign: 'center', padding: tokens.spacing[8] }}>
                  No upcoming items! 🎉<br />You're all caught up or ready to start your first quest.
                </div>
              ) : (
                <div css={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                  {upcomingItems.map((item) => (
                    <MilestoneCard key={item.id} milestone={item} onClick={handleMilestoneClick} />
                  ))}
                </div>
              )}
            </div>
          ),
        },
      ]}
    />
  );
};
