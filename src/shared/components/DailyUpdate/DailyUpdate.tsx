import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { Button } from '../Button';
import folderImage from '../../assets/images/folder.png';
import mapIcon from '../../assets/images/map_icon.png';

export interface DailyUpdateProps {
  className?: string;
}

export const DailyUpdate: React.FC<DailyUpdateProps> = () => {
  const navigate = useNavigate();
  const { theme, tokens } = useTheme();

  const getStyles = () => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme.surface,
      border: `2px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      position: 'relative' as const,
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: tokens.shadows.medium,
    },
    leftContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[3],
      alignItems: 'flex-start', // Left align content
    },
    header: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
      textAlign: 'left' as const,
    },
    rightContent: {
      position: 'absolute' as const,
      top: '-60px', // Position above the main component
      right: tokens.spacing[6],
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: tokens.spacing[3],
    },
    folderButton: {
      backgroundColor: '#ffffff', // White background
      border: `2px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6], // Larger padding
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: tokens.spacing[2],
      transition: 'all 0.2s ease',
      position: 'relative' as const,
      boxShadow: tokens.shadows.medium,
    },
    folderButtonHover: {
      backgroundColor: '#f5f5f5',
      transform: 'translateY(-2px)',
    },
    folderImage: {
      width: '96px', // Larger image
      height: '96px',
      objectFit: 'contain' as const,
    },
    folderTitle: {
      ...tokens.typography.label.medium,
      color: theme.onSurface,
      margin: 0,
      fontWeight: 600,
    },
    mapButton: {
      backgroundColor: '#ffffff', // White background
      border: `2px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6], // Larger padding
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: tokens.spacing[2],
      transition: 'all 0.2s ease',
      position: 'relative' as const,
      boxShadow: tokens.shadows.medium,
    },
    mapButtonHover: {
      backgroundColor: '#f5f5f5',
      transform: 'translateY(-2px)',
    },
    mapImage: {
      width: '96px', // Larger image
      height: '96px',
      objectFit: 'contain' as const,
    },
    mapTitle: {
      ...tokens.typography.label.medium,
      color: theme.onSurface,
      margin: 0,
      fontWeight: 600,
    },
  });

  const styles = getStyles();

  const handleGetStarted = () => {
    navigate('/chat');
  };

  const handleFolderClick = () => {
    navigate('/dashboard');
  };

  const handleMapClick = () => {
    navigate('/map');
  };

  return (
    <div style={styles.container} data-testid="daily-update">
      <div style={styles.leftContent}>
        <h2 style={styles.header}>Today: Setting goals</h2>
        <Button
          variant="filled"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>

      <div style={styles.rightContent}>
        <button
          style={styles.mapButton}
          onClick={handleMapClick}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, styles.mapButtonHover);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = styles.mapButton.backgroundColor;
            e.currentTarget.style.transform = 'none';
          }}
          data-testid="map-button"
        >
          <img
            src={mapIcon}
            alt="Map"
            style={styles.mapImage}
          />
          <span style={styles.mapTitle}>Map</span>
        </button>

        <button
          style={styles.folderButton}
          onClick={handleFolderClick}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, styles.folderButtonHover);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = styles.folderButton.backgroundColor;
            e.currentTarget.style.transform = 'none';
          }}
          data-testid="folder-button"
        >
          <img
            src={folderImage}
            alt="Folder"
            style={styles.folderImage}
          />
          <span style={styles.folderTitle}>Folder</span>
        </button>
      </div>
    </div>
  );
};