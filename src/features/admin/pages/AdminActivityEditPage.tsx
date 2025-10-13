import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from '../../../styles';
import { PageLayout, Button, Modal } from '@shared/components';
import { Solid, Pane } from '@shared/components/surfaces';
import { DraggablePageCard, AddPageButton, DraggableBlockType } from '../components';
import { ActivitiesService } from '../../activities/api';
import { ActivityPageResponse, ActivityVersion, Activity, Page, Block } from '../../activities/types';

export const AdminActivityEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors, tokens } = useTheme();

  // State to track all loaded pages and activity info
  const [allPages, setAllPages] = useState<ActivityPageResponse[]>([]);
  const [activityVersion, setActivityVersion] = useState<ActivityVersion | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editablePages, setEditablePages] = useState<ActivityPageResponse[]>([]);
  const [editableActivity, setEditableActivity] = useState<Activity | null>(null);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Update editable pages when allPages changes
  useEffect(() => {
    setEditablePages([...allPages]);
  }, [allPages]);

  // Update editable activity when activity changes
  useEffect(() => {
    if (activity) {
      setEditableActivity({ ...activity });
    }
  }, [activity]);

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

  const handleDiscard = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      navigate(`/admin/activities/${id}`);
    }
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    navigate(`/admin/activities/${id}`);
  };

  const handleSave = () => {
    if (!hasChanges) {
      return;
    }
    setSaveError(null); // Reset any previous error
    setShowSaveModal(true);
  };

  const confirmSave = async () => {
    if (!id || !editableActivity) return;

    setSaving(true);
    setSaveError(null);

    try {
      // Prepare the data that would be saved
      const saveData = {
        activity: {
          // Only send fields that belong to Activity model (status, author_meta)
          status: editableActivity.status,
          author_meta: editableActivity.author_meta,
        },
        activity_version: {
          // Title and description belong in ActivityVersion
          ...activityVersion,
          title: editableActivity.title,
          description: editableActivity.description,
        },
        pages: editablePages.map((pageData, index) => ({
          ...pageData.page,
          index, // Ensure index is current
          blocks: pageData.blocks,
        })),
        total_pages: editablePages.length,
      };

      console.log('Saving activity edits:', saveData);

      // Call the save API
      await ActivitiesService.saveActivityEdits(id!, saveData);

      // Success - reset state and navigate back
      setShowSaveModal(false);
      setHasChanges(false);
      setSaving(false);
      navigate(`/admin/activities/${id}`);

    } catch (error) {
      console.error('Failed to save activity edits:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
      setSaving(false);
    }
  };

  // Page Management Handlers
  const handleAddPage = (insertIndex: number) => {
    const newPageId = `page_${Date.now()}`;
    const newPage: Page = {
      id: newPageId,
      index: insertIndex,
      title: `New Page ${insertIndex + 1}`,
      meta: {}
    };

    const newPageData: ActivityPageResponse = {
      activity_version: activityVersion!,
      page: newPage,
      blocks: [],
      media: []
    };

    const updatedPages = [...editablePages];
    updatedPages.splice(insertIndex, 0, newPageData);

    // Update indices for all pages after the inserted one
    updatedPages.forEach((pageData, index) => {
      pageData.page.index = index;
    });

    setEditablePages(updatedPages);
    setHasChanges(true);
  };

  const handlePageChange = (pageIndex: number, updatedPage: Page) => {
    const updatedPages = [...editablePages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      page: updatedPage
    };
    setEditablePages(updatedPages);
    setHasChanges(true);
  };

  const handlePageDelete = (pageIndex: number) => {
    const updatedPages = editablePages.filter((_, index) => index !== pageIndex);

    // Update indices for remaining pages
    updatedPages.forEach((pageData, index) => {
      pageData.page.index = index;
    });

    setEditablePages(updatedPages);
    setHasChanges(true);
  };

  const handleBlockChange = (pageIndex: number, blockId: string, updatedBlock: Block) => {
    const updatedPages = [...editablePages];
    const blockIndex = updatedPages[pageIndex].blocks.findIndex(b => b.id === blockId);

    if (blockIndex >= 0) {
      updatedPages[pageIndex].blocks[blockIndex] = updatedBlock;
      setEditablePages(updatedPages);
      setHasChanges(true);
    }
  };

  const handleBlockDelete = (pageIndex: number, blockId: string) => {
    const updatedPages = [...editablePages];
    updatedPages[pageIndex].blocks = updatedPages[pageIndex].blocks.filter(b => b.id !== blockId);
    setEditablePages(updatedPages);
    setHasChanges(true);
  };

  const handleBlockAdd = (pageIndex: number, blockType: string, insertIndex: number) => {
    const newBlockId = `block_${Date.now()}`;
    const newBlock: Block = {
      id: newBlockId,
      block_type: blockType,
      config: {
        // Add default config based on block type
        ...(blockType === 'text' && {
          text: 'Enter your text here...',
          style: 'body',
          align: 'left'
        }),
        ...(blockType === 'media' && {
          media_id: '',
          fit: 'contain'
        }),
        ...(blockType === 'text_input' && {
          question_id: `question_${Date.now()}`,
          question_type: 'text_input',
          title: 'New Question',
          subtitle: '',
          required: false,
          config: {
            placeholder: 'Enter your answer...',
            multiline: false,
          }
        }),
        ...(blockType === 'multiple_choice' && {
          question_id: `question_${Date.now()}`,
          question_type: 'multiple_choice',
          title: 'New Multiple Choice Question',
          subtitle: '',
          required: false,
          config: {
            min_select: 1,
            max_select: 1,
            options: [
              { id: 'opt_1', title: 'Option 1', body: '' },
              { id: 'opt_2', title: 'Option 2', body: '' },
            ]
          }
        }),
      },
    };

    const updatedPages = [...editablePages];
    updatedPages[pageIndex].blocks.splice(insertIndex, 0, newBlock);
    setEditablePages(updatedPages);
    setHasChanges(true);
  };

  const handleBlockMove = (sourcePageIndex: number, sourceBlockIndex: number, targetPageIndex: number, targetInsertIndex: number, block?: Block) => {
    const updatedPages = [...editablePages];

    if (sourcePageIndex === targetPageIndex) {
      // Moving within the same page
      const blocks = [...updatedPages[sourcePageIndex].blocks];
      const draggedBlock = blocks[sourceBlockIndex];

      // Remove the dragged block and insert it at the new position
      blocks.splice(sourceBlockIndex, 1);
      blocks.splice(targetInsertIndex > sourceBlockIndex ? targetInsertIndex - 1 : targetInsertIndex, 0, draggedBlock);

      updatedPages[sourcePageIndex].blocks = blocks;
    } else {
      // Moving between different pages
      if (!block) return;

      // Remove from source page
      updatedPages[sourcePageIndex].blocks.splice(sourceBlockIndex, 1);

      // Add to target page
      updatedPages[targetPageIndex].blocks.splice(targetInsertIndex, 0, block);
    }

    setEditablePages(updatedPages);
    setHasChanges(true);
  };

  const handlePageReorder = (dragIndex: number, hoverIndex: number) => {
    const updatedPages = [...editablePages];
    const draggedPage = updatedPages[dragIndex];

    // Remove the dragged page and insert it at the new position
    updatedPages.splice(dragIndex, 1);
    updatedPages.splice(hoverIndex, 0, draggedPage);

    // Update page indices to reflect new order
    updatedPages.forEach((pageData, index) => {
      pageData.page.index = index;
    });

    setEditablePages(updatedPages);
    setHasChanges(true);
  };

  // Activity Management Handlers
  const handleActivityChange = (field: 'title' | 'description', value: string) => {
    if (!editableActivity) return;

    const updatedActivity = {
      ...editableActivity,
      [field]: value
    };
    setEditableActivity(updatedActivity);
    setHasChanges(true);
  };

  const blockTypes = [
    {
      category: 'Basic Blocks',
      blocks: [
        { type: 'text', icon: 'text_fields', label: 'Text' },
        { type: 'media', icon: 'image', label: 'Media' },
        { type: 'divider', icon: 'horizontal_rule', label: 'Divider' },
      ]
    },
    {
      category: 'Question Blocks',
      blocks: [
        { type: 'text_input', icon: 'edit_note', label: 'Text Input' },
        { type: 'multiple_choice', icon: 'checklist', label: 'Multiple Choice' },
      ]
    }
  ];

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

  if (error || !activityVersion || !editableActivity) {
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

  return (
    <DndProvider backend={HTML5Backend}>
      <PageLayout
        pageName="Edit Activity"
        navMode="admin"
        toolbars={[
          // Edit Toolbar
          <Solid css={{ margin: 0, borderRadius: 0 }}>
            <div style={styles.toolbar}>
              <div style={styles.toolbarLeft}>
                <span style={styles.toolbarTitle}>
                  {activityVersion.title}
                </span>
              </div>
              <div style={styles.toolbarRight}>
                <Button
                  variant="outlined"
                  onClick={handleDiscard}
                >
                  Discard
                </Button>
                <Button
                  variant="filled"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </Solid>
        ]}
        sidebar={
          // Left Panel - Block Types
          <Solid as="aside" css={{ margin: 0, borderRadius: 0, height: '100%' }}>
            <div style={styles.leftPanel}>
              <h3 style={styles.panelTitle}>Block Types</h3>
              {blockTypes.map((category, catIndex) => (
                <div key={catIndex} style={styles.blockCategory}>
                  <h4 style={styles.blockCategoryTitle}>
                    {category.category}
                  </h4>
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
          {/* Activity Header - Pane Component */}
          <Pane>
            <input
              type="text"
              value={editableActivity.title}
              onChange={(e) => handleActivityChange('title', e.target.value)}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              style={{
                ...styles.activityTitleInput,
                ...(titleFocused ? styles.activityTitleInputFocused : {}),
              }}
              placeholder="Activity title..."
            />
            <textarea
              value={editableActivity.description}
              onChange={(e) => handleActivityChange('description', e.target.value)}
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
              style={{
                ...styles.activityDescriptionInput,
                ...(descriptionFocused ? styles.activityDescriptionInputFocused : {}),
              }}
              placeholder="Activity description..."
            />
            <p style={styles.activityMeta}>
              Version {activityVersion.version} • {allPages.length} pages
            </p>
          </Pane>

          {/* Editable Page Cards */}
          <div style={styles.pagesContainer}>
            {editablePages.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No pages found. Add your first page below.</p>
              </div>
            ) : (
              editablePages.map((pageData, index) => (
                <React.Fragment key={pageData.page.id}>
                  {/* Add Page Button - Between existing pages */}
                  {index === 0 && (
                    <AddPageButton
                      position="between"
                      onAddPage={() => handleAddPage(0)}
                    />
                  )}

                  {/* Draggable and Droppable Page Edit Card (already a Pane) */}
                  <DraggablePageCard
                    page={pageData.page}
                    blocks={pageData.blocks}
                    media={pageData.media}
                    pageNumber={index + 1}
                    pageIndex={index}
                    onPageChange={(updatedPage) => handlePageChange(index, updatedPage)}
                    onBlockChange={(blockId, block) => handleBlockChange(index, blockId, block)}
                    onBlockDelete={(blockId) => handleBlockDelete(index, blockId)}
                    onPageDelete={() => handlePageDelete(index)}
                    onBlockAdd={(blockType, insertIndex = pageData.blocks.length) => handleBlockAdd(index, blockType, insertIndex)}
                    onBlockMove={handleBlockMove}
                    onPageReorder={handlePageReorder}
                  />

                  {/* Add Page Button - Between existing pages */}
                  <AddPageButton
                    position="between"
                    onAddPage={() => handleAddPage(index + 1)}
                  />
                </React.Fragment>
              ))
            )}

            {/* Add Page Button - At the end */}
            {editablePages.length === 0 && (
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
      >
      {/* Discard Changes Modal */}
      <Modal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title="Discard Changes"
        actions={[
          {
            label: 'Cancel',
            variant: 'outlined',
            onClick: () => setShowDiscardModal(false),
          },
          {
            label: 'Discard',
            variant: 'filled',
            onClick: confirmDiscard,
          },
        ]}
      >
        <p>You have unsaved changes. Are you sure you want to discard them?</p>
        <p style={{ marginTop: tokens.spacing[4], color: colors.onSurfaceVariant }}>
          This will lose all your edits and cannot be undone.
        </p>
      </Modal>

      {/* Save Changes Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => !saving && setShowSaveModal(false)}
        title="Save Changes"
        size="medium"
        closeOnOverlayClick={!saving}
        closeOnEscape={!saving}
        actions={[
          {
            label: 'Cancel',
            variant: 'outlined',
            onClick: () => setShowSaveModal(false),
            disabled: saving,
          },
          {
            label: saving ? 'Saving...' : 'Save',
            variant: 'filled',
            onClick: confirmSave,
            disabled: saving,
          },
        ]}
      >
        {saveError ? (
          <div>
            <p style={{ color: colors.error }}>Failed to save changes:</p>
            <p style={{ marginTop: tokens.spacing[2], color: colors.error, fontSize: '0.9em' }}>
              {saveError}
            </p>
            <p style={{ marginTop: tokens.spacing[4], color: colors.onSurfaceVariant }}>
              Please try again or contact support if the problem persists.
            </p>
          </div>
        ) : (
          <div>
            <p>Ready to save your changes?</p>
            <p style={{ marginTop: tokens.spacing[4], color: colors.onSurfaceVariant }}>
              This will create a new version of the activity with all your edits.
            </p>
            {saving && (
              <p style={{ marginTop: tokens.spacing[4], color: colors.primary, fontStyle: 'italic' }}>
                Saving changes to the server...
              </p>
            )}
          </div>
        )}
      </Modal>
      </PageLayout>
    </DndProvider>
  );
};