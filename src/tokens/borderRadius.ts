export const borderRadius = {
  none: '0px',
  small: '2px',
  medium: '6px',
  large: '8px',
  xl: '16px',
  full: '1000px',
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;