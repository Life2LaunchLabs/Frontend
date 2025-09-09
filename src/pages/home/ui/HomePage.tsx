import { useState } from 'react'
import reactLogo from '../../../assets/react.svg'
import viteLogo from '/vite.svg'
import { useTheme } from '../../../theme/ThemeContext'
import ConnectionStatus from '../../../components/ConnectionStatus/ConnectionStatus'

function HomePage() {
  const [count, setCount] = useState(0)
  const { theme, tokens } = useTheme()

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: theme.surface,
      color: theme.onSurface,
      padding: tokens.spacing[8],
      fontFamily: tokens.typography.fontFamily.default.join(', '),
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[8],
      marginBottom: tokens.spacing[8],
    },
    logo: {
      height: tokens.spacing[24],
      padding: tokens.spacing[6],
      transition: 'filter 300ms',
    },
    heading: {
      ...tokens.typography.headline.large,
      color: theme.primary,
      marginBottom: tokens.spacing[8],
    },
    card: {
      padding: tokens.spacing[8],
      backgroundColor: theme.surfaceContainer,
      borderRadius: tokens.borderRadius.large,
      marginBottom: tokens.spacing[8],
    },
    button: {
      borderRadius: tokens.borderRadius.large,
      border: '1px solid transparent',
      padding: `${tokens.spacing[3]} ${tokens.spacing[5]}`,
      ...tokens.typography.label.large,
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      cursor: 'pointer',
      transition: 'border-color 0.25s',
    },
    readTheDocs: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[8],
    },
    code: {
      backgroundColor: theme.surfaceContainerHigh,
      color: theme.onSurface,
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      fontFamily: tokens.typography.fontFamily.mono.join(', '),
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} style={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} style={styles.logo} alt="React logo" />
        </a>
      </div>
      <h1 style={styles.heading}>Vite + React</h1>
      <div style={styles.card}>
        <button 
          style={styles.button}
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code style={styles.code}>src/pages/home/ui/HomePage.tsx</code> and save to test HMR
        </p>
      </div>
      <p style={styles.readTheDocs}>
        Click on the Vite and React logos to learn more
      </p>
      
      <ConnectionStatus />
    </div>
  )
}

export default HomePage