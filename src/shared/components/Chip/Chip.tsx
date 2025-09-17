import React, { useState } from 'react';
import { useTheme } from '../../../styles';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'filled',
  disabled = false,
  onClick,
  ...props
}) => {
  const { theme, tokens } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getChipStyles = () => {
    const baseStyle = {
      borderRadius: tokens.borderRadius.full,
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      border: 'none',
      cursor: disabled ? 'default' : 'pointer',
      ...tokens.typography.body.small,
      transition: 'all 0.15s ease-in-out',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none' as const,
      outline: 'none',
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: theme.onSurface,
        opacity: 0.5,
      };
    }

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: isHovered 
            ? `${theme.surfaceContainer}E6` // 90% opacity
            : `${theme.surface}CC`, // 80% opacity
          color: theme.onSurface,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: isHovered 
            ? `${theme.surfaceContainer}80` // 50% opacity
            : 'transparent',
          color: theme.primary,
          border: `1px solid ${theme.primary}`,
          backdropFilter: 'blur(8px)',
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: isHovered 
            ? `${theme.surfaceContainer}E6` // 90% opacity
            : `${theme.surface}CC`, // 80% opacity
          color: theme.onSurface,
          backdropFilter: 'blur(8px)',
          boxShadow: isHovered 
            ? '0 2px 6px rgba(0, 0, 0, 0.15)'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        };
      default:
        return baseStyle;
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...props}
      className="l2l-chip"
      style={getChipStyles()}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="chip"
    >
      {children}
    </button>
  );
};