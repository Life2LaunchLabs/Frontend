import React, { useState } from 'react';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import { borderRadius } from '../../tokens/borderRadius';

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
  icon = 'add',
  disabled = false,
  onClick,
  ...props
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyles = () => {
    const baseStyle = {
      borderRadius: borderRadius.full,
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: 'none',
      cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: '500',
      fontSize: '14px',
      transition: 'all 0.15s ease-in-out',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      // tabIndex will be handled by props
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
          return theme.onPrimary;
        case 'tonal':
          return theme.onSecondary;
        case 'outlined':
        case 'text':
        case 'elevated':
        default:
          return theme.primary;
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
            color: theme.onSurface,
            opacity: 0.4,
            boxShadow: 'none',
          };
        case 'outlined':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            color: theme.onSurface,
            opacity: 0.4,
            border: `1px solid ${theme.onSurface}`,
            borderOpacity: 0.15,
          };
        case 'text':
        default:
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            color: theme.onSurface,
            opacity: 0.4,
          };
      }
    }

    // Enabled styles
    const stateLayerOpacity = getStateLayerOpacity();
    const stateLayerColor = getStateLayerColor();
    
    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.primary,
          color: theme.onPrimary,
          boxShadow: stateLayerOpacity > 0 ? `inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})` : 'none',
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: theme.primary,
          border: `1px solid ${theme.primary}`,
          boxShadow: stateLayerOpacity > 0 ? `inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})` : 'none',
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: theme.primary,
          border: 'none',
          boxShadow: stateLayerOpacity > 0 ? `inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})` : 'none',
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: theme.primary,
          border: 'none',
          boxShadow: stateLayerOpacity > 0 
            ? `0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1000px rgba(${hexToRgb(stateLayerColor)}, ${stateLayerOpacity})`
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        };
      case 'tonal':
        return {
          ...baseStyle,
          backgroundColor: theme.secondaryContainer,
          color: theme.onSecondaryContainer,
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
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...props}
      className="l2l-button"
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