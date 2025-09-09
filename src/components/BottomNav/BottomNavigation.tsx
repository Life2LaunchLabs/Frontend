import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';

export interface NavItem {
  id: string;
  path: string;
  icon: string;
  label: string;
}

export interface BottomNavigationProps {
  items?: NavItem[];
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  items: customItems,
  className 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, tokens } = useTheme();

  const defaultItems: NavItem[] = [
    {
      id: 'home',
      path: '/home',
      icon: 'home',
      label: 'Home'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: 'person',
      label: 'Profile'
    },
    {
      id: 'quests',
      path: '/quests',
      icon: 'assignment',
      label: 'Quests'
    },
    {
      id: 'shop',
      path: '/shop',
      icon: 'shopping_bag',
      label: 'Shop'
    },
    {
      id: 'discover',
      path: '/discover',
      icon: 'explore',
      label: 'Discover'
    }
  ];

  const navItems = customItems || defaultItems;

  const isActivePath = (path: string): boolean => {
    return location.pathname === path;
  };

  const getContainerStyles = () => ({
    margin: tokens.spacing[4],
    marginTop: 0,
    backgroundColor: theme.surfaceContainer,
    borderRadius: tokens.borderRadius.xl,
    border: `1px solid ${theme.onSurfaceVariant}40`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8px)'
  });

  const getNavContainerStyles = () => ({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: tokens.spacing[2]
  });

  return (
    <div 
      className={className}
      style={getContainerStyles()}
      data-testid="bottom-navigation"
    >
      <div style={getNavContainerStyles()}>
        {navItems.map((item) => {
          const isActive = isActivePath(item.path);
          
          const getItemStyles = () => ({
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            padding: tokens.spacing[3],
            borderRadius: tokens.borderRadius.medium,
            backgroundColor: isActive ? theme.primaryContainer : 'transparent',
            color: isActive ? theme.onPrimaryContainer : theme.onSurfaceVariant,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            minWidth: '48px',
            minHeight: '48px'
          });

          const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = `${theme.onSurface}10`;
              e.currentTarget.style.color = theme.onSurface;
            }
          };

          const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.onSurfaceVariant;
            }
          };

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={getItemStyles()}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-active={isActive}
              data-testid={`nav-item-${item.id}`}
            >
              <div style={{ marginBottom: tokens.spacing[1] }}>
                <Icon 
                  name={item.icon} 
                  typography="title-medium" 
                  color="inherit" 
                  active={isActive}
                />
              </div>
              <span style={{
                ...tokens.typography.label.small,
                color: 'inherit'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};