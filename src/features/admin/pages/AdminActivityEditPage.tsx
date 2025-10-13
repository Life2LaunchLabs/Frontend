import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from '../../../styles';
import { PageLayout, Button } from '@shared/components';
import { Solid, Pane } from '@shared/components/surfaces';
import { DraggablePageCard, AddPageButton, DraggableBlockType } from '../components';
import { ActivitiesService } from '../../activities/api';
import { Activity, Block, Page } from '../../activities/types';
import { useActivityEditor } from '../hooks/useActivityEditor';
import { getBlockTypesByCategory } from '../utils/blockTypes';

export const AdminActivityEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();

  // Loading state
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor state (managed by our new hook)
  const editor = useActivityEditor(activity);

  // UI state
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load activity on mount
  useEffect(() => {
    const loadActivity = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const activityData = await ActivitiesService.getActivityForEdit(id);
        console.log('Loaded activity data:', activityData);
        console.log('Has activity_version:', 'activity_version' in (activityData as any));
        console.log('activity_version value:', (activityData as any).activity_version);
        setActivity(activityData);
      } catch (err) {
        console.error('Failed to load activity:', err);
        setError(err instanceof Error ? err.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id]);

  // Handlers - execute immediately, no modals
  const handleDiscard = () => {
    console.log('[Discard] Clicked - navigating back');
    navigate(`/admin/activities/${id}`);
  };

  const handleSave = async () => {
    console.log('[Save] Clicked. hasChanges:', editor.hasChanges);
    if (!editor.hasChanges) {
      console.log('[Save] No changes to save');
      return;
    }

    if (!id) return;

    setSaving(true);

    try {
      const saveData = editor.getSavePayload();
      console.log('[Save] Payload:', saveData);

      await ActivitiesService.saveActivityEdits(id, saveData);

      console.log('[Save] Success! Navigating back');
      setSaving(false);
      navigate(`/admin/activities/${id}`);
    } catch (error) {
      console.error('[Save] Failed:', error);
      alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSaving(false);
    }
  };

  // Page handlers (now using editor actions)
  const handleAddPage = (insertIndex: number) => {
    editor.addPage(insertIndex);
  };

  const handlePageChange = (pageId: string, updatedPage: Partial<Page>) => {
    if (updatedPage.title !== undefined) {
      editor.updatePage(pageId, updatedPage.title, updatedPage.meta);
    }
  };

  const handlePageDelete = (pageId: string) => {
    editor.deletePage(pageId);
  };

  const handlePageReorder = (pageId: string, newIndex: number) => {
    editor.reorderPage(pageId, newIndex);
  };

  // Block handlers (now using editor actions)
  const handleBlockChange = (blockId: string, updatedBlock: Block) => {
    editor.updateBlock(blockId, updatedBlock.config);
  };

  const handleBlockDelete = (blockId: string) => {
    editor.deleteBlock(blockId);
  };

  const handleBlockAdd = (pageId: string, blockType: string, insertIndex: number) => {
    editor.addBlock(pageId, blockType, insertIndex);
  };

  const handleBlockMove = (
    sourcePageIndex: number,
    sourceBlockIndex: number,
    targetPageIndex: number,
    targetInsertIndex: number
  ) => {
    // Convert indices to IDs
    const sourcePage = editor.orderedPages[sourcePageIndex];
    const targetPage = editor.orderedPages[targetPageIndex];

    if (!sourcePage || !targetPage) return;

    const sourceBlock = sourcePage.blocks[sourceBlockIndex];
    if (!sourceBlock) return;

    editor.moveBlock(sourceBlock.id, targetPage.page.id, targetInsertIndex);
  };

  // Get block types for sidebar
  const blockTypes = getBlockTypesByCategory();

  // Styles
  const getStyles = () => ({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: tokens.spacing[4],
      gap: tokens.spacing[4],
    },
    toolbarLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[3],
      minWidth: 0,
    },
    toolbarTitle: {
      ...tokens.typography.headline.small,
      color: colors.onSurface,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    toolbarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[3],
      flexShrink: 0,
    },
    leftPanel: {
      width: '280px',
      height: '100%',
      padding: tokens.spacing[4],
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      overflowY: 'auto' as const,
    },
    panelTitle: {
      ...tokens.typography.headline.small,
      color: colors.onSurface,
      margin: 0,
    },
    blockCategory: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    blockCategoryTitle: {
      ...tokens.typography.label.medium,
      color: colors.onSurfaceVariant,
      margin: 0,
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      padding: tokens.spacing[6],
      overflowY: 'auto' as const,
      minWidth: 0,
    },
    activityTitleInput: {
      ...tokens.typography.headline.large,
      color: colors.onSurface,
      backgroundColor: 'transparent',
      border: `2px solid transparent`,
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      outline: 'none',
      width: '100%',
      marginBottom: tokens.spacing[2],
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    activityTitleInputFocused: {
      border: `2px solid ${colors.primary}`,
      backgroundColor: colors.surfaceContainerHighest,
      cursor: 'text',
    },
    activityDescriptionInput: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      backgroundColor: 'transparent',
      border: `2px solid transparent`,
      borderRadius: tokens.borderRadius.small,
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      outline: 'none',
      width: '100%',
      minHeight: '3em',
      resize: 'vertical' as const,
      marginBottom: tokens.spacing[2],
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      fontFamily: 'inherit',
    },
    activityDescriptionInputFocused: {
      border: `2px solid ${colors.primary}`,
      backgroundColor: colors.surfaceContainerHighest,
      cursor: 'text',
    },
    activityMeta: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      margin: 0,
    },
    pagesContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 0,
    },
    emptyState: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[8],
    },
    loadingText: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[12],
    },
    errorText: {
      ...tokens.typography.body.large,
      color: colors.error,
      textAlign: 'center' as const,
      padding: tokens.spacing[12],
    },
  });

  const styles = getStyles();

  // Loading state
  if (loading) {
    return (
      <PageLayout
        pageName="Edit Activity"
        navMode="admin"
        panes={[
          {
            content: (
              <div style={styles.loadingText}>
                Loading activity for editing...
              </div>
            ),
          },
        ]}
      />
    );
  }

  // Error state
  if (error || !activity) {
    return (
      <PageLayout
        pageName="Edit Activity"
        navMode="admin"
        panes={[
          {
            content: (
              <div style={styles.errorText}>
                {error || 'Activity not found'}
              </div>
            ),
          },
        ]}
      />
    );
  }

  // Main render
  return (
    <DndProvider backend={HTML5Backend}>
      <PageLayout
        pageName="Edit Activity"
        navMode="admin"
        toolbars={[
          <Solid key="toolbar" css={{ margin: 0, borderRadius: 0 }}>
            <div style={styles.toolbar}>
              <div style={styles.toolbarLeft}>
                <span style={styles.toolbarTitle}>
                  {editor.state.title}
                </span>
              </div>
              <div style={styles.toolbarRight}>
                <Button variant="outlined" onClick={handleDiscard} disabled={saving}>
                  Discard
                </Button>
                <Button variant="filled" onClick={handleSave} disabled={!editor.hasChanges || saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </Solid>
        ]}
        sidebar={
          <Solid as="aside" css={{ margin: 0, borderRadius: 0, height: '100%' }}>
            <div style={styles.leftPanel}>
              <h3 style={styles.panelTitle}>Block Types</h3>
              {blockTypes.map((category, catIndex) => (
                <div key={catIndex} style={styles.blockCategory}>
                  <h4 style={styles.blockCategoryTitle}>{category.category}</h4>
                  {category.blocks.map((block) => (
                    <DraggableBlockType
                      key={block.type}
                      type={block.type}
                      icon={block.icon}
                      label={block.label}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Solid>
        }
        panes={[
          {
            content: (
              <div style={styles.mainContent}>
                {/* Activity Header */}
                <Pane>
                  <input
                    type="text"
                    value={editor.state.title}
                    onChange={(e) => editor.updateTitle(e.target.value)}
                    onFocus={() => setTitleFocused(true)}
                    onBlur={() => setTitleFocused(false)}
                    style={{
                      ...styles.activityTitleInput,
                      ...(titleFocused ? styles.activityTitleInputFocused : {}),
                    }}
                    placeholder="Activity title..."
                  />
                  <textarea
                    value={editor.state.description}
                    onChange={(e) => editor.updateDescription(e.target.value)}
                    onFocus={() => setDescriptionFocused(true)}
                    onBlur={() => setDescriptionFocused(false)}
                    style={{
                      ...styles.activityDescriptionInput,
                      ...(descriptionFocused ? styles.activityDescriptionInputFocused : {}),
                    }}
                    placeholder="Activity description..."
                  />
                  <p style={styles.activityMeta}>
                    Version {editor.state.versionNumber} • {editor.state.pageOrder.length} pages
                  </p>
                </Pane>

                {/* Pages */}
                <div style={styles.pagesContainer}>
                  {editor.orderedPages.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p>No pages found. Add your first page below.</p>
                    </div>
                  ) : (
                    editor.orderedPages.map((pageData, index) => {
                      if (!pageData) return null;

                      const page = pageData.page;
                      const blocks = pageData.blocks as any[];

                      return (
                        <React.Fragment key={page.id}>
                          {index === 0 && (
                            <AddPageButton
                              position="between"
                              onAddPage={() => handleAddPage(0)}
                            />
                          )}

                          <DraggablePageCard
                            page={page as unknown as Page}
                            blocks={blocks}
                            media={editor.state.media}
                            pageNumber={index + 1}
                            pageIndex={index}
                            onPageChange={(updatedPage) => handlePageChange(page.id, updatedPage)}
                            onBlockChange={(blockId, block) => handleBlockChange(blockId, block)}
                            onBlockDelete={(blockId) => handleBlockDelete(blockId)}
                            onPageDelete={() => handlePageDelete(page.id)}
                            onBlockAdd={(blockType, insertIndex = blocks.length) =>
                              handleBlockAdd(page.id, blockType, insertIndex)
                            }
                            onBlockMove={handleBlockMove}
                            onPageReorder={(dragIndex, hoverIndex) => {
                              const draggedPageId = editor.state.pageOrder[dragIndex];
                              handlePageReorder(draggedPageId, hoverIndex);
                            }}
                          />

                          <AddPageButton
                            position="between"
                            onAddPage={() => handleAddPage(index + 1)}
                          />
                        </React.Fragment>
                      );
                    })
                  )}

                  {editor.orderedPages.length === 0 && (
                    <AddPageButton
                      position="end"
                      onAddPage={() => handleAddPage(0)}
                    />
                  )}
                </div>
              </div>
            ),
          },
        ]}
      />
      {/* Modals removed - buttons execute immediately */}
    </DndProvider>
  );
};
