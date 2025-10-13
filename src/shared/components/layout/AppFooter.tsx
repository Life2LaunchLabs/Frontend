/** @jsxImportSource @emotion/react */
import { useTheme } from '../../../styles';
import { Footer } from './Footer';
import { Solid } from '../surfaces';

/**
 * AppFooter - Standard application footer with links
 *
 * This is a pre-configured Footer with standard content.
 * Use this instead of manually adding Footer content everywhere.
 */
export const AppFooter = () => {
  const { colors, tokens } = useTheme();

  return (
    <Footer css={{
        padding: tokens.spacing[6], paddingTop: tokens.spacing[3] }}>
      <div css={{ 
        display: 'flex', 
        gap: tokens.spacing[4], 
        alignItems: 'center',
        }}>
        <span css={{ ...tokens.typography.body.small, color: colors.onSurfaceVariant }}>
          © 2025 Launchpad
        </span>
        <a
          href="/privacy"
          css={{
            ...tokens.typography.body.small,
            color: colors.onSurfaceVariant,
            '&:hover': { color: colors.primary },
          }}
        >
          Privacy
        </a>
        <a
          href="/terms"
          css={{
            ...tokens.typography.body.small,
            color: colors.onSurfaceVariant,
            '&:hover': { color: colors.primary },
          }}
        >
          Terms
        </a>
      </div>
      <div css={{ ...tokens.typography.body.small, color: colors.onSurfaceVariant }}>
        AI-Powered Learning
      </div>
    </Footer>
  );
};
