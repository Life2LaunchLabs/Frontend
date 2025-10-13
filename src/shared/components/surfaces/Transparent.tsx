/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode, forwardRef } from 'react';
import { useTheme } from '@/styles/providers/hooks';

export interface TransparentProps {
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
export const Transparent = forwardRef<HTMLElement, TransparentProps>(
  ({ children, className, as: Component = 'div', css: customCss, ...props }, ref) => {
    const { mode } = useTheme();

    const baseStyles: CSSObject = {
      position: 'relative',
      zIndex: 100,
    };

    const modeStyles: CSSObject = mode === 'launchpad'
      ? {
          borderRadius: 0,
          boxShadow: 'none',
        }
      : {
          borderRadius: 0,
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

Transparent.displayName = 'Transparent';
