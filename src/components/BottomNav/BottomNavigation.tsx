import { useNavigate, useLocation } from 'react-router-dom';
// import { designTokens } from '../design/tokens';
import { useTheme } from '../../theme';

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      path: '/home',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Home'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Profile'
    },
    {
      id: 'quests',
      path: '/quests',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 2L19 14H12L13 9L11 9L10 14H3L1 2H21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 18C7.55228 18 8 18.4477 8 19C8 19.5523 7.55228 20 7 20C6.44772 20 6 19.5523 6 19C6 18.4477 6.44772 18 7 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 18C16.5523 18 17 18.4477 17 19C17 19.5523 16.5523 20 16 20C15.4477 20 15 19.5523 15 19C15 18.4477 15.4477 18 16 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Quests'
    },
    {
      id: 'shop',
      path: '/shop',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Shop'
    },
    {
      id: 'discover',
      path: '/discover',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Discover'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div 
      className="mx-4 mb-4 backdrop-blur-sm rounded-2xl shadow-lg"
      style={{
        backgroundColor: designTokens.colors.surface.container + 'F0', // 94% opacity
        border: `2px solid ${designTokens.colors.border.secondary}60`,
        boxShadow: designTokens.shadows.xl,
      }}
    >
      <div 
        className="flex justify-around items-center"
        style={{ padding: designTokens.spacing.sm }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center rounded-lg transition-all duration-200"
            style={{
              padding: designTokens.spacing.md,
              borderRadius: designTokens.borderRadius.lg,
              backgroundColor: isActivePath(item.path) 
                ? designTokens.colors.primary.container 
                : 'transparent',
              color: isActivePath(item.path)
                ? designTokens.colors.primary.main
                : designTokens.colors.onSurface.secondary,
            }}
            onMouseEnter={(e) => {
              if (!isActivePath(item.path)) {
                e.target.style.backgroundColor = designTokens.colors.hover.surface;
                e.target.style.color = designTokens.colors.onSurface.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActivePath(item.path)) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = designTokens.colors.onSurface.secondary;
              }
            }}
          >
            <div style={{ marginBottom: designTokens.spacing.xs }}>
              {item.icon}
            </div>
            <span 
              className="font-medium"
              style={{
                fontSize: designTokens.typography.fontSize.xs,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNavigation;