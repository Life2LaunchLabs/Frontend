/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from '../../../styles';
import { PageLayout, Button, IconButton } from '@shared/components';
import { QuestAdminService } from '../api';
import { QuestTemplateDetail, QuestTemplateItem, ItemOrderUpdate } from '../types';

export const AdminQuestDetailPage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<QuestTemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showItemTypeMenu, setShowItemTypeMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedColor, setEditedColor] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (questId) {
      loadQuest();
    }
  }, [questId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showItemTypeMenu) {
        setShowItemTypeMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showItemTypeMenu]);

  const loadQuest = async () => {
    if (!questId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await QuestAdminService.getQuestTemplate(questId);
      setQuest(data);
      setEditedTitle(data.title);
      setEditedDescription(data.description);
      setEditedColor(data.color);
      setEditedCategory(data.category);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quest');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!questId || !quest) return;

    try {
      setIsSaving(true);
      await QuestAdminService.publishQuestTemplate(questId);
      await loadQuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish quest');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (!questId || !quest) return;

    try {
      setIsSaving(true);
      await QuestAdminService.unpublishQuestTemplate(questId);
      await loadQuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish quest');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!questId || !quest) return;

    try {
      setIsSaving(true);
      await QuestAdminService.updateQuestTemplate(questId, {
        title: editedTitle,
        description: editedDescription,
        color: editedColor,
        category: editedCategory,
      });
      await loadQuest();
      setIsEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!quest) return;
    setEditedTitle(quest.title);
    setEditedDescription(quest.description);
    setEditedColor(quest.color);
    setEditedCategory(quest.category);
    setIsEditMode(false);
  };

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  useEffect(() => {
    if (isEditMode && descriptionTextareaRef.current) {
      autoResizeTextarea(descriptionTextareaRef.current);
    }
  }, [isEditMode, editedDescription]);

  const handleReorder = useCallback(async (newOrder: ItemOrderUpdate[]) => {
    if (!questId) return;

    try {
      setIsSaving(true);
      await QuestAdminService.reorderQuestItems(questId, newOrder);
      await loadQuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder items');
    } finally {
      setIsSaving(false);
    }
  }, [questId]);

  const handleRemoveItem = async (itemId: string) => {
    if (!questId) return;

    if (!confirm('Are you sure you want to remove this item?')) return;

    try {
      setIsSaving(true);
      await QuestAdminService.removeItemFromQuest(questId, itemId);
      await loadQuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateActivity = async () => {
    if (!questId) return;

    try {
      setIsCreatingActivity(true);
      setError(null);
      const result = await QuestAdminService.createActivityForQuest(questId);
      // Navigate to the new activity page
      navigate(`/admin/activities/${result.activity_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
      setIsCreatingActivity(false);
    }
  };

  const getStyles = () => ({
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[6],
      width: '100%',
    },
    header: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[2],
      boxShadow: tokens.shadows.small,
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
    },
    backButton: {
      color: colors.primary,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[2],
      ...tokens.typography.label.large,
      cursor: 'pointer',
    },
    backIcon: {
      fontFamily: '"Material Symbols Outlined"',
      fontSize: '20px',
    },
    titleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: tokens.spacing[4],
    },
    titleSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
      flex: 1,
    },
    title: {
      ...tokens.typography.headline.large,
      color: colors.onSurface,
      margin: 0,
    },
    actions: {
      display: 'flex',
      gap: tokens.spacing[3],
      flexShrink: 0,
    },
    statusBadge: (status: string) => ({
      padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.full,
      ...tokens.typography.label.small,
      alignSelf: 'flex-start',
      backgroundColor:
        status === 'published'
          ? colors.primaryContainer
          : status === 'draft'
          ? colors.secondaryContainer
          : colors.errorContainer,
      color:
        status === 'published'
          ? colors.onPrimaryContainer
          : status === 'draft'
          ? colors.onSecondaryContainer
          : colors.onErrorContainer,
    }),
    description: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      margin: 0,
    },
    stats: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: tokens.spacing[4],
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[1],
    },
    statLabel: {
      ...tokens.typography.label.small,
      color: colors.onSurfaceVariant,
    },
    statValue: {
      ...tokens.typography.label.medium,
      color: colors.onSurface,
      fontWeight: 600,
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[4],
      backgroundColor: colors.surfaceVariant,
      borderRadius: tokens.borderRadius.large,
      padding: tokens.spacing[2],
      boxShadow: tokens.shadows.small,
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing[4],
    },
    sectionTitle: {
      ...tokens.typography.title.medium,
      color: colors.onSurface,
      margin: 0,
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: tokens.spacing[2],
    },
    emptyText: {
      ...tokens.typography.body.large,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[4],
    },
    loadingText: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[2],
    },
    menuContainer: {
      position: 'relative' as const,
    },
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      right: 0,
      marginTop: tokens.spacing[4],
      backgroundColor: colors.surface,
      borderRadius: tokens.borderRadius.medium,
      boxShadow: tokens.shadows.large,
      zIndex: 1000,
      minWidth: '200px',
      overflow: 'hidden',
    },
    dropdownItem: {
      padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      cursor: 'pointer',
      ...tokens.typography.body.medium,
      color: colors.onSurface,
      transition: 'background-color 0.2s',
      borderBottom: `1px solid ${colors.outline}`,
    } as React.CSSProperties,
    errorBanner: {
      backgroundColor: colors.errorContainer,
      color: colors.onErrorContainer,
      padding: tokens.spacing[3],
      borderRadius: tokens.borderRadius.medium,
      marginBottom: tokens.spacing[4],
      ...tokens.typography.body.medium,
    },
    input: {
      width: '100%',
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${colors.outline}`,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      ...tokens.typography.body.large,
      fontFamily: 'inherit',
      outline: 'none',
    } as React.CSSProperties,
    titleInput: {
      width: '100%',
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${colors.outline}`,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      ...tokens.typography.headline.large,
      fontFamily: 'inherit',
      outline: 'none',
    } as React.CSSProperties,
    textarea: {
      width: '100%',
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.medium,
      border: `1px solid ${colors.outline}`,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      ...tokens.typography.body.large,
      fontFamily: 'inherit',
      resize: 'none' as const,
      overflow: 'hidden' as const,
      outline: 'none',
      minHeight: 'auto',
    } as React.CSSProperties,
    editActions: {
      display: 'flex',
      gap: tokens.spacing[2],
      marginTop: tokens.spacing[2],
    },
    loadingOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    loadingContent: {
      backgroundColor: colors.surface,
      padding: tokens.spacing[8],
      borderRadius: tokens.borderRadius.large,
      textAlign: 'center' as const,
      minWidth: '300px',
    },
    loadingText: {
      ...tokens.typography.title.medium,
      color: colors.onSurface,
      marginTop: tokens.spacing[4],
    },
    spinner: {
      border: `4px solid ${colors.surfaceVariant}`,
      borderTop: `4px solid ${colors.primary}`,
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto',
    },
  });

  const styles = getStyles();

  const renderContent = () => {
    return (
        <div css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[6], width: '100%' }}>
          <div style={styles.header}>
            <div style={styles.topBar}>
              <a
                href="#"
                style={styles.backButton}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/quests');
                }}
              >
                <span style={styles.backIcon}>arrow_back</span>
                Back to Quests
              </a>
            </div>

            {error && <div style={styles.errorBanner}>{error}</div>}

            <div style={styles.titleRow}>
              <div style={styles.titleSection}>
                {isEditMode ? (
                  <>
                    <input
                      type="text"
                      style={styles.titleInput}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="Quest title"
                    />
                    <div style={styles.editActions}>
                      <Button
                        variant="filled"
                        icon="save"
                        onClick={handleSaveEdit}
                        disabled={isSaving || !editedTitle.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        icon="close"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 style={styles.title}>{quest.title}</h1>
                    <span style={styles.statusBadge(quest.status)}>{quest.status}</span>
                  </>
                )}
              </div>
            <div style={styles.actions}>
              {!isEditMode && (
                <IconButton
                  icon="edit"
                  onClick={() => setIsEditMode(true)}
                  size="medium"
                />
              )}
              {quest.status === 'draft' ? (
                <Button
                  variant="filled"
                  icon="publish"
                  onClick={handlePublish}
                  disabled={isSaving || quest.items_count === 0 || isEditMode}
                >
                  Publish
                </Button>
              ) : (
                <Button variant="outlined" icon="unpublished" onClick={handleUnpublish} disabled={isSaving || isEditMode}>
                  Unpublish
                </Button>
              )}
            </div>
          </div>

          {isEditMode ? (
            <div>
              <textarea
                ref={descriptionTextareaRef}
                style={styles.textarea}
                value={editedDescription}
                onChange={(e) => {
                  setEditedDescription(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                placeholder="Quest description"
                rows={1}
              />
              <div style={{ display: 'flex', gap: tokens.spacing[3], marginTop: tokens.spacing[3], maxWidth: '600px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ ...tokens.typography.label.medium, color: colors.onSurfaceVariant, display: 'block', marginBottom: tokens.spacing[4] }}>
                    Color
                  </label>
                  <input
                    type="text"
                    style={styles.input}
                    value={editedColor}
                    onChange={(e) => setEditedColor(e.target.value)}
                    placeholder="e.g., #2d4a3e"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ ...tokens.typography.label.medium, color: colors.onSurfaceVariant, display: 'block', marginBottom: tokens.spacing[4] }}>
                    Category
                  </label>
                  <input
                    type="text"
                    style={styles.input}
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                    placeholder="Quest category"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p style={styles.description}>{quest.description}</p>
          )}

            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Total Items:</span>
                <span style={styles.statValue}>{quest.items_count}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Milestones:</span>
                <span style={styles.statValue}>{quest.milestones_count}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Activities:</span>
                <span style={styles.statValue}>{quest.activities_count}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Duration:</span>
                <span style={styles.statValue}>{quest.estimated_total_days} days</span>
              </div>
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Quest Items</h2>
              <div style={styles.menuContainer}>
                <Button
                  variant="outlined"
                  icon="add"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowItemTypeMenu(!showItemTypeMenu);
                  }}
                >
                  Add Item
                </Button>
                {showItemTypeMenu && (
                  <div style={styles.dropdown}>
                    <div
                      style={styles.dropdownItem}
                      onClick={() => {
                        setShowItemTypeMenu(false);
                        // TODO: Create milestone (not implemented yet)
                        alert('Milestone creation coming soon!');
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceVariant}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Add Milestone
                    </div>
                    <div
                      style={styles.dropdownItem}
                      onClick={() => {
                        setShowItemTypeMenu(false);
                        handleCreateActivity();
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceVariant}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Add Activity
                    </div>
                  </div>
                )}
              </div>
            </div>

            {quest.template_items.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>
                  No items in this quest yet. Add milestones and activities to build your quest.
                </p>
                <Button variant="filled" icon="add" onClick={() => navigate(`/admin/quests/${questId}/add-item`)}>
                  Add First Item
                </Button>
              </div>
            ) : (
              <QuestItemsList
                items={quest.template_items}
                onReorder={handleReorder}
                onRemove={handleRemoveItem}
                disabled={isSaving}
              />
            )}
          </div>

          {/* Loading overlay when creating activity */}
        {isCreatingActivity && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingContent}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Creating activity...</p>
            </div>
          </div>
        )}
        </div>
    );
  };

  if (loading) {
    return (
      <PageLayout
        pageName="Quest Detail"
        navMode="admin"
        panes={[
          {
            content: <p>Loading quest...</p>,
          },
        ]}
      />
    );
  }

  if (!quest) {
    return (
      <PageLayout
        pageName="Quest Detail"
        navMode="admin"
        panes={[
          {
            content: (
              <>
                <p>Quest not found</p>
                <Button variant="filled" onClick={() => navigate('/admin/quests')}>
                  Back to Quests
                </Button>
              </>
            ),
          },
        ]}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <PageLayout
        pageName="Quest Detail"
        navMode="admin"
        panes={[
          {
            content: (
              <>
                <style>
                  {`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}
                </style>
                {renderContent()}
              </>
            ),
          },
        ]}
      />
    </DndProvider>
  );
};

interface QuestItemsListProps {
  items: QuestTemplateItem[];
  onReorder: (newOrder: ItemOrderUpdate[]) => void;
  onRemove: (itemId: string) => void;
  disabled: boolean;
}

const QuestItemsList: React.FC<QuestItemsListProps> = ({ items, onReorder, onRemove, disabled }) => {
  const { colors, tokens } = useTheme();
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setLocalItems((prevItems) => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, removed);
      return newItems;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    const newOrder: ItemOrderUpdate[] = localItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    onReorder(newOrder);
  }, [localItems, onReorder]);

  const getStyles = () => ({
    list: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[3],
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.list}>
      {localItems.map((item, index) => (
        <DraggableQuestItem
          key={item.id}
          item={item}
          index={index}
          moveItem={moveItem}
          onDragEnd={handleDragEnd}
          onRemove={() => onRemove(item.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

interface DraggableQuestItemProps {
  item: QuestTemplateItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDragEnd: () => void;
  onRemove: () => void;
  disabled: boolean;
}

const ITEM_TYPE = 'QUEST_ITEM';

const DraggableQuestItem: React.FC<DraggableQuestItemProps> = ({
  item,
  index,
  moveItem,
  onDragEnd,
  onRemove,
  disabled,
}) => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      onDragEnd();
    },
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const getStyles = () => ({
    card: {
      backgroundColor: colors.surface,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      display: 'flex',
      gap: tokens.spacing[4],
      alignItems: 'flex-start',
      border: `1px solid ${colors.outline}`,
      cursor: disabled ? 'default' : 'pointer',
      opacity: isDragging ? 0.5 : disabled ? 0.6 : 1,
      transition: 'background-color 0.2s, box-shadow 0.2s',
    } as React.CSSProperties,
    cardHover: {
      backgroundColor: colors.surfaceVariant,
      boxShadow: tokens.shadows.medium,
    } as React.CSSProperties,
    dragHandle: {
      color: colors.onSurfaceVariant,
      cursor: 'grab',
      fontFamily: '"Material Symbols Outlined"',
      fontSize: '24px',
    },
    content: {
      flex: 1,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: tokens.spacing[2],
    },
    title: {
      ...tokens.typography.title.medium,
      color: colors.onSurface,
      margin: 0,
    },
    typeBadge: (type: string) => ({
      padding: `${tokens.spacing[2]} ${tokens.spacing[2]}`,
      borderRadius: tokens.borderRadius.small,
      ...tokens.typography.label.small,
      backgroundColor: type === 'activity' ? colors.primaryContainer : colors.secondaryContainer,
      color: type === 'activity' ? colors.onPrimaryContainer : colors.onSecondaryContainer,
    }),
    description: {
      ...tokens.typography.body.medium,
      color: colors.onSurfaceVariant,
      marginBottom: tokens.spacing[2],
    },
    footer: {
      display: 'flex',
      gap: tokens.spacing[4],
      ...tokens.typography.label.medium,
      color: colors.onSurfaceVariant,
    },
    actions: {
      display: 'flex',
      gap: tokens.spacing[4],
    },
  });

  const styles = getStyles();

  const handleCardClick = () => {
    if (item.item_definition.item_type === 'activity' && item.item_definition.activity_data) {
      navigate(`/admin/activities/${item.item_definition.activity_data.id}`);
    }
  };

  // Get display title and description - use activity data for activities, item_definition for milestones
  const displayTitle = item.item_definition.item_type === 'activity' && item.item_definition.activity_data
    ? item.item_definition.activity_data.title
    : item.item_definition.title;

  const displayDescription = item.item_definition.item_type === 'activity' && item.item_definition.activity_data
    ? item.item_definition.activity_data.description
    : item.item_definition.description;

  const activityVersion = item.item_definition.item_type === 'activity' && item.item_definition.activity_data
    ? item.item_definition.activity_data.version
    : null;

  return (
    <div
      ref={ref}
      style={{
        ...styles.card,
        ...(isHovered && !isDragging ? styles.cardHover : {}),
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={styles.dragHandle}
        onMouseDown={(e) => e.stopPropagation()}
      >
        drag_indicator
      </span>

      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h4 style={styles.title}>{displayTitle}</h4>
            <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
              <span style={styles.typeBadge(item.item_definition.item_type)}>
                {item.item_definition.item_type}
              </span>
              {activityVersion && (
                <span style={{
                  ...tokens.typography.label.small,
                  backgroundColor: colors.tertiaryContainer,
                  color: colors.onTertiaryContainer,
                  padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                  borderRadius: tokens.borderRadius.small,
                  fontWeight: '500',
                }}>
                  v{activityVersion}
                </span>
              )}
            </div>
          </div>
        </div>

        <p style={styles.description}>{displayDescription}</p>

        <div style={styles.footer}>
          <span>Duration: {item.effective_duration_days} days</span>
          {item.prerequisites.length > 0 && <span>Prerequisites: {item.prerequisites.length}</span>}
        </div>
      </div>

      <div style={styles.actions}>
        <IconButton
          icon="delete"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};