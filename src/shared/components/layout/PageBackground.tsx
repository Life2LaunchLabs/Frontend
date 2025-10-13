/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode } from 'react';
import { useTheme } from '@/styles/providers/hooks';
import auroraBg from '@/shared/assets/images/aurora_bg.png';

export interface PageBackgroundProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageBackground - Full-page background container
 *
 * Launchpad: Aurora background image with dark overlay
 * Admin: Solid light background color
 */
export const PageBackground = ({ children, className }: PageBackgroundProps) => {
  const { mode, colors } = useTheme();

  const baseStyles: CSSObject = {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
  };

  const launchpadStyles: CSSObject = {
    background: `
      linear-gradient(#00000080, #00000080),
      url(${auroraBg})
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  const adminStyles: CSSObject = {
    background: colors.surface,
  };

  const modeStyles = mode === 'launchpad' ? launchpadStyles : adminStyles;

  const combinedStyles: CSSObject = {
    ...baseStyles,
    ...modeStyles,
  };

  return (
    <div className={className} css={combinedStyles}>
      {children}
    </div>
  );
};
