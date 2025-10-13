/**
 * Color tokens for Launchpad design system
 * Supports two modes: Launchpad (dark, aurora) and Admin (light, clean)
 */

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


// ============================================================================
// LAUNCHPAD MODE COLORS (Dark, Cold Aurora)
// ============================================================================

export const launchpadColors = {
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
  surfaceVariant: colorPrimitives.neutralVariant[700],
  onSurfaceVariant: colorPrimitives.neutralVariant[300],

  outline: colorPrimitives.neutralVariant[500],
  outlineVariant: colorPrimitives.neutralVariant[600],
  
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
  glass: withOpacity(colorPrimitives.neutral[800], 0.4)
} as const;

// ============================================================================
// ADMIN MODE COLORS (Light, Clean)
// ============================================================================
// Light Theme
export const adminColors = {
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
  surfaceVariant: colorPrimitives.neutralVariant[200],
  onSurfaceVariant: colorPrimitives.neutralVariant[600],

  outline: colorPrimitives.neutralVariant[400],
  outlineVariant: colorPrimitives.neutralVariant[300],
  
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
  glass: withOpacity(colorPrimitives.neutral[50], 0.4)
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Add opacity to a color
 * Works with hex, rgb, or rgba values
 */
export function withOpacity(color: string, opacity: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    // Extract RGB values
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`;
    }
  }

  // Handle named rgba colors (return as-is or modify)
  if (color.startsWith('rgba')) {
    const parts = color.match(/rgba\(([^)]+)\)/);
    if (parts && parts[1]) {
      const values = parts[1].split(',').map(v => v.trim());
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
    }
  }

  return color;
}

/**
 * Create state layer color (for hover, focus, etc.)
 * Material Design 3 state layer system
 */
export function stateLayer(baseColor: string, opacity: number): string {
  return withOpacity(baseColor, opacity);
}

// State layer opacity values (Material Design 3)
export const stateOpacity = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LaunchpadColors = typeof launchpadColors;
export type AdminColors = typeof adminColors;
export type DesignMode = 'launchpad' | 'admin';

