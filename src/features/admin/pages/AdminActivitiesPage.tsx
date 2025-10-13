/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout } from '@shared/components';
import { ActivityCard } from '../components/ActivityCard';
import { ActivitiesService } from '../../activities/api';
import { Activity } from '../../activities/types';

export const AdminActivitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log('AdminActivitiesPage: Starting to fetch activities');
        setLoading(true);
        setError(null);
        const activitiesData = await ActivitiesService.getActivities();
        console.log('AdminActivitiesPage: Received activities data:', activitiesData);
        console.log('AdminActivitiesPage: Number of activities:', activitiesData?.length);
        setActivities(activitiesData);
      } catch (err) {
        console.error('AdminActivitiesPage: Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleActivityClick = (activity: Activity) => {
    navigate(`/admin/activities/${activity.id}`);
  };

  if (loading) {
    return (
      <PageLayout
        pageName="Activities"
        navMode="admin"
        panes={[
          {
            content: <p>Loading activities...</p>,
          },
        ]}
      />
    );
  }

  if (error) {
    return (
      <PageLayout
        pageName="Activities"
        navMode="admin"
        panes={[
          {
            content: <p css={{ color: colors.error }}>Error: {error}</p>,
          },
        ]}
      />
    );
  }

  return (
    <PageLayout
      pageName="Activities"
      navMode="admin"
      panes={[
        {
          content: (
            <>
              {/* Header */}
              <div css={{ marginBottom: tokens.spacing[6] }}>
                <h1>Activities</h1>
                <p>Manage and view all activities for your organization</p>
              </div>

              {/* Content */}
              {activities.length === 0 ? (
                <div css={{ textAlign: 'center', padding: tokens.spacing[8] }}>
                  <h2>No Activities Found</h2>
                  <p>There are no activities created for your organization yet.</p>
                </div>
              ) : (
                <div css={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: tokens.spacing[6],
                }}>
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onClick={() => handleActivityClick(activity)}
                    />
                  ))}
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
};