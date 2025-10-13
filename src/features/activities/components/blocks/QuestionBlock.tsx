import React, { useState } from 'react';
import { useTheme } from '../../../../styles';
import { QuestionBlockConfig, MultipleChoiceOption, MultipleChoiceConfig, TextInputConfig } from '../../types';

export interface QuestionBlockProps {
  config: QuestionBlockConfig;
  onResponseChange?: (questionId: string, value: any) => void;
  initialValue?: any;
}

export const QuestionBlock: React.FC<QuestionBlockProps> = ({
  config,
  onResponseChange,
  initialValue
}) => {
  const { colors, tokens } = useTheme();
  const [value, setValue] = useState(initialValue || null);

  const handleChange = (newValue: any) => {
    setValue(newValue);
    onResponseChange?.(config.question_id, newValue);
  };

  const getContainerStyle = () => ({
    marginBottom: tokens.spacing[6],
    padding: tokens.spacing[4],
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: tokens.borderRadius.medium,
    border: `1px solid ${colors.outline}`,
  });

  const getTitleStyle = () => ({
    ...tokens.typography.headline.small,
    color: colors.onSurface,
    margin: 0,
    marginBottom: tokens.spacing[2],
  });

  const getSubtitleStyle = () => ({
    ...tokens.typography.body.medium,
    color: colors.onSurfaceVariant,
    margin: 0,
    marginBottom: tokens.spacing[4],
  });

  const getRequiredStyle = () => ({
    color: colors.error,
    marginLeft: tokens.spacing[1],
  });

  const renderMultipleChoice = (questionConfig: MultipleChoiceConfig) => {
    const selectedIds = value || [];
    // Handle both nested config and flat config from backend
    const options = questionConfig?.options || config.options || [];
    const maxSelect = questionConfig?.max_select || config.max_select || 1;
    const isMultiple = maxSelect > 1;

    const handleOptionChange = (optionId: string, checked: boolean) => {
      if (isMultiple) {
        let newSelected = [...selectedIds];
        if (checked) {
          if (newSelected.length < maxSelect) {
            newSelected.push(optionId);
          }
        } else {
          newSelected = newSelected.filter(id => id !== optionId);
        }
        handleChange(newSelected);
      } else {
        handleChange(checked ? [optionId] : []);
      }
    };

    const getOptionStyle = (isSelected: boolean) => ({
      display: 'flex',
      alignItems: 'flex-start',
      padding: tokens.spacing[3],
      marginBottom: tokens.spacing[2],
      backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
      border: `2px solid ${isSelected ? colors.primary : colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    });

    const getOptionContentStyle = () => ({
      marginLeft: tokens.spacing[3],
      flex: 1,
    });

    const getOptionTitleStyle = () => ({
      ...tokens.typography.body.medium,
      color: colors.onSurface,
      margin: 0,
      fontWeight: 500,
    });

    const getOptionBodyStyle = () => ({
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      margin: 0,
      marginTop: tokens.spacing[1],
    });

    return (
      <div>
        {options.map((option: any) => {
          // Handle both formats: {id, title, body} and {value, label}
          const optionId = option.id || option.value;
          const optionTitle = option.title || option.label;
          const isSelected = selectedIds.includes(optionId);

          return (
            <div
              key={optionId}
              style={getOptionStyle(isSelected)}
              onClick={() => handleOptionChange(optionId, !isSelected)}
            >
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                checked={isSelected}
                onChange={() => {}} // Handled by div click
                style={{ marginTop: '2px' }}
              />
              <div style={getOptionContentStyle()}>
                <div style={getOptionTitleStyle()}>{optionTitle}</div>
                {option.body && (
                  <div style={getOptionBodyStyle()}>{option.body}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTextInput = (questionConfig: TextInputConfig) => {
    // Handle both nested config structure and flat structure from backend
    const multiline = questionConfig?.multiline || config.multiline || false;
    const maxLength = questionConfig?.max_length || config.max_length;
    const placeholder = questionConfig?.placeholder || config.placeholder || '';

    const inputStyle = {
      width: '100%',
      padding: tokens.spacing[3],
      backgroundColor: colors.surface,
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      color: colors.onSurface,
      fontSize: tokens.typography.body.medium.fontSize,
      fontFamily: tokens.typography.body.medium.fontFamily,
      resize: multiline ? 'vertical' as const : 'none' as const,
      minHeight: multiline ? '100px' : 'auto',
    };

    const currentLength = value?.length || 0;

    const counterStyle = {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      textAlign: 'right' as const,
      marginTop: tokens.spacing[1],
    };

    if (multiline) {
      return (
        <div>
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            style={inputStyle}
          />
          {maxLength && (
            <div style={counterStyle}>
              {currentLength} / {maxLength}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            style={inputStyle}
          />
          {maxLength && (
            <div style={counterStyle}>
              {currentLength} / {maxLength}
            </div>
          )}
        </div>
      );
    }
  };

  const renderQuestionContent = () => {
    switch (config.question_type) {
      case 'multiple_choice':
      case 'single_choice':
        return renderMultipleChoice((config.config || {}) as MultipleChoiceConfig);
      case 'text_input':
        return renderTextInput((config.config || {}) as TextInputConfig);
      default:
        return (
          <div style={{
            padding: tokens.spacing[4],
            backgroundColor: colors.errorContainer,
            color: colors.onErrorContainer,
            borderRadius: tokens.borderRadius.medium,
            textAlign: 'center',
          }}>
            Unsupported question type: {config.question_type}
          </div>
        );
    }
  };

  return (
    <div style={getContainerStyle()}>
      <h3 style={getTitleStyle()}>
        {config.question_text || config.title}
        {config.required && <span style={getRequiredStyle()}>*</span>}
      </h3>

      {config.subtitle && (
        <p style={getSubtitleStyle()}>{config.subtitle}</p>
      )}

      {renderQuestionContent()}
    </div>
  );
};