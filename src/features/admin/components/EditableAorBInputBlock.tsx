import React from 'react';
import { useTheme } from '../../../styles';
import { Button, IconButton } from '../../../shared/components';
import { AorBInputConfig, AorBPrompt, QuestionBlockConfig } from '../../activities/types';

export interface EditableAorBInputBlockProps {
  config: QuestionBlockConfig;
  onChange: (updatedConfig: QuestionBlockConfig) => void;
}

export const EditableAorBInputBlock: React.FC<EditableAorBInputBlockProps> = ({
  config,
  onChange
}) => {
  const { colors, tokens } = useTheme();

  const aOrBConfig = (config.config || {}) as AorBInputConfig;
  const prompts = (aOrBConfig.prompts || (config as any).prompts || []) as AorBPrompt[];
  const positiveLabel = aOrBConfig.positive_label ?? 'Yes';
  const negativeLabel = aOrBConfig.negative_label ?? 'No';

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
      minHeight: '72px',
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
    promptRow: {
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[3],
      backgroundColor: colors.surface,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    promptHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: colors.onSurfaceVariant,
      ...tokens.typography.label.small,
    },
    promptList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[3],
    },
  });

  const styles = getStyles();

  const handleChange = (field: keyof QuestionBlockConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleConfigChange = (field: keyof AorBInputConfig, value: any) => {
    onChange({
      ...config,
      config: {
        ...aOrBConfig,
        [field]: value,
      },
    });
  };

  const handleAddPrompt = () => {
    const newPrompt: AorBPrompt = {
      id: `prompt_${Date.now()}`,
      title: 'New statement',
      description: '',
    };
    handleConfigChange('prompts', [...prompts, newPrompt]);
  };

  const handleUpdatePrompt = (
    index: number,
    field: keyof AorBPrompt,
    value: string
  ) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[index] = {
      ...updatedPrompts[index],
      [field]: value,
    };
    handleConfigChange('prompts', updatedPrompts);
  };

  const handleDeletePrompt = (index: number) => {
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    handleConfigChange('prompts', updatedPrompts);
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
          A or B Question
        </span>
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <label style={styles.label}>Question Title *</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Introduce your sequence..."
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <label style={styles.label}>Subtitle (optional)</label>
        <input
          type="text"
          value={config.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Explain how the responses should be used..."
          style={styles.input}
        />
      </div>

      <div style={{ display: 'flex', gap: tokens.spacing[3], marginBottom: tokens.spacing[3] }}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Positive button label</label>
          <input
            type="text"
            value={positiveLabel}
            onChange={(e) => handleConfigChange('positive_label', e.target.value)}
            placeholder="Yes"
            style={styles.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Negative button label</label>
          <input
            type="text"
            value={negativeLabel}
            onChange={(e) => handleConfigChange('negative_label', e.target.value)}
            placeholder="No"
            style={styles.input}
          />
        </div>
      </div>

      <div style={{ marginBottom: tokens.spacing[2] }}>
        <label style={styles.label}>Prompts</label>
      </div>

      <div style={styles.promptList}>
        {prompts.map((prompt, index) => (
          <div key={prompt.id} style={styles.promptRow}>
            <div style={styles.promptHeader}>
              <span>Prompt {index + 1}</span>
              <IconButton
                icon="delete"
                variant="text"
                onClick={() => handleDeletePrompt(index)}
                title="Remove prompt"
              />
            </div>
            <input
              type="text"
              value={prompt.title}
              onChange={(e) => handleUpdatePrompt(index, 'title', e.target.value)}
              placeholder="Prompt question or statement"
              style={styles.input}
            />
            <textarea
              value={prompt.description || ''}
              onChange={(e) => handleUpdatePrompt(index, 'description', e.target.value)}
              placeholder="Optional supporting detail"
              style={styles.textarea}
            />
          </div>
        ))}
      </div>

      <Button
        variant="outlined"
        onClick={handleAddPrompt}
        style={{ marginTop: tokens.spacing[2] }}
      >
        + Add Prompt
      </Button>

      <div style={styles.checkbox}>
        <input
          type="checkbox"
          id={`required-aorb-${config.question_id}`}
          checked={config.required || false}
          onChange={(e) => handleChange('required', e.target.checked)}
          style={styles.checkboxInput}
        />
        <label htmlFor={`required-aorb-${config.question_id}`} style={styles.checkboxLabel}>
          Required
        </label>
      </div>
    </div>
  );
};
