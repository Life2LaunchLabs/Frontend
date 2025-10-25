/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { useTheme } from '@/styles/providers/hooks';

export interface SectionCenteredProps {
  image?: string;
  imageColor?: string;
  children: ReactNode;
}

export const SectionCentered = ({ image, imageColor, children }: SectionCenteredProps) => {
  return (
    <div
      css={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: image ? `url(${image}) center/cover` : imageColor || 'transparent',
      }}
    >
      <div
        css={{
          maxWidth: '800px',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
