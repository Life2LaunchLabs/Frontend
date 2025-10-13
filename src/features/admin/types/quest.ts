/**
 * Quest and Activity type definitions for admin interface
 */

// ============================================================
// Quest Template Types
// ============================================================

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  color: string;
  category: string;
  organization: string;
  organization_name: string;
  created_by: number;
  created_by_email: string;
  is_public: boolean;
  is_template: boolean;
  status: 'draft' | 'published' | 'archived';
  estimated_total_days: number;
  items_count: number;
  milestones_count: number;
  activities_count: number;
  created_at: string;
  updated_at: string;
}

export interface QuestTemplateDetail extends QuestTemplate {
  template_items: QuestTemplateItem[];
  can_edit: boolean;
  meta: Record<string, unknown>;
}

export interface QuestTemplateCreate {
  title: string;
  description: string;
  color?: string;
  category?: string;
  organization: string;
  is_public?: boolean;
  is_template?: boolean;
  status?: 'draft' | 'published' | 'archived';
  meta?: Record<string, unknown>;
}

// ============================================================
// Quest Item Definition Types
// ============================================================

export interface QuestItemDefinition {
  id: string;
  item_type: 'activity' | 'milestone';
  title: string;
  description: string;
  estimated_duration_days: number;
  activity_data: ActivityData | null;
  milestone_data: Record<string, unknown> | null;
  organization: string;
  organization_name: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityData {
  id: string;
  slug: string;
  status: string;
  title: string;
  description: string;
  version: number | null;
}

export interface QuestItemDefinitionCreate {
  item_type: 'activity' | 'milestone';
  title: string;
  description: string;
  estimated_duration_days: number;
  milestone_data?: Record<string, unknown>;
  activity?: string;
  organization: string;
}

// ============================================================
// Quest Template Item Types (Join Table)
// ============================================================

export interface QuestTemplateItem {
  id: string;
  order: number;
  item_definition: QuestItemDefinition;
  override_duration_days: number | null;
  effective_duration_days: number;
  notes: string;
  prerequisites: QuestTemplateItem[];
  can_be_started: boolean;
  created_at: string;
}

export interface ItemOrderUpdate {
  id: string;
  order: number;
}

// ============================================================
// Activity Types
// ============================================================

export interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  organization: string;
  organization_name: string;
  latest_version_number: number | null;
  author_meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ActivityDetail extends Activity {
  activity_version: ActivityVersion | null;
}

export interface ActivityVersion {
  id: string;
  version: number;
  title: string;
  description: string;
  meta: Record<string, unknown>;
  is_published: boolean;
  created_at: string;
  pages: Page[];
}

export interface Page {
  id: string;
  index: number;
  title: string;
  meta: Record<string, unknown>;
  blocks: Block[];
}

export interface Block {
  id: string;
  index: number;
  block_type: string;
  config: Record<string, unknown>;
}

export interface PageOrderUpdate {
  id: string;
  index: number;
}

// ============================================================
// UI Helper Types
// ============================================================

export interface DragDropResult {
  source: {
    index: number;
    droppableId: string;
  };
  destination: {
    index: number;
    droppableId: string;
  } | null;
  draggableId: string;
}