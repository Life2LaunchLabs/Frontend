/**
 * Transition and animation tokens
 */

// Transition durations
export const duration = {
  instant: '100ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// Easing functions
export const easing = {
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Accelerate and decelerate
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)', // Start fast, end slow
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)', // Start slow, end fast
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)', // Quick, abrupt
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
} as const;

// Combined transitions (shorthand)
export const transitions = {
  instant: `${duration.instant} ${easing.standard}`,
  fast: `${duration.fast} ${easing.standard}`,
  normal: `${duration.normal} ${easing.standard}`,
  slow: `${duration.slow} ${easing.standard}`,
  slower: `${duration.slower} ${easing.standard}`,
} as const;

export type TransitionKey = keyof typeof transitions;
