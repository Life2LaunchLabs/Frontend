/** @jsxImportSource @emotion/react */
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/styles/providers/hooks';
import { Button } from '@shared/components';
import acornTalk from '@shared/assets/images/acorn_talk.png';
import launchpadDomeLogo from '@shared/assets/images/launchpad_dome_logo.png';

export const GetStartedSection = () => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      css={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        }}
      >
        <img
          src={launchpadDomeLogo}
          alt="Launchpad"
          css={{
            height: '40px',
            width: 'auto',
          }}
        />
        <Button variant="outlined" onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>

      {/* Content area - two horizontal halves */}
      <div
        css={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[8],
          padding: tokens.spacing[6],
          background: 'transparent',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            justifyContent: 'center',
            gap: tokens.spacing[4],
          },
        }}
      >
        {/* Left side - acorn image (right-aligned) */}
        <div
          css={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            '@media (max-width: 768px)': {
              justifyContent: 'center',
              flex: 'none',
            },
          }}
        >
          <img
            src={acornTalk}
            alt="Acorn"
            css={{
              maxWidth: '400px',
              width: '100%',
              height: 'auto',
              '@media (max-width: 768px)': {
                maxWidth: '80px',
              },
            }}
          />
        </div>

        {/* Right side - text and button (left-aligned) */}
        <div
          css={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing[4],
            alignItems: 'flex-start',
            '@media (max-width: 768px)': {
              alignItems: 'center',
              flex: 'none',
            },
          }}
        >
          <h1
            css={{
              ...tokens.typography.display.large,
              color: colors.onSurface,
              textAlign: 'left',
              '@media (max-width: 768px)': {
                ...tokens.typography.display.small,
                textAlign: 'center',
              },
            }}
          >
            Ready to take control of your life launching journey?
          </h1>
          <Button variant="filled" onClick={() => navigate('/welcome')}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
