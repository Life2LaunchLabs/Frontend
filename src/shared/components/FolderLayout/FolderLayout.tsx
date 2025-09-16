import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { FolderCard } from '../FolderCard';
import { FolderTabNav, TabItem } from '../FolderTabNav';
import { IconButton } from '../IconButton';
import trainCarImage from '../../assets/images/train_car.png';

export interface FolderLayoutProps {
  title: string;
  children: React.ReactNode;
  tabs: TabItem[];
  onMenuClick?: () => void;
}

export const FolderLayout: React.FC<FolderLayoutProps> = ({
  title,
  children,
  tabs,
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const { tokens } = useTheme();

  const getStyles = () => ({
    pageContainer: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${trainCarImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      margin: 0,
      padding: 0,
    },
    blurOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    contentContainer: {
      position: 'relative' as const,
      zIndex: 1,
      padding: tokens.spacing[6],
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      boxSizing: 'border-box' as const,
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[4],
    },
    closeButton: {
      alignSelf: 'flex-start',
    },
    mainContainer: {
      flex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0,
    },
    tabNavContainer: {
      alignSelf: 'flex-start',
    },
    folderContainer: {
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0,
    },
  });

  const styles = getStyles();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div style={styles.pageContainer} data-testid="folder-layout">
      <div style={styles.blurOverlay} />
      <div style={styles.contentContainer}>
        <div style={styles.topBar}>
          <div style={styles.closeButton}>
            <IconButton
              icon="close"
              onClick={handleClose}
              variant="outlined"
            />
          </div>
        </div>

        <div style={styles.mainContainer}>
          <div style={styles.tabNavContainer}>
            <FolderTabNav tabs={tabs} />
          </div>

          <div style={styles.folderContainer}>
            <FolderCard title={title} onMenuClick={onMenuClick}>
              {children}
            </FolderCard>
          </div>
        </div>
      </div>
    </div>
  );
};