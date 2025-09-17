import React, { useState } from 'react';
import { useTheme } from '../../../styles';
import { useDevTests } from '../hooks';
import { useLogout } from '../../auth';
import { 
  TestResultsPanel, 
  PresetSelector, 
  ProviderStatusMonitor,
  LiveChatInterface,
  SessionHistoryViewer,
  AnalyticsWidget
} from '../components';

export const DevPage: React.FC = () => {
  const { theme, tokens } = useTheme();
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('claude_balanced');
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const logoutMutation = useLogout();
  
  const {
    testResults,
    isRunning,
    clearResults,
    runAllTests,
    testChatEndpoint,
    testPresetInfo,
    testSessionCreation,
    testSessionList,
    testProviderStatus,
    testRealMessage,
    // testConversationContext,
    // Phase 3 test methods
    testAnalytics,
    testProviderComparison,
    testWebSocketStreaming
    // testSessionInsights
  } = useDevTests();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handlePresetSelected = (preset: any) => {
    setSelectedPresetKey(preset.key);
  };

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      backgroundColor: theme.surface,
      padding: tokens.spacing[6],
    },
    header: {
      marginBottom: tokens.spacing[8],
      textAlign: 'center' as const,
    },
    title: {
      ...tokens.typography.display.medium,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2],
    },
    subtitle: {
      ...tokens.typography.headline.small,
      color: theme.onSurfaceVariant,
      margin: 0,
      marginBottom: tokens.spacing[4],
    },
    description: {
      ...tokens.typography.body.large,
      color: theme.onSurfaceVariant,
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.6,
    },
    mainContent: {
      display: 'grid',
      gap: tokens.spacing[6],
      gridTemplateColumns: '1fr',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    controlsPanel: {
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
    },
    controlsTitle: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: `0 0 ${tokens.spacing[4]}px 0`,
    },
    buttonGrid: {
      display: 'grid',
      gap: tokens.spacing[4],
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    },
    button: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[4]}px ${tokens.spacing[6]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      cursor: isRunning ? 'not-allowed' : 'pointer',
      opacity: isRunning ? 0.6 : 1,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing[2],
    },
    secondaryButton: {
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[4]}px ${tokens.spacing[6]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      cursor: isRunning ? 'not-allowed' : 'pointer',
      opacity: isRunning ? 0.6 : 1,
      transition: 'all 0.2s ease',
    },
    runAllButton: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.medium,
      padding: `${tokens.spacing[4]}px ${tokens.spacing[8]}px`,
      fontSize: tokens.typography.headline.small.fontSize,
      fontWeight: 600,
      cursor: isRunning ? 'not-allowed' : 'pointer',
      opacity: isRunning ? 0.6 : 1,
      gridColumn: '1 / -1',
      marginTop: tokens.spacing[4],
    },
    statusBadge: {
      display: 'inline-block',
      backgroundColor: isRunning ? '#FF9800' : '#4CAF50',
      color: 'white',
      padding: `${tokens.spacing[1]}px ${tokens.spacing[3]}px`,
      borderRadius: tokens.borderRadius.full,
      fontSize: '12px',
      fontWeight: 600,
      marginLeft: tokens.spacing[3],
    },
    authSection: {
      position: 'absolute' as const,
      top: tokens.spacing[4],
      right: tokens.spacing[4],
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[3],
    },
    authStatus: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    logoutButton: {
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[1]}px ${tokens.spacing[3]}px`,
      fontSize: '12px',
      cursor: 'pointer',
    },
  });

  const styles = getStyles();

  const handleIndividualTest = async (testFn: () => Promise<any>, testName: string) => {
    if (isRunning) return;
    
    try {
      await testFn();
    } catch (error) {
      console.error(`${testName} failed:`, error);
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.authSection}>
        <div style={styles.authStatus}>
          <span style={{ color: '#4CAF50' }}>●</span>
          Authenticated
        </div>
        <button 
          style={styles.logoutButton} 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </button>
      </div>
      
      <div style={styles.header}>
        <h1 style={styles.title}>
          Chat System Dev Interface
          <span style={styles.statusBadge}>
            {isRunning ? 'Running Tests...' : 'Ready'}
          </span>
        </h1>
        <h2 style={styles.subtitle}>Phase 3 Advanced Message Processing & Streaming</h2>
        <p style={styles.description}>
          Advanced testing interface featuring real-time WebSocket streaming, conversation analytics, 
          enhanced message processing pipeline, and comprehensive conversation insights. 
          Experience next-generation chat capabilities with structured data extraction and intelligent caching.
        </p>
      </div>

      <div style={styles.mainContent}>
        {/* Control Panel */}
        <div style={styles.controlsPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={styles.controlsTitle}>Test Controls</h3>
            <div style={{ 
              ...tokens.typography.body.small,
              color: theme.onSurfaceVariant,
              backgroundColor: theme.primaryContainer,
              padding: `${tokens.spacing[1]}px ${tokens.spacing[3]}px`,
              borderRadius: tokens.borderRadius.full,
              border: `1px solid ${theme.primary}`
            }}>
              Selected: {selectedPresetKey}
            </div>
          </div>
          
          <div style={styles.buttonGrid}>
            {/* Phase 1 Tests */}
            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(testChatEndpoint, 'Chat Endpoint')}
              disabled={isRunning}
            >
              🔗 Test Connectivity
            </button>
            
            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(testPresetInfo, 'Preset Info')}
              disabled={isRunning}
            >
              📋 Test Presets
            </button>
            
            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(
                () => testSessionCreation({
                  preset_key: selectedPresetKey,
                  title: `Quick Test Session (${selectedPresetKey})`
                }), 
                'Session Creation'
              )}
              disabled={isRunning}
            >
              ➕ Create Session
            </button>

            {/* Phase 2 Tests */}
            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(testProviderStatus, 'Provider Status')}
              disabled={isRunning}
            >
              🌐 Provider Status
            </button>
            
            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(testSessionList, 'Session List')}
              disabled={isRunning}
            >
              📝 Session List
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => {
                handleIndividualTest(
                  async () => {
                    // Create session and send test message
                    const session = await testSessionCreation({
                      preset_key: selectedPresetKey,
                      title: `LLM Test (${selectedPresetKey})`
                    });
                    return testRealMessage(session.session_id, "Hello! Please respond with 'Test successful!'");
                  }, 
                  'Real LLM Message'
                );
              }}
              disabled={isRunning}
            >
              💬 Test LLM Message
            </button>

            {/* Phase 3 Feature Tests */}
            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(
                () => testAnalytics(),
                'Conversation Analytics'
              )}
              disabled={isRunning}
            >
              📊 Test Analytics
            </button>
            
            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(
                () => testProviderComparison(),
                'Provider Comparison'
              )}
              disabled={isRunning}
            >
              ⚖️ Provider Comparison
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => handleIndividualTest(
                () => testWebSocketStreaming(selectedPresetKey),
                'WebSocket Streaming'
              )}
              disabled={isRunning}
            >
              🌊 Test Streaming
            </button>
          </div>

          <button
            style={styles.runAllButton}
            onClick={() => runAllTests(selectedPresetKey)}
            disabled={isRunning}
          >
            {isRunning ? '⏳ Running Full Test Suite...' : `🚀 Run Full Test Suite (${selectedPresetKey})`}
          </button>
        </div>

        {/* Phase 3 Widgets Grid */}
        <div style={{
          display: 'grid',
          gap: tokens.spacing[6],
          gridTemplateColumns: '1fr 1fr',
          gridTemplateAreas: '"preset provider" "chat history" "analytics analytics" "results results"',
        }}>
          {/* Preset Selector */}
          <div style={{ gridArea: 'preset' }}>
            <PresetSelector onPresetSelected={handlePresetSelected} />
          </div>

          {/* Provider Status Monitor */}
          <div style={{ gridArea: 'provider' }}>
            <ProviderStatusMonitor onRefresh={() => setHistoryRefreshTrigger(prev => prev + 1)} />
          </div>

          {/* Live Chat Interface */}
          <div style={{ gridArea: 'chat' }}>
            <LiveChatInterface selectedPresetKey={selectedPresetKey} />
          </div>

          {/* Session History Viewer */}
          <div style={{ gridArea: 'history' }}>
            <SessionHistoryViewer refreshTrigger={historyRefreshTrigger} />
          </div>

          {/* Analytics Widget */}
          <div style={{ gridArea: 'analytics' }}>
            <AnalyticsWidget />
          </div>

          {/* Results Panel */}
          <div style={{ gridArea: 'results' }}>
            <TestResultsPanel 
              results={testResults}
              isRunning={isRunning}
              onClear={clearResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
};