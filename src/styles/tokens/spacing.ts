/**
 * Spacing tokens - 8px grid system
 * All spacing values are multiples of 8px for geometric precision
 */

export const spacing = {
  0: '0',
  1: '0.125rem',  // 2px - micro spacing
  2: '0.5rem',    // 8px - base unit
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.5rem',    // 24px
  6: '2rem',      // 32px
  7: '2.5rem',    // 40px
  8: '4rem',      // 64px
  9: '5rem',      // 80px
  10: '6rem',     // 96px
  11: '8rem',     // 128px
  12: '10rem',    // 160px
} as const;

export type SpacingKey = keyof typeof spacing;