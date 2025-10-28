/**
 * Onboarding flow types
 */

export type FlowStepType = 'activity' | 'branch' | 'custom';

export interface FlowStep {
  id: string;
  type: FlowStepType;
  activitySlug?: string;
  title: string;
  options?: string[];
}

export interface FlowConfig {
  flow_id: string;
  steps: FlowStep[];
}

export interface FlowState {
  flow_id: string;
  current_step_index: number;
  current_step: FlowStep;
  completed_steps: string[];
  attempt_ids: Record<string, string>;
  total_steps: number;
  started_at: string;
  completed_at?: string;
  metadata: Record<string, any>;
  flow_config: FlowConfig;
  is_complete?: boolean;
}

export interface FlowProgressUpdate {
  step_id: string;
  attempt_id?: string;
  action: 'complete' | 'next' | 'previous';
}

export interface FlowInitializeRequest {
  flow_id?: string;
  metadata?: Record<string, any>;
}
