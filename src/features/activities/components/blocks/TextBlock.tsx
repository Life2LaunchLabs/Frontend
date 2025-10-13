import React from 'react';
import { useTheme } from '../../../../styles';
import { TextBlockConfig } from '../../types';

export interface TextBlockProps {
  config: TextBlockConfig;
}

export const TextBlock: React.FC<TextBlockProps> = ({ config }) => {
  const { colors, tokens } = useTheme();

  const getTextStyle = () => {
    const baseStyle = {
      color: colors.onSurface,
      textAlign: config.align || 'left' as const,
      margin: 0,
      marginBottom: tokens.spacing[4],
    };

    switch (config.style) {
      case 'h1':
        return { ...baseStyle, ...tokens.typography.display.large };
      case 'h2':
        return { ...baseStyle, ...tokens.typography.display.medium };
      case 'h3':
        return { ...baseStyle, ...tokens.typography.headline.large };
      case 'lead':
        return {
          ...baseStyle,
          ...tokens.typography.body.large,
          fontWeight: 500,
          fontSize: '1.1em'
        };
      case 'quote':
        return {
          ...baseStyle,
          ...tokens.typography.body.large,
          fontStyle: 'italic',
          padding: tokens.spacing[4],
          borderLeft: `4px solid ${colors.primary}`,
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: tokens.borderRadius.medium,
        };
      default: // 'body'
        return { ...baseStyle, ...tokens.typography.body.medium };
    }
  };

  const Tag = config.style.startsWith('h') ? config.style as 'h1' | 'h2' | 'h3' : 'div';

  return (
    <Tag style={getTextStyle()}>
      {config.text || config.content || 'No content'}
    </Tag>
  );
};