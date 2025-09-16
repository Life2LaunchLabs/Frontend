import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Only enable checker in development, not in build
    process.env.NODE_ENV !== 'production' && checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint . --max-warnings 50',
        dev: {
          logLevel: ['error']
        }
      },
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
