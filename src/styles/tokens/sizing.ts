export const sizing = {
  0: '0',
  1: '25rem',  // 400px
  2: '40rem',  // 640px
  3: '60rem',  // 960px
} as const;

export type sizingKey = keyof typeof sizing;

/** Pane width constraints for layouts */
export const paneWidths = {
  small: '15rem',   // 240px
  medium: '22.5rem', // 360px
  large: '30rem',   // 480px
  xl: '60rem',      // 960px
  full: '9999rem',  // essentially no limit
} as const;

export type PaneWidthKey = keyof typeof paneWidths;