/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTheme } from '../../../styles';

export interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const { colors, tokens } = useTheme();

  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      css={{
        width: '100%',
        height: '8px',
        backgroundColor: colors.surfaceContainerHighest,
        borderRadius: tokens.borderRadius.full,
        overflow: 'hidden',
      }}
    >
      <div
        css={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: colors.primary,
          borderRadius: tokens.borderRadius.full,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
};
