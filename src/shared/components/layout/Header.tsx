// Header.tsx
/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton, NavButton, Button } from '@shared/components'; // ensure Button exists
import { useTheme } from '@/styles/providers/hooks';
import { Transparent } from '../surfaces';
import galaxyLogo from '@/shared/assets/images/Galaxy Launchpad Logo 1.png';

export interface HeaderProps {
  pageName?: string;
  className?: string;
  navMode?: 'launchpad' | 'admin';
  showNav?: boolean;

  /** NEW */
  variant?: 'global' | 'utility';
  leftAction?: { type: 'back' | 'close'; label?: string; onClick?: () => void };
  rightAction?: { label: string; onClick: () => void; ariaLabel?: string };
}

export const Header = ({
  pageName,
  className,
  navMode = 'launchpad',
  showNav = true,
  variant = 'global',
  leftAction,
  rightAction,
}: HeaderProps) => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const headerStyles: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing[6],
  };

  const logoStyles: CSSObject = {
    width: '48px',
    height: 'auto',
    display: 'block',
    transition: tokens.transitions.normal,
  };

  const handleUserClick = () => navigate(navMode === 'admin' ? '/admin/account' : '/account');

  const renderAdminLinks = () => (
    <>
      <NavButton
        icon="dashboard"
        variant="text"
        align="left"
        active={location.pathname === '/admin/dashboard'}
        onClick={() => navigate('/admin/dashboard')}
        aria-label="Dashboard"
        data-testid="admin-dashboard-button"
      >
        Dashboard
      </NavButton>
      <NavButton
        icon="map"
        variant="text"
        align="left"
        active={location.pathname === '/admin/quests'}
        onClick={() => navigate('/admin/quests')}
        aria-label="Quests"
        data-testid="admin-quests-button"
      >
        Quests
      </NavButton>
    </>
  );

  const renderLaunchpadLinks = () => (
    <>
      <NavButton
        icon="home"
        variant="text"
        align="left"
        active={location.pathname === '/home'}
        onClick={() => navigate('/home')}
        aria-label="Home"
        data-testid="home-button"
      >
        Home
      </NavButton>
      <NavButton
        icon="chat"
        variant="text"
        align="left"
        active={location.pathname === '/chat'}
        onClick={() => navigate('/chat')}
        aria-label="Chat"
        data-testid="chat-button"
      >
        Chat
      </NavButton>
      <NavButton
        icon="person"
        variant="text"
        align="left"
        active={location.pathname === '/profile'}
        onClick={() => navigate('/profile')}
        aria-label="Profile"
        data-testid="profile-button"
      >
        Profile
      </NavButton>
      <NavButton
        icon="map"
        variant="text"
        align="left"
        active={location.pathname === '/quests'}
        onClick={() => navigate('/quests')}
        aria-label="Quests"
        data-testid="quests-button"
      >
        Quests
      </NavButton>
      <NavButton
        icon="search"
        variant="text"
        align="left"
        active={location.pathname === '/explore'}
        onClick={() => navigate('/explore')}
        aria-label="Explore"
        data-testid="explore-button"
      >
        Explore
      </NavButton>
    </>
  );

  // ——— Utility header layout ———
  if (variant === 'utility') {
    return (
      <Transparent as="header" className={className} css={headerStyles}>
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* Left action: back/close */}
          {leftAction && (
            <IconButton
              icon={leftAction.type === 'back' ? 'arrow_back' : 'close'}
              variant="standard"
              aria-label={leftAction.type === 'back' ? (leftAction.label || 'Back') : (leftAction.label || 'Close')}
              onClick={leftAction.onClick ?? (() => navigate(-1))}
            />
          )}

          {/* Title */}
          <h1 css={{ ...tokens.typography.headline.large, color: colors.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {pageName}
          </h1>
        </div>

        {/* Right action (Done / Save) */}
        <div>
          {rightAction && (
            <Button
              variant="filled"
              aria-label={rightAction.ariaLabel || rightAction.label}
              onClick={rightAction.onClick}
            >
              {rightAction.label}
            </Button>
          )}
        </div>
      </Transparent>
    );
  }

  // ——— Global header layout (default) ———
  return (
    <Transparent as="header" className={className} css={headerStyles}>
      <img src={galaxyLogo} alt="Galaxy Launchpad" css={logoStyles} />
      <h1 css={{ ...tokens.typography.headline.large, color: colors.primary }}>
        {pageName}
      </h1>

      {showNav && (
        <>
          <div
            css={{
              flex: 1,
              marginLeft: tokens.spacing[4],
              marginRight: tokens.spacing[4],
              display: 'flex',
            }}
          >
            <div
              css={{
                display: 'flex',
                gap: tokens.spacing[2],
                alignItems: 'center',
                backgroundColor: colors.surface,
                padding: tokens.spacing[2],
                borderRadius: tokens.borderRadius.large,
              }}
            >
              {navMode === 'admin' ? renderAdminLinks() : renderLaunchpadLinks()}
            </div>
          </div>

          <IconButton
            icon="person"
            variant="standard"
            onClick={handleUserClick}
            style={{ width: '48px', height: '48px', backgroundColor: 'white' }}
          />
        </>
      )}
    </Transparent>
  );
};
