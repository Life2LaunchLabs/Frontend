import React from 'react';
import { FolderLayout, TabItem } from '../../../shared/components';
import { useTheme } from '../../../styles';

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'explore', label: 'Explore', path: '/explore' },
];

export const ExplorePage: React.FC = () => {
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
  });

  const styles = getStyles();

  const handleMenuClick = () => {
    console.log('Explore menu clicked');
  };

  return (
    <FolderLayout title="Explore & Discover" tabs={tabs} onMenuClick={handleMenuClick}>
      <div style={styles.container} data-testid="explore-page">
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Random Encounters</h2>
          <div style={styles.content}>
            <p>Venture into the unknown and discover mysterious locations, hidden treasures, and unexpected adventures.</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Discovery Log</h2>
          <div style={styles.content}>
            <p>Track your discoveries and unlock achievements as you explore new territories.</p>

            <h4>Recent Discoveries:</h4>
            <ul>
              <li>Ancient Forest Shrine</li>
              <li>Crystal Cave Network</li>
              <li>Abandoned Watchtower</li>
            </ul>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Exploration Tools</h2>
          <div style={styles.content}>
            <p>Equip yourself with the right tools for your adventures:</p>
            <ul>
              <li>Compass & Navigation</li>
              <li>Resource Scanner</li>
              <li>Weather Tracker</li>
              <li>Wildlife Guide</li>
            </ul>
          </div>
        </div>
      </div>
    </FolderLayout>
  );
};