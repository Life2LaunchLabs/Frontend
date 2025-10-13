/** @jsxImportSource @emotion/react */
import {
  PageBackground,
  Header,
  ContentArea,
  NavSidebar,
  Footer,
  Pane,
  Card,
} from '@shared/components';
import { useTheme } from '@styles';

/**
 * Example demonstrating the new design system
 *
 * Shows:
 * - Launchpad mode (dark, glassmorphic)
 * - Admin mode (light, clean)
 * - Surface components (Solid, Pane, Card)
 * - Layout system
 */
export const DesignSystemExample = () => {
  const { mode, colors, tokens, setMode } = useTheme();

  return (
    <PageBackground>
      <Header>
        <h1 css={{ ...tokens.typography.headline.medium, color: colors.textPrimary }}>
          Launchpad
        </h1>
        <button
          onClick={() => setMode(mode === 'launchpad' ? 'admin' : 'launchpad')}
          css={{
            padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
            background: colors.accentPrimary,
            color: '#ffffff',
            border: 'none',
            borderRadius: tokens.borderRadius.medium,
            cursor: 'pointer',
            ...tokens.typography.label.large,
            transition: tokens.transitions.normal,
            '&:hover': {
              background: (colors as any).accentPrimaryHover,
            },
          }}
        >
          Switch to {mode === 'launchpad' ? 'Admin' : 'Launchpad'} Mode
        </button>
      </Header>

      <NavSidebar>
        <div css={{ ...tokens.typography.label.large, color: colors.textPrimary }}>
          Navigation
        </div>
        <div css={{ ...tokens.typography.body.small, color: colors.textSecondary }}>
          Dashboard
        </div>
        <div css={{ ...tokens.typography.body.small, color: colors.textSecondary }}>
          Profile
        </div>
        <div css={{ ...tokens.typography.body.small, color: colors.textSecondary }}>
          Settings
        </div>
      </NavSidebar>

      <ContentArea hasMenu centered>
        <Pane css={{ marginBottom: tokens.spacing[6] }}>
          <h2 css={{ ...tokens.typography.headline.small, color: colors.textPrimary }}>
            Design System Demo - {mode === 'launchpad' ? 'Launchpad' : 'Admin'} Mode
          </h2>
          <p css={{ ...tokens.typography.body.medium, color: colors.textSecondary }}>
            This demonstrates the new design system with glassmorphic effects, proper spacing,
            and mode-aware theming.
          </p>
        </Pane>

        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: tokens.spacing[4],
          }}
        >
          <Card interactive>
            <Card.Header>Interactive Card</Card.Header>
            <Card.Content>
              This card has hover effects and the distinctive 45° angled corner.
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>Static Card</Card.Header>
            <Card.Content>
              This card is not interactive. Notice the angled bottom-right corner.
            </Card.Content>
          </Card>

          <Card interactive onClick={() => alert('Card clicked!')}>
            <Card.Header>Clickable Card</Card.Header>
            <Card.Content>Click me to see the action!</Card.Content>
          </Card>
        </div>
      </ContentArea>

      <Footer>
        <div css={{ ...tokens.typography.body.small, color: colors.textSecondary }}>
          © 2025 Launchpad
        </div>
        <div css={{ ...tokens.typography.body.small, color: colors.textSecondary }}>
          Mode: {mode}
        </div>
      </Footer>
    </PageBackground>
  );
};
