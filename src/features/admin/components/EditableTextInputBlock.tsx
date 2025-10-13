import React from 'react';
import { useTheme } from '../../../styles';
import { QuestionBlockConfig } from '../../activities/types';

export interface EditableTextInputBlockProps {
  config: QuestionBlockConfig;
  onChange: (updatedConfig: QuestionBlockConfig) => void;
}

export const EditableTextInputBlock: React.FC<EditableTextInputBlockProps> = ({
  config,
  onChange
}) => {
  const { colors, tokens } = useTheme();

  const getStyles = () => ({
    container: {
      border: `2px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      backgroundColor: colors.surfaceContainerLow,
    },
    header: {
      marginBottom: tokens.spacing[4],
    },
    label: {
      ...tokens.typography.label.small,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[2],
    },
    input: {
      ...tokens.typography.body.medium,
      width: '100%',
      padding: tokens.spacing[3],
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.small,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      outline: 'none',
      fontFamily: 'inherit',
    },
    textarea: {
      ...tokens.typography.body.medium,
      width: '100%',
      minHeight: '80px',
      padding: tokens.spacing[3],
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.small,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      outline: 'none',
      fontFamily: 'inherit',
      resize: 'vertical' as const,
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      marginTop: tokens.spacing[3],
    },
    checkboxInput: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
    },
    checkboxLabel: {
      ...tokens.typography.body.medium,
      color: colors.onSurface,
      cursor: 'pointer',
    },
  });

  const styles = getStyles();

  const handleChange = (field: keyof QuestionBlockConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleConfigChange = (field: string, value: any) => {
    onChange({
      ...config,
      config: {
        ...config.config,
        [field]: value,
      },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{
          ...tokens.typography.label.large,
          color: colors.primary,
        }}>
          Text Input Question
        </span>
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <label style={styles.label}>Question Title *</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter your question..."
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <label style={styles.label}>Subtitle (optional)</label>
        <input
          type="text"
          value={config.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Additional context or instructions..."
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <label style={styles.label}>Placeholder Text</label>
        <input
          type="text"
          value={(config.config as any).placeholder || ''}
          onChange={(e) => handleConfigChange('placeholder', e.target.value)}
          placeholder="Enter your answer..."
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <label style={styles.label}>Maximum Length (optional)</label>
        <input
          type="number"
          value={(config.config as any).max_length || ''}
          onChange={(e) => handleConfigChange('max_length', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="No limit"
          style={styles.input}
          min="1"
        />
      </div>

      <div style={styles.checkbox}>
        <input
          type="checkbox"
          id="multiline-checkbox"
          checked={(config.config as any).multiline || false}
          onChange={(e) => handleConfigChange('multiline', e.target.checked)}
          style={styles.checkboxInput}
        />
        <label htmlFor="multiline-checkbox" style={styles.checkboxLabel}>
          Allow multiple lines
        </label>
      </div>

      <div style={styles.checkbox}>
        <input
          type="checkbox"
          id="required-checkbox"
          checked={config.required || false}
          onChange={(e) => handleChange('required', e.target.checked)}
          style={styles.checkboxInput}
        />
        <label htmlFor="required-checkbox" style={styles.checkboxLabel}>
          Required
        </label>
      </div>
    </div>
  );
};
