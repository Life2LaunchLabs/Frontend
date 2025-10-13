import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { Button } from '../../../shared/components';

export const AdminNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, tokens } = useTheme();

  const getStyles = () => ({
    navbar: {
      backgroundColor: colors.surfaceVariant,
      borderBottom: `1px solid ${colors.outline}`,
      padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[6],
      boxShadow: tokens.shadows.small,
    },
    title: {
      ...tokens.typography.headline.medium,
      color: colors.onSurface,
      marginRight: tokens.spacing[8],
    },
    navItems: {
      display: 'flex',
      gap: tokens.spacing[4],
      alignItems: 'center',
    },
  });

  const styles = getStyles();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>Admin Panel</h1>

      <div style={styles.navItems}>
        <Button
          variant={isActive('/admin/dashboard') ? 'filled' : 'text'}
          onClick={() => navigate('/admin/dashboard')}
        >
          Dashboard
        </Button>

        <Button
          variant={isActive('/admin/quests') ? 'filled' : 'text'}
          onClick={() => navigate('/admin/quests')}
        >
          Quests
        </Button>
      </div>
    </nav>
  );
};