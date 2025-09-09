import { useState, useEffect } from 'react'

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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [logs, setLogs] = useState<ConnectionLog[]>([])
  const [isPolling, setIsPolling] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
      case 'connected': return '#4ade80'
      case 'disconnected': return '#f87171'
      case 'checking': return '#fbbf24'
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
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#f9fafb',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
        Backend Connection Status
      </h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
        }} />
        <span style={{ fontWeight: 'bold' }}>{getStatusText()}</span>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>
          ({API_URL})
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={checkConnection}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Test Connection
        </button>
        <button
          onClick={() => setIsPolling(!isPolling)}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: isPolling ? '#ef4444' : '#10b981',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isPolling ? 'Stop Auto-check' : 'Start Auto-check'}
        </button>
        <button
          onClick={() => setLogs([])}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: '#6b7280',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Clear Logs
        </button>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4b5563' }}>
          Connection Logs:
        </h4>
        <div style={{
          height: '200px',
          overflowY: 'auto',
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#9ca3af' }}>No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ 
                marginBottom: '4px',
                color: log.status === 'success' ? '#4ade80' : '#f87171'
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