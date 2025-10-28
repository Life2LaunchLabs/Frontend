import React from 'react';
import { useTheme } from '../../../styles';
import { iconMapping } from './iconMapping';

export interface IconProps {
  name: string;
  typography?: 'display-large' | 'display-medium' | 'display-small' | 'headline-large' | 'headline-medium' | 'headline-small' | 'title-large' | 'title-medium' | 'title-small' | 'label-large' | 'label-medium' | 'label-small' | 'body-large' | 'body-medium' | 'body-small';
  active?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'inherit';
  size?: number; // For custom icon libraries
  className?: string;
  style?: React.CSSProperties;
}

const getIconStyles = (
  typography: IconProps['typography'], 
  active: boolean = false, 
  color: any
) => {
  const iconConfig = {
    'display-large': { fontSize: '48px', fontWeight: '500', opticalSize: 48 },
    'display-medium': { fontSize: '48px', fontWeight: '500', opticalSize: 48 },
    'display-small': { fontSize: '40px', fontWeight: '400', opticalSize: 40 },
    'headline-large': { fontSize: '48px', fontWeight: '400', opticalSize: 48 },
    'headline-medium': { fontSize: '40px', fontWeight: '400', opticalSize: 40 },
    'headline-small': { fontSize: '40px', fontWeight: '300', opticalSize: 40 },
    'title-large': { fontSize: '24px', fontWeight: '400', opticalSize: 24 },
    'title-medium': { fontSize: '24px', fontWeight: '400', opticalSize: 24 },
    'title-small': { fontSize: '20px', fontWeight: '400', opticalSize: 20 },
    'label-large': { fontSize: '24px', fontWeight: '300', opticalSize: 24 },
    'label-medium': { fontSize: '20px', fontWeight: '300', opticalSize: 20 },
    'label-small': { fontSize: '20px', fontWeight: '300', opticalSize: 20 },
    'body-large': { fontSize: '24px', fontWeight: '300', opticalSize: 24 },
    'body-medium': { fontSize: '20px', fontWeight: '300', opticalSize: 20 },
    'body-small': { fontSize: '20px', fontWeight: '300', opticalSize: 20 },
  };

  const config = iconConfig[typography];
  const fill = active ? 1 : 0;

  const getColor = () => {
    switch (color) {
      case 'primary':
        return color.primary;
      case 'secondary':
        return color.secondary;
      case 'tertiary':
        return color.tertiary;
      case 'surface':
        return color.onSurface;
      case 'inherit':
      default:
        return 'inherit';
    }
  };

  return {
    fontFamily: '"Material Symbols Outlined"',
    fontSize: config.fontSize,
    fontWeight: config.fontWeight,
    color: getColor(),
    fontVariationSettings: `"FILL" ${fill}, "wght" ${config.fontWeight}, "GRAD" 0, "opsz" ${config.opticalSize}`,
  };
};

export const Icon: React.FC<IconProps> = ({
  name,
  typography,
  active = false,
  color = 'inherit',
  size,
  className,
  style,
}) => {
  const { colors } = useTheme();

  // Check if icon is in our custom mapping
  const mappedIcon = iconMapping[name as keyof typeof iconMapping];

  const getColor = () => {
    switch (color) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'tertiary':
        return colors.tertiary;
      case 'surface':
        return colors.onSurface;
      case 'inherit':
      default:
        return 'inherit';
    }
  };

  if (mappedIcon) {
    const iconSize = size || 20;

    // Hugeicons (component-based)
    if (mappedIcon.library === 'hugeicons' && 'component' in mappedIcon) {
      const IconComponent = mappedIcon.component;
      return (
        <IconComponent
          size={iconSize}
          color={getColor()}
          className={className}
          style={style}
        />
      );
    }

    // Material Symbols from mapping (font-based)
    if (mappedIcon.library === 'material' && 'symbolName' in mappedIcon) {
      return (
        <span
          className={`l2l-icon ${className || ''}`}
          style={{
            fontFamily: '"Material Symbols Rounded"',
            fontSize: `${iconSize}px`,
            color: getColor(),
            fontVariationSettings: `"FILL" ${active ? 1 : 0}, "wght" 400, "GRAD" 0, "opsz" 48`,
            ...style,
          }}
        >
          {mappedIcon.symbolName}
        </span>
      );
    }
  }

  // Fallback to Material Symbols for backwards compatibility
  if (!typography) {
    console.warn(`Icon "${name}" not found in mapping and no typography specified for Material Symbol fallback`);
    return null;
  }

  const iconStyles = getIconStyles(typography, active, color);

  return (
    <span
      className={`l2l-icon ${className || ''}`}
      style={{ ...iconStyles, ...style }}
      data-testid="icon"
    >
      {name}
    </span>
  );
};