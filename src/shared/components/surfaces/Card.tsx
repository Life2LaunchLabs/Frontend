/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode, forwardRef } from 'react';
import { useTheme } from '@/styles/providers/hooks';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  css?: CSSObject;
}

/**
 * Card - Interactive items with distinctive 45° angled corner
 *
 * Features:
 * - Angled bottom-right corner (45°)
 * - Impact outline in Launchpad mode
 * - Hover effects when interactive
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, onClick, interactive = !!onClick, css: customCss, ...props }, ref) => {
    const { mode, colors, tokens } = useTheme();

    const baseStyles: CSSObject = {
      position: 'relative',
      borderRadius: 0,
      // Angled corner: 45° cut on bottom-right
      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
      padding: tokens.spacing[4],
      transition: `all ${tokens.transitions.normal}`,
      cursor: interactive ? 'pointer' : 'default',
    };

    const launchpadStyles: CSSObject = {
      background: colors.surfaceDark,
      border: `1px solid ${colors.outlineImpact}`,
      boxShadow: tokens.shadows.small,
    };

    const adminStyles: CSSObject = {
      background: colors.surface,
      border: `1px solid ${colors.outline}`,
      boxShadow: tokens.shadows.medium,
    };

    const interactiveStyles: CSSObject = interactive
      ? {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'launchpad' ? tokens.shadows.medium : tokens.shadows.large,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: `2px solid ${mode === 'launchpad' ? colors.outlineImpact : (colors as any).accentPrimary}`,
            outlineOffset: '2px',
          },
        }
      : {};

    const modeStyles = mode === 'launchpad' ? launchpadStyles : adminStyles;

    const combinedStyles: CSSObject = {
      ...baseStyles,
      ...modeStyles,
      ...interactiveStyles,
      ...customCss,
    };

    return (
      <div
        ref={ref}
        className={className}
        css={combinedStyles}
        onClick={onClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for Card structure
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  const { colors, tokens } = useTheme();

  return (
    <div
      className={className}
      css={{
        marginBottom: tokens.spacing[3],
        color: colors.textPrimary,
        ...tokens.typography.title.medium,
      }}
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className }: CardContentProps) => {
  const { colors, tokens } = useTheme();

  return (
    <div
      className={className}
      css={{
        color: colors.textSecondary,
        ...tokens.typography.body.medium,
      }}
    >
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className }: CardFooterProps) => {
  const { tokens } = useTheme();

  return (
    <div
      className={className}
      css={{
        marginTop: tokens.spacing[4],
        display: 'flex',
        gap: tokens.spacing[2],
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </div>
  );
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
