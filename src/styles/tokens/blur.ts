/**
 * Blur tokens for glassmorphic effects
 */

export const blur = {
  none: '0',
  light: '4px',
  medium: '12px',
  heavy: '24px',
} as const;

export type BlurKey = keyof typeof blur;
