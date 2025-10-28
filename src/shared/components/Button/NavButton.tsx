/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useTheme, stateLayer, stateOpacity, withOpacity } from '../../../styles';
import { Icon } from '../Icon';

export interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  icon?: string | false;
  disabled?: boolean;
  align?: 'center' | 'left';
  collapsed?: boolean;
  active?: boolean;
  color?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const NavButton: React.FC<NavButtonProps> = ({
  children,
  variant = 'filled',
  icon = false,
  disabled = false,
  align = 'center',
  collapsed = false,
  active = false,
  color,
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
        return color || colors.primary;
    }
  };

  const baseStyles = {
    borderRadius: tokens.borderRadius.small,
    padding: collapsed
      ? tokens.spacing[2]
      : align === 'left'
      ? `${tokens.spacing[2]} ${tokens.spacing[6]} ${tokens.spacing[2]} ${tokens.spacing[3]}`
      : `${tokens.spacing[2]} ${tokens.spacing[6]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : align === 'left' ? 'flex-start' : 'center',
    gap: tokens.spacing[2],
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    ...tokens.typography.label.large,
    transition: tokens.transitions.normal,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    width: collapsed ? '40px' : 'auto',
  };

  const stateLayerOpacityValue = getStateLayerOpacity();
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
          boxShadow: stateLayerOpacityValue > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacityValue)}`
            : 'none',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: color || colors.primary,
          border: `1px solid ${colors.outline}`,
          boxShadow: stateLayerOpacityValue > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacityValue)}`
            : 'none',
        };
      case 'text':
        return {
          backgroundColor: active ? withOpacity(color || colors.primary, 0.12) : 'transparent',
          color: color || colors.primary,
          border: 'none',
          boxShadow: stateLayerOpacityValue > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacityValue)}`
            : 'none',
          // Bottom border underline that grows from left to right
          '&::after': {
            content: '""',
            position: 'absolute' as const,
            bottom: 0,
            left: 0,
            width: active || isHovered ? '100%' : '0%',
            height: '2px',
            backgroundColor: color || colors.primary,
            transition: 'width 0.3s ease-out',
          },
        };
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          color: color || colors.primary,
          border: 'none',
          boxShadow: stateLayerOpacityValue > 0
            ? `${tokens.shadows.small}, inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacityValue)}`
            : tokens.shadows.small,
        };
      case 'tonal':
        return {
          backgroundColor: colors.surfaceContainer,
          color: colors.onSurface,
          boxShadow: stateLayerOpacityValue > 0
            ? `inset 0 0 0 1000px ${stateLayer(stateLayerColorValue, stateLayerOpacityValue)}`
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
          outline: `2px solid ${color || colors.primary}`,
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
      {!collapsed && children}
    </button>
  );
};
