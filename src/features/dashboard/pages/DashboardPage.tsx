import React from 'react';
import { FolderLayout, TabItem } from '../../../shared/components';
import { useTheme } from '../../../styles';

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'map', label: 'Map', path: '/map' },
  { id: 'explore', label: 'Explore', path: '/explore' },
];

export const DashboardPage: React.FC = () => {
  const { theme, tokens } = useTheme();

  const getStyles = () => ({
    container: {
      padding: tokens.spacing[6],
    },
    title: {
      ...tokens.typography.headline.large,
      color: theme.onSurface,
      marginBottom: tokens.spacing[4],
    },
    content: {
      ...tokens.typography.body.large,
      color: theme.onSurfaceVariant,
      lineHeight: 1.6,
    },
    section: {
      marginBottom: tokens.spacing[6],
    },
    sectionTitle: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      marginBottom: tokens.spacing[3],
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: tokens.spacing[4],
      marginTop: tokens.spacing[4],
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
    },
  });

  const styles = getStyles();

  const handleMenuClick = () => {
    console.log('Dashboard menu clicked');
  };

  return (
    <FolderLayout title="Dashboard Overview" tabs={tabs} onMenuClick={handleMenuClick}>
      <div style={styles.container} data-testid="dashboard-page">
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Stats</h2>
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3>Active Quests</h3>
              <div style={styles.content}>12</div>
            </div>
            <div style={styles.card}>
              <h3>Completed Today</h3>
              <div style={styles.content}>3</div>
            </div>
            <div style={styles.card}>
              <h3>Total Experience</h3>
              <div style={styles.content}>15,420 XP</div>
            </div>
            <div style={styles.card}>
              <h3>Current Level</h3>
              <div style={styles.content}>Level 25</div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Activity</h2>
          <div style={styles.content}>
            <ul>
              <li>Completed "Ancient Forest Exploration" quest</li>
              <li>Discovered new area: Crystal Caverns</li>
              <li>Leveled up to Level 25</li>
              <li>Unlocked new skill: Advanced Navigation</li>
            </ul>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Goals & Progress</h2>
          <div style={styles.content}>
            <p>Track your progress toward personal and quest-related goals.</p>

            <h4>Current Focus:</h4>
            <ul>
              <li>Reach Level 30 (Progress: 83%)</li>
              <li>Complete 5 exploration quests (Progress: 60%)</li>
              <li>Discover 10 new locations (Progress: 70%)</li>
            </ul>
          </div>
        </div>
      </div>
    </FolderLayout>
  );
};