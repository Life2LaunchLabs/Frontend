import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    // Only enable checker in development, not in build
    process.env.NODE_ENV !== 'production' && checker({
      typescript: true,
      // Disable ESLint in vite-plugin-checker due to ESLint 9 compatibility issues
      // You can still run ESLint manually with: npm run lint
      overlay: {
        initialIsOpen: false,
      }
    }),
  ].filter(Boolean),
  server: {
    proxy: {
      '/api': {
        target: `http://${process.env.VITE_API_URL || 'localhost:8000'}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
