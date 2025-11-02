/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode, forwardRef } from 'react';
import { useTheme } from '@/styles/providers/hooks';
import { glassify } from '@/styles/tokens';

export interface PaneProps {
  children: ReactNode;
  className?: string;
  css?: CSSObject;
  invisible?: boolean;
}

/**
 * Pane - Content containers with glassmorphic effects
 *
 * Launchpad: Glassmorphic with blur, transparency, and inner glow
 * Admin: Solid fill with subtle shadow
 */
export const Pane = forwardRef<HTMLDivElement, PaneProps>(
  ({ children, className, css: customCss, invisible = false, ...props }, ref) => {
    const { mode, colors, tokens } = useTheme();

    const baseStyles: CSSObject = {
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      '@media (max-width: 768px)': {
        padding: invisible ? tokens.spacing[2] : tokens.spacing[4],
      },
    };

    const surfaceColor = mode === 'launchpad'
      ? (colors as typeof import('@/styles/tokens').launchpadColors).surface
      : (colors as typeof import('@/styles/tokens').adminColors).surface;

    const launchpadStyles: CSSObject = glassify(
      surfaceColor,
      0.4,
      {
        blur: tokens.blur.medium,
        borderColor: colors.outline,
        shadow: tokens.shadows.pane,
      }
    );

    const adminStyles: CSSObject = {
      background: (colors as any).surfaceVariant || colors.surfaceContainer,
      border: `1px solid ${colors.outline}`,
      boxShadow: tokens.shadows.pane,
    };

    const invisibleStyles: CSSObject = {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    };

    const modeStyles = invisible ? invisibleStyles : (mode === 'launchpad' ? launchpadStyles : adminStyles);

    const combinedStyles: CSSObject = {
      ...baseStyles,
      ...modeStyles,
      ...customCss,
    };

    return (
      <div
        ref={ref}
        className={className}
        css={combinedStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Pane.displayName = 'Pane';
