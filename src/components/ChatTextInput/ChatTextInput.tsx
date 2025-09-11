import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme';

export interface ChatTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ChatTextInput: React.FC<ChatTextInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = "Type your message...",
  disabled = false,
  className,
  style,
}) => {
  const { theme, tokens } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [value]);

  const containerStyles: React.CSSProperties = {
    backgroundColor: `${theme.surfaceContainer}E6`, // 90% opacity
    backdropFilter: 'blur(8px)',
    borderRadius: tokens.borderRadius.large,
    padding: tokens.spacing[4],
    display: 'flex',
    alignItems: 'flex-end',
    gap: tokens.spacing[3],
    ...style,
  };

  const textareaStyles: React.CSSProperties = {
    flex: 1,
    resize: 'none' as const,
    borderRadius: tokens.borderRadius.large,
    border: `1px solid ${isFocused ? theme.primary : theme.onSurfaceVariant}`,
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
    backgroundColor: theme.surface,
    color: theme.onSurface,
    ...tokens.typography.body.medium,
    minHeight: '48px',
    maxHeight: '128px',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    boxShadow: isFocused ? `0 0 0 2px ${theme.primary}20` : 'none',
    opacity: disabled ? 0.5 : 1,
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: (!value.trim() || disabled) 
      ? theme.onSurfaceVariant 
      : theme.primary,
    color: (!value.trim() || disabled) 
      ? theme.surface 
      : theme.onPrimary,
    borderRadius: tokens.borderRadius.full,
    padding: tokens.spacing[3],
    border: 'none',
    cursor: disabled || !value.trim() ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background-color 0.15s ease-in-out',
    opacity: disabled ? 0.5 : 1,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleSendClick = () => {
    if (value.trim() && !disabled) {
      onSend();
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div 
      className={className}
      style={containerStyles}
      data-testid="chat-text-input"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        style={textareaStyles}
        rows={1}
        data-testid="chat-textarea"
      />
      <button
        onClick={handleSendClick}
        disabled={!value.trim() || disabled}
        style={buttonStyles}
        aria-label="Send message"
        data-testid="send-button"
      >
        <svg 
          width="20" 
          height="20" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </button>
    </div>
  );
};