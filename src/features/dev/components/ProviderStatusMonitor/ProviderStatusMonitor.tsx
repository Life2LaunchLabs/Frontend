import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../styles';
import { DevChatService } from '../../api';

export interface ProviderStatusMonitorProps {
  onRefresh?: () => void;
}

export const ProviderStatusMonitor: React.FC<ProviderStatusMonitorProps> = ({ 
  onRefresh 
}) => {
  const { theme, tokens } = useTheme();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProviderStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await DevChatService.getProviderStatus();
      setStatus(result);
      onRefresh?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderStatus();
  }, []);

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[4],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
    },
    refreshButton: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]}px ${tokens.spacing[4]}px`,
      fontSize: tokens.typography.body.small.fontSize,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
    },
    providerGrid: {
      display: 'grid',
      gap: tokens.spacing[4],
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    },
    providerCard: {
      backgroundColor: theme.surfaceContainer,
      borderRadius: tokens.borderRadius.small,
      padding: tokens.spacing[4],
      border: `1px solid ${theme.outline}`,
    },
    providerName: {
      ...tokens.typography.body.large,
      fontWeight: 600,
      color: theme.onSurface,
      margin: `0 0 ${tokens.spacing[2]}px 0`,
      textTransform: 'capitalize' as const,
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      marginBottom: tokens.spacing[1],
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    statusText: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
    },
    summary: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      marginBottom: tokens.spacing[4],
      padding: tokens.spacing[3],
      backgroundColor: theme.primaryContainer,
      borderRadius: tokens.borderRadius.small,
    },
    error: {
      ...tokens.typography.body.medium,
      color: theme.error,
      textAlign: 'center' as const,
      padding: tokens.spacing[4],
      backgroundColor: theme.errorContainer,
      borderRadius: tokens.borderRadius.small,
    },
    loading: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[4],
    },
  });

  const styles = getStyles();

  if (loading && !status) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>🌐 Provider Status</h3>
        </div>
        <div style={styles.loading}>Loading provider status...</div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>🌐 Provider Status</h3>
          <button style={styles.refreshButton} onClick={loadProviderStatus}>
            Retry
          </button>
        </div>
        <div style={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🌐 Provider Status</h3>
        <button style={styles.refreshButton} onClick={loadProviderStatus} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {status && (
        <>
          <div style={styles.summary}>
            {status.available_count}/{status.total_count} providers available
          </div>

          <div style={styles.providerGrid}>
            {Object.entries(status.providers).map(([providerName, providerInfo]: [string, any]) => (
              <div key={providerName} style={styles.providerCard}>
                <div style={styles.providerName}>{providerName}</div>
                
                <div style={styles.statusIndicator}>
                  <div 
                    style={{
                      ...styles.statusDot,
                      backgroundColor: providerInfo.available ? '#4CAF50' : '#F44336'
                    }}
                  />
                  <span style={styles.statusText}>
                    {providerInfo.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div style={styles.statusIndicator}>
                  <div 
                    style={{
                      ...styles.statusDot,
                      backgroundColor: providerInfo.api_key_configured ? '#4CAF50' : '#FF9800'
                    }}
                  />
                  <span style={styles.statusText}>
                    API Key {providerInfo.api_key_configured ? 'Configured' : 'Missing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};