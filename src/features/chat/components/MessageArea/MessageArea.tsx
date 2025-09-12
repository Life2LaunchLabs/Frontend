import React from 'react';
import { useTheme } from '../../../../styles';

export interface MessageAreaProps {
  message: string;
  isLoading?: boolean;
  loadingText?: string;
  characterName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  message,
  isLoading = false,
  loadingText,
  characterName,
  className,
  style,
}) => {
  const { theme, tokens } = useTheme();

  const getLoadingText = () => {
    if (loadingText) return loadingText;
    if (characterName) {
      return `${characterName.charAt(0).toUpperCase() + characterName.slice(1)} is thinking...`;
    }
    return 'Thinking...';
  };

  const containerStyles: React.CSSProperties = {
    backgroundColor: `${theme.surface}CC`, // 80% opacity
    backdropFilter: 'blur(8px)',
    borderRadius: tokens.borderRadius.large,
    padding: tokens.spacing[4],
    overflowY: 'auto' as const,
    flex: 1,
    ...style,
  };

  const messageStyles: React.CSSProperties = {
    ...tokens.typography.body.medium,
    color: theme.onSurface,
    margin: 0,
    whiteSpace: 'pre-wrap' as const,
    lineHeight: 1.6,
  };

  const loadingStyles: React.CSSProperties = {
    ...tokens.typography.body.medium,
    color: theme.onSurfaceVariant,
    textAlign: 'center' as const,
    margin: 0,
  };

  return (
    <div 
      className={className}
      style={containerStyles}
      data-testid="message-area"
    >
      {isLoading ? (
        <div 
          className="animate-pulse"
          style={loadingStyles}
          data-testid="loading-message"
        >
          {getLoadingText()}
        </div>
      ) : (
        <div 
          style={messageStyles}
          data-testid="message-content"
        >
          {message || ''}
        </div>
      )}
    </div>
  );
};