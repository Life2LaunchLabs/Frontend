import React from 'react';
import { useTheme } from '../../../styles';

export interface FolderTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  zIndex?: number;
  isFirst?: boolean;
}

export const FolderTab: React.FC<FolderTabProps> = ({
  label,
  isActive,
  onClick,
  zIndex = 1,
  isFirst = false,
}) => {
  const { theme, tokens } = useTheme();

  const getStyles = () => ({
    tab: {
      position: 'relative' as const,
      background: isActive ? '#e6dbc3' : '#b8a687', // Manila color when active, darker when not
      color: isActive ? theme.onSurface : theme.onSurfaceVariant,
      border: 'none',
      cursor: 'pointer',
      padding: `${tokens.spacing[3]}px ${tokens.spacing[6]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      fontWeight: isActive ? 600 : 400,
      transition: 'all 0.2s ease',
      minWidth: '120px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Trapezoid shape using clip-path
      clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
      marginLeft: isFirst ? '0px' : '-8px', // Overlap tabs except first
      zIndex: zIndex,
      borderTop: isActive ? '2px solid #ffffff' : 'none',
      borderLeft: isActive ? '2px solid #ffffff' : 'none',
      borderRight: isActive ? '2px solid #ffffff' : 'none',
      // Adjust clip-path to account for borders when active
      ...(isActive && {
        clipPath: 'polygon(15% 0%, 85% 0%, 97% 100%, 3% 100%)',
      }),
    },
    tabHover: {
      background: isActive ? '#e6dbc3' : '#c4b094',
      transform: 'translateY(-1px)',
    },
  });

  const styles = getStyles();

  return (
    <button
      style={styles.tab}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = styles.tabHover.background;
          e.currentTarget.style.transform = styles.tabHover.transform;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = '#b8a687';
          e.currentTarget.style.transform = 'none';
        }
      }}
      data-testid={`folder-tab-${label.toLowerCase()}`}
    >
      {label}
    </button>
  );
};