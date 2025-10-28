// Header.tsx
/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton, NavButton, Button } from '@shared/components'; // ensure Button exists
import { useTheme } from '@/styles/providers/hooks';
import { glassify } from '@/styles/tokens';
import { Transparent } from '../surfaces';
import galaxyLogo from '@/shared/assets/images/launchpad_dome_logo.png';

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
  const { colors, tokens, mode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const surfaceColor = mode === 'launchpad'
    ? (colors as typeof import('@/styles/tokens').launchpadColors).surface
    : (colors as typeof import('@/styles/tokens').adminColors).surface;

  const headerStyles: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing[6],
  };

  const logoStyles: CSSObject = {
    height: '3rem',
    width: 'auto',
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
        color={colors.onSurface}
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
        color={colors.onSurface}
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
        color={colors.onSurface}
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
        color={colors.onSurface}
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
        color={colors.onSurface}
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
        color={colors.onSurface}
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
        color={colors.onSurface}
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
          <h1 css={{ ...tokens.typography.headline.large, color: colors.onSurface, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                padding: tokens.spacing[2],
                borderRadius: tokens.borderRadius.xl,
                ...glassify(surfaceColor, 0.4, {
                  blur: tokens.blur.medium,
                  borderColor: colors.outline,
                  shadow: tokens.shadows.small,
                }),
              }}
            >
              {navMode === 'admin' ? renderAdminLinks() : renderLaunchpadLinks()}
            </div>
          </div>

          <IconButton
            icon="person"
            variant="standard"
            onClick={handleUserClick}
            color={colors.onSurface}
            style={{ width: '48px', height: '48px', backgroundColor: 'white' }}
          />
        </>
      )}
    </Transparent>
  );
};
