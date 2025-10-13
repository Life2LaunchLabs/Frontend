/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode, forwardRef, HTMLAttributes } from 'react';
import { useTheme } from '@/styles/providers/hooks';

export interface SolidProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'header' | 'footer' | 'aside' | 'nav';
  css?: CSSObject;
}

/**
 * Solid - Anchoring elements (Header, Footer, NavSidebar)
 *
 * Launchpad: Dark blue-black solid with subtle border
 * Admin: Light solid with subtle bottom/top border
 */
export const Solid = forwardRef<HTMLElement, SolidProps>(
  ({ children, className, as: Component = 'div', css: customCss, ...props }, ref) => {
    const { mode, colors, tokens } = useTheme();

    const baseStyles: CSSObject = {
      background: colors.surface,
      position: 'relative',
      zIndex: 100,
    };

    const modeStyles: CSSObject = mode === 'launchpad'
      ? {
          border: `1px solid ${colors.outline}`,
          boxShadow: 'none',
        }
      : {
          borderBottom: `1px solid ${colors.outline}`,
          boxShadow: 'none',
        };

    const combinedStyles: CSSObject = {
      ...baseStyles,
      ...modeStyles,
      ...customCss,
    };

    return (
      <Component
        ref={ref as any}
        className={className}
        css={combinedStyles}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Solid.displayName = 'Solid';
