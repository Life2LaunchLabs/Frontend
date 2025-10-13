/**
 * Types for dashboard API data (unified quest system)
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

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  bio?: string;
  profile_photo?: string;
}

export interface DashboardData {
  upcoming_items: QuestItem[];
  active_quests: QuestEnrollment[];
}