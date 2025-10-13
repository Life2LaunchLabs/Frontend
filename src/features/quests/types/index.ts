/**
 * Quest types for user-facing quest functionality
 */

export interface Activity {
  id: string;
  slug: string;
  status: string;
}

export interface QuestItemDefinition {
  id: string;
  item_type: 'activity' | 'milestone';
  title: string;
  description: string;
  estimated_duration_days: number;
  activity?: Activity;
}

export interface QuestItem {
  id: string;
  quest_title: string;
  quest_color: string;
  item_definition: QuestItemDefinition;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at?: string;
  finish_date: string; // ISO date string
  notes?: string;
  order: number;
}

export interface QuestItemProgress {
  id: string;
  template_item_id: string;
  item_definition: QuestItemDefinition;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  order: number;
  notes?: string;
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  color: string;
  category: string;
}

export interface QuestEnrollment {
  id: string;
  quest_template: QuestTemplate;
  status: 'active' | 'completed' | 'paused';
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  completed_items?: number;
  total_items?: number;
}

export interface QuestEnrollmentDetail extends QuestEnrollment {
  items: QuestItemProgress[];
  completed_items?: number;
  total_items?: number;
}

export interface PublishedQuest {
  id: string;
  title: string;
  short_description?: string;
  description?: string;
  image_url?: string;
  organization: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
