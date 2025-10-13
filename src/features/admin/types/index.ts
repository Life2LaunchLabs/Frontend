// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User Admin Status
export interface UserAdminStatus {
  is_admin: boolean;
  admin_organizations: Organization[];
  default_organization: Organization | null;
}

// API Request/Response Types
export interface SetDefaultOrganizationRequest {
  organization_slug: string;
}

export interface SetDefaultOrganizationResponse {
  message: string;
  default_organization: Organization;
}

// Re-export quest types
export * from './quest';