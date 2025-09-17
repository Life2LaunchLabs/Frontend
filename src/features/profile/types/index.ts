// Profile-specific types extending the basic auth User type
import type { User } from '../../auth/types';

export interface ProfileData extends User {
  // Additional profile fields from backend PrivateProfileSerializer
  middle_name?: string;
  birth_date?: string;
  profile_photo_url?: string;
  full_name?: string;
  anonymous_id?: string;
  account_created?: string;
  encrypted_data?: any;
  tagline?: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  bio?: string;
  birth_date?: string;
  profile_photo?: File | null;
  tagline?: string;
}

export interface ProfileHeaderEditData {
  first_name?: string;
  last_name?: string;
  bio?: string;
  email?: string;
  tagline?: string;
  profile_photo?: File | null;
}

export interface ProfileApiError {
  message: string;
  field_errors?: Record<string, string[]>;
}