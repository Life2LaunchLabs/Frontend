import React from 'react';
import { useTheme } from '../../../../styles';

export interface MessageAreaProps {
  message: string;
  streamingMessage?: string;
  isLoading?: boolean;
  isStreaming?: boolean;
  loadingText?: string;
  characterName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  message,
  streamingMessage,
  isLoading = false,
  isStreaming = false,
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

  const streamingCursorStyles: React.CSSProperties = {
    display: 'inline-block',
    width: '2px',
    height: '1.2em',
    backgroundColor: theme.primary,
    marginLeft: '2px',
    animation: 'blink 1s infinite',
  };

  // Display content based on state priority
  const displayContent = () => {
    if (isLoading) {
      return (
        <div 
          className="animate-pulse"
          style={loadingStyles}
          data-testid="loading-message"
        >
          {getLoadingText()}
        </div>
      );
    }
    
    if (isStreaming && streamingMessage) {
      return (
        <div 
          style={messageStyles}
          data-testid="streaming-message"
        >
          {streamingMessage}
          <span style={streamingCursorStyles} />
        </div>
      );
    }
    
    return (
      <div 
        style={messageStyles}
        data-testid="message-content"
      >
        {message || ''}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
      <div 
        className={className}
        style={containerStyles}
        data-testid="message-area"
      >
        {displayContent()}
      </div>
    </>
  );
};