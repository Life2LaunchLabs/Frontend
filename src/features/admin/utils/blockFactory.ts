import { BlockData } from '../types/editor';

/**
 * Creates default configuration for a new block based on type
 */
export function createDefaultBlockConfig(blockType: string): Record<string, any> {
  switch (blockType) {
    case 'text':
      return {
        text: 'Enter your text here...',
        style: 'body',
        align: 'left',
      };

    case 'media':
      return {
        media_id: '',
        fit: 'contain',
      };

    case 'divider':
      return {};

    case 'text_input':
      return {
        question_id: `question_${Date.now()}`,
        question_type: 'text_input',
        title: 'New Question',
        subtitle: '',
        required: false,
        config: {
          placeholder: 'Enter your answer...',
          multiline: false,
        },
      };

    case 'multiple_choice':
      return {
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
          ],
        },
      };

    case 'dropdown_input':
      return {
        question_id: `question_${Date.now()}`,
        question_type: 'dropdown_input',
        title: 'New Dropdown Question',
        subtitle: '',
        required: false,
        config: {
          placeholder: 'Select an option...',
          options: [
            { id: 'opt_1', title: 'Option 1', body: '' },
            { id: 'opt_2', title: 'Option 2', body: '' },
          ],
        },
      };

    case 'a_or_b_input':
      return {
        question_id: `question_${Date.now()}`,
        question_type: 'a_or_b_input',
        title: 'New A or B Question',
        subtitle: '',
        required: false,
        config: {
          positive_label: 'Yes',
          negative_label: 'No',
          prompts: [
            { id: 'prompt_1', title: 'First prompt', description: '' },
            { id: 'prompt_2', title: 'Second prompt', description: '' },
          ],
        },
      };

    default:
      return {};
  }
}

/**
 * Creates a new block with default configuration
 */
export function createBlock(blockType: string, pageId: string): BlockData {
  return {
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    pageId,
    blockType,
    config: createDefaultBlockConfig(blockType),
  };
}

/**
 * Validates block configuration (basic validation)
 */
export function validateBlockConfig(block: BlockData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Type-specific validation
  switch (block.blockType) {
    case 'text':
      if (!block.config.text && !block.config.content) {
        errors.push('Text block must have text or content');
      }
      break;

    case 'media':
      // Media can be empty when first created
      break;

    case 'text_input':
    case 'multiple_choice':
    case 'dropdown_input':
    case 'a_or_b_input':
      if (!block.config.question_id) {
        errors.push('Question block must have question_id');
      }
      if (!block.config.title) {
        errors.push('Question block must have title');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
