import { useState, useEffect } from 'react';
import { ActivitiesService } from '../api';
import { Activity, ActivityPageResponse, Attempt, PageProgress } from '../types';

export const useActivity = (slug: string) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ActivitiesService.getActivity(slug);
        setActivity(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch activity');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchActivity();
    }
  }, [slug]);

  return { activity, loading, error };
};

export const useActivityPage = (slug: string, pageIndex: number = 0) => {
  const [pageData, setPageData] = useState<ActivityPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ActivitiesService.getActivityPage(slug, pageIndex);
        setPageData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch activity page');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug, pageIndex]);

  return { pageData, loading, error };
};

export const useAllActivityPages = (slug: string) => {
  const [pages, setPages] = useState<ActivityPageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the activity once
        const activity = await ActivitiesService.getActivity(slug);

        if (!activity.activity_version) {
          throw new Error('No published version found for this activity');
        }

        const activityPages = activity.activity_version.pages || [];
        const media = activity.media || [];

        // Transform all pages to ActivityPageResponse format
        const allPages = activityPages.map(page => ({
          page: page,
          blocks: page.blocks || [],
          media: media,
          activity_version: activity.activity_version
        }));

        setPages(allPages);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch activity pages');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAllPages();
    }
  }, [slug]);

  return { pages, loading, error };
};


// Attempt Management Hooks
export const useCreateAttempt = () => {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAttempt = async (activityVersionId: string, questInstanceId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ActivitiesService.createAttempt(activityVersionId, questInstanceId);
      setAttempt(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to create attempt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { attempt, loading, error, createAttempt };
};

export const useAttempt = (attemptId: string | null) => {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      if (!attemptId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await ActivitiesService.getAttempt(attemptId);
        setAttempt(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch attempt');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  return { attempt, loading, error };
};

export const useSubmitResponse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitResponse = async (
    attemptId: string,
    questionId: string,
    questionType: string,
    pageId: string,
    value: any,
    valid: boolean = true
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ActivitiesService.submitResponse(
        attemptId, questionId, questionType, pageId, value, valid
      );
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to submit response');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitResponse, loading, error };
};

export const useAttemptProgress = (attemptId: string | null) => {
  const [progress, setProgress] = useState<PageProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = async (pageId: string, reached: boolean = true, data: any = {}) => {
    if (!attemptId) return;

    try {
      const updatedProgress = await ActivitiesService.updatePageProgress(attemptId, pageId, reached, data);
      // Update local state
      setProgress(prev => {
        const existing = prev.find(p => p.page.id === pageId);
        if (existing) {
          return prev.map(p => p.page.id === pageId ? updatedProgress : p);
        } else {
          return [...prev, updatedProgress];
        }
      });
      return updatedProgress;
    } catch (err: any) {
      setError(err.message || 'Failed to update progress');
      throw err;
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (!attemptId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await ActivitiesService.getAttemptProgress(attemptId);
        setProgress(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [attemptId]);

  return { progress, loading, error, updateProgress };
};