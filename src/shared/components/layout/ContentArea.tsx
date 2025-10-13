/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ReactNode } from 'react';
import { useTheme } from '@/styles/providers/hooks';

export interface ContentAreaProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  verticalCenter?: boolean;
  maxWidth?: string;
}

/**
 * ContentArea - Main content container
 *
 * Handles spacing and layout for page content
 * Accounts for menu sidebar and header when present
 */
export const ContentArea = ({
  children,
  className,
  centered = false,
  verticalCenter = false,
  maxWidth = '1200px',
}: ContentAreaProps) => {
  const { tokens } = useTheme();

  const baseStyles: CSSObject = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: verticalCenter ? 'center' : 'flex-start',
    minHeight: 0,
    height: '100%',
  };

  const centeredStyles: CSSObject = centered
    ? {
        maxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
      }
    : {};

  const combinedStyles: CSSObject = {
    ...baseStyles,
    ...centeredStyles,
  };

  return (
    <main className={className} css={combinedStyles}>
      {children}
    </main>
  );
};
