import '@emotion/react';
import type { Theme as CustomTheme } from './styles/providers/ThemeContext';

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}
