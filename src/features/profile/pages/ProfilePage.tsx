import React from 'react';
import { FolderLayout, TabItem } from '../../../shared/components';
import { useTheme } from '../../../styles';
import {
  ProfileHeader,
} from '../components';

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'explore', label: 'Explore', path: '/explore' },
];

export const ProfilePage: React.FC = () => {
  const { tokens } = useTheme();

  const getStyles = () => ({
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      minHeight: 0,
    },
    scrollableContent: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: tokens.spacing[6],
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[8],
      minHeight: 0,
    },
  });

  const styles = getStyles();

  const handleMenuClick = () => {
    console.log('Profile menu clicked');
  };

  return (
    <FolderLayout title="Profile" tabs={tabs} onMenuClick={handleMenuClick}>
      <div style={styles.container} data-testid="profile-page">
        <div style={styles.scrollableContent}>
        <ProfileHeader />
        </div>
      </div>
    </FolderLayout>
  );
};