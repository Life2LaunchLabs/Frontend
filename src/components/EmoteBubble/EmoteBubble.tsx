import React from 'react';
import { useTheme } from '../../theme';

export interface EmoteBubbleProps {
  emote: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  className?: string;
  style?: React.CSSProperties;
}

export const EmoteBubble: React.FC<EmoteBubbleProps> = ({
  emote,
  position = 'top-right',
  className,
  style,
}) => {
  const { theme, tokens } = useTheme();

  const getPositionStyles = (): React.CSSProperties => {
    const basePosition: React.CSSProperties = {
      position: 'absolute',
      zIndex: 10,
    };

    switch (position) {
      case 'top-right':
        return {
          ...basePosition,
          top: '50%',
          right: tokens.spacing[4],
          transform: 'translateY(-50%)',
        };
      case 'top-left':
        return {
          ...basePosition,
          top: '50%',
          left: tokens.spacing[4],
          transform: 'translateY(-50%)',
        };
      case 'bottom-right':
        return {
          ...basePosition,
          bottom: tokens.spacing[4],
          right: tokens.spacing[4],
        };
      case 'bottom-left':
        return {
          ...basePosition,
          bottom: tokens.spacing[4],
          left: tokens.spacing[4],
        };
      case 'center':
        return {
          ...basePosition,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      default:
        return basePosition;
    }
  };

  const bubbleStyles: React.CSSProperties = {
    ...getPositionStyles(),
    backgroundColor: `${theme.surfaceContainer}E6`, // 90% opacity
    backdropFilter: 'blur(8px)',
    borderRadius: tokens.borderRadius.full,
    padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    ...style,
  };

  const textStyles: React.CSSProperties = {
    ...tokens.typography.body.small,
    color: theme.onSurfaceVariant,
    margin: 0,
    whiteSpace: 'nowrap' as const,
  };

  if (!emote || emote.trim() === '') {
    return null;
  }

  return (
    <div 
      className={className}
      style={bubbleStyles}
      data-testid="emote-bubble"
    >
      <span style={textStyles}>
        {emote}
      </span>
    </div>
  );
};