/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import { useTheme } from './providers/hooks';

/**
 * GlobalStyles - Sets default styles for HTML elements
 *
 * This ensures consistent styling without needing to specify
 * typography and colors on every element.
 */
export const GlobalStyles = () => {
  const { colors, tokens } = useTheme();

  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: ${tokens.typography.fontFamily.default};
          background: ${colors.surface};
          color: ${colors.onSurface};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Headings */
        h1 {
          ${tokens.typography.display.small};
          color: ${colors.onSurface};
          margin: 0 0 ${tokens.spacing[4]} 0;
        }

        h2 {
          ${tokens.typography.headline.large};
          color: ${colors.onSurface};
          margin: 0 0 ${tokens.spacing[3]} 0;
        }

        h3 {
          ${tokens.typography.headline.medium};
          color: ${colors.onSurface};
          margin: 0 0 ${tokens.spacing[3]} 0;
        }

        h4 {
          ${tokens.typography.headline.small};
          color: ${colors.onSurface};
          margin: 0 0 ${tokens.spacing[2]} 0;
        }

        h5 {
          ${tokens.typography.title.large};
          color: ${colors.onSurface};
          margin: 0 0 ${tokens.spacing[2]} 0;
        }

        h6 {
          ${tokens.typography.title.medium};
          color: ${colors.onSurface};
          margin: 0 0 ${tokens.spacing[2]} 0;
        }

        /* Paragraphs and text */
        p {
          ${tokens.typography.body.medium};
          color: ${colors.onSurface};
          margin: 0 0 ${tokens.spacing[4]} 0;
          line-height: 1.6;
        }

        /* Links */
        a {
          color: ${colors.primary};
          text-decoration: none;
          transition: ${tokens.transitions.fast};

          &:hover {
            text-decoration: underline;
          }
        }

        /* Lists */
        ul, ol {
          ${tokens.typography.body.medium};
          color: ${colors.onSurfaceVariant};
          margin: 0 0 ${tokens.spacing[4]} 0;
          padding-left: ${tokens.spacing[6]};
        }

        /* Code */
        code {
          font-family: ${tokens.typography.fontFamily.mono};
          background: ${colors.surfaceContainer};
          padding: 2px 6px;
          border-radius: ${tokens.borderRadius.small};
          font-size: 0.9em;
        }

        pre {
          font-family: ${tokens.typography.fontFamily.mono};
          background: ${colors.surfaceContainer};
          padding: ${tokens.spacing[4]};
          border-radius: ${tokens.borderRadius.medium};
          overflow-x: auto;
        }

        /* Remove default button styles */
        button {
          font-family: inherit;
        }

        /* Form elements inherit font */
        input, textarea, select {
          font-family: inherit;
        }
      `}
    />
  );
};
