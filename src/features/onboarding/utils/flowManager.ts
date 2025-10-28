/**
 * Flow management utilities
 */

import { FlowState, FlowStep } from '../types';

/**
 * Calculate the route path for a given flow step
 */
export function getStepRoutePath(step: FlowStep): string {
  if (step.type === 'activity' && step.activitySlug) {
    // For the first step (welcome), use /welcome without slug
    // For subsequent steps, use /welcome/:slug
    return step.id === 'welcome' ? '/welcome' : `/welcome/${step.activitySlug}`;
  }

  // For other step types, use a generic pattern
  return `/welcome/${step.id}`;
}

/**
 * Determine the next route after completing a step
 */
export function getNextRoute(flowState: FlowState): string {
  if (flowState.is_complete || flowState.current_step_index >= flowState.total_steps) {
    // Flow is complete, redirect to registration
    return '/register?flow_complete=true';
  }

  // Navigate to the current step
  return getStepRoutePath(flowState.current_step);
}

/**
 * Get activity slug from route parameter
 * If no slug provided, return the first step's slug
 */
export function getActivitySlugFromRoute(
  routeSlug: string | undefined,
  flowState: FlowState | null
): string {
  if (routeSlug) {
    return routeSlug;
  }

  // Default to the first step
  if (flowState && flowState.flow_config.steps[0]) {
    return flowState.flow_config.steps[0].activitySlug || 'welcome';
  }

  return 'welcome';
}

/**
 * Check if we can navigate to the previous step
 */
export function canGoBack(flowState: FlowState): boolean {
  return flowState.current_step_index > 0;
}

/**
 * Check if the current step is the last one
 */
export function isLastStep(flowState: FlowState): boolean {
  return flowState.current_step_index === flowState.total_steps - 1;
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(flowState: FlowState): number {
  if (flowState.total_steps === 0) return 0;
  return Math.round((flowState.completed_steps.length / flowState.total_steps) * 100);
}
