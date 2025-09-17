// Dev feature types for testing chat system

export interface ConfigPreset {
  key: string;
  name: string;
  description: string;
  category: string;
  is_default: boolean;
  provider: string;
  model: string;
}

export interface SessionConfig {
  preset_key: string;
  title?: string;
  ttl_hours?: number;
}

export interface ChatSession {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  message_count: number;
  is_active: boolean;
  model_config: any; // Backend handles this internally
  context_config: any; // Backend handles this internally
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  preset_info?: {
    key: string;
    name: string;
    description: string;
    category: string;
    provider: string;
    model: string;
  };
}

export interface PresetInfo {
  presets: ConfigPreset[];
  categories: string[];
  default_preset_key: string;
}

export type TestResult = {
  test: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  data?: any;
  timestamp?: string;
};