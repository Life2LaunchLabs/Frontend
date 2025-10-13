/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../styles';
import { PageLayout, Button, IconButton } from '@shared/components';
import { BlockRenderer } from '../../activities';
import { ActivitiesService } from '../../activities/api';
import { Activity, ActivityPageResponse, ActivityVersion } from '../../activities/types';

export const AdminActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();

  // State to track all loaded pages and activity info
  const [allPages, setAllPages] = useState<ActivityPageResponse[]>([]);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [activityVersion, setActivityVersion] = useState<ActivityVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to load activity with nested pages
  useEffect(() => {
    const loadActivity = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch the full activity details with latest version (includes nested pages and blocks)
        const activityData = await ActivitiesService.getActivity(id);
        setActivity(activityData);

        // Extract the latest activity version from the activity data
        if (activityData.activity_version) {
          setActivityVersion(activityData.activity_version);

          // Convert pages to the format expected by the component
          // All pages share the same media array from the activity
          const media = activityData.media || [];
          const pages: ActivityPageResponse[] = activityData.activity_version.pages.map((page: any) => ({
            page: page,
            blocks: page.blocks || [],
            media: media, // Use resolved media from backend
            activity_version: activityData.activity_version
          }));

          setAllPages(pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id]);

  const getStyles = () => ({
    header: {
      marginBottom: tokens.spacing[6],
      backgroundColor: colors.surfaceVariant,
      padding: tokens.spacing[8],
      borderRadius: tokens.borderRadius.large,
      boxShadow: tokens.shadows.small,
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: tokens.spacing[4],
    },
    titleSection: {
      flex: 1,
    },
    title: {
      ...tokens.typography.headline.large,
      color: colors.onSurface,
      marginBottom: tokens.spacing[2],
    },
    subtitle: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[4],
    },
    activityMeta: {
      display: 'flex',
      gap: tokens.spacing[4],
      flexWrap: 'wrap' as const,
      marginBottom: tokens.spacing[4],
    },
    metaItem: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
      backgroundColor: colors.surface,
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.small,
      border: `1px solid ${colors.outline}`,
    },
    versionInfo: {
      ...tokens.typography.label.medium,
      color: colors.primary,
      backgroundColor: colors.primaryContainer,
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.medium,
    },
    pagesContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[6],
    },
    pageCard: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[6],
      boxShadow: tokens.shadows.medium,
      border: `1px solid ${colors.outline}`,
    },
    pageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[6],
      paddingBottom: tokens.spacing[4],
      borderBottom: `1px solid ${colors.outline}`,
    },
    pageTitle: {
      ...tokens.typography.headline.medium,
      color: colors.onSurface,
      margin: 0,
      marginBottom: tokens.spacing[2],
    },
    pageIndex: {
      ...tokens.typography.body.small,
      color: colors.onSurfaceVariant,
    },
    pageNumber: {
      ...tokens.typography.label.large,
      color: colors.primary,
      backgroundColor: colors.primaryContainer,
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.medium,
    },
    blocksContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
    },
    loadingText: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
    },
    errorText: {
      ...tokens.typography.body.large,
      color: colors.error,
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing[4],
    },
  });

  const styles = getStyles();


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    return (
      <>
        <div style={styles.toolbar}>
          <IconButton
            icon="arrow_back"
            variant="outlined"
            onClick={() => {
              // Navigate to parent quest if available, otherwise to activities list
              if (activity.quest_templates && activity.quest_templates.length > 0) {
                navigate(`/admin/quests/${activity.quest_templates[0].id}`);
              } else {
                navigate('/admin/activities');
              }
            }}
          />
          <IconButton
            icon="edit"
            variant="filled"
            onClick={() => navigate(`/admin/activities/${id}/edit`)}
          />
        </div>

        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>{activityVersion.title}</h1>
              <p style={styles.subtitle}>
                Activity Version {activityVersion.version}
              </p>
            </div>
            <div style={styles.versionInfo}>
              v{activityVersion.version}
            </div>
          </div>

          <div style={styles.activityMeta}>
            <div style={styles.metaItem}>
              Activity ID: {activityVersion.id}
            </div>
            <div style={styles.metaItem}>
              Created: {formatDate(activityVersion.created_at)}
            </div>
            <div style={styles.metaItem}>
              Pages: {allPages.length}
            </div>
            <div style={styles.metaItem}>
              Blocks: {allPages.reduce((total, pageData) => total + pageData.blocks.length, 0)}
            </div>
          </div>
        </div>

        <div style={styles.pagesContainer}>
          {allPages.length === 0 ? (
            <div style={styles.loadingText}>
              No pages found for this activity.
            </div>
          ) : (
            allPages.map((pageData, index) => (
              <div key={pageData.page.id} style={styles.pageCard}>
                <div style={styles.pageHeader}>
                  <div>
                    <h3 style={styles.pageTitle}>
                      {pageData.page.title || `Page ${pageData.page.index + 1}`}
                    </h3>
                    <div style={styles.pageIndex}>
                      Index: {pageData.page.index}
                    </div>
                  </div>
                  <div style={styles.pageNumber}>
                    Page {index + 1}
                  </div>
                </div>

                <div style={styles.blocksContainer}>
                  {pageData.blocks.length === 0 ? (
                    <div style={{ ...styles.loadingText, fontStyle: 'italic', color: colors.onSurfaceVariant }}>
                      No blocks in this page
                    </div>
                  ) : (
                    pageData.blocks.map((block) => (
                      <BlockRenderer
                        key={block.id}
                        block={block}
                        media={pageData.media}
                      />
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <PageLayout
        pageName="Activity Detail"
        navMode="admin"
        panes={[
          {
            content: <p>Loading activity details...</p>,
          },
        ]}
      />
    );
  }

  if (error || !activity || !activityVersion) {
    return (
      <PageLayout
        pageName="Activity Detail"
        navMode="admin"
        panes={[
          {
            content: (
              <>
                <p css={{ color: colors.error }}>{error || 'Activity not found'}</p>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </>
            ),
          },
        ]}
      />
    );
  }

  return (
    <PageLayout
      pageName="Activity Detail"
      navMode="admin"
      panes={[
        {
          content: renderContent(),
        },
      ]}
    />
  );
};