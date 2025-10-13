/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/styles/providers/hooks';
import { Solid } from '../surfaces';
import { NavButton } from '@shared/components';
import galaxyLogo from '@/shared/assets/images/Galaxy Launchpad Logo 1.png';

export interface NavSidebarProps {
  className?: string;
  mode?: 'launchpad' | 'admin';
}

/**
 * NavSidebar - Side navigation menu
 *
 * Uses Solid component with sidebar-specific styles
 */
export const NavSidebar = ({ className, mode = 'launchpad' }: NavSidebarProps) => {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);
  const handleFocus = () => setIsExpanded(true);
  const handleBlur = (e: React.FocusEvent) => {
    // Only collapse if focus is leaving the sidebar completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsExpanded(false);
    }
  };

  const sidebarStyles: CSSObject = {
    left: 0,
    padding: tokens.spacing[4],
    borderRadius: tokens.borderRadius.large,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing[2],
    width: 'fit-content',
    transition: tokens.transitions.normal,
  };

  const logoStyles: CSSObject = {
    width: '48px',
    height: 'auto',
    display: 'block',
    transition: tokens.transitions.normal,
  };

  const renderAdminLinks = () => (
    <>
      <NavButton
        icon="dashboard"
        variant="text"
        align={isExpanded ? 'left' : 'center'}
        collapsed={!isExpanded}
        active={location.pathname === '/admin/dashboard'}
        onClick={() => navigate('/admin/dashboard')}
        aria-label="Dashboard"
        data-testid="admin-dashboard-button">
          Dashboard
      </NavButton>
      <NavButton
        icon="map"
        variant="text"
        align={isExpanded ? 'left' : 'center'}
        collapsed={!isExpanded}
        active={location.pathname === '/admin/quests'}
        onClick={() => navigate('/admin/quests')}
        aria-label="Quests"
        data-testid="admin-quests-button">
          Quests
      </NavButton>
    </>
  );

  const renderLaunchpadLinks = () => (
    <>
      <NavButton
        icon="home"
        variant="text"
        align={isExpanded ? 'left' : 'center'}
        collapsed={!isExpanded}
        active={location.pathname === '/home'}
        onClick={() => navigate('/home')}
        aria-label="Home"
        data-testid="home-button">
          Home
      </NavButton>
      <NavButton
        icon="chat"
        variant="text"
        align={isExpanded ? 'left' : 'center'}
        collapsed={!isExpanded}
        active={location.pathname === '/chat'}
        onClick={() => navigate('/chat')}
        aria-label="Chat"
        data-testid="chat-button">
          Chat
      </NavButton>
      <NavButton
        icon="person"
        variant="text"
        align={isExpanded ? 'left' : 'center'}
        collapsed={!isExpanded}
        active={location.pathname === '/profile'}
        onClick={() => navigate('/profile')}
        aria-label="Profile"
        data-testid="profile-button">
          Profile
      </NavButton>
      <NavButton
        icon="map"
        variant="text"
        align={isExpanded ? 'left' : 'center'}
        collapsed={!isExpanded}
        active={location.pathname === '/quests'}
        onClick={() => navigate('/quests')}
        aria-label="Quests"
        data-testid="quests-button">
          Quests
      </NavButton>
      <NavButton
        icon="search"
        variant="text"
        align={isExpanded ? 'left' : 'center'}
        collapsed={!isExpanded}
        active={location.pathname === '/discover'}
        onClick={() => navigate('/discover')}
        aria-label="Discover"
        data-testid="discover-button">
          Discover
      </NavButton>
    </>
  );

  return (
    <Solid
      as="aside"
      className={className}
      css={sidebarStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <img src={galaxyLogo} alt="Galaxy Launchpad" css={logoStyles} />
      {mode === 'admin' ? renderAdminLinks() : renderLaunchpadLinks()}
    </Solid>
  );
};
