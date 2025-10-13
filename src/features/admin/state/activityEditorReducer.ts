import { ActivityEditorState, EditorAction, PageData } from '../types/editor';
import { createBlock } from '../utils/blockFactory';
import { isStateDirty, markStateClean } from '../utils/transformers';

/**
 * Main reducer for activity editor state
 * Handles all state mutations in a predictable, immutable way
 */
export function activityEditorReducer(
  state: ActivityEditorState,
  action: EditorAction
): ActivityEditorState {
  let newState: ActivityEditorState;

  switch (action.type) {
    // Activity/Version updates
    case 'UPDATE_TITLE':
      newState = { ...state, title: action.payload };
      break;

    case 'UPDATE_DESCRIPTION':
      newState = { ...state, description: action.payload };
      break;

    case 'UPDATE_STATUS':
      newState = { ...state, status: action.payload };
      break;

    case 'UPDATE_AUTHOR_META':
      newState = { ...state, authorMeta: action.payload };
      break;

    // Page operations
    case 'ADD_PAGE': {
      const newPageId = `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newPage: PageData = {
        id: newPageId,
        title: `New Page ${state.pageOrder.length + 1}`,
        meta: {},
        blockOrder: [],
      };

      const newPages = new Map(state.pages);
      newPages.set(newPageId, newPage);

      const newPageOrder = [...state.pageOrder];
      newPageOrder.splice(action.payload.insertIndex, 0, newPageId);

      newState = {
        ...state,
        pages: newPages,
        pageOrder: newPageOrder,
      };
      break;
    }

    case 'UPDATE_PAGE': {
      const { pageId, title, meta } = action.payload;
      const page = state.pages.get(pageId);
      if (!page) return state;

      const updatedPage: PageData = {
        ...page,
        title,
        meta: meta !== undefined ? meta : page.meta,
      };

      const newPages = new Map(state.pages);
      newPages.set(pageId, updatedPage);

      newState = {
        ...state,
        pages: newPages,
      };
      break;
    }

    case 'DELETE_PAGE': {
      const { pageId } = action.payload;
      const page = state.pages.get(pageId);
      if (!page) return state;

      // Remove the page
      const newPages = new Map(state.pages);
      newPages.delete(pageId);

      // Remove all blocks in this page
      const newBlocks = new Map(state.blocks);
      for (const blockId of page.blockOrder) {
        newBlocks.delete(blockId);
      }

      // Remove from page order
      const newPageOrder = state.pageOrder.filter(id => id !== pageId);

      newState = {
        ...state,
        pages: newPages,
        blocks: newBlocks,
        pageOrder: newPageOrder,
      };
      break;
    }

    case 'REORDER_PAGE': {
      const { pageId, newIndex } = action.payload;
      const currentIndex = state.pageOrder.indexOf(pageId);
      if (currentIndex === -1 || currentIndex === newIndex) return state;

      const newPageOrder = [...state.pageOrder];
      newPageOrder.splice(currentIndex, 1);
      newPageOrder.splice(newIndex, 0, pageId);

      newState = {
        ...state,
        pageOrder: newPageOrder,
      };
      break;
    }

    // Block operations
    case 'ADD_BLOCK': {
      const { pageId, blockType, insertIndex } = action.payload;
      const page = state.pages.get(pageId);
      if (!page) return state;

      const newBlock = createBlock(blockType, pageId);

      // Add block to blocks map
      const newBlocks = new Map(state.blocks);
      newBlocks.set(newBlock.id, newBlock);

      // Add block to page's block order
      const newBlockOrder = [...page.blockOrder];
      newBlockOrder.splice(insertIndex, 0, newBlock.id);

      const updatedPage: PageData = {
        ...page,
        blockOrder: newBlockOrder,
      };

      const newPages = new Map(state.pages);
      newPages.set(pageId, updatedPage);

      newState = {
        ...state,
        pages: newPages,
        blocks: newBlocks,
      };
      break;
    }

    case 'UPDATE_BLOCK': {
      const { blockId, config } = action.payload;
      const block = state.blocks.get(blockId);
      if (!block) return state;

      const updatedBlock = {
        ...block,
        config,
      };

      const newBlocks = new Map(state.blocks);
      newBlocks.set(blockId, updatedBlock);

      newState = {
        ...state,
        blocks: newBlocks,
      };
      break;
    }

    case 'DELETE_BLOCK': {
      const { blockId } = action.payload;
      const block = state.blocks.get(blockId);
      if (!block) return state;

      const page = state.pages.get(block.pageId);
      if (!page) return state;

      // Remove block from blocks map
      const newBlocks = new Map(state.blocks);
      newBlocks.delete(blockId);

      // Remove block from page's block order
      const newBlockOrder = page.blockOrder.filter(id => id !== blockId);

      const updatedPage: PageData = {
        ...page,
        blockOrder: newBlockOrder,
      };

      const newPages = new Map(state.pages);
      newPages.set(page.id, updatedPage);

      newState = {
        ...state,
        pages: newPages,
        blocks: newBlocks,
      };
      break;
    }

    case 'MOVE_BLOCK': {
      const { blockId, targetPageId, insertIndex } = action.payload;
      const block = state.blocks.get(blockId);
      if (!block) return state;

      const sourcePage = state.pages.get(block.pageId);
      const targetPage = state.pages.get(targetPageId);
      if (!sourcePage || !targetPage) return state;

      const newBlocks = new Map(state.blocks);
      const newPages = new Map(state.pages);

      // Update block's pageId
      const updatedBlock = {
        ...block,
        pageId: targetPageId,
      };
      newBlocks.set(blockId, updatedBlock);

      // Remove from source page
      const sourceBlockOrder = sourcePage.blockOrder.filter(id => id !== blockId);
      newPages.set(sourcePage.id, {
        ...sourcePage,
        blockOrder: sourceBlockOrder,
      });

      // Add to target page
      let targetBlockOrder = [...targetPage.blockOrder];

      // If moving within the same page, adjust insert index
      if (sourcePage.id === targetPageId) {
        const oldIndex = targetPage.blockOrder.indexOf(blockId);
        if (oldIndex < insertIndex) {
          targetBlockOrder.splice(insertIndex, 0, blockId);
        } else {
          targetBlockOrder = sourceBlockOrder;
          targetBlockOrder.splice(insertIndex, 0, blockId);
        }
      } else {
        targetBlockOrder.splice(insertIndex, 0, blockId);
      }

      newPages.set(targetPageId, {
        ...targetPage,
        blockOrder: targetBlockOrder,
      });

      newState = {
        ...state,
        pages: newPages,
        blocks: newBlocks,
      };
      break;
    }

    // Bulk operations
    case 'RESET_TO_CLEAN':
      return action.payload;

    case 'MARK_CLEAN':
      return markStateClean(state);

    default:
      return state;
  }

  // Update dirty flag for all mutations except MARK_CLEAN and RESET_TO_CLEAN
  newState.isDirty = isStateDirty(newState);
  return newState;
}
