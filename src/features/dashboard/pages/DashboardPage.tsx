import React from 'react';
import { FolderLayout, TabItem } from '../../../shared/components';
import { useTheme } from '../../../styles';
import { useUpcomingMilestones, useQuests, useUserProfile } from '../api/hooks';
import { MilestoneCard, QuestCard, MilestoneCalendar } from '../components';

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'explore', label: 'Explore', path: '/explore' },
];

export const DashboardPage: React.FC = () => {
  const { theme, tokens } = useTheme();
  const { data: upcomingMilestones, isLoading, error } = useUpcomingMilestones();
  const { data: quests, isLoading: questsLoading, error: questsError } = useQuests();
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useUserProfile();

  const getStyles = () => ({
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      padding: tokens.spacing[6],
      gap: tokens.spacing[6],
      width: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    mainLayout: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: tokens.spacing[6],
      width: '100%',
      minWidth: 0,
    },
    leftColumn: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      flex: 1,
      minWidth: 0,
    },
    leftPanel: {
      flex: 1,
      backgroundColor: theme.surface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      display: 'flex',
      gap: tokens.spacing[6],
      minHeight: 0,
    },
    bioCard: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    bioSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    bioHeader: {
      ...tokens.typography.titleMedium,
      color: theme.onSurface,
      fontWeight: 600,
    },
    bioContent: {
      ...tokens.typography.bodyMedium,
      color: theme.onSurfaceVariant,
      lineHeight: 1.5,
    },
    todayContent: {
      ...tokens.typography.bodyMedium,
      color: theme.onSurfaceVariant,
      fontStyle: 'italic' as const,
    },
    todoPanel: {
      backgroundColor: theme.surface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      display: 'flex',
      flexDirection: 'column' as const,
      width: '300px',
      minWidth: '250px',
      flexShrink: 1,
    },
    todoHeader: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      marginBottom: tokens.spacing[4],
    },
    todoList: {
      flex: 1,
      overflowY: 'auto' as const,
      minHeight: 0,
    },
    emptyState: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
    },
    loadingState: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[4],
    },
    errorState: {
      ...tokens.typography.body.medium,
      color: theme.error,
      textAlign: 'center' as const,
      padding: tokens.spacing[4],
    },
    placeholderText: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
    },
    questsPanel: {
      backgroundColor: theme.surface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0,
      flex: 1,
    },
    questsHeader: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      marginBottom: tokens.spacing[4],
    },
    questsScrollContainer: {
      display: 'flex',
      gap: tokens.spacing[4],
      overflowX: 'auto' as const,
      overflowY: 'hidden' as const,
      paddingBottom: tokens.spacing[2],
      // Custom scrollbar styling
      scrollbarWidth: 'thin' as const,
      scrollbarColor: `${theme.outline} transparent`,
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.outline,
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: theme.onSurfaceVariant,
      },
    },
  });

  const styles = getStyles();

  const handleMenuClick = () => {
    console.log('Dashboard menu clicked');
  };

  const handleMilestoneClick = (milestone: any) => {
    console.log('Milestone clicked:', milestone);
    // Future: Navigate to milestone detail or mark as complete
  };

  const handleQuestClick = (quest: any) => {
    console.log('Quest clicked:', quest);
    // Future: Navigate to quest detail
  };

  const renderPanel1Content = () => {
    if (profileLoading || questsLoading) {
      return <div style={styles.loadingState}>Loading...</div>;
    }

    if (profileError || questsError) {
      return <div style={styles.errorState}>Failed to load data</div>;
    }

    // Get all milestones for calendar markers
    const allMilestones = upcomingMilestones || [];

    return (
      <>
        <div style={styles.bioCard}>
          <div style={styles.bioSection}>
            <div style={styles.bioHeader}>Your North Star</div>
            <div style={styles.bioContent}>
              {userProfile?.bio || 'No bio set yet. Add your goals and aspirations in your profile.'}
            </div>
          </div>
          <div style={styles.bioSection}>
            <div style={styles.bioHeader}>Today</div>
            <div style={styles.todayContent}>Work in Progress</div>
          </div>
        </div>
        <MilestoneCalendar milestones={allMilestones} />
      </>
    );
  };

  const renderTodoContent = () => {
    if (isLoading) {
      return <div style={styles.loadingState}>Loading upcoming milestones...</div>;
    }

    if (error) {
      return <div style={styles.errorState}>Failed to load milestones</div>;
    }

    if (!upcomingMilestones || upcomingMilestones.length === 0) {
      return (
        <div style={styles.emptyState}>
          No upcoming milestones! 🎉<br />
          You're all caught up or ready to start your first quest.
        </div>
      );
    }

    return (
      <div style={styles.todoList}>
        {upcomingMilestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onClick={handleMilestoneClick}
          />
        ))}
      </div>
    );
  };

  const renderQuestsContent = () => {
    if (questsLoading) {
      return <div style={styles.loadingState}>Loading quests...</div>;
    }

    if (questsError) {
      return <div style={styles.errorState}>Failed to load quests</div>;
    }

    if (!quests || quests.length === 0) {
      return (
        <div style={styles.emptyState}>
          No active quests yet.<br />
          Start your journey by creating your first quest!
        </div>
      );
    }

    return (
      <div style={styles.questsScrollContainer}>
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClick={handleQuestClick}
          />
        ))}
      </div>
    );
  };

  return (
    <FolderLayout title="Dashboard Overview" tabs={tabs} onMenuClick={handleMenuClick}>
      <div style={styles.container} data-testid="dashboard-page">
        <div style={styles.mainLayout}>
          {/* Left Column - Two Panels */}
          <div style={styles.leftColumn}>
            <div style={styles.leftPanel}>
              {renderPanel1Content()}
            </div>
            <div style={styles.questsPanel}>
              <h2 style={styles.questsHeader}>Active Quests</h2>
              {renderQuestsContent()}
            </div>
          </div>

          {/* Right Panel - Todo List */}
          <div style={styles.todoPanel}>
            <h2 style={styles.todoHeader}>Upcoming Milestones</h2>
            {renderTodoContent()}
          </div>
        </div>
      </div>
    </FolderLayout>
  );
};