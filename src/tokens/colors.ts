// Color Primitives
export const colorPrimitives = {
  primary: {
    50: '#f0f4f2',
    100: '#dce6e0',
    200: '#b9cdc1',
    300: '#96b4a2',
    400: '#739b83',
    500: '#2d4a3e',
    600: '#24403a',
    700: '#1b3631',
    800: '#122c28',
    900: '#09221f',
  },
  secondary: {
    50: '#f4f0ef',
    100: '#e5dbd9',
    200: '#d1b8b3',
    300: '#bd948d',
    400: '#a97067',
    500: '#8b4a47',
    600: '#73403d',
    700: '#5b3633',
    800: '#432c29',
    900: '#2b221f',
  },
  tertiary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  neutral: {
    50: '#e6dbc3',
    100: '#d9cba6',
    200: '#ccba89',
    300: '#bfa96c',
    400: '#b2984f',
    500: '#a58732',
    600: '#8a7029',
    700: '#6f5920',
    800: '#544217',
    900: '#392b0e',
  },
  neutralVariant: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// Light Theme
export const lightTheme = {
  primary: colorPrimitives.primary[500],
  onPrimary: '#ffffff',
  primaryContainer: colorPrimitives.primary[100],
  onPrimaryContainer: colorPrimitives.primary[900],
  
  secondary: colorPrimitives.secondary[500],
  onSecondary: '#ffffff',
  secondaryContainer: colorPrimitives.secondary[100],
  onSecondaryContainer: colorPrimitives.secondary[900],
  
  tertiary: colorPrimitives.tertiary[500],
  onTertiary: '#ffffff',
  tertiaryContainer: colorPrimitives.tertiary[100],
  onTertiaryContainer: colorPrimitives.tertiary[900],
  
  error: colorPrimitives.error[500],
  onError: '#ffffff',
  errorContainer: colorPrimitives.error[100],
  onErrorContainer: colorPrimitives.error[900],
  
  surface: colorPrimitives.neutral[50],
  onSurface: colorPrimitives.neutral[900],
  onSurfaceVariant: colorPrimitives.neutralVariant[600],
  
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: colorPrimitives.neutral[100],
  surfaceContainer: colorPrimitives.neutral[200],
  surfaceContainerHigh: colorPrimitives.neutral[300],
  surfaceContainerHighest: colorPrimitives.neutral[400],
  
  inverseSurface: colorPrimitives.neutral[800],
  inverseOnSurface: colorPrimitives.neutral[100],
  inversePrimary: colorPrimitives.primary[200],
  
  scrim: colorPrimitives.neutralVariant[900],
  shadow: colorPrimitives.neutralVariant[900],
} as const;

// Dark Theme
export const darkTheme = {
  primary: colorPrimitives.primary[300],
  onPrimary: colorPrimitives.primary[900],
  primaryContainer: colorPrimitives.primary[800],
  onPrimaryContainer: colorPrimitives.primary[100],
  
  secondary: colorPrimitives.secondary[300],
  onSecondary: colorPrimitives.secondary[900],
  secondaryContainer: colorPrimitives.secondary[800],
  onSecondaryContainer: colorPrimitives.secondary[100],
  
  tertiary: colorPrimitives.tertiary[300],
  onTertiary: colorPrimitives.tertiary[900],
  tertiaryContainer: colorPrimitives.tertiary[800],
  onTertiaryContainer: colorPrimitives.tertiary[100],
  
  error: colorPrimitives.error[300],
  onError: colorPrimitives.error[900],
  errorContainer: colorPrimitives.error[800],
  onErrorContainer: colorPrimitives.error[100],
  
  surface: colorPrimitives.neutral[800],
  onSurface: colorPrimitives.neutral[100],
  onSurfaceVariant: colorPrimitives.neutralVariant[300],
  
  surfaceContainerLowest: colorPrimitives.neutral[900],
  surfaceContainerLow: colorPrimitives.neutral[800],
  surfaceContainer: colorPrimitives.neutral[700],
  surfaceContainerHigh: colorPrimitives.neutral[600],
  surfaceContainerHighest: colorPrimitives.neutral[500],
  
  inverseSurface: colorPrimitives.neutral[100],
  inverseOnSurface: colorPrimitives.neutral[800],
  inversePrimary: colorPrimitives.primary[600],
  
  scrim: colorPrimitives.neutralVariant[900],
  shadow: colorPrimitives.neutralVariant[900],
} as const;

// Legacy colors for backward compatibility
export const colors = {
  primary: colorPrimitives.primary,
  secondary: colorPrimitives.secondary,
  success: colorPrimitives.tertiary,
  danger: colorPrimitives.error,
  warning: colorPrimitives.tertiary,
} as const;