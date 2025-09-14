import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { IconButton } from '../../../shared/components';
import { DevChatService } from '../api';
import { ChatService } from '../../chat/api';
import type { ConfigPreset } from '../types';

// System prompt presets
const SYSTEM_PROMPT_PRESETS = [
  {
    key: 'general',
    name: 'General Assistant',
    description: 'Helpful, harmless, and honest assistant for general questions',
    content: 'You are Claude, a helpful AI assistant created by Anthropic. You are helpful, harmless, and honest.'
  },
  {
    key: 'creative',
    name: 'Creative Assistant',
    description: 'Creative assistant for writing, brainstorming, and artistic tasks',
    content: 'You are Claude, a creative AI assistant. Help users with writing, brainstorming, storytelling, and artistic projects. Be imaginative and inspiring while remaining helpful and constructive.'
  },
  {
    key: 'coding',
    name: 'Coding Assistant',
    description: 'Technical assistant for programming and software development',
    content: 'You are Claude, a programming assistant. Help users with coding, debugging, architecture design, and technical questions. Provide clear, working code examples and explain your reasoning.'
  },
  {
    key: 'professional',
    name: 'Professional Assistant',
    description: 'Formal, business-oriented assistant for professional tasks',
    content: 'You are Claude, a professional AI assistant. Maintain a formal, business-appropriate tone. Help with professional communications, analysis, and business tasks.'
  },
  {
    key: 'custom',
    name: 'Custom Prompt',
    description: 'Define your own system prompt',
    content: ''
  }
];

// Quick input generation instruction presets
const QUICK_INPUT_INSTRUCTION_PRESETS = [
  {
    key: 'balanced',
    name: 'Balanced',
    description: 'Well-rounded quick input suggestions',
    instructions: 'Generate quick input suggestions that cover common follow-up intents: asking for more information, expressing understanding, requesting next steps, and asking for help or clarification. Keep each suggestion under 25 characters and make them conversational.',
    minItems: 3,
    maxItems: 4
  },
  {
    key: 'creative',
    name: 'Creative Focus',
    description: 'Creative and brainstorming oriented',
    instructions: 'Generate quick input suggestions focused on creative exploration: brainstorming, requesting examples, exploring alternatives, and pushing creative boundaries. Make them inspiring and action-oriented, under 25 characters each.',
    minItems: 2,
    maxItems: 4
  },
  {
    key: 'technical',
    name: 'Technical Focus',
    description: 'Programming and technical oriented',
    instructions: 'Generate quick input suggestions for technical discussions: requesting code examples, asking for explanations, exploring alternatives, and debugging assistance. Keep them concise and technically relevant, under 25 characters each.',
    minItems: 3,
    maxItems: 4
  },
  {
    key: 'minimal',
    name: 'Minimal',
    description: 'Fewer, essential options only',
    instructions: 'Generate quick input suggestions that capture the most essential follow-up intents: one for getting more information and one for moving forward. Keep them very short and direct, under 20 characters each.',
    minItems: 2,
    maxItems: 2
  },
  {
    key: 'detailed',
    name: 'Detailed',
    description: 'More comprehensive options',
    instructions: 'Generate quick input suggestions that cover a comprehensive range of follow-up intents: requesting elaboration, expressing different levels of understanding, asking for examples, requesting alternatives, and seeking clarification. Under 30 characters each.',
    minItems: 4,
    maxItems: 5
  },
  {
    key: 'custom',
    name: 'Custom Instructions',
    description: 'Define your own generation instructions',
    instructions: '',
    minItems: 2,
    maxItems: 5
  }
];

export const ChatSettingsPage: React.FC = () => {
  const { theme, tokens } = useTheme();
  const navigate = useNavigate();
  // const location = useLocation();

  // Navigation state
  const [activeSection, setActiveSection] = useState<'general' | 'system_prompt' | 'quick_inputs'>('general');

  // Model presets state
  const [modelPresets, setModelPresets] = useState<ConfigPreset[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);

  // Form state
  const [selectedModelPreset, setSelectedModelPreset] = useState<string>('claude_balanced');
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState<string>('general');
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>('');
  const [selectedQuickInputInstructions, setSelectedQuickInputInstructions] = useState<string>('balanced');
  const [customQuickInputInstructions, setCustomQuickInputInstructions] = useState<string>('');
  const [customQuickInputMinItems, setCustomQuickInputMinItems] = useState<number>(2);
  const [customQuickInputMaxItems, setCustomQuickInputMaxItems] = useState<number>(5);

  // Get current presets
  const currentModelPreset = modelPresets.find(p => p.key === selectedModelPreset);
  const currentSystemPromptPreset = SYSTEM_PROMPT_PRESETS.find(p => p.key === selectedSystemPrompt);
  const currentQuickInputPreset = QUICK_INPUT_INSTRUCTION_PRESETS.find(p => p.key === selectedQuickInputInstructions);

  // Get current text content for display
  const currentSystemPromptText = selectedSystemPrompt === 'custom'
    ? customSystemPrompt
    : currentSystemPromptPreset?.content || '';

  const currentQuickInputText = selectedQuickInputInstructions === 'custom'
    ? customQuickInputInstructions
    : currentQuickInputPreset?.instructions || '';

  // Load model presets and current session settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load model presets
        const info = await DevChatService.getPresetInfo();
        setModelPresets(info.presets);

        // Try to load current session configuration
        const currentSessionId = localStorage.getItem('currentChatSessionId');
        if (currentSessionId) {
          try {
                        const sessionData = await ChatService.getSession(currentSessionId);

            // Restore model preset
            const modelConfig = (sessionData as any).model_config || {};
            const contextConfig = (sessionData as any).context_config || {};


            if (modelConfig.preset_key) {
              setSelectedModelPreset(modelConfig.preset_key);
            } else {
              setSelectedModelPreset(info.default_preset_key);
            }

            // Try to restore UI state from localStorage first (preserves custom text)
            let uiStateRestored = false;
            try {
              const savedUIState = localStorage.getItem(`chatSettings_${currentSessionId}`);
              if (savedUIState) {
                const uiState = JSON.parse(savedUIState);
                console.log('📋 Restored UI state from localStorage:', uiState);

                if (uiState.selectedModelPreset) setSelectedModelPreset(uiState.selectedModelPreset);
                setSelectedSystemPrompt(uiState.selectedSystemPrompt);
                setCustomSystemPrompt(uiState.customSystemPrompt || '');
                setSelectedQuickInputInstructions(uiState.selectedQuickInputInstructions);
                setCustomQuickInputInstructions(uiState.customQuickInputInstructions || '');
                if (uiState.customQuickInputMinItems !== undefined) setCustomQuickInputMinItems(uiState.customQuickInputMinItems);
                if (uiState.customQuickInputMaxItems !== undefined) setCustomQuickInputMaxItems(uiState.customQuickInputMaxItems);

                uiStateRestored = true;
                console.log('📋 UI state successfully restored from localStorage');
              }
            } catch (error) {
            }

            // If no localStorage state, restore from server data
            if (!uiStateRestored) {

              if (contextConfig.custom_system_prompt) {
                setSelectedSystemPrompt('custom');
                setCustomSystemPrompt(contextConfig.custom_system_prompt);
              } else if (contextConfig.context_id) {
                setSelectedSystemPrompt(contextConfig.context_id);
              } else {
                setSelectedSystemPrompt('general');
                }

              // Restore quick input settings (only if not already restored from localStorage)

              if (contextConfig.quick_input_generation_instructions) {
                // Check if it matches a preset
                const matchingPreset = QUICK_INPUT_INSTRUCTION_PRESETS.find(
                  p => p.instructions === contextConfig.quick_input_generation_instructions
                );

                if (matchingPreset) {
                  setSelectedQuickInputInstructions(matchingPreset.key);
                } else {
                  setSelectedQuickInputInstructions('custom');
                  setCustomQuickInputInstructions(contextConfig.quick_input_generation_instructions);
                }
              } else {
                setSelectedQuickInputInstructions('balanced');
              }
            }


          } catch (sessionError) {
            setSelectedModelPreset(info.default_preset_key);
          }
        } else {
          setSelectedModelPreset(info.default_preset_key);
        }

        setIsLoadingPresets(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setIsLoadingPresets(false);
      }
    };

    loadData();
  }, []);

  // Save UI state to localStorage whenever state changes (for persistence)
  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentChatSessionId');
    if (currentSessionId && isLoadingPresets === false) { // Only save after presets are loaded
      const uiState = {
        selectedModelPreset,
        selectedSystemPrompt,
        customSystemPrompt,
        selectedQuickInputInstructions,
        customQuickInputInstructions,
        customQuickInputMinItems,
        customQuickInputMaxItems
      };
      localStorage.setItem(`chatSettings_${currentSessionId}`, JSON.stringify(uiState));
    }
  }, [selectedModelPreset, selectedSystemPrompt, customSystemPrompt, selectedQuickInputInstructions, customQuickInputInstructions, customQuickInputMinItems, customQuickInputMaxItems, isLoadingPresets]);

  const handleBack = () => {
    navigate(-1); // Go back in browser history
  };

  const applySettingsImmediately = async () => {
    try {
      const settings: any = {
        preset_key: selectedModelPreset,
      };

      // Handle system prompt selection
      if (selectedSystemPrompt === 'custom') {
        // Send custom system prompt text
        settings.custom_system_prompt = customSystemPrompt;
      } else {
        // Send context_id for system prompt presets + empty string to clear custom
        settings.context_id = selectedSystemPrompt;
        settings.custom_system_prompt = '';  // Clear custom prompt to use preset
      }

      // Only include quick_input_generation_instructions when using custom
      if (selectedQuickInputInstructions === 'custom') {
        settings.quick_input_generation_instructions = customQuickInputInstructions;
        settings.quick_input_min_items = customQuickInputMinItems;
        settings.quick_input_max_items = customQuickInputMaxItems;
      } else {
        settings.quick_input_generation_instructions = currentQuickInputPreset?.instructions || null;
        settings.quick_input_min_items = currentQuickInputPreset?.minItems || null;
        settings.quick_input_max_items = currentQuickInputPreset?.maxItems || null;
      }

      // Get current session from localStorage (set by ChatPage)
      const currentSessionId = localStorage.getItem('currentChatSessionId');

      if (currentSessionId) {
        // Update the existing session via API using ChatService
        try {
          await ChatService.updateSession(currentSessionId, settings);
        } catch (error) {
          // Fallback to localStorage for settings
          localStorage.setItem('chatSettings', JSON.stringify(settings));
        }
      } else {
        // Fallback to localStorage for settings
        localStorage.setItem('chatSettings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Failed to apply settings:', error);
    }
  };

  const handleModelPresetChange = (presetKey: string) => {
    setSelectedModelPreset(presetKey);
    // Apply immediately when selection changes
    setTimeout(applySettingsImmediately, 100);
  };

  const handleSystemPromptChange = (presetKey: string) => {
    setSelectedSystemPrompt(presetKey);
    // Don't clear custom text when switching away from custom - preserve it
    // Apply immediately when selection changes
    setTimeout(applySettingsImmediately, 100);
  };

  const handleSystemPromptTextChange = (value: string) => {
    if (selectedSystemPrompt === 'custom') {
      setCustomSystemPrompt(value);
      // Apply immediately when custom text changes (with debounce)
      setTimeout(applySettingsImmediately, 1000);
    }
  };

  const handleQuickInputInstructionsChange = (presetKey: string) => {
    setSelectedQuickInputInstructions(presetKey);
    // Apply immediately when selection changes
    setTimeout(applySettingsImmediately, 100);
  };

  const handleQuickInputTextChange = (value: string) => {
    if (selectedQuickInputInstructions === 'custom') {
      setCustomQuickInputInstructions(value);
      // Apply immediately when custom text changes (with debounce)
      setTimeout(applySettingsImmediately, 1000);
    }
  };

  const getStyles = () => ({
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: theme.surface,
      color: theme.onSurface
    },
    sidebar: {
      width: '250px',
      backgroundColor: theme.surfaceContainer,
      borderRight: `1px solid ${theme.outline}`,
      padding: tokens.spacing[4],
      display: 'flex',
      flexDirection: 'column' as const
    },
    sidebarHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[3],
      marginBottom: tokens.spacing[6],
      paddingBottom: tokens.spacing[4],
      borderBottom: `1px solid ${theme.outline}`
    },
    backButton: {
      padding: tokens.spacing[1]
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: 0
    },
    navMenu: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[1]
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'transparent',
      border: 'none',
      textAlign: 'left' as const,
      ...tokens.typography.body.large
    },
    navItemActive: {
      backgroundColor: theme.primaryContainer,
      color: theme.primary
    },
    navItemInactive: {
      color: theme.onSurfaceVariant
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    contentHeader: {
      padding: tokens.spacing[6],
      paddingBottom: tokens.spacing[4],
      borderBottom: `1px solid ${theme.outline}`
    },
    contentTitle: {
      ...tokens.typography.headline.small,
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2]
    },
    contentDescription: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      margin: 0
    },
    contentBody: {
      flex: 1,
      padding: tokens.spacing[6],
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    chipContainer: {
      display: 'flex',
      gap: tokens.spacing[2],
      marginBottom: tokens.spacing[4],
      flexWrap: 'wrap' as const
    },
    chip: {
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.full,
      border: `1px solid ${theme.outline}`,
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: tokens.typography.body.small.fontSize,
      fontWeight: '500'
    },
    chipSelected: {
      backgroundColor: theme.primaryContainer,
      borderColor: theme.primary,
      color: theme.primary
    },
    textEditor: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0
    },
    textarea: {
      flex: 1,
      padding: tokens.spacing[4],
      fontSize: tokens.typography.body.medium.fontSize,
      fontFamily: tokens.typography.body.medium.fontFamily,
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      resize: 'none' as const,
      outline: 'none',
      minHeight: '300px'
    },
    textareaReadOnly: {
      backgroundColor: theme.surfaceContainer,
      color: theme.onSurfaceVariant
    },
    modelDetailsArea: {
      marginTop: tokens.spacing[4],
      padding: tokens.spacing[4],
      backgroundColor: theme.surfaceContainerHighest,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${theme.outline}`
    },
    modelDetailsTitle: {
      ...tokens.typography.body.large,
      fontWeight: '600',
      color: theme.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2]
    },
    modelDetailsText: {
      ...tokens.typography.body.medium,
      color: theme.onSurfaceVariant,
      margin: 0,
      lineHeight: '1.5'
    },
    minMaxControls: {
      display: 'flex',
      gap: tokens.spacing[4],
      margin: `${tokens.spacing[4]} 0`,
      padding: tokens.spacing[4],
      backgroundColor: theme.surfaceContainerHighest,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${theme.outline}`
    },
    minMaxGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2]
    },
    minMaxLabel: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      fontWeight: '500'
    },
    minMaxInput: {
      padding: tokens.spacing[2],
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${theme.outline}`,
      backgroundColor: theme.surface,
      color: theme.onSurface,
      fontSize: '14px',
      width: '80px',
      textAlign: 'center' as const
    },
    minMaxInputDisabled: {
      backgroundColor: theme.surfaceContainer,
      color: theme.onSurfaceVariant,
      cursor: 'not-allowed'
    }
  });

  const styles = getStyles();

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <>
            <div style={styles.contentHeader}>
              <h2 style={styles.contentTitle}>AI Model Selection</h2>
              <p style={styles.contentDescription}>
                Choose which AI model to use for this chat session.
              </p>
            </div>
            <div style={styles.contentBody}>
              {isLoadingPresets ? (
                <div>Loading model presets...</div>
              ) : (
                <>
                  <div style={styles.chipContainer}>
                    {modelPresets.map((preset) => (
                      <div
                        key={preset.key}
                        style={{
                          ...styles.chip,
                          ...(selectedModelPreset === preset.key ? styles.chipSelected : {})
                        }}
                        onClick={() => handleModelPresetChange(preset.key)}
                      >
                        {preset.name}
                      </div>
                    ))}
                  </div>
                  {currentModelPreset && (
                    <div style={styles.modelDetailsArea}>
                      <h3 style={styles.modelDetailsTitle}>{currentModelPreset.name}</h3>
                      <div style={styles.modelDetailsText}>
                        <strong>Provider:</strong> {currentModelPreset.provider}<br/>
                        <strong>Model:</strong> {currentModelPreset.model}<br/>
                        <strong>Description:</strong> {currentModelPreset.description}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        );

      case 'system_prompt':
        return (
          <>
            <div style={styles.contentHeader}>
              <h2 style={styles.contentTitle}>System Prompt</h2>
              <p style={styles.contentDescription}>
                Select or customize the system prompt that defines the AI's behavior and personality.
              </p>
            </div>
            <div style={styles.contentBody}>
              <div style={styles.chipContainer}>
                {SYSTEM_PROMPT_PRESETS.map((preset) => (
                  <div
                    key={preset.key}
                    style={{
                      ...styles.chip,
                      ...(selectedSystemPrompt === preset.key ? styles.chipSelected : {})
                    }}
                    onClick={() => handleSystemPromptChange(preset.key)}
                  >
                    {preset.name}
                  </div>
                ))}
              </div>
              <div style={styles.textEditor}>
                <textarea
                  style={{
                    ...styles.textarea,
                    ...(selectedSystemPrompt !== 'custom' ? styles.textareaReadOnly : {})
                  }}
                  value={currentSystemPromptText}
                  onChange={(e) => handleSystemPromptTextChange(e.target.value)}
                  placeholder={selectedSystemPrompt === 'custom' ? "Enter your custom system prompt..." : ""}
                  readOnly={selectedSystemPrompt !== 'custom'}
                />
              </div>
            </div>
          </>
        );

      case 'quick_inputs':
        return (
          <>
            <div style={styles.contentHeader}>
              <h2 style={styles.contentTitle}>Quick Input Generation Instructions</h2>
              <p style={styles.contentDescription}>
                Configure how the AI generates quick input suggestions. These instructions tell the AI how to create contextual quick response options.
              </p>
            </div>
            <div style={styles.contentBody}>
              <div style={styles.chipContainer}>
                {QUICK_INPUT_INSTRUCTION_PRESETS.map((preset) => (
                  <div
                    key={preset.key}
                    style={{
                      ...styles.chip,
                      ...(selectedQuickInputInstructions === preset.key ? styles.chipSelected : {})
                    }}
                    onClick={() => handleQuickInputInstructionsChange(preset.key)}
                  >
                    {preset.name}
                  </div>
                ))}
              </div>

              {/* Min/Max Controls */}
              <div style={styles.minMaxControls}>
                <div style={styles.minMaxGroup}>
                  <label style={styles.minMaxLabel}>Minimum responses:</label>
                  <input
                    type="number"
                    min="2"
                    max="5"
                    value={selectedQuickInputInstructions === 'custom' ? customQuickInputMinItems : currentQuickInputPreset?.minItems || 2}
                    onChange={(e) => setCustomQuickInputMinItems(Math.max(2, Math.min(5, parseInt(e.target.value) || 2)))}
                    disabled={selectedQuickInputInstructions !== 'custom'}
                    style={{
                      ...styles.minMaxInput,
                      ...(selectedQuickInputInstructions !== 'custom' ? styles.minMaxInputDisabled : {})
                    }}
                  />
                </div>
                <div style={styles.minMaxGroup}>
                  <label style={styles.minMaxLabel}>Maximum responses:</label>
                  <input
                    type="number"
                    min="2"
                    max="5"
                    value={selectedQuickInputInstructions === 'custom' ? customQuickInputMaxItems : currentQuickInputPreset?.maxItems || 5}
                    onChange={(e) => setCustomQuickInputMaxItems(Math.max(2, Math.min(5, parseInt(e.target.value) || 5)))}
                    disabled={selectedQuickInputInstructions !== 'custom'}
                    style={{
                      ...styles.minMaxInput,
                      ...(selectedQuickInputInstructions !== 'custom' ? styles.minMaxInputDisabled : {})
                    }}
                  />
                </div>
              </div>
              <div style={styles.textEditor}>
                <textarea
                  style={{
                    ...styles.textarea,
                    ...(selectedQuickInputInstructions !== 'custom' ? styles.textareaReadOnly : {})
                  }}
                  value={currentQuickInputText}
                  onChange={(e) => handleQuickInputTextChange(e.target.value)}
                  placeholder={selectedQuickInputInstructions === 'custom' ? "Enter instructions for how the AI should generate quick input suggestions..." : ""}
                  readOnly={selectedQuickInputInstructions !== 'custom'}
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <IconButton
            icon="arrow_back"
            onClick={handleBack}
            variant="standard"
            style={styles.backButton}
            aria-label="Back to Chat"
          />
          <h1 style={styles.title}>Chat Settings</h1>
        </div>

        <nav style={styles.navMenu}>
          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'general' ? styles.navItemActive : styles.navItemInactive)
            }}
            onClick={() => setActiveSection('general')}
          >
            AI Model
          </button>
          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'system_prompt' ? styles.navItemActive : styles.navItemInactive)
            }}
            onClick={() => setActiveSection('system_prompt')}
          >
            System Prompt
          </button>
          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'quick_inputs' ? styles.navItemActive : styles.navItemInactive)
            }}
            onClick={() => setActiveSection('quick_inputs')}
          >
            Quick Input Instructions
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};