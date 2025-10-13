import React from 'react';
import { useTheme } from '../../../styles';
import { QuestionBlockConfig, MultipleChoiceOption } from '../../activities/types';
import { Button, IconButton } from '../../../shared/components';

export interface EditableMultipleChoiceBlockProps {
  config: QuestionBlockConfig;
  onChange: (updatedConfig: QuestionBlockConfig) => void;
}

export const EditableMultipleChoiceBlock: React.FC<EditableMultipleChoiceBlockProps> = ({
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
    numberInput: {
      ...tokens.typography.body.medium,
      width: '80px',
      padding: tokens.spacing[2],
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.small,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      outline: 'none',
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
    optionsList: {
      marginTop: tokens.spacing[3],
    },
    optionItem: {
      display: 'flex',
      gap: tokens.spacing[2],
      marginBottom: tokens.spacing[2],
      alignItems: 'center',
    },
    optionInput: {
      flex: 1,
    },
    rangeRow: {
      display: 'flex',
      gap: tokens.spacing[3],
      alignItems: 'center',
      marginTop: tokens.spacing[3],
    },
  });

  const styles = getStyles();

  const options = ((config.config as any).options || []) as MultipleChoiceOption[];
  const minSelect = (config.config as any).min_select || 1;
  const maxSelect = (config.config as any).max_select || 1;

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

  const handleAddOption = () => {
    const newOption: MultipleChoiceOption = {
      id: `option_${Date.now()}`,
      title: '',
      body: '',
    };
    handleConfigChange('options', [...options, newOption]);
  };

  const handleUpdateOption = (index: number, field: keyof MultipleChoiceOption, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };
    handleConfigChange('options', updatedOptions);
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    handleConfigChange('options', updatedOptions);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{
          ...tokens.typography.label.large,
          color: colors.primary,
        }}>
          Multiple Choice Question
        </span>
      </div>

      <div>
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

          <div style={styles.rangeRow}>
            <div>
              <label style={styles.label}>Min Answers</label>
              <input
                type="number"
                value={minSelect}
                onChange={(e) => handleConfigChange('min_select', parseInt(e.target.value) || 1)}
                style={styles.numberInput}
                min="1"
                max={maxSelect}
              />
            </div>
            <div>
              <label style={styles.label}>Max Answers</label>
              <input
                type="number"
                value={maxSelect}
                onChange={(e) => handleConfigChange('max_select', parseInt(e.target.value) || 1)}
                style={styles.numberInput}
                min={minSelect}
              />
            </div>
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

          <div style={{ marginTop: tokens.spacing[4] }}>
            <label style={styles.label}>Options</label>
            <div style={styles.optionsList}>
              {options.map((option, index) => (
                <div key={option.id} style={styles.optionItem}>
                  <span style={{ ...tokens.typography.body.medium, color: colors.onSurfaceVariant }}>
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={option.title}
                    onChange={(e) => handleUpdateOption(index, 'title', e.target.value)}
                    placeholder="Option text..."
                    style={{ ...styles.input, ...styles.optionInput }}
                  />
                  <IconButton
                    icon="delete"
                    variant="text"
                    onClick={() => handleDeleteOption(index)}
                  />
                </div>
              ))}
            </div>
            <Button
              variant="outlined"
              onClick={handleAddOption}
              style={{ marginTop: tokens.spacing[2] }}
            >
              + Add Option
            </Button>
          </div>
      </div>
    </div>
  );
};
