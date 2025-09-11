import React from 'react';
import { useTheme } from '../../theme';
import { Chip } from '../Chip';

export interface QuickInputChipsProps {
  inputs: string[];
  onInputClick: (input: string) => void;
  disabled?: boolean;
  variant?: 'filled' | 'outlined' | 'elevated';
  className?: string;
  style?: React.CSSProperties;
}

export const QuickInputChips: React.FC<QuickInputChipsProps> = ({
  inputs,
  onInputClick,
  disabled = false,
  variant = 'filled',
  className,
  style,
}) => {
  const { tokens } = useTheme();

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacing[2],
    flexWrap: 'wrap',
    ...style,
  };

  const handleChipClick = (input: string) => {
    if (!disabled) {
      onInputClick(input);
    }
  };

  if (!inputs || inputs.length === 0) {
    return null;
  }

  return (
    <div 
      className={className}
      style={containerStyles}
      data-testid="quick-input-chips"
    >
      {inputs.map((input, index) => (
        <Chip
          key={index}
          variant={variant}
          disabled={disabled}
          onClick={() => handleChipClick(input)}
        >
          {input}
        </Chip>
      ))}
    </div>
  );
};