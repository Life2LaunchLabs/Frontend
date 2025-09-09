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
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      '"SF Mono"',
      'Consolas',
      '"Liberation Mono"',
      'Menlo',
      'monospace',
    ],
  },
  display: {
    large: {
      fontSize: '57px',
      fontWeight: '700',
      fontFamily: 'Poppins',
    },
    medium: {
      fontSize: '45px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
    small: {
      fontSize: '36px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
  },
  headline: {
    large: {
      fontSize: '32px',
      fontWeight: '700',
      fontFamily: 'Poppins',
    },
    medium: {
      fontSize: '28px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
    small: {
      fontSize: '24px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
  },
  title: {
    large: {
      fontSize: '22px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
    medium: {
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: 'Poppins',
    },
    small: {
      fontSize: '14px',
      fontWeight: '500',
      fontFamily: 'Poppins',
    },
  },
  label: {
    large: {
      fontSize: '14px',
      fontWeight: '700',
      fontFamily: 'Poppins',
    },
    medium: {
      fontSize: '12px',
      fontWeight: '700',
      fontFamily: 'Poppins',
    },
    small: {
      fontSize: '11px',
      fontWeight: '500',
      fontFamily: 'Poppins',
    },
  },
  body: {
    large: {
      fontSize: '16px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
    medium: {
      fontSize: '14px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
    small: {
      fontSize: '10px',
      fontWeight: '400',
      fontFamily: 'Poppins',
    },
  },
} as const;