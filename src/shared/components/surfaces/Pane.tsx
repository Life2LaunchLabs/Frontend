/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode, forwardRef } from 'react';
import { useTheme } from '@/styles/providers/hooks';

export interface PaneProps {
  children: ReactNode;
  className?: string;
  css?: CSSObject;
}

/**
 * Pane - Content containers with glassmorphic effects
 *
 * Launchpad: Glassmorphic with blur, transparency, and inner glow
 * Admin: Solid fill with subtle shadow
 */
export const Pane = forwardRef<HTMLDivElement, PaneProps>(
  ({ children, className, css: customCss, ...props }, ref) => {
    const { mode, colors, tokens } = useTheme();

    const baseStyles: CSSObject = {
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
    };

    const launchpadStyles: CSSObject = {
      background: colors.glass,
      backdropFilter: `blur(${tokens.blur.medium})`,
      WebkitBackdropFilter: `blur(${tokens.blur.medium})`,
      border: `1px solid ${colors.outline}`,
      boxShadow: tokens.shadows.pane,
    };

    const adminStyles: CSSObject = {
      background: (colors as any).surfaceVariant || colors.surfaceContainer,
      border: `1px solid ${colors.outline}`,
      boxShadow: tokens.shadows.pane,
    };

    const modeStyles = mode === 'launchpad' ? launchpadStyles : adminStyles;

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
