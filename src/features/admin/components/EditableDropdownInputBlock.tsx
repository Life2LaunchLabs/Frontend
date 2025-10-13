import React from 'react';
import { useTheme } from '../../../styles';
import { Button, IconButton } from '../../../shared/components';
import { DropdownInputConfig, MultipleChoiceOption, QuestionBlockConfig } from '../../activities/types';

export interface EditableDropdownInputBlockProps {
  config: QuestionBlockConfig;
  onChange: (updatedConfig: QuestionBlockConfig) => void;
}

export const EditableDropdownInputBlock: React.FC<EditableDropdownInputBlockProps> = ({
  config,
  onChange
}) => {
  const { colors, tokens } = useTheme();

  const dropdownConfig = (config.config || {}) as DropdownInputConfig;
  const options = (dropdownConfig.options || (config as any).options || []) as MultipleChoiceOption[];
  const placeholder = dropdownConfig.placeholder ?? '';

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
    optionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      marginBottom: tokens.spacing[2],
    },
    optionIndex: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      minWidth: '20px',
      textAlign: 'right' as const,
    },
    selectPreview: {
      ...tokens.typography.body.medium,
      width: '100%',
      padding: tokens.spacing[3],
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.small,
      backgroundColor: colors.surface,
      color: colors.onSurfaceVariant,
      outline: 'none',
      cursor: 'not-allowed',
    },
  });

  const styles = getStyles();

  const handleChange = (field: keyof QuestionBlockConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleConfigChange = (field: keyof DropdownInputConfig, value: any) => {
    onChange({
      ...config,
      config: {
        ...dropdownConfig,
        [field]: value,
      },
    });
  };

  const handleAddOption = () => {
    const newOption: MultipleChoiceOption = {
      id: `option_${Date.now()}`,
      title: 'New option',
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
        <span
          style={{
            ...tokens.typography.label.large,
            color: colors.primary,
          }}
        >
          Dropdown Question
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
        <label style={styles.label}>Placeholder text</label>
        <input
          type="text"
          value={placeholder}
          onChange={(e) => handleConfigChange('placeholder', e.target.value)}
          placeholder="Select an option..."
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <label style={styles.label}>Dropdown Preview</label>
        <select disabled style={styles.selectPreview} value="">
          <option value="">{placeholder || 'Select an option...'}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title || 'Untitled option'}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: tokens.spacing[2] }}>
        <label style={styles.label}>Options</label>
      </div>

      {options.map((option, index) => (
        <div key={option.id} style={styles.optionRow}>
          <span style={styles.optionIndex}>{index + 1}.</span>
          <input
            type="text"
            value={option.title}
            onChange={(e) => handleUpdateOption(index, 'title', e.target.value)}
            placeholder="Option label"
            style={styles.input}
          />
          <IconButton
            icon="delete"
            variant="text"
            onClick={() => handleDeleteOption(index)}
            title="Remove option"
          />
        </div>
      ))}

      <Button
        variant="outlined"
        onClick={handleAddOption}
        style={{ marginTop: tokens.spacing[2] }}
      >
        + Add Option
      </Button>

      <div style={styles.checkbox}>
        <input
          type="checkbox"
          id={`required-dropdown-${config.question_id}`}
          checked={config.required || false}
          onChange={(e) => handleChange('required', e.target.checked)}
          style={styles.checkboxInput}
        />
        <label htmlFor={`required-dropdown-${config.question_id}`} style={styles.checkboxLabel}>
          Required
        </label>
      </div>
    </div>
  );
};
