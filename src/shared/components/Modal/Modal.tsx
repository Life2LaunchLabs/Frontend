import React, { useEffect } from 'react';
import { useTheme } from '../../../styles';
import { IconButton } from '../IconButton';

export interface ModalAction {
  label: string;
  variant?: 'filled' | 'outlined' | 'text';
  onClick: () => void;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: ModalAction[];
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  const { colors, tokens } = useTheme();

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStyles = () => ({
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: tokens.spacing[4],
    },
    modal: {
      backgroundColor: colors.surface,
      borderRadius: tokens.borderRadius.large,
      boxShadow: tokens.shadows.large,
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const,
      maxWidth: size === 'small' ? '400px' : size === 'large' ? '800px' : '600px',
      width: '100%',
      border: `1px solid ${colors.outline}`,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: tokens.spacing[6],
      borderBottom: `1px solid ${colors.outline}`,
      backgroundColor: colors.surfaceVariant,
    },
    title: {
      ...tokens.typography.headline.small,
      color: colors.onSurface,
      margin: 0,
    },
    content: {
      padding: tokens.spacing[6],
      flex: 1,
      overflow: 'auto',
      color: colors.onSurface,
      ...tokens.typography.body.medium,
    },
    actions: {
      display: 'flex',
      gap: tokens.spacing[3],
      padding: tokens.spacing[6],
      paddingTop: tokens.spacing[4],
      justifyContent: 'flex-end',
      borderTop: `1px solid ${colors.outline}`,
      backgroundColor: colors.surfaceContainer,
    },
    actionButton: {
      padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
      borderRadius: tokens.borderRadius.medium,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ...tokens.typography.body.medium,
      fontWeight: 500,
    },
    actionButtonFilled: {
      backgroundColor: colors.primary,
      color: colors.onPrimary,
    },
    actionButtonFilledHover: {
      backgroundColor: colors.primaryContainer,
    },
    actionButtonOutlined: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
    },
    actionButtonOutlinedHover: {
      backgroundColor: colors.primaryContainer,
    },
    actionButtonText: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: 'none',
    },
    actionButtonTextHover: {
      backgroundColor: colors.surfaceContainerHighest,
    },
    actionButtonDisabled: {
      backgroundColor: colors.surfaceVariant,
      color: colors.onSurfaceVariant,
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  });

  const styles = getStyles();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const getActionButtonStyle = (variant: string = 'filled') => {
    switch (variant) {
      case 'outlined':
        return { ...styles.actionButton, ...styles.actionButtonOutlined };
      case 'text':
        return { ...styles.actionButton, ...styles.actionButtonText };
      default:
        return { ...styles.actionButton, ...styles.actionButtonFilled };
    }
  };

  const getActionButtonHoverStyle = (variant: string = 'filled') => {
    switch (variant) {
      case 'outlined':
        return styles.actionButtonOutlinedHover;
      case 'text':
        return styles.actionButtonTextHover;
      default:
        return styles.actionButtonFilledHover;
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          {showCloseButton && (
            <IconButton
              icon="close"
              variant="standard"
              onClick={onClose}
              title="Close"
            />
          )}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div style={styles.actions}>
            {actions.map((action, index) => (
              <button
                key={index}
                style={{
                  ...getActionButtonStyle(action.variant),
                  ...(action.disabled ? styles.actionButtonDisabled : {}),
                }}
                onClick={action.onClick}
                disabled={action.disabled}
                onMouseEnter={(e) => {
                  if (!action.disabled) {
                    Object.assign(e.currentTarget.style, getActionButtonHoverStyle(action.variant));
                  }
                }}
                onMouseLeave={(e) => {
                  if (!action.disabled) {
                    Object.assign(e.currentTarget.style, getActionButtonStyle(action.variant));
                  }
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};