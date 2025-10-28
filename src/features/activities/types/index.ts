// Activity Types
export interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  author_meta: Record<string, any>;
  created_at: string;
  updated_at: string;
  latest_version?: ActivityVersionWithPages;
  quest_templates?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

export interface ActivityVersionWithPages extends ActivityVersion {
  pages: Page[];
}

export interface ActivityVersion {
  id: string;
  version: number;
  title: string;
  meta: Record<string, any>;
  is_published: boolean;
  created_at: string;
}

export interface Page {
  id: string;
  index: number;
  title: string;
  meta: Record<string, any>;
}

export interface Block {
  id: string;
  index: number;
  block_type: string;
  config: Record<string, any>;
}

export interface MediaAsset {
  media_id: string;
  url: string;
  mime_type: string;
  width?: number;
  height?: number;
  duration_ms?: number;
  meta: Record<string, any>;
}

// Activity Page Response
export interface ActivityPageResponse {
  activity_version: ActivityVersion;
  page: Page;
  blocks: Block[];
  media: MediaAsset[];
}

// Question Types
export interface MultipleChoiceOption {
  id: string;
  title: string;
  body?: string;
  description?: string;
}

export interface MultipleChoiceConfig {
  min_select: number;
  max_select: number;
  options: MultipleChoiceOption[];
}

export interface TextInputConfig {
  placeholder: string;
  max_length?: number;
  multiline?: boolean;
}

export interface DropdownInputConfig {
  placeholder?: string;
  options: MultipleChoiceOption[];
}

export interface AorBPrompt {
  id: string;
  title: string;
  description?: string;
}

export interface AorBInputConfig {
  prompts: AorBPrompt[];
  positive_label?: string;
  negative_label?: string;
}

export interface RatingInputConfig {
  min: number;
  max: number;
  step?: number;
  label_min?: string;
  label_max?: string;
}

// Block Type Configs
export interface TextBlockConfig {
  style: 'h1' | 'h2' | 'h3' | 'body' | 'lead' | 'quote';
  text?: string;        // For new blocks created in edit mode
  content?: string;     // For existing blocks from backend
  align?: 'left' | 'center' | 'right';
}

export interface MediaBlockConfig {
  media_id: string;
  caption?: string;
  fit: 'contain' | 'cover';
  role?: 'illustration' | 'bg';
}

export interface QuestionBlockConfig {
  question_id: string;
  question_type: 'multiple_choice' | 'text_input' | 'single_choice' | 'dropdown_input' | 'a_or_b_input' | 'rating';
  title: string;
  subtitle?: string;
  tooltip?: string;
  required: boolean;
  config: MultipleChoiceConfig | TextInputConfig | DropdownInputConfig | AorBInputConfig | RatingInputConfig | Record<string, any>;
}

// Attempt and Response Types
export interface Attempt {
  id: string;
  user?: any; // User reference
  activity_version: ActivityVersion;
  quest_instance?: any;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Response {
  id: string;
  question_id: string;
  question_type: string;
  value: any;
  valid: boolean;
  meta: Record<string, any>;
  created_at: string;
}

export interface PageProgress {
  page: Page;
  reached: boolean;
  last_seen_at: string;
  data: Record<string, any>;
}

// Create Attempt Request
export interface CreateAttemptRequest {
  activity_version_id: string;
  quest_instance_id?: string;
  meta?: Record<string, any>;
}

// Submit Response Request
export interface SubmitResponseRequest {
  question_id: string;
  question_type: string;
  page_id: string;
  value: any;
  valid?: boolean;
  meta?: Record<string, any>;
}