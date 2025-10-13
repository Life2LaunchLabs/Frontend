/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode } from 'react';
import { useTheme } from '@/styles/providers/hooks';
import { Solid } from '../surfaces';

export interface FooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Footer - Bottom navigation/info area
 *
 * Uses Solid component with footer-specific styles
 */
export const Footer = ({ children, className }: FooterProps) => {
  const { mode, tokens } = useTheme();

  const footerStyles: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...(mode === 'admin' && {
      borderTop: `1px solid ${tokens.shadows.none}`,
      borderBottom: 'none',
    }),
  };

  return (
    <Solid as="footer" className={className} css={footerStyles}>
      {children}
    </Solid>
  );
};
