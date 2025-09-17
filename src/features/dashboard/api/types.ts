/**
 * Types for dashboard API data
 */

export interface Milestone {
  id: string;
  title: string;
  description: string;
  finish_date: string; // ISO date string
  status: 'not_started' | 'in_progress' | 'complete';
  order: number;
  can_be_started: boolean;
  quest: {
    id: string;
    title: string;
    color: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  color: string;
  category: 'Personal' | 'Other';
  is_personal: boolean;
  milestones_count: number;
  completed_milestones_count: number;
  in_progress_milestones_count: number;
  created_at: string;
  updated_at: string;
}

export interface UpcomingMilestonesResponse {
  upcoming_milestones: Milestone[];
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
  upcoming_milestones: Milestone[];
  // Future dashboard data can be added here
}