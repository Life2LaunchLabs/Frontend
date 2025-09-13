import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../styles';
import { DevChatService } from '../../api';
import type { ConfigPreset, PresetInfo, ValidationResult } from '../../types';

export interface PresetSelectorProps {
  onValidationResult?: (result: ValidationResult) => void;
  onPresetSelected?: (preset: ConfigPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ 
  onValidationResult, 
  onPresetSelected 
}) => {
  const { theme, tokens } = useTheme();
  
  const [presetInfo, setPresetInfo] = useState<PresetInfo | null>(null);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPresetInfo = async () => {
      try {
        const info = await DevChatService.getPresetInfo();
        setPresetInfo(info);
        
        // Set default preset
        setSelectedPresetKey(info.default_preset_key);
        
        // Notify parent of default preset selection
        if (onPresetSelected) {
          const defaultPreset = info.presets.find(p => p.key === info.default_preset_key);
          if (defaultPreset) {
            onPresetSelected(defaultPreset);
          }
        }
      } catch (error) {
        console.error('Failed to load preset info:', error);
      }
    };

    loadPresetInfo();
  }, []);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPresetKey(presetKey);
    setValidationResult(null);
    
    // Notify parent of preset selection
    if (presetInfo && onPresetSelected) {
      const preset = presetInfo.presets.find(p => p.key === presetKey);
      if (preset) {
        onPresetSelected(preset);
      }
    }
  };

  const validateSelectedPreset = async () => {
    if (!selectedPresetKey) return;

    setIsLoading(true);
    try {
      const result = await DevChatService.validatePreset(selectedPresetKey);
      setValidationResult(result);
      onValidationResult?.(result);
    } catch (error: any) {
      const errorResult: ValidationResult = {
        valid: false,
        errors: [error.message || 'Validation failed'],
        warnings: []
      };
      setValidationResult(errorResult);
      onValidationResult?.(errorResult);
    } finally {
      setIsLoading(false);
    }
  };

  const getStyles = () => ({
    container: {
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[6],
      border: `1px solid ${theme.outline}`,
    },
    title: {
      ...tokens.typography.headline.medium,
      color: theme.onSurface,
      margin: `0 0 ${tokens.spacing[4]}px 0`,
      borderBottom: `1px solid ${theme.outline}`,
      paddingBottom: tokens.spacing[3],
    },
    formRow: {
      display: 'grid',
      gap: tokens.spacing[4],
      gridTemplateColumns: '1fr 1fr auto',
      alignItems: 'end',
      marginBottom: tokens.spacing[4],
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    label: {
      ...tokens.typography.body.medium,
      color: theme.onSurface,
      fontWeight: 600,
    },
    select: {
      backgroundColor: theme.surfaceContainer,
      color: theme.onSurface,
      border: `1px solid ${theme.outline}`,
      borderRadius: tokens.borderRadius.small,
      padding: tokens.spacing[3],
      fontSize: tokens.typography.body.medium.fontSize,
      cursor: 'pointer',
    },
    validateButton: {
      backgroundColor: theme.primary,
      color: theme.onPrimary,
      border: 'none',
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[3]}px ${tokens.spacing[6]}px`,
      fontSize: tokens.typography.body.medium.fontSize,
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.6 : 1,
      whiteSpace: 'nowrap' as const,
    },
    presetGrid: {
      display: 'grid',
      gap: tokens.spacing[3],
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      marginBottom: tokens.spacing[4],
    },
    presetCard: (isSelected: boolean) => ({
      backgroundColor: isSelected ? theme.primaryContainer : theme.surfaceContainer,
      border: `2px solid ${isSelected ? theme.primary : theme.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    presetName: {
      ...tokens.typography.body.large,
      fontWeight: 600,
      color: theme.onSurface,
      marginBottom: tokens.spacing[1],
    },
    presetDescription: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      marginBottom: tokens.spacing[2],
    },
    presetMeta: {
      ...tokens.typography.body.small,
      color: theme.onSurfaceVariant,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryChip: {
      backgroundColor: theme.surfaceContainerHighest,
      color: theme.onSurface,
      padding: `${tokens.spacing[1]}px ${tokens.spacing[2]}px`,
      borderRadius: tokens.borderRadius.full,
      fontSize: '11px',
      fontWeight: 600,
    },
    validationResult: {
      backgroundColor: validationResult?.valid ? '#E8F5E8' : '#FFEBEE',
      color: validationResult?.valid ? '#2E7D32' : '#C62828',
      border: `1px solid ${validationResult?.valid ? '#4CAF50' : '#F44336'}`,
      borderRadius: tokens.borderRadius.small,
      padding: tokens.spacing[4],
      marginTop: tokens.spacing[4],
    },
    validationHeader: {
      ...tokens.typography.body.large,
      fontWeight: 600,
      marginBottom: tokens.spacing[2],
    },
    validationList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    validationItem: {
      ...tokens.typography.body.medium,
      marginBottom: tokens.spacing[1],
    },
  });

  const styles = getStyles();

  if (!presetInfo) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Loading preset information...</div>
      </div>
    );
  }

  const filteredPresets = selectedCategory === 'all' 
    ? presetInfo.presets 
    : presetInfo.presets.filter(preset => preset.category === selectedCategory);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Configuration Presets</h3>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Category</label>
          <select
            style={styles.select}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {presetInfo.categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Selected Preset</label>
          <select
            style={styles.select}
            value={selectedPresetKey}
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            {filteredPresets.map((preset) => (
              <option key={preset.key} value={preset.key}>
                {preset.name} ({preset.provider})
              </option>
            ))}
          </select>
        </div>

        <button
          style={styles.validateButton}
          onClick={validateSelectedPreset}
          disabled={isLoading || !selectedPresetKey}
        >
          {isLoading ? 'Validating...' : 'Validate'}
        </button>
      </div>

      <div style={styles.presetGrid}>
        {filteredPresets.map((preset) => (
          <div
            key={preset.key}
            style={styles.presetCard(preset.key === selectedPresetKey)}
            onClick={() => handlePresetChange(preset.key)}
          >
            <div style={styles.presetName}>{preset.name}</div>
            <div style={styles.presetDescription}>{preset.description}</div>
            <div style={styles.presetMeta}>
              <span>{preset.provider} • {preset.model}</span>
              <span style={styles.categoryChip}>{preset.category}</span>
            </div>
          </div>
        ))}
      </div>

      {validationResult && (
        <div style={styles.validationResult}>
          <div style={styles.validationHeader}>
            {validationResult.valid ? '✓ Preset Valid' : '✗ Preset Invalid'}
          </div>
          
          {validationResult.errors.length > 0 && (
            <div>
              <strong>Errors:</strong>
              <ul style={styles.validationList}>
                {validationResult.errors.map((error, index) => (
                  <li key={index} style={styles.validationItem}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validationResult.warnings.length > 0 && (
            <div>
              <strong>Warnings:</strong>
              <ul style={styles.validationList}>
                {validationResult.warnings.map((warning, index) => (
                  <li key={index} style={styles.validationItem}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.preset_info && (
            <div style={{ marginTop: tokens.spacing[3] }}>
              <strong>Preset Details:</strong>
              <div style={styles.validationItem}>
                {validationResult.preset_info.name} - {validationResult.preset_info.provider} {validationResult.preset_info.model}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};