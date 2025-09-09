import { useState, useEffect } from 'react'
import { useTheme } from '../../theme'

interface ConnectionLog {
  timestamp: string
  status: 'success' | 'error'
  message: string
  responseTime?: number
}

interface HealthResponse {
  status: string
  message: string
  timestamp: string
  version: string
}

const ConnectionStatus = () => {
  const { theme, tokens } = useTheme()
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [logs, setLogs] = useState<ConnectionLog[]>([])
  const [isPolling, setIsPolling] = useState(true)

  // Format API URL to ensure it has proper scheme
  const formatApiUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return `http://${url}`
      } else {
        return `https://${url}`
      }
    }
    return url
  }

  const API_URL = formatApiUrl(import.meta.env.VITE_API_URL || 'localhost:8000')

  const addLog = (log: ConnectionLog) => {
    setLogs(prev => [log, ...prev.slice(0, 9)]) // Keep last 10 logs
  }

  const checkConnection = async () => {
    const startTime = Date.now()
    
    try {
      const response = await fetch(`${API_URL}/api/health/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        const data: HealthResponse = await response.json()
        setConnectionStatus('connected')
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          status: 'success',
          message: `✅ ${data.message} (${responseTime}ms)`,
          responseTime
        })
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      setConnectionStatus('disconnected')
      addLog({
        timestamp: new Date().toLocaleTimeString(),
        status: 'error',
        message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  }

  useEffect(() => {
    // Initial check
    checkConnection()

    // Set up polling if enabled
    let interval: number | null = null
    if (isPolling) {
      interval = setInterval(checkConnection, 5000) // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPolling])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return theme.tertiary
      case 'disconnected': return theme.error
      case 'checking': return theme.tertiary
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected'
      case 'disconnected': return 'Disconnected'
      case 'checking': return 'Checking...'
    }
  }

  return (
    <div style={{
      border: `1px solid ${theme.onSurfaceVariant}`,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[4],
      margin: `${tokens.spacing[4]} 0`,
      backgroundColor: theme.surfaceContainerLow,
      color: theme.onSurface,
      fontFamily: tokens.typography.fontFamily.mono.join(', ')
    }}>
      <h3 style={{ 
        margin: `0 0 ${tokens.spacing[3]} 0`,
        ...tokens.typography.title.medium,
        color: theme.onSurface
      }}>
        Backend Connection Status
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: tokens.spacing[2], 
        marginBottom: tokens.spacing[4] 
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: tokens.borderRadius.full,
          backgroundColor: getStatusColor(),
        }} />
        <span style={{ 
          ...tokens.typography.label.medium,
          color: theme.onSurface 
        }}>{getStatusText()}</span>
        <span style={{ 
          ...tokens.typography.body.small,
          color: theme.onSurfaceVariant 
        }}>
          ({API_URL})
        </span>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: tokens.spacing[2], 
        marginBottom: tokens.spacing[4] 
      }}>
        <button
          onClick={checkConnection}
          style={{
            padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
            border: `1px solid ${theme.onSurfaceVariant}`,
            borderRadius: tokens.borderRadius.medium,
            backgroundColor: theme.surface,
            color: theme.onSurface,
            cursor: 'pointer',
            ...tokens.typography.body.small
          }}
        >
          Test Connection
        </button>
        <button
          onClick={() => setIsPolling(!isPolling)}
          style={{
            padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
            border: 'none',
            borderRadius: tokens.borderRadius.medium,
            backgroundColor: isPolling ? theme.error : theme.tertiary,
            color: isPolling ? theme.onError : theme.onTertiary,
            cursor: 'pointer',
            ...tokens.typography.body.small
          }}
        >
          {isPolling ? 'Stop Auto-check' : 'Start Auto-check'}
        </button>
        <button
          onClick={() => setLogs([])}
          style={{
            padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
            border: 'none',
            borderRadius: tokens.borderRadius.medium,
            backgroundColor: theme.onSurfaceVariant,
            color: theme.surface,
            cursor: 'pointer',
            ...tokens.typography.body.small
          }}
        >
          Clear Logs
        </button>
      </div>

      <div>
        <h4 style={{ 
          margin: `0 0 ${tokens.spacing[2]} 0`,
          ...tokens.typography.body.medium,
          color: theme.onSurfaceVariant
        }}>
          Connection Logs:
        </h4>
        <div style={{
          height: '200px',
          overflowY: 'auto',
          backgroundColor: theme.surfaceContainer,
          color: theme.onSurface,
          padding: tokens.spacing[2],
          borderRadius: tokens.borderRadius.medium,
          ...tokens.typography.body.small,
          lineHeight: '1.4',
          border: `1px solid ${theme.onSurfaceVariant}`
        }}>
          {logs.length === 0 ? (
            <div style={{ color: theme.onSurfaceVariant }}>No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ 
                marginBottom: tokens.spacing[1],
                color: log.status === 'success' ? theme.tertiary : theme.error
              }}>
                [{log.timestamp}] {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus