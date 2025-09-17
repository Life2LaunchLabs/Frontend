import React, { createContext, useState, ReactNode } from 'react';
import { lightTheme, darkTheme } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { borderRadius } from '../tokens/borderRadius';
import { typography } from '../tokens/typography';
import { shadows } from '../tokens/shadows';

export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  tokens: {
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    typography: typeof typography;
    shadows: typeof shadows;
  };
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialMode = 'light' 
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  
  const theme = mode === 'light' ? lightTheme : darkTheme;
  
  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    mode,
    setMode,
    toggleMode,
    tokens: {
      spacing,
      borderRadius,
      typography,
      shadows,
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

