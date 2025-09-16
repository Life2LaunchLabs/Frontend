import React from 'react';
import { useTheme } from '../../../styles';
import { Icon } from '../Icon';

export interface FolderCardProps {
  title: string;
  children: React.ReactNode;
  onMenuClick?: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  title,
  children,
  onMenuClick,
}) => {
  const { theme, tokens } = useTheme();

  const getStyles = () => ({
    container: {
      backgroundColor: '#e6dbc3', // Manila color
      border: `2px solid #ffffff`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
      boxShadow: tokens.shadows.medium,
      marginTop: '-2px', // Overlap with tab nav
      zIndex: 5, // Above inactive tabs (0) but below active tab (10)
      height: '100%',
      minHeight: 0,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[4],
      borderBottom: `1px solid ${theme.outline}`,
      paddingBottom: tokens.spacing[3],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
    },
    menuButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: tokens.spacing[2],
      borderRadius: tokens.borderRadius.small,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease',
    },
    menuButtonHover: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    content: {
      flex: 1,
      overflow: 'visible',
      minHeight: 0,
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.container} data-testid="folder-card">
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        {onMenuClick && (
          <button
            style={styles.menuButton}
            onClick={onMenuClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = styles.menuButtonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Icon name="more_vert" typography="title-medium" color="surface" />
          </button>
        )}
      </div>
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
};