import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import {
  launchpadColors,
  adminColors,
  launchpadShadows,
  adminShadows,
  spacing,
  sizing,
  paneWidths,
  borderRadius,
  typography,
  transitions,
  blur,
  zIndex,
  breakpoints,
} from '../tokens';
import type { LaunchpadColors, AdminColors } from '../tokens';

// Design mode type
export type DesignMode = 'launchpad' | 'admin';

// Theme type with all tokens
export interface Theme {
  mode: DesignMode;
  colors: LaunchpadColors | AdminColors;
  tokens: {
    spacing: typeof spacing;
    sizing: typeof sizing;
    paneWidths: typeof paneWidths;
    borderRadius: typeof borderRadius;
    typography: typeof typography;
    shadows: typeof launchpadShadows | typeof adminShadows;
    transitions: typeof transitions;
    blur: typeof blur;
    zIndex: typeof zIndex;
    breakpoints: typeof breakpoints;
  };
}

export interface ThemeContextType {
  mode: DesignMode;
  colors: LaunchpadColors | AdminColors;
  tokens: Theme['tokens'];
  setMode: (mode: DesignMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: DesignMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode,
}) => {
  // Determine initial mode from localStorage or prop or route
  const getInitialMode = (): DesignMode => {
    if (initialMode) return initialMode;

    // Check localStorage for saved preference
    const saved = localStorage.getItem('launchpad-design-mode') as DesignMode | null;
    if (saved === 'launchpad' || saved === 'admin') return saved;

    // Check route
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }

    return 'launchpad';
  };

  const [mode, setModeState] = useState<DesignMode>(getInitialMode);

  // Persist mode to localStorage
  const setMode = (newMode: DesignMode) => {
    setModeState(newMode);
    localStorage.setItem('launchpad-design-mode', newMode);
  };

  // Update mode based on route changes - monitor URL changes with MutationObserver and events
  useEffect(() => {
    const updateModeFromPath = () => {
      const path = window.location.pathname;
      const shouldBeAdmin = path.startsWith('/admin/');
      const newMode = shouldBeAdmin ? 'admin' : 'launchpad';

      if (newMode !== mode) {
        setModeState(newMode);
      }
    };

    // Listen to both popstate (back/forward) and custom navigation events
    window.addEventListener('popstate', updateModeFromPath);

    // Intercept pushState and replaceState to catch programmatic navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      updateModeFromPath();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      updateModeFromPath();
    };

    return () => {
      window.removeEventListener('popstate', updateModeFromPath);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [mode]);

  // Create theme object
  const theme: Theme = useMemo(
    () => ({
      mode,
      colors: mode === 'launchpad' ? launchpadColors : adminColors,
      tokens: {
        spacing,
        sizing,
        paneWidths,
        borderRadius,
        typography,
        shadows: mode === 'launchpad' ? launchpadShadows : adminShadows,
        transitions,
        blur,
        zIndex,
        breakpoints,
      },
    }),
    [mode]
  );

  const contextValue: ThemeContextType = useMemo(
    () => ({
      mode,
      colors: theme.colors,
      tokens: theme.tokens,
      setMode,
    }),
    [mode, theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <EmotionThemeProvider theme={theme}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};
