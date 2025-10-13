import { useState } from 'react';
import { ActivitiesService, Activity } from '../../activities';

export const useActivitiesHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await ActivitiesService.healthCheck();
      setHealthStatus(status);
    } catch (err: any) {
      setError(err.message || 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  return { healthStatus, loading, error, checkHealth };
};

export const useCreateDemoActivity = () => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDemo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ActivitiesService.createDemoActivity();
      setActivity(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create demo activity');
    } finally {
      setLoading(false);
    }
  };

  return { activity, loading, error, createDemo };
};