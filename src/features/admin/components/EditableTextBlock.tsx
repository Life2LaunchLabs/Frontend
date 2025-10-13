import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles';
import { TextBlockConfig } from '../../activities/types';

export interface EditableTextBlockProps {
  config: TextBlockConfig;
  onChange: (config: TextBlockConfig) => void;
}

export const EditableTextBlock: React.FC<EditableTextBlockProps> = ({
  config,
  onChange
}) => {
  const { colors, tokens } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(config.text || config.content || '');
  const [showStyleSelector, setShowStyleSelector] = useState(true);

  const styleOptions = [
    { value: 'h1', label: 'Heading 1', description: 'Large title' },
    { value: 'h2', label: 'Heading 2', description: 'Medium title' },
    { value: 'h3', label: 'Heading 3', description: 'Small title' },
    { value: 'body', label: 'Body Text', description: 'Regular paragraph' },
    { value: 'lead', label: 'Lead Text', description: 'Emphasized paragraph' },
    { value: 'quote', label: 'Quote', description: 'Styled quotation' },
  ];

  useEffect(() => {
    setEditValue(config.text || config.content || '');
  }, [config.text, config.content]);

  const getStyles = () => ({
    container: {
      position: 'relative' as const,
      marginBottom: tokens.spacing[4],
    },
    toolbar: {
      display: 'flex',
      gap: tokens.spacing[2],
      padding: tokens.spacing[2],
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${colors.outline}`,
      marginBottom: tokens.spacing[2],
    },
    styleButton: {
      ...tokens.typography.body.small,
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      backgroundColor: colors.surfaceVariant,
      color: colors.onSurfaceVariant,
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.small,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    styleButtonActive: {
      backgroundColor: colors.primary,
      color: colors.onPrimary,
      borderColor: colors.primary,
    },
    styleButtonHover: {
      backgroundColor: colors.surfaceContainerHighest,
    },
  });

  const getTextStyle = () => {
    const baseStyle = {
      color: colors.onSurface,
      textAlign: config.align || 'left' as const,
      margin: 0,
      marginBottom: 0,
      cursor: isEditing ? 'text' : 'pointer',
      padding: tokens.spacing[2],
      borderRadius: tokens.borderRadius.small,
      transition: 'background-color 0.2s ease',
      backgroundColor: isEditing ? colors.surfaceContainerHighest : 'transparent',
      border: isEditing ? `2px solid ${colors.primary}` : '2px solid transparent',
      outline: 'none',
      minHeight: '2em',
      width: '100%',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
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
          backgroundColor: isEditing ? colors.surfaceContainerHighest : colors.surfaceContainerLow,
          borderRadius: tokens.borderRadius.medium,
        };
      default: // 'body'
        return { ...baseStyle, ...tokens.typography.body.medium };
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleStyleChange = (newStyle: string) => {
    const updatedConfig = {
      ...config,
      style: newStyle as any,
      text: editValue,
      content: editValue
    };
    onChange(updatedConfig);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update the config with new text
    const updatedConfig = {
      ...config,
      text: editValue,
      content: editValue // Keep both for compatibility
    };
    onChange(updatedConfig);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(config.text || config.content || '');
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  const styles = getStyles();

  const Tag = config.style?.startsWith('h') ? config.style as 'h1' | 'h2' | 'h3' : 'div';

  return (
    <div style={styles.container}>
      {/* Style Selector Toolbar - Always Visible */}
      <div style={styles.toolbar}>
        {styleOptions.map((option) => (
          <button
            key={option.value}
            style={{
              ...styles.styleButton,
              ...(config.style === option.value ? styles.styleButtonActive : {}),
            }}
            onClick={() => handleStyleChange(option.value)}
            onMouseEnter={(e) => {
              if (config.style !== option.value) {
                Object.assign(e.currentTarget.style, styles.styleButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (config.style !== option.value) {
                Object.assign(e.currentTarget.style, styles.styleButton);
              }
            }}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Text Content */}
      {isEditing ? (
        <textarea
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={getTextStyle()}
          autoFocus
          placeholder="Enter text..."
        />
      ) : (
        <Tag
          style={getTextStyle()}
          onClick={handleClick}
          title="Click to edit"
        >
          {editValue || 'Click to add text...'}
        </Tag>
      )}
    </div>
  );
};