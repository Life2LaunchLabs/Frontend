import React from 'react';
import { useTheme } from '../../../../styles';
import type { TestResult } from '../../types';

export interface TestResultsPanelProps {
  results: TestResult[];
  isRunning: boolean;
  onClear: () => void;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  results,
  isRunning,
  onClear
}) => {
  const { theme, tokens } = useTheme();

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'pending': return '#FF9800';
      default: return theme.onSurface;
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'pending': return '⏳';
      default: return '○';
    }
  };

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
      borderBottom: `1px solid ${theme.outline}`,
      paddingBottom: tokens.spacing[3],
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0,
    },
    clearButton: {
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]}px ${tokens.spacing[4]}px`,
      cursor: 'pointer',
      fontSize: tokens.typography.body.medium.fontSize,
      opacity: results.length > 0 && !isRunning ? 1 : 0.5,
    },
    resultsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[3],
      maxHeight: '400px',
      overflowY: 'auto' as const,
    },
    resultItem: {
      backgroundColor: theme.surfaceContainer,
      padding: tokens.spacing[4],
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
    },
    resultHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      marginBottom: tokens.spacing[2],
    },
    resultIcon: {
      fontSize: '18px',
    },
    resultTest: {
      ...tokens.typography.body.large,
      fontWeight: 600,
      color: theme.onSurface,
    },
    resultTime: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      marginLeft: 'auto',
    },
    resultMessage: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[2],
    },
    resultData: {
      backgroundColor: theme.surfaceContainerHighest,
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.small,
      fontFamily: 'monospace',
      fontSize: '12px',
      color: theme.onSurface,
      maxHeight: '150px',
      overflowY: 'auto' as const,
      whiteSpace: 'pre-wrap' as const,
    },
    emptyState: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
      fontStyle: 'italic',
    },
  });

  const styles = getStyles();

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Test Results ({results.length})</h3>
        <button
          style={styles.clearButton}
          onClick={onClear}
          disabled={results.length === 0 || isRunning}
        >
          Clear
        </button>
      </div>

      <div style={styles.resultsList}>
        {results.length === 0 ? (
          <div style={styles.emptyState}>
            No test results yet. Run some tests to see results here.
          </div>
        ) : (
          results.map((result, index) => (
            <div key={`${result.test}-${index}`} style={styles.resultItem}>
              <div style={styles.resultHeader}>
                <span 
                  style={{
                    ...styles.resultIcon,
                    color: getStatusColor(result.status)
                  }}
                >
                  {getStatusIcon(result.status)}
                </span>
                <span style={styles.resultTest}>{result.test}</span>
                {result.timestamp && (
                  <span style={styles.resultTime}>
                    {formatTimestamp(result.timestamp)}
                  </span>
                )}
              </div>

              {result.message && (
                <div style={styles.resultMessage}>
                  {result.message}
                </div>
              )}

              {result.data && (
                <div style={styles.resultData}>
                  {JSON.stringify(result.data, null, 2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};