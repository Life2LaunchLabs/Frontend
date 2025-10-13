/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTheme } from '../../../styles';

export interface CarouselCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed width keeps alignment crisp; override as needed */
  width?: number; // px

  /** Optional media */
  imageSrc?: string;
  imageAlt?: string;
  emoji?: string;

  /** Controls the media box height (px) and corner radius */
  mediaHeight?: number; // default 140
  mediaRadius?: string | number; // default tokens.borderRadius.medium

  children: React.ReactNode;
}

export const CarouselCard: React.FC<CarouselCardProps> = ({
  width = 260,
  imageSrc,
  imageAlt,
  emoji,
  mediaHeight = 140,
  mediaRadius,
  children,
  ...rest
}) => {
  const { tokens, colors } = useTheme();
  const radius = mediaRadius ?? tokens.borderRadius.medium;

  const hasImage = Boolean(imageSrc);
  const hasEmoji = !hasImage && Boolean(emoji);

  return (
    <div
      {...rest}
      css={{
        width,
        boxSizing: 'border-box',
        padding: `${tokens.spacing[2]} ${tokens.spacing[2]}`,
        borderRadius: tokens.borderRadius.medium,
        outline: 'none',
        transition: tokens.transitions.fast,
        '&:focus-visible': {
          outline: `2px solid ${colors.primary}`,
          outlineOffset: 2,
        },
      }}
    >
      {(hasImage || hasEmoji) && (
        <div
          css={{
            width: '100%',
            height: mediaHeight,
            borderRadius: radius,
            overflow: 'hidden',
            display: 'grid',
            placeItems: 'center',
            marginBottom: tokens.spacing[2],
            // ultra minimal: no background fills unless you add one externally
          }}
        >
          {hasImage ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? ''}
              loading="lazy"
              decoding="async"
              draggable={false}
              css={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                userSelect: 'none',
                display: 'block',
              }}
            />
          ) : (
            // Emoji fallback
            <span
              aria-label={typeof emoji === 'string' ? emoji : undefined}
              css={{
                fontSize: 48,
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {emoji}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
};
