/**
 * Typography tokens for Launchpad design system
 * Based on Material Design 3 type scale with Poppins font
 */

export const typography = {
  fontFamily: {
    default: [
      'Poppins',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
    ].join(', '),
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      '"SF Mono"',
      'Consolas',
      '"Liberation Mono"',
      'Menlo',
      'monospace',
    ].join(', '),
  },

  // Display - Large, impactful text
  display: {
    large: {
      fontSize: '56px',
      fontWeight: '300',
      lineHeight: '64px',
      letterSpacing: '-0.25px',
    },
    medium: {
      fontSize: '44px',
      fontWeight: '300',
      lineHeight: '52px',
      letterSpacing: '0px',
    },
    small: {
      fontSize: '36px',
      fontWeight: '400',
      lineHeight: '44px',
      letterSpacing: '0px',
    },
  },

  // Headline - High-emphasis, short text
  headline: {
    large: {
      fontSize: '32px',
      fontWeight: '400',
      lineHeight: '40px',
      letterSpacing: '0px',
    },
    medium: {
      fontSize: '28px',
      fontWeight: '400',
      lineHeight: '36px',
      letterSpacing: '0px',
    },
    small: {
      fontSize: '24px',
      fontWeight: '400',
      lineHeight: '32px',
      letterSpacing: '0px',
    },
  },

  // Title - Medium-emphasis text
  title: {
    large: {
      fontSize: '22px',
      fontWeight: '400',
      lineHeight: '28px',
      letterSpacing: '0px',
    },
    medium: {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '24px',
      letterSpacing: '0.15px',
    },
    small: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
  },

  // Body - Main content text
  body: {
    large: {
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      letterSpacing: '0.5px',
    },
    medium: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      letterSpacing: '0.25px',
    },
    small: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      letterSpacing: '0.25px',
    },
  },

  // Label - Buttons, tabs, labels
  label: {
    large: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    medium: {
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
    small: {
      fontSize: '11px',
      fontWeight: '500',
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
  },
} as const;

export type TypographyVariant =
  | 'display.large' | 'display.medium' | 'display.small'
  | 'headline.large' | 'headline.medium' | 'headline.small'
  | 'title.large' | 'title.medium' | 'title.small'
  | 'body.large' | 'body.medium' | 'body.small'
  | 'label.large' | 'label.medium' | 'label.small';
