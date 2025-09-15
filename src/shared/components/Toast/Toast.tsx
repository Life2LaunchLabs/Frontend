import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../../../styles';
import { Icon } from '../Icon';

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
  position = 'top-right'
}) => {
  const { theme, tokens } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match exit animation duration
  }, [id, onClose]);

  useEffect(() => {
    // Auto-dismiss after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 9999,
      minWidth: '320px',
      maxWidth: '480px',
      padding: tokens.spacing[4],
      borderRadius: tokens.borderRadius.large,
      boxShadow: tokens.shadows.large,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isVisible && !isExiting 
        ? 'translateX(0) scale(1)' 
        : position.includes('right') 
          ? 'translateX(100%) scale(0.95)' 
          : 'translateX(-100%) scale(0.95)',
      opacity: isVisible && !isExiting ? 1 : 0,
    };

    // Position styles
    const positionStyles = (() => {
      switch (position) {
        case 'top-right':
          return { top: tokens.spacing[4], right: tokens.spacing[4] };
        case 'top-left':
          return { top: tokens.spacing[4], left: tokens.spacing[4] };
        case 'bottom-right':
          return { bottom: tokens.spacing[4], right: tokens.spacing[4] };
        case 'bottom-left':
          return { bottom: tokens.spacing[4], left: tokens.spacing[4] };
        default:
          return { top: tokens.spacing[4], right: tokens.spacing[4] };
      }
    })();

    // Type-specific styles
    const typeStyles = (() => {
      switch (type) {
        case 'success':
          return {
            backgroundColor: theme.primaryContainer,
            color: theme.onPrimaryContainer,
            border: `1px solid ${theme.primary}`,
          };
        case 'error':
          return {
            backgroundColor: theme.errorContainer,
            color: theme.onErrorContainer,
            border: `1px solid ${theme.error}`,
          };
        case 'warning':
          return {
            backgroundColor: theme.tertiaryContainer,
            color: theme.onTertiaryContainer,
            border: `1px solid ${theme.tertiary}`,
          };
        case 'info':
          return {
            backgroundColor: theme.surfaceContainer,
            color: theme.onSurface,
            border: `1px solid ${theme.outline}`,
          };
        default:
          return {
            backgroundColor: theme.surface,
            color: theme.onSurface,
            border: `1px solid ${theme.outline}`,
          };
      }
    })();

    return { ...baseStyles, ...positionStyles, ...typeStyles };
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return theme.primary;
      case 'error':
        return theme.error;
      case 'warning':
        return theme.tertiary;
      case 'info':
        return theme.onSurface;
      default:
        return theme.onSurface;
    }
  };

  return (
    <div
      style={getToastStyles()}
      onClick={handleClose}
      data-testid={`toast-${type}`}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: tokens.spacing[3],
      }}>
        <div style={{ color: getIconColor(), marginTop: tokens.spacing[1] }}>
          <Icon
            name={getIconName()}
            typography="title-medium"
            color="inherit"
          />
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            ...tokens.typography.title.medium,
            marginBottom: message ? tokens.spacing[1] : 0,
            wordWrap: 'break-word',
          }}>
            {title}
          </div>
          
          {message && (
            <div style={{
              ...tokens.typography.body.medium,
              opacity: 0.8,
              wordWrap: 'break-word',
            }}>
              {message}
            </div>
          )}
        </div>

        <div
          style={{
            opacity: 0.6,
            cursor: 'pointer',
            padding: tokens.spacing[1],
            marginTop: -tokens.spacing[1],
            marginRight: -tokens.spacing[1],
          }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <Icon
            name="close"
            typography="title-small"
            color="inherit"
          />
        </div>
      </div>
    </div>
  );
};