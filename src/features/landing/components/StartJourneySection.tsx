/** @jsxImportSource @emotion/react */
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/styles/providers/hooks';
import { Button } from '@shared/components';
import { SectionCentered } from './SectionCentered';

export const StartJourneySection = () => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();

  return (
    <SectionCentered>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[6],
          alignItems: 'center',
        }}
      >
        <h2 css={{ ...tokens.typography.display.medium, color: colors.onSurface }}>
          Ready to Start Your Journey?
        </h2>
        <p css={{ ...tokens.typography.body.large, color: colors.onSurfaceVariant, lineHeight: 1.6 }}>
          Join thousands of young adults taking control of their future with Launchpad.
        </p>
        <Button variant="filled" size="large" onClick={() => navigate('/welcome')}>
          Get Started
        </Button>
      </div>
    </SectionCentered>
  );
};
