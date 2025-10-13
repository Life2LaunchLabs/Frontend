import { Activity } from '../../activities/types';
import { ActivityEditorState, SaveEditsPayload, PageData, BlockData } from '../types/editor';

/**
 * Transforms backend Activity response into normalized editor state
 */
export function fromBackendActivity(activity: Activity): ActivityEditorState {
  console.log('[Transformer] Processing activity:', activity.id);
  const pages = new Map<string, PageData>();
  const blocks = new Map<string, BlockData>();
  const pageOrder: string[] = [];

  // Extract version data (assuming activity_version exists based on backend structure)
  const activityVersion = (activity as any).activity_version;
  console.log('[Transformer] activity_version:', activityVersion);

  if (!activityVersion) {
    console.error('[Transformer] No activity_version found in activity!');
    throw new Error('Activity must have an activity_version for editing');
  }

  // Process pages and blocks
  const backendPages = activityVersion.pages || [];
  console.log('[Transformer] Processing', backendPages.length, 'pages');
  for (const backendPage of backendPages) {
    const pageId = backendPage.id;
    pageOrder.push(pageId);

    const blockOrder: string[] = [];

    // Process blocks for this page
    const backendBlocks = backendPage.blocks || [];
    for (const backendBlock of backendBlocks) {
      const blockId = backendBlock.id;
      blockOrder.push(blockId);

      blocks.set(blockId, {
        id: blockId,
        pageId: pageId,
        blockType: backendBlock.block_type,
        config: backendBlock.config || {},
      });
    }

    pages.set(pageId, {
      id: pageId,
      title: backendPage.title || '',
      meta: backendPage.meta || {},
      blockOrder,
    });
  }

  const state: ActivityEditorState = {
    activityId: activity.id,
    status: activity.status,
    authorMeta: activity.author_meta || {},

    versionId: activityVersion.id || null,
    versionNumber: activityVersion.version || 1,
    title: activityVersion.title || '',
    description: activityVersion.description || '',
    versionMeta: activityVersion.meta || {},

    pages,
    pageOrder,
    blocks,

    media: (activity as any).media || [],

    isDirty: false,
    originalState: '',
  };

  // Capture original state for dirty checking
  state.originalState = serializeStateForComparison(state);

  console.log('[Transformer] Created state with', state.pageOrder.length, 'pages,', state.blocks.size, 'blocks');
  console.log('[Transformer] Final state:', state);

  return state;
}

/**
 * Transforms normalized editor state into backend save payload
 */
export function toBackendSavePayload(state: ActivityEditorState): SaveEditsPayload {
  const pages = state.pageOrder.map((pageId, index) => {
    const page = state.pages.get(pageId);
    if (!page) throw new Error(`Page ${pageId} not found in state`);

    const blocks = page.blockOrder.map((blockId, blockIndex) => {
      const block = state.blocks.get(blockId);
      if (!block) throw new Error(`Block ${blockId} not found in state`);

      return {
        id: block.id,
        index: blockIndex,
        block_type: block.blockType,
        config: block.config,
      };
    });

    return {
      id: page.id,
      index,
      title: page.title,
      meta: page.meta,
      blocks,
    };
  });

  return {
    activity: {
      status: state.status,
      author_meta: state.authorMeta,
    },
    activity_version: {
      title: state.title,
      description: state.description,
      meta: state.versionMeta,
    },
    pages,
    total_pages: pages.length,
  };
}

/**
 * Serializes state for comparison (dirty checking)
 * Excludes isDirty and originalState fields
 */
function serializeStateForComparison(state: ActivityEditorState): string {
  return JSON.stringify({
    activityId: state.activityId,
    status: state.status,
    authorMeta: state.authorMeta,
    versionId: state.versionId,
    versionNumber: state.versionNumber,
    title: state.title,
    description: state.description,
    versionMeta: state.versionMeta,
    pages: Array.from(state.pages.entries()),
    pageOrder: state.pageOrder,
    blocks: Array.from(state.blocks.entries()),
  });
}

/**
 * Checks if state has unsaved changes
 */
export function isStateDirty(state: ActivityEditorState): boolean {
  const currentSerialized = serializeStateForComparison(state);
  return currentSerialized !== state.originalState;
}

/**
 * Creates a clean snapshot of current state (for MARK_CLEAN action)
 */
export function markStateClean(state: ActivityEditorState): ActivityEditorState {
  return {
    ...state,
    isDirty: false,
    originalState: serializeStateForComparison(state),
  };
}
