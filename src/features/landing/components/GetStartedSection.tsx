/** @jsxImportSource @emotion/react */
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/styles/providers/hooks';
import { Button } from '@shared/components';

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
        <div css={{ ...tokens.typography.title.large, fontWeight: 600 }}>
          Launchpad
        </div>
        <Button variant="outlined" onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>

      {/* Content area - centered */}
      <div
        css={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: tokens.spacing[6],
          padding: tokens.spacing[6],
          textAlign: 'center',
        }}
      >
        <h1
          css={{
            ...tokens.typography.display.large,
            maxWidth: '800px',
            color: colors.onSurface,
          }}
        >
          Discover the resources you need to launch your life with confidence
        </h1>
        <Button variant="filled" size="large" onClick={() => navigate('/welcome')}>
          Get Started
        </Button>
      </div>
    </div>
  );
};
