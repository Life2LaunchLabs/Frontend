import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../../../styles';
import {
  QuestionBlockConfig,
  MultipleChoiceOption,
  MultipleChoiceConfig,
  TextInputConfig,
  DropdownInputConfig,
  AorBInputConfig,
  AorBPrompt,
} from '../../types';
import { Button } from '../../../../shared/components';

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
  const defaultValueForType = useMemo(() => {
    switch (config.question_type) {
      case 'multiple_choice':
      case 'single_choice':
        return [];
      case 'text_input':
      case 'dropdown_input':
        return '';
      case 'a_or_b_input':
        return {};
      default:
        return null;
    }
  }, [config.question_type]);

  const [value, setValue] = useState<any>(() => {
    if (initialValue !== undefined) {
      return initialValue ?? defaultValueForType;
    }
    return defaultValueForType;
  });

  const [aOrBIndex, setAOrBIndex] = useState(0);
  const [aOrBAnimationState, setAOrBAnimationState] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [aOrBDirection, setAOrBDirection] = useState<'forward' | 'backward'>('forward');
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const aOrBPrompts = useMemo<AorBPrompt[]>(() => {
    if (config.question_type !== 'a_or_b_input') {
      return [];
    }
    const baseConfig = (config.config || {}) as AorBInputConfig;
    return baseConfig.prompts || (baseConfig as any).options || [];
  }, [config]);

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue ?? defaultValueForType);
    }
  }, [initialValue, defaultValueForType]);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (config.question_type !== 'a_or_b_input') {
      if (aOrBIndex !== 0) {
        setAOrBIndex(0);
      }
      return;
    }

    if (aOrBPrompts.length === 0 && aOrBIndex !== 0) {
      setAOrBIndex(0);
    } else if (aOrBPrompts.length > 0 && aOrBIndex >= aOrBPrompts.length) {
      setAOrBIndex(aOrBPrompts.length - 1);
    }
  }, [config.question_type, aOrBPrompts, aOrBIndex]);

  const handleChange = (newValue: any) => {
    setValue(newValue);
    onResponseChange?.(config.question_id, newValue);
  };

  const transitionToIndex = (nextIndex: number, direction: 'forward' | 'backward') => {
    if (nextIndex < 0 || nextIndex >= aOrBPrompts.length) {
      return;
    }

    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
    }

    setAOrBDirection(direction);
    setAOrBAnimationState('exiting');

    exitTimeoutRef.current = setTimeout(() => {
      setAOrBIndex(nextIndex);
      setAOrBAnimationState('entering');

      enterTimeoutRef.current = setTimeout(() => {
        setAOrBAnimationState('idle');
      }, 200);
    }, 200);
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
    // Handle both old array format and new object format for backward compatibility
    const selections = Array.isArray(value)
      ? // Convert old array format to object format
        value.reduce((acc, id) => ({ ...acc, [id]: true }), {} as Record<string, boolean>)
      : typeof value === 'object' && value !== null
        ? (value as Record<string, boolean>)
        : {};

    // Handle both nested config and flat config from backend
    const options = questionConfig?.options || config.options || [];
    const minSelect = questionConfig?.min_select || config.min_select || 0;
    const maxSelect = questionConfig?.max_select || config.max_select || 1;
    const isMultiple = maxSelect > 1;

    const handleOptionChange = (optionId: string, checked: boolean) => {
      const selectedCount = Object.values(selections).filter(Boolean).length;

      if (checked) {
        // Check if we can add more selections
        if (selectedCount >= maxSelect) {
          return; // Already at max
        }
        handleChange({ ...selections, [optionId]: true });
      } else {
        // Remove selection
        const newSelections = { ...selections };
        delete newSelections[optionId];
        handleChange(newSelections);
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
          // Handle both formats: {id, title, body, description} and {value, label}
          const optionId = option.id || option.value;
          const optionTitle = option.title || option.label;
          const optionDescription = option.description;
          const isSelected = selections[optionId] === true;

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
                {(option.body || optionDescription) && (
                  <div style={getOptionBodyStyle()}>
                    {optionDescription || option.body}
                  </div>
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
    const textValue = typeof value === 'string' ? value : '';

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

    const currentLength = textValue.length;

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
            value={textValue}
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
            value={textValue}
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

  const renderDropdown = (questionConfig: DropdownInputConfig) => {
    const options = questionConfig?.options || (config as any).options || [];
    const placeholder = questionConfig?.placeholder || (config as any).placeholder || 'Select an option...';
    const selectedValue = typeof value === 'string' ? value : '';

    const selectStyle = {
      width: '100%',
      padding: tokens.spacing[3],
      backgroundColor: colors.surface,
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      color: selectedValue ? colors.onSurface : colors.onSurfaceVariant,
      fontSize: tokens.typography.body.medium.fontSize,
      fontFamily: tokens.typography.body.medium.fontFamily,
      outline: 'none',
    };

    const helperTextStyle = {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      marginTop: tokens.spacing[2],
    };

    return (
      <div>
        <select
          value={selectedValue}
          onChange={(e) => handleChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">{placeholder}</option>
          {options.map((option: MultipleChoiceOption) => (
            <option key={option.id} value={option.id}>
              {option.title || (option as any).label || 'Untitled option'}
            </option>
          ))}
        </select>
        {options.length === 0 && (
          <div style={helperTextStyle}>
            Add options to this dropdown to collect a response.
          </div>
        )}
      </div>
    );
  };

  const renderAorB = (questionConfig: AorBInputConfig) => {
    const prompts = aOrBPrompts;
    const answers = value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, boolean>)
      : {};

    if (prompts.length === 0) {
      return (
        <div
          style={{
            ...tokens.typography.body.small,
            color: colors.onSurfaceVariant,
          }}
        >
          Add prompts to configure this A or B sequence.
        </div>
      );
    }

    const currentPrompt = prompts[aOrBIndex];
    const progressText = `Prompt ${Math.min(aOrBIndex + 1, prompts.length)} of ${prompts.length}`;
    const currentAnswer = currentPrompt ? answers[currentPrompt.id] : undefined;
    const yesLabel = questionConfig?.positive_label || 'Yes';
    const noLabel = questionConfig?.negative_label || 'No';

    const getAnimationTransform = () => {
      if (aOrBAnimationState === 'idle') return 'translateX(0)';
      if (aOrBAnimationState === 'exiting') {
        return aOrBDirection === 'forward' ? 'translateX(-12px)' : 'translateX(12px)';
      }
      if (aOrBAnimationState === 'entering') {
        return aOrBDirection === 'forward' ? 'translateX(12px)' : 'translateX(-12px)';
      }
      return 'translateX(0)';
    };

    const cardStyle = {
      padding: tokens.spacing[4],
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${colors.outline}`,
      backgroundColor: colors.surface,
      minHeight: '160px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      opacity: aOrBAnimationState === 'exiting' ? 0 : 1,
      transform: getAnimationTransform(),
    };

    const promptTitleStyle = {
      ...tokens.typography.title.small,
      color: colors.onSurface,
      margin: 0,
    };

    const promptBodyStyle = {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      margin: 0,
    };

    const progressStyle = {
      ...tokens.typography.label.small,
      color: colors.onSurfaceVariant,
    };

    const buttonRowStyle = {
      display: 'flex',
      gap: tokens.spacing[2],
      marginTop: tokens.spacing[3],
      flexWrap: 'wrap' as const,
    };

    const handleAnswer = (decision: boolean) => {
      if (!currentPrompt) return;
      const updatedAnswers = {
        ...answers,
        [currentPrompt.id]: decision,
      };
      handleChange(updatedAnswers);

      if (aOrBIndex < prompts.length - 1) {
        transitionToIndex(aOrBIndex + 1, 'forward');
      }
    };

    const handleBack = () => {
      if (aOrBIndex === 0) return;
      transitionToIndex(aOrBIndex - 1, 'backward');
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing[2] }}>
          <span style={progressStyle}>{progressText}</span>
          <span style={progressStyle}>
            {Object.keys(answers).length}/{prompts.length} answered
          </span>
        </div>
        <div style={cardStyle}>
          <h4 style={promptTitleStyle}>{currentPrompt?.title}</h4>
          {currentPrompt?.description && (
            <p style={promptBodyStyle}>{currentPrompt.description}</p>
          )}
        </div>
        <div style={buttonRowStyle}>
          <Button
            variant={currentAnswer === true ? 'filled' : 'outlined'}
            onClick={() => handleAnswer(true)}
          >
            {yesLabel}
          </Button>
          <Button
            variant={currentAnswer === false ? 'filled' : 'outlined'}
            onClick={() => handleAnswer(false)}
          >
            {noLabel}
          </Button>
          <Button
            variant="text"
            onClick={handleBack}
            disabled={aOrBIndex === 0}
          >
            Back
          </Button>
        </div>
      </div>
    );
  };

  const renderQuestionContent = () => {
    switch (config.question_type) {
      case 'multiple_choice':
      case 'single_choice':
        return renderMultipleChoice((config.config || {}) as MultipleChoiceConfig);
      case 'text_input':
        return renderTextInput((config.config || {}) as TextInputConfig);
      case 'dropdown_input':
        return renderDropdown((config.config || {}) as DropdownInputConfig);
      case 'a_or_b_input':
        return renderAorB((config.config || {}) as AorBInputConfig);
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