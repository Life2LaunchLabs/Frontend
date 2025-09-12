import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { ThemeProvider } from './styles'
import { QueryProvider } from './app/providers/QueryProvider'
import { ToastProvider } from './shared/components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
)