import React, { useState } from 'react';
import { useTheme } from '../../../styles';
import { Icon } from '../Icon';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  variant?: 'filled' | 'outlined' | 'standard' | 'elevated' | 'tonal';
  icon?: string;
  disabled?: boolean;
  toggle?: boolean;
  toggled?: boolean;
  color?: string;
  onToggle?: (toggled: boolean) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'filled',
  icon = 'add',
  disabled = false,
  toggle = false,
  toggled: controlledToggled,
  color,
  onToggle,
  onClick,
  ...props
}) => {
  const { colors, tokens } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [internalToggled, setInternalToggled] = useState(false);

  // Use controlled toggle state if provided, otherwise use internal state
  const isToggled = controlledToggled !== undefined ? controlledToggled : internalToggled;

  const getButtonStyles = () => {
    const baseStyle = {
      width: '40px',
      height: '40px',
      borderRadius: tokens.borderRadius.full,
      padding: tokens.spacing[2], // 8px for the design requirement of padding 4 (8px total)
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: disabled ? 'default' : 'pointer',
      fontFamily: tokens.typography.fontFamily.default,
      transition: 'all 0.15s ease-in-out',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    const getStateLayerOpacity = () => {
      if (disabled) return 0;
      if (isPressed) return 0.12;
      if (isFocused) return 0.12;
      if (isHovered) return 0.10;
      return 0;
    };

    const getStateLayerColor = () => {
      switch (variant) {
        case 'filled':
          return colors.onPrimary;
        case 'tonal':
          return colors.onSecondary;
        case 'outlined':
        case 'standard':
        case 'elevated':
        default:
          return color || colors.primary;
      }
    };

    if (disabled) {
      // Disabled styles
      switch (variant) {
        case 'filled':
        case 'elevated':
        case 'tonal':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            color: colors.onSurface,
            opacity: 0.4,
            boxShadow: 'none',
          };
        case 'outlined':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            color: colors.onSurface,
            opacity: 0.4,
            border: `1px solid ${colors.onSurface}`,
            borderOpacity: 0.15,
          };
        case 'standard':
        default:
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            color: colors.onSurface,
            opacity: 0.4,
          };
      }
    }

    // Enabled styles
    const stateLayerOpacity = getStateLayerOpacity();
    const stateLayerColor = getStateLayerColor();
    
    // Apply toggle state styling
    const getToggleBackground = () => {
      if (!toggle) return null;
      if (isToggled) {
        switch (variant) {
          case 'filled':
            return colors.primary;
          case 'tonal':
            return colors.secondaryContainer;
          case 'outlined':
            return colors.primaryContainer;
          case 'standard':
            return colors.primaryContainer;
          case 'elevated':
            return colors.primaryContainer;
          default:
            return colors.primaryContainer;
        }
      }
      return null;
    };

    const toggleBg = getToggleBackground();
    
    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: toggleBg || colors.primary,
          color: colors.onPrimary,
          boxShadow: stateLayerOpacity > 0 ? `inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})` : 'none',
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: toggleBg || 'transparent',
          color: isToggled ? colors.onPrimaryContainer : (color || colors.primary),
          border: `1px solid ${color || colors.primary}`,
          boxShadow: stateLayerOpacity > 0 ? `inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})` : 'none',
        };
      case 'standard':
        return {
          ...baseStyle,
          backgroundColor: toggleBg || 'transparent',
          color: isToggled ? colors.onPrimaryContainer : (color || colors.primary),
          border: 'none',
          boxShadow: stateLayerOpacity > 0 ? `inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})` : 'none',
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: toggleBg || 'transparent',
          color: isToggled ? colors.onPrimaryContainer : (color || colors.primary),
          border: 'none',
          boxShadow: stateLayerOpacity > 0
            ? `0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})`
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        };
      case 'tonal':
        return {
          ...baseStyle,
          backgroundColor: toggleBg || colors.secondaryContainer,
          color: colors.onSecondaryContainer,
          boxShadow: stateLayerOpacity > 0 ? `inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})` : 'none',
        };
      default:
        return baseStyle;
    }
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (toggle) {
      const newToggleState = !isToggled;
      if (controlledToggled === undefined) {
        setInternalToggled(newToggleState);
      }
      if (onToggle) {
        onToggle(newToggleState);
      }
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...props}
      className="l2l-icon-button"
      style={getButtonStyles()}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      data-variant={variant}
      data-state={disabled ? 'disabled' : 'enabled'}
      data-hovered={isHovered}
      data-focused={isFocused}
      data-pressed={isPressed}
      data-toggle={toggle}
      data-toggled={isToggled}
    >
      <Icon 
        name={icon} 
        typography="title-medium" 
        color="inherit"
      />
    </button>
  );
};