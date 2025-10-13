import { Activity, MediaAsset } from '../../activities/types';

/**
 * Normalized editor state - single source of truth for activity editing
 * Uses Maps for O(1) lookups and ordered arrays for rendering
 */
export interface ActivityEditorState {
  // Activity metadata (non-version fields)
  activityId: string;
  status: Activity['status'];
  authorMeta: Record<string, any>;

  // Version metadata
  versionId: string | null;
  versionNumber: number;
  title: string;
  description: string;
  versionMeta: Record<string, any>;

  // Normalized page data
  pages: Map<string, PageData>;
  pageOrder: string[]; // Ordered list of page IDs

  // Normalized block data
  blocks: Map<string, BlockData>;

  // Media assets (shared across all pages)
  media: MediaAsset[];

  // Editor state
  isDirty: boolean;
  originalState: string; // JSON snapshot for dirty checking
}

export interface PageData {
  id: string;
  title: string;
  meta: Record<string, any>;
  blockOrder: string[]; // Ordered list of block IDs in this page
}

export interface BlockData {
  id: string;
  pageId: string; // Parent page
  blockType: string;
  config: Record<string, any>;
}

/**
 * Editor actions - all possible state mutations
 */
export type EditorAction =
  // Activity/Version updates
  | { type: 'UPDATE_TITLE'; payload: string }
  | { type: 'UPDATE_DESCRIPTION'; payload: string }
  | { type: 'UPDATE_STATUS'; payload: Activity['status'] }
  | { type: 'UPDATE_AUTHOR_META'; payload: Record<string, any> }

  // Page operations
  | { type: 'ADD_PAGE'; payload: { insertIndex: number } }
  | { type: 'UPDATE_PAGE'; payload: { pageId: string; title: string; meta?: Record<string, any> } }
  | { type: 'DELETE_PAGE'; payload: { pageId: string } }
  | { type: 'REORDER_PAGE'; payload: { pageId: string; newIndex: number } }

  // Block operations
  | { type: 'ADD_BLOCK'; payload: { pageId: string; blockType: string; insertIndex: number } }
  | { type: 'UPDATE_BLOCK'; payload: { blockId: string; config: Record<string, any> } }
  | { type: 'DELETE_BLOCK'; payload: { blockId: string } }
  | { type: 'MOVE_BLOCK'; payload: { blockId: string; targetPageId: string; insertIndex: number } }

  // Bulk operations
  | { type: 'RESET_TO_CLEAN'; payload: ActivityEditorState }
  | { type: 'MARK_CLEAN' };

/**
 * Backend save payload format
 */
export interface SaveEditsPayload {
  activity: {
    status: Activity['status'];
    author_meta: Record<string, any>;
  };
  activity_version: {
    title: string;
    description: string;
    meta: Record<string, any>;
  };
  pages: Array<{
    id: string;
    index: number;
    title: string;
    meta: Record<string, any>;
    blocks: Array<{
      id: string;
      index: number;
      block_type: string;
      config: Record<string, any>;
    }>;
  }>;
  total_pages: number;
}
