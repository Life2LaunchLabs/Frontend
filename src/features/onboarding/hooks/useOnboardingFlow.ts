import { useContext } from 'react';
import { OnboardingFlowContext } from '../context/OnboardingFlowContext';

/**
 * Hook to access onboarding flow context
 * Must be used within OnboardingFlowProvider
 */
export function useOnboardingFlow() {
  const context = useContext(OnboardingFlowContext);

  if (context === undefined) {
    throw new Error('useOnboardingFlow must be used within OnboardingFlowProvider');
  }

  return context;
}
