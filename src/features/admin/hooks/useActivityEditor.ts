import { useReducer, useCallback, useMemo, useEffect } from 'react';
import { Activity } from '../../activities/types';
import { ActivityEditorState, SaveEditsPayload } from '../types/editor';
import { activityEditorReducer } from '../state/activityEditorReducer';
import { fromBackendActivity, toBackendSavePayload } from '../utils/transformers';

/**
 * Main hook for activity editor state management
 * Provides all actions and derived state
 */
export function useActivityEditor(initialActivity: Activity | null) {
  // Initialize state from backend activity
  const initialState = useMemo<ActivityEditorState | null>(() => {
    console.log('[useActivityEditor] Initializing with activity:', initialActivity?.id);
    if (!initialActivity) {
      console.log('[useActivityEditor] No initial activity, returning null');
      return null;
    }
    try {
      const state = fromBackendActivity(initialActivity);
      console.log('[useActivityEditor] Successfully created initial state');
      return state;
    } catch (error) {
      console.error('[useActivityEditor] Failed to initialize editor state:', error);
      return null;
    }
  }, [initialActivity]);

  console.log('[useActivityEditor] initialState:', initialState);
  console.log('[useActivityEditor] Will use:', initialState ? 'transformed state' : 'empty state');

  const [state, dispatch] = useReducer(
    activityEditorReducer,
    initialState || createEmptyState()
  );

  // Reset state when initialState changes (when activity loads)
  useEffect(() => {
    if (initialState) {
      console.log('[useActivityEditor] Resetting to new initial state with', initialState.pageOrder.length, 'pages');
      dispatch({ type: 'RESET_TO_CLEAN', payload: initialState });
    }
  }, [initialState]);

  console.log('[useActivityEditor] Current state after reducer:', state);

  // Activity/Version actions
  const updateTitle = useCallback((title: string) => {
    dispatch({ type: 'UPDATE_TITLE', payload: title });
  }, []);

  const updateDescription = useCallback((description: string) => {
    dispatch({ type: 'UPDATE_DESCRIPTION', payload: description });
  }, []);

  const updateStatus = useCallback((status: Activity['status']) => {
    dispatch({ type: 'UPDATE_STATUS', payload: status });
  }, []);

  const updateAuthorMeta = useCallback((authorMeta: Record<string, any>) => {
    dispatch({ type: 'UPDATE_AUTHOR_META', payload: authorMeta });
  }, []);

  // Page actions
  const addPage = useCallback((insertIndex: number) => {
    dispatch({ type: 'ADD_PAGE', payload: { insertIndex } });
  }, []);

  const updatePage = useCallback((pageId: string, title: string, meta?: Record<string, any>) => {
    dispatch({ type: 'UPDATE_PAGE', payload: { pageId, title, meta } });
  }, []);

  const deletePage = useCallback((pageId: string) => {
    dispatch({ type: 'DELETE_PAGE', payload: { pageId } });
  }, []);

  const reorderPage = useCallback((pageId: string, newIndex: number) => {
    dispatch({ type: 'REORDER_PAGE', payload: { pageId, newIndex } });
  }, []);

  // Block actions
  const addBlock = useCallback((pageId: string, blockType: string, insertIndex: number) => {
    dispatch({ type: 'ADD_BLOCK', payload: { pageId, blockType, insertIndex } });
  }, []);

  const updateBlock = useCallback((blockId: string, config: Record<string, any>) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { blockId, config } });
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: { blockId } });
  }, []);

  const moveBlock = useCallback((blockId: string, targetPageId: string, insertIndex: number) => {
    dispatch({ type: 'MOVE_BLOCK', payload: { blockId, targetPageId, insertIndex } });
  }, []);

  // Bulk actions
  const resetToClean = useCallback((newState: ActivityEditorState) => {
    dispatch({ type: 'RESET_TO_CLEAN', payload: newState });
  }, []);

  const markClean = useCallback(() => {
    dispatch({ type: 'MARK_CLEAN' });
  }, []);

  // Derived state
  const hasChanges = state.isDirty;

  // Generate save payload
  const getSavePayload = useCallback((): SaveEditsPayload => {
    return toBackendSavePayload(state);
  }, [state]);

  // Get pages in order for rendering
  const orderedPages = useMemo(() => {
    return state.pageOrder.map((pageId, pageIndex) => {
      const page = state.pages.get(pageId);
      if (!page) return null;

      // Convert BlockData to Block format that components expect
      const blocks = page.blockOrder.map((blockId, blockIndex) => {
        const blockData = state.blocks.get(blockId);
        if (!blockData) return null;

        // Convert to Block interface (camelCase -> snake_case)
        return {
          id: blockData.id,
          index: blockIndex,
          block_type: blockData.blockType, // Convert camelCase to snake_case
          config: blockData.config,
        };
      }).filter(Boolean);

      // Convert PageData to Page format
      const pageForComponent = {
        id: page.id,
        index: pageIndex,
        title: page.title,
        meta: page.meta,
      };

      return {
        page: pageForComponent,
        blocks,
      };
    }).filter(Boolean);
  }, [state.pageOrder, state.pages, state.blocks]);

  return {
    // State
    state,
    hasChanges,
    orderedPages,

    // Activity/Version actions
    updateTitle,
    updateDescription,
    updateStatus,
    updateAuthorMeta,

    // Page actions
    addPage,
    updatePage,
    deletePage,
    reorderPage,

    // Block actions
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,

    // Bulk actions
    resetToClean,
    markClean,
    getSavePayload,
  };
}

/**
 * Creates an empty editor state (fallback)
 */
function createEmptyState(): ActivityEditorState {
  return {
    activityId: '',
    status: 'draft',
    authorMeta: {},
    versionId: null,
    versionNumber: 1,
    title: '',
    description: '',
    versionMeta: {},
    pages: new Map(),
    pageOrder: [],
    blocks: new Map(),
    media: [],
    isDirty: false,
    originalState: '',
  };
}
