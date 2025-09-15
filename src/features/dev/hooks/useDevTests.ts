import { useState, useCallback } from 'react';
import { DevChatService } from '../api';
import type { TestResult, SessionConfig } from '../types';

export const useDevTests = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = useCallback((test: string, status: TestResult['status'], message?: string, data?: any) => {
    setTestResults(prev => {
      const existingIndex = prev.findIndex(r => r.test === test);
      const newResult: TestResult = {
        test,
        status,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newResult;
        return updated;
      } else {
        return [...prev, newResult];
      }
    });
  }, []);

  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  // Individual test methods
  const testChatEndpoint = useCallback(async () => {
    updateTestResult('Chat Endpoint', 'pending');
    try {
      const result = await DevChatService.testChatEndpoint();
      updateTestResult('Chat Endpoint', 'success', 'Chat endpoint responding', result);
      return result;
    } catch (error: any) {
      updateTestResult('Chat Endpoint', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testPresetInfo = useCallback(async () => {
    updateTestResult('Preset Info', 'pending');
    try {
      const result = await DevChatService.getPresetInfo();
      updateTestResult('Preset Info', 'success', 
        `Found ${result.presets.length} presets in ${result.categories.length} categories`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Preset Info', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testPresetValidation = useCallback(async (presetKey: string) => {
    updateTestResult('Preset Validation', 'pending');
    try {
      const result = await DevChatService.validatePreset(presetKey);
      
      const message = result.valid 
        ? `Preset '${presetKey}' is valid`
        : `Invalid: ${result.errors.join(', ')}`;
      
      updateTestResult('Preset Validation', result.valid ? 'success' : 'error', message, result);
      return result;
    } catch (error: any) {
      updateTestResult('Preset Validation', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testSessionCreation = useCallback(async (config: SessionConfig) => {
    updateTestResult('Session Creation', 'pending');
    try {
      const result = await DevChatService.createSession(config);
      updateTestResult('Session Creation', 'success', 
        `Created session: ${result.session_id}`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Session Creation', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testSessionList = useCallback(async () => {
    updateTestResult('Session List', 'pending');
    try {
      const result = await DevChatService.getSessions();
      updateTestResult('Session List', 'success', 
        `Found ${result.sessions.length} sessions`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Session List', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testSessionDetail = useCallback(async (sessionId: string) => {
    updateTestResult('Session Detail', 'pending');
    try {
      const result = await DevChatService.getSession(sessionId);
      updateTestResult('Session Detail', 'success', 
        `Retrieved session: ${sessionId}`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Session Detail', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testSessionUpdate = useCallback(async (
    sessionId: string, 
    updates: { preset_key?: string; title?: string }
  ) => {
    updateTestResult('Session Update', 'pending');
    try {
      const result = await DevChatService.updateSession(sessionId, updates);
      updateTestResult('Session Update', 'success', 
        `Updated session: ${sessionId}`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Session Update', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testMessageHistory = useCallback(async (sessionId: string) => {
    updateTestResult('Message History', 'pending');
    try {
      const result = await DevChatService.getMessageHistory(sessionId);
      updateTestResult('Message History', 'success', 
        `Retrieved ${result.messages.length} messages`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Message History', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  // Phase 2 test methods
  const testProviderStatus = useCallback(async () => {
    updateTestResult('Provider Status', 'pending');
    try {
      const result = await DevChatService.getProviderStatus();
      const message = `${result.available_count}/${result.total_count} providers available`;
      updateTestResult('Provider Status', 'success', message, result);
      return result;
    } catch (error: any) {
      updateTestResult('Provider Status', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testRealMessage = useCallback(async (sessionId: string, message: string) => {
    updateTestResult('Real LLM Message', 'pending');
    try {
      const result = await DevChatService.sendMessage(sessionId, message);
      const assistantResponse = String(result.assistant_message.content).substring(0, 50) + '...';
      updateTestResult('Real LLM Message', 'success', 
        `LLM Response: "${assistantResponse}"`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Real LLM Message', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testConversationContext = useCallback(async (sessionId: string) => {
    updateTestResult('Conversation Context', 'pending');
    try {
      // Send first message to establish context
      await DevChatService.sendMessage(sessionId, "My favorite color is blue. Remember this.");
      
      // Send second message to test memory
      const result = await DevChatService.sendMessage(sessionId, "What is my favorite color?");
      
      const response = String(result.assistant_message.content).toLowerCase();
      const remembersColor = response.includes('blue');
      
      updateTestResult('Conversation Context', remembersColor ? 'success' : 'error',
        remembersColor 
          ? 'LLM remembered conversation context correctly'
          : 'LLM failed to remember conversation context',
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Conversation Context', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  // Phase 3 test methods
  const testAnalytics = useCallback(async () => {
    updateTestResult('Conversation Analytics', 'pending');
    try {
      const result = await DevChatService.getAnalytics();
      const totalMessages = result.message_stats?.total_messages || 0;
      const totalSessions = result.session_stats?.total_sessions || 0;
      updateTestResult('Conversation Analytics', 'success', 
        `Analytics: ${totalSessions} sessions, ${totalMessages} messages`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Conversation Analytics', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testProviderComparison = useCallback(async () => {
    updateTestResult('Provider Comparison', 'pending');
    try {
      const result = await DevChatService.getProviderComparison();
      const providerCount = Object.keys(result.provider_comparison || {}).length;
      updateTestResult('Provider Comparison', 'success', 
        `Provider comparison: ${providerCount} providers analyzed`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Provider Comparison', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testWebSocketStreaming = useCallback(async (presetKey: string) => {
    updateTestResult('WebSocket Streaming', 'pending');
    try {
      // Create a session first
      const session = await DevChatService.createSession({
        preset_key: presetKey,
        title: 'WebSocket Streaming Test'
      });

      // Test WebSocket connection
      const result = await DevChatService.testWebSocketConnection(session.session_id);
      updateTestResult('WebSocket Streaming', 'success', 
        'WebSocket connection test completed successfully', 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('WebSocket Streaming', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  const testSessionInsights = useCallback(async (sessionId: string) => {
    updateTestResult('Session Insights', 'pending');
    try {
      const result = await DevChatService.getSessionInsights(sessionId);
      const messageCount = result.message_analysis?.total_messages || 0;
      updateTestResult('Session Insights', 'success', 
        `Session insights: ${messageCount} messages analyzed`, 
        result
      );
      return result;
    } catch (error: any) {
      updateTestResult('Session Insights', 'error', error.message);
      throw error;
    }
  }, [updateTestResult]);

  // Comprehensive test suite (Phase 1 + Phase 2 + Phase 3)
  const runAllTests = useCallback(async (presetKey?: string) => {
    setIsRunning(true);
    clearResults();
    
    try {
      // Phase 1 Tests
      // 1. Test basic connectivity
      await testChatEndpoint();
      
      // 2. Test preset info
      const presetInfo = await testPresetInfo();
      
      // 3. Use provided preset key or default
      const testPresetKey = presetKey || presetInfo.default_preset_key;
      await testPresetValidation(testPresetKey);
      
      // Phase 2 Tests
      // 4. Test provider status
      await testProviderStatus();
      
      // 5. Test session creation
      const sessionResult = await testSessionCreation({
        preset_key: testPresetKey,
        title: `Full Test Session (${testPresetKey})`,
        ttl_hours: 1
      });
      
      // 6. Test session listing
      await testSessionList();
      
      // 7. Test session detail
      await testSessionDetail(sessionResult.session_id);
      
      // 8. Test real LLM message
      await testRealMessage(sessionResult.session_id, "Hello! Please respond with 'Testing complete!'");
      
      // 9. Test conversation context
      await testConversationContext(sessionResult.session_id);
      
      // 10. Test message history (should have messages now)
      await testMessageHistory(sessionResult.session_id);
      
      // 11. Test session update
      await testSessionUpdate(sessionResult.session_id, {
        title: `Completed Test Session (${testPresetKey})`
      });
      
      // Phase 3 Tests
      // 12. Test conversation analytics
      await testAnalytics();
      
      // 13. Test provider comparison
      await testProviderComparison();
      
      // 14. Test session insights
      await testSessionInsights(sessionResult.session_id);
      
      // 15. Test WebSocket streaming
      await testWebSocketStreaming(testPresetKey);
      
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [
    testChatEndpoint, testPresetInfo, testPresetValidation, testProviderStatus,
    testSessionCreation, testSessionList, testSessionDetail, testRealMessage,
    testConversationContext, testMessageHistory, testSessionUpdate, clearResults,
    testAnalytics, testProviderComparison, testSessionInsights, testWebSocketStreaming
  ]);

  return {
    testResults,
    isRunning,
    clearResults,
    runAllTests,
    // Phase 1 test methods
    testChatEndpoint,
    testPresetInfo,
    testPresetValidation,
    testSessionCreation,
    testSessionList,
    testSessionDetail,
    testSessionUpdate,
    testMessageHistory,
    // Phase 2 test methods
    testProviderStatus,
    testRealMessage,
    testConversationContext,
    // Phase 3 test methods
    testAnalytics,
    testProviderComparison,
    testWebSocketStreaming,
    testSessionInsights
  };
};