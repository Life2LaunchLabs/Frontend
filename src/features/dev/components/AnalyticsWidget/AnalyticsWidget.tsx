import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../styles';
import { DevChatService } from '../../api';

export interface AnalyticsWidgetProps {
  className?: string;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ className }) => {
  const { theme, tokens } = useTheme();
  const [analytics, setAnalytics] = useState<any>(null);
  const [providerComparison, setProviderComparison] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
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
      cursor: 'pointer',
      opacity: isLoading ? 0.6 : 1,
      transition: 'opacity 0.2s ease',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: tokens.spacing[3],
    },
    metric: {
      backgroundColor: theme.surfaceContainerHighest,
      borderRadius: tokens.borderRadius.small,
      padding: tokens.spacing[3],
      textAlign: 'center' as const,
    },
    metricValue: {
      ...tokens.typography.headline.small,
      color: theme.primary,
      margin: 0,
      marginBottom: tokens.spacing[1],
    },
    metricLabel: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      margin: 0,
    },
    section: {
      backgroundColor: theme.surfaceContainerHighest,
      borderRadius: tokens.borderRadius.small,
      padding: tokens.spacing[4],
    },
    sectionTitle: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      margin: `0 0 ${tokens.spacing[2]}px 0`,
      fontWeight: 600,
    },
    providerList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    providerItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${tokens.spacing[1]}px 0`,
    },
    providerName: {
      ...tokens.typography.body.small,
      color: theme.onSurface,
      margin: 0,
    },
    providerStats: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      margin: 0,
    },
    loadingState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      color: theme.onSurfaceVariant,
      ...tokens.typography.body.medium,
    },
    errorState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      color: theme.error,
      ...tokens.typography.body.medium,
      textAlign: 'center' as const,
    },
    noDataState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      color: theme.onSurfaceVariant,
      ...tokens.typography.body.medium,
      textAlign: 'center' as const,
    },
  });

  const styles = getStyles();

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [analyticsData, comparisonData] = await Promise.all([
        DevChatService.getAnalytics(),
        DevChatService.getProviderComparison()
      ]);
      
      setAnalytics(analyticsData);
      setProviderComparison(comparisonData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleRefresh = () => {
    if (!isLoading) {
      loadAnalytics();
    }
  };

  if (error) {
    return (
      <div className={className} style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>📊 Analytics Dashboard</h3>
          <button style={styles.refreshButton} onClick={handleRefresh} disabled={isLoading}>
            🔄 Retry
          </button>
        </div>
        <div style={styles.errorState}>
          <div>
            <div>❌ Error loading analytics</div>
            <div style={{ marginTop: tokens.spacing[1], fontSize: '12px' }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className} style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>📊 Analytics Dashboard</h3>
          <button style={styles.refreshButton} disabled>
            ⏳ Loading...
          </button>
        </div>
        <div style={styles.loadingState}>
          Loading analytics data...
        </div>
      </div>
    );
  }

  if (!analytics || !providerComparison) {
    return (
      <div className={className} style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>📊 Analytics Dashboard</h3>
          <button style={styles.refreshButton} onClick={handleRefresh}>
            🔄 Load Data
          </button>
        </div>
        <div style={styles.noDataState}>
          <div>
            <div>📊 No analytics data available</div>
            <div style={{ marginTop: tokens.spacing[1], fontSize: '12px' }}>
              Create some sessions and send messages to see analytics
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalSessions = analytics.session_stats?.total_sessions || 0;
  const totalMessages = analytics.message_stats?.total_messages || 0;
  const userMessages = analytics.message_stats?.user_messages || 0;
  const assistantMessages = analytics.message_stats?.assistant_messages || 0;
  const providerCount = Object.keys(providerComparison.provider_comparison || {}).length;

  return (
    <div className={className} style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Analytics Dashboard</h3>
        <button style={styles.refreshButton} onClick={handleRefresh} disabled={isLoading}>
          🔄 Refresh
        </button>
      </div>
      
      <div style={styles.content}>
        {/* Key Metrics */}
        <div style={styles.metricsGrid}>
          <div style={styles.metric}>
            <div style={styles.metricValue}>{totalSessions}</div>
            <div style={styles.metricLabel}>Sessions</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricValue}>{totalMessages}</div>
            <div style={styles.metricLabel}>Messages</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricValue}>{userMessages}</div>
            <div style={styles.metricLabel}>User</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricValue}>{assistantMessages}</div>
            <div style={styles.metricLabel}>Assistant</div>
          </div>
        </div>

        {/* Provider Usage */}
        {providerCount > 0 && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Provider Usage</h4>
            <div style={styles.providerList}>
              {Object.entries(providerComparison.provider_comparison).map(([provider, stats]: [string, any]) => (
                <div key={provider} style={styles.providerItem}>
                  <span style={styles.providerName}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </span>
                  <span style={styles.providerStats}>
                    {stats.sessions} sessions • {stats.messages} msgs
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Topics */}
        {analytics.conversation_topics?.length > 0 && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Top Topics</h4>
            <div style={styles.providerList}>
              {analytics.conversation_topics.slice(0, 3).map((topic: any) => (
                <div key={topic.topic} style={styles.providerItem}>
                  <span style={styles.providerName}>
                    {topic.topic.charAt(0).toUpperCase() + topic.topic.slice(1)}
                  </span>
                  <span style={styles.providerStats}>
                    {topic.mentions} mentions • {topic.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};