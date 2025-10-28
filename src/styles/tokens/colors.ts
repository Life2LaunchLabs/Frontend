/**
 * Color tokens for Launchpad design system
 * Supports two modes: Launchpad (dark, aurora) and Admin (light, clean)
 */

export const colorPrimitives = {
  primary: {
    50: '#ffddcc',
    100: '#ffaf8c',
    200: '#ff794d',
    300: '#ff6040',
    400: '#f3473d',
    500: '#eb343a',
    600: '#e21a32',
    700: '#991722',
    800: '#661738',
    900: '#4d0925',
  },
  secondary: {
    50: '#19a7ff',
    100: '#0097f4',
    200: '#0087e8',
    300: '#0077dc',
    400: '#0067d0',
    500: '#0057c2',
    600: '#0047b4',
    700: '#0037a6',
    800: '#002797',
    900: '#081587',
  },
  tertiary: {
    50: '#fffaf4',
    100: '#ffe5b2',
    200: '#ffd787',
    300: '#ffcf66',
    400: '#ffc800',
    500: '#ffa733',
    600: '#e58f17',
    700: '#b26c09',
    800: '#8f5011',
    900: '#332008',
  },
  error: {
    50: '#fcf4f4',
    100: '#f2c2c2',
    200: '#e37d7d',
    300: '#d94c4c',
    400: '#e31919',
    500: '#cc1616',
    600: '#b01212',
    700: '#7d0e0e',
    800: '#4a0808',
    900: '#170202',
  },
  neutral: {
    50: '#f1f1f9',
    100: '#e9eaf5',
    200: '#d2d4eb',
    300: '#6e73bf',
    400: '#6368ac',
    500: '#585c99',
    600: '#53568f',
    700: '#424573',
    800: '#313456',
    900: '#272843',
  },
  neutralVariant: {
    50: '#f7f7f7',
    100: '#d7d7d7',
    200: '#bbbaba',
    300: '#9c9b9c',
    400: '#7e7d7d',
    500: '#605e5f',
    600: '#4d4b4c',
    700: '#3a3839',
    800: '#262626',
    900: '#131313',
  },
} as const;


// ============================================================================
// LAUNCHPAD MODE COLORS (Dark Mode)
// ============================================================================

export const launchpadColors = {
  primary: colorPrimitives.primary[400],
  surfaceTint: '#ff00e6',
  onPrimary: '#ffffff',
  primaryContainer: colorPrimitives.primary[800],
  onPrimaryContainer: '#ffffff',

  secondary: colorPrimitives.secondary[400],
  onSecondary: '#ffffff',
  secondaryContainer: colorPrimitives.secondary[800],
  onSecondaryContainer: '#ffffff',

  tertiary: colorPrimitives.tertiary[400],
  onTertiary: colorPrimitives.tertiary[900],
  tertiaryContainer: colorPrimitives.tertiary[800],
  onTertiaryContainer: colorPrimitives.tertiary[200],

  error: colorPrimitives.error[400],
  onError: colorPrimitives.error[900],
  errorContainer: colorPrimitives.error[700],
  onErrorContainer: '#ffffff',

  background: '#121212',
  onBackground: '#fafafa',

  surface: colorPrimitives.neutral[900],
  onSurface: colorPrimitives.neutral[50],
  surfaceVariant: colorPrimitives.neutralVariant[800],
  onSurfaceVariant: colorPrimitives.neutralVariant[100],

  outline: colorPrimitives.neutralVariant[200],
  outlineVariant: colorPrimitives.neutralVariant[600],

  shadow: '#000000',
  scrim: '#000000',

  inverseSurface: colorPrimitives.neutral[200],
  inverseOnSurface: colorPrimitives.neutral[900],
  inversePrimary: colorPrimitives.primary[400],

  surfaceContainerLowest: colorPrimitives.neutral[800],
  surfaceContainerLow: colorPrimitives.neutral[700],
  surfaceContainer: colorPrimitives.neutral[600],
  surfaceContainerHigh: colorPrimitives.neutral[500],
  surfaceContainerHighest: colorPrimitives.neutral[400],

  glass: withOpacity(colorPrimitives.neutral[900], 0.4)
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

/**
 * Apply glassmorphic effect to any color
 * Returns a CSSObject with all glass effect properties
 *
 * @param color - Base color to apply glass effect to
 * @param opacity - Opacity of the glass effect (default: 0.4)
 * @param options - Optional configuration for blur, border, and shadow
 * @returns CSSObject with background, backdrop filter, border, and shadow
 *
 * @example
 * // With defaults
 * const styles = glassify(colors.primary);
 *
 * // With custom opacity
 * const styles = glassify(colors.secondary, 0.6);
 *
 * // With custom tokens
 * const styles = glassify(colors.tertiary, 0.5, {
 *   blur: '16px',
 *   borderColor: colors.outline,
 *   shadow: tokens.shadows.large
 * });
 */
export function glassify(
  color: string,
  opacity: number = 0.4,
  options?: {
    blur?: string;
    borderColor?: string;
    shadow?: string;
  }
) {
  return {
    background: withOpacity(color, opacity),
    backdropFilter: `blur(${options?.blur || '12px'})`,
    WebkitBackdropFilter: `blur(${options?.blur || '12px'})`,
    border: `1px solid ${options?.borderColor || 'rgba(255, 255, 255, 0.2)'}`,
    boxShadow: options?.shadow || '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  };
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

