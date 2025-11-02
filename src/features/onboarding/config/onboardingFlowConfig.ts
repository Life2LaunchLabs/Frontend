/**
 * Default onboarding flow configuration
 * This matches the backend DEFAULT_FLOW_CONFIG
 */

import { FlowConfig } from '../types';

export const DEFAULT_ONBOARDING_FLOW: FlowConfig = {
  flow_id: 'user-onboarding-v1',
  steps: [
    // Welcome step temporarily skipped - jump directly to pathways
    // {
    //   id: 'welcome',
    //   type: 'activity',
    //   activitySlug: 'welcome',
    //   title: 'Welcome to Launchpad'
    // },
    {
      id: 'pathways',
      type: 'activity',
      activitySlug: 'pathways-assessment',
      title: 'Career Pathways Assessment'
    }
  ]
};

/**
 * Get the next step after the current one
 */
export function getNextStep(currentStepIndex: number, flowConfig: FlowConfig) {
  const nextIndex = currentStepIndex + 1;
  if (nextIndex >= flowConfig.steps.length) {
    return null;
  }
  return flowConfig.steps[nextIndex];
}

/**
 * Get the previous step before the current one
 */
export function getPreviousStep(currentStepIndex: number, flowConfig: FlowConfig) {
  const prevIndex = currentStepIndex - 1;
  if (prevIndex < 0) {
    return null;
  }
  return flowConfig.steps[prevIndex];
}

/**
 * Check if a step is the first step
 */
export function isFirstStep(currentStepIndex: number): boolean {
  return currentStepIndex === 0;
}

/**
 * Check if a step is the last step
 */
export function isLastStep(currentStepIndex: number, flowConfig: FlowConfig): boolean {
  return currentStepIndex === flowConfig.steps.length - 1;
}

/**
 * Get a step by its ID
 */
export function getStepById(stepId: string, flowConfig: FlowConfig) {
  return flowConfig.steps.find(step => step.id === stepId);
}

/**
 * Get step index by ID
 */
export function getStepIndexById(stepId: string, flowConfig: FlowConfig): number {
  return flowConfig.steps.findIndex(step => step.id === stepId);
}
