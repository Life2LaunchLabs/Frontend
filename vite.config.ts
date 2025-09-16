import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
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
  ],
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
