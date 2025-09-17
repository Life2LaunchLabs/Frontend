import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { FolderTab } from '../FolderTab';

export interface TabItem {
  id: string;
  label: string;
  path: string;
}

export interface FolderTabNavProps {
  tabs: TabItem[];
}

export const FolderTabNav: React.FC<FolderTabNavProps> = ({ tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens } = useTheme();

  const getStyles = () => ({
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: '0px', // Connect to folder card
      paddingLeft: tokens.spacing[4],
      position: 'relative' as const,
    },
  });

  const styles = getStyles();

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div style={styles.container} data-testid="folder-tab-nav">
      {tabs.map((tab, index) => (
        <FolderTab
          key={tab.id}
          label={tab.label}
          isActive={location.pathname === tab.path}
          onClick={() => handleTabClick(tab.path)}
          zIndex={location.pathname === tab.path ? 10 : 0}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};