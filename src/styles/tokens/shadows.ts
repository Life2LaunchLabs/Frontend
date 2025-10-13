/**
 * Shadow design tokens
 * Launchpad uses deeper shadows, Admin uses subtle shadows
 */

// Launchpad mode shadows (deeper, more dramatic)
export const launchpadShadows = {
  none: 'none',
  small: '0 4px 16px rgba(0, 0, 0, 0.5)',
  medium: '0 8px 32px rgba(0, 0, 0, 0.4)',
  large: '0 16px 48px rgba(0, 0, 0, 0.5)',
  glow: '0 0 16px rgba(255, 255, 255, 0.1)', // Inner glow effect
  pane: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Glassmorphic pane
} as const;

// Admin mode shadows (subtle, light)
export const adminShadows = {
  none: 'none',
  small: '0 1px 3px rgba(0, 0, 0, 0.12)',
  medium: '0 2px 4px rgba(0, 0, 0, 0.08)',
  large: '0 4px 8px rgba(0, 0, 0, 0.1)',
  glow: 'none', // No glow in admin mode
  pane: '0 1px 3px rgba(0, 0, 0, 0.12)', // Simple shadow
} as const;

// Legacy export (uses launchpad by default)
export const shadows = launchpadShadows;