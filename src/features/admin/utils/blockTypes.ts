/**
 * Block type registry - single source of truth for all block types
 */

export interface BlockTypeMetadata {
  type: string;
  icon: string;
  label: string;
  category: 'basic' | 'question';
  description?: string;
}

export const BLOCK_TYPES: Record<string, BlockTypeMetadata> = {
  text: {
    type: 'text',
    icon: 'text_fields',
    label: 'Text',
    category: 'basic',
    description: 'Add text content with various styles',
  },
  media: {
    type: 'media',
    icon: 'image',
    label: 'Media',
    category: 'basic',
    description: 'Add images or videos',
  },
  divider: {
    type: 'divider',
    icon: 'horizontal_rule',
    label: 'Divider',
    category: 'basic',
    description: 'Add a horizontal divider',
  },
  text_input: {
    type: 'text_input',
    icon: 'edit_note',
    label: 'Text Input',
    category: 'question',
    description: 'Ask for text input',
  },
  multiple_choice: {
    type: 'multiple_choice',
    icon: 'checklist',
    label: 'Multiple Choice',
    category: 'question',
    description: 'Ask a multiple choice question',
  },
  dropdown_input: {
    type: 'dropdown_input',
    icon: 'arrow_drop_down_circle',
    label: 'Dropdown',
    category: 'question',
    description: 'Let respondents choose one option from a dropdown',
  },
  a_or_b_input: {
    type: 'a_or_b_input',
    icon: 'swap_horiz',
    label: 'A or B',
    category: 'question',
    description: 'Step through prompts and capture yes/no decisions',
  },
};

/**
 * Get block types grouped by category
 */
export function getBlockTypesByCategory() {
  const categories: Record<string, BlockTypeMetadata[]> = {
    basic: [],
    question: [],
  };

  for (const blockType of Object.values(BLOCK_TYPES)) {
    categories[blockType.category].push(blockType);
  }

  return [
    { category: 'Basic Blocks', blocks: categories.basic },
    { category: 'Question Blocks', blocks: categories.question },
  ];
}

/**
 * Get metadata for a specific block type
 */
export function getBlockTypeMetadata(type: string): BlockTypeMetadata | null {
  return BLOCK_TYPES[type] || null;
}

/**
 * Check if a block type exists
 */
export function isValidBlockType(type: string): boolean {
  return type in BLOCK_TYPES;
}
