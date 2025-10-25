/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { useTheme } from '@/styles/providers/hooks';

export interface SectionImageLeftProps {
  image?: string;
  imageColor?: string;
  header: string;
  body: ReactNode;
}

export const SectionImageLeft = ({ image, imageColor, header, body }: SectionImageLeftProps) => {
  const { colors, tokens } = useTheme();

  return (
    <div
      css={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        background: imageColor || 'transparent',
      }}
    >
      <div css={{ display: 'flex', width: '100%', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Image half */}
        <div
          css={{
            flex: '0 0 50%',
            background: image ? `url(${image}) center/cover` : colors.surfaceContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!image && (
            <div css={{ ...tokens.typography.body.large, color: colors.onSurfaceVariant }}>
              Image
            </div>
          )}
        </div>

        {/* Content half */}
        <div
          css={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: tokens.spacing[8],
            gap: tokens.spacing[4],
          }}
        >
          <h2 css={{ ...tokens.typography.display.medium, color: colors.onSurface }}>
            {header}
          </h2>
          <div css={{ ...tokens.typography.body.large, color: colors.onSurfaceVariant, lineHeight: 1.6 }}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
};
