import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FlowState, FlowProgressUpdate } from '../types';
import { OnboardingFlowService } from '../api/OnboardingFlowService';

interface OnboardingFlowContextValue {
  flowState: FlowState | null;
  loading: boolean;
  error: string | null;
  initializeFlow: () => Promise<void>;
  updateProgress: (update: FlowProgressUpdate) => Promise<FlowState>;
  completeFlow: () => Promise<void>;
  refreshFlowState: () => Promise<void>;
}

export const OnboardingFlowContext = createContext<OnboardingFlowContextValue | undefined>(
  undefined
);

interface OnboardingFlowProviderProps {
  children: ReactNode;
  autoInitialize?: boolean;
}

export const OnboardingFlowProvider: React.FC<OnboardingFlowProviderProps> = ({
  children,
  autoInitialize = true,
}) => {
  const [flowState, setFlowState] = useState<FlowState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize a new flow
   */
  const initializeFlow = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await OnboardingFlowService.initializeFlow();
      setFlowState(state);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize flow';
      setError(errorMessage);
      console.error('Failed to initialize flow:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get current flow state from backend
   */
  const refreshFlowState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await OnboardingFlowService.getFlowState();
      setFlowState(state);
      setLoading(false);
    } catch (err) {
      // If no flow exists (404), initialize one
      if (autoInitialize) {
        try {
          const newState = await OnboardingFlowService.initializeFlow();
          setFlowState(newState);
          setLoading(false);
        } catch (initErr) {
          const errorMessage = initErr instanceof Error ? initErr.message : 'Failed to initialize flow';
          setError(errorMessage);
          console.error('Failed to initialize flow:', initErr);
          setLoading(false);
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get flow state';
        setError(errorMessage);
        console.error('Failed to get flow state:', err);
        setLoading(false);
      }
    }
  }, [autoInitialize]);

  /**
   * Update flow progress
   */
  const updateProgress = useCallback(async (update: FlowProgressUpdate): Promise<FlowState> => {
    try {
      setError(null);
      const updatedState = await OnboardingFlowService.updateFlowProgress(update);
      setFlowState(updatedState);
      return updatedState;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update progress';
      setError(errorMessage);
      console.error('Failed to update progress:', err);
      throw err;
    }
  }, []);

  /**
   * Complete the entire flow
   */
  const completeFlow = useCallback(async () => {
    try {
      setError(null);
      const completedState = await OnboardingFlowService.completeFlow();
      setFlowState(completedState);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete flow';
      setError(errorMessage);
      console.error('Failed to complete flow:', err);
      throw err;
    }
  }, []);

  /**
   * On mount, try to get existing flow state or initialize new one
   */
  useEffect(() => {
    if (autoInitialize) {
      refreshFlowState();
    } else {
      setLoading(false);
    }
  }, [autoInitialize, refreshFlowState]);

  const value: OnboardingFlowContextValue = {
    flowState,
    loading,
    error,
    initializeFlow,
    updateProgress,
    completeFlow,
    refreshFlowState,
  };

  return (
    <OnboardingFlowContext.Provider value={value}>
      {children}
    </OnboardingFlowContext.Provider>
  );
};
