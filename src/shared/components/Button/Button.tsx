/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useTheme, stateLayer, stateOpacity, withOpacity } from '../../../styles';
import { Icon } from '../Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  icon?: string | false;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  icon = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const { colors, tokens } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getStateLayerOpacity = () => {
    if (disabled) return 0;
    if (isPressed) return stateOpacity.pressed;
    if (isFocused) return stateOpacity.focus;
    if (isHovered) return stateOpacity.hover;
    return 0;
  };

  const getStateLayerColor = () => {
    switch (variant) {
      case 'filled':
        return '#ffffff';
      case 'tonal':
        return colors.onSurface;
      case 'outlined':
      case 'text':
      case 'elevated':
      default:
        return colors.primary;
    }
  };

  const baseStyles = {
    borderRadius: tokens.borderRadius.full,
    padding: `${tokens.spacing[2]} ${tokens.spacing[6]}`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing[2],
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    ...tokens.typography.label.large,
    transition: tokens.transitions.normal,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  const stateLayerOpacity = getStateLayerOpacity();
  const stateLayerColorValue = getStateLayerColor();

  // Build variant-specific styles
  const getVariantStyles = () => {
    if (disabled) {
      // Disabled styles
      switch (variant) {
        case 'filled':
        case 'elevated':
        case 'tonal':
          return {
            backgroundColor: withOpacity(colors.onSurface, 0.12),
            color: colors.onSurfaceVariant,
            boxShadow: 'none',
          };
        case 'outlined':
          return {
            backgroundColor: 'transparent',
            color: colors.onSurfaceVariant,
            border: `1px solid ${withOpacity(colors.onSurface, 0.12)}`,
          };
        case 'text':
        default:
          return {
            backgroundColor: 'transparent',
            color: colors.onSurfaceVariant,
          };
      }
    }

    // Enabled styles with state layers
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.primary,
          color: '#ffffff',
          boxShadow: stateLayerOpacity > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacity)}`
            : 'none',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.outline}`,
          boxShadow: stateLayerOpacity > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacity)}`
            : 'none',
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: 'none',
          boxShadow: stateLayerOpacity > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacity)}`
            : 'none',
        };
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          color: colors.primary,
          border: 'none',
          boxShadow: stateLayerOpacity > 0
            ? `${tokens.shadows.small}, inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacity)}`
            : tokens.shadows.small,
        };
      case 'tonal':
        return {
          backgroundColor: colors.surfaceContainer,
          color: colors.onSurface,
          boxShadow: stateLayerOpacity > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacity)}`
            : 'none',
        };
      default:
        return {};
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...props}
      css={{
        ...baseStyles,
        ...getVariantStyles(),
        '&:focus-visible': {
          outline: `2px solid ${colors.primary}`,
          outlineOffset: '2px',
        },
      }}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      data-hovered={isHovered}
      data-focused={isFocused}
      data-pressed={isPressed}
    >
      {icon !== false && (
        <Icon
          name={icon}
          typography="title-medium"
          color="inherit"
        />
      )}
      {children}
    </button>
  );
};
