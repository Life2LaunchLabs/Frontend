import React from 'react';
import { useTheme } from '../../theme';

export interface IconProps {
  name: string;
  typography: 'display-large' | 'display-medium' | 'display-small' | 'headline-large' | 'headline-medium' | 'headline-small' | 'title-large' | 'title-medium' | 'title-small' | 'label-large' | 'label-medium' | 'label-small' | 'body-large' | 'body-medium' | 'body-small';
  active?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'inherit';
}

const getIconStyles = (
  typography: IconProps['typography'], 
  active: boolean = false, 
  theme: any, 
  color: IconProps['color'] = 'inherit'
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
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'tertiary':
        return theme.tertiary;
      case 'surface':
        return theme.onSurface;
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
  color = 'inherit' 
}) => {
  const { theme, tokens } = useTheme();
  const iconStyles = getIconStyles(typography, active, theme, color);

  return (
    <span
      className="l2l-icon"
      style={iconStyles}
      data-testid="icon"
    >
      {name}
    </span>
  );
};