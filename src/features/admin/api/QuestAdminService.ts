import { apiClient } from '../../../lib/api';
import {
  QuestTemplate,
  QuestTemplateDetail,
  QuestTemplateCreate,
  QuestItemDefinition,
  QuestItemDefinitionCreate,
  QuestTemplateItem,
  Activity,
  ActivityDetail,
  ActivityVersion,
  ItemOrderUpdate,
  PageOrderUpdate,
} from '../types/quest';

/**
 * Admin API service for quest and activity management
 */
export class QuestAdminService {
  private static baseURL = '/api/admin';

  // ============================================================
  // Quest Template Management
  // ============================================================

  /**
   * List all quest templates for admin organizations
   */
  static async listQuestTemplates(): Promise<QuestTemplate[]> {
    const response = await apiClient.get<QuestTemplate[]>(`${this.baseURL}/templates/`);
    return response.data;
  }

  /**
   * Get detailed quest template with items
   */
  static async getQuestTemplate(id: string): Promise<QuestTemplateDetail> {
    const response = await apiClient.get<QuestTemplateDetail>(`${this.baseURL}/templates/${id}/`);
    return response.data;
  }

  /**
   * Create a new quest template
   */
  static async createQuestTemplate(data: QuestTemplateCreate): Promise<QuestTemplate> {
    const response = await apiClient.post<QuestTemplate>(`${this.baseURL}/templates/`, data);
    return response.data;
  }

  /**
   * Update quest template
   */
  static async updateQuestTemplate(id: string, data: Partial<QuestTemplateCreate>): Promise<QuestTemplate> {
    const response = await apiClient.patch<QuestTemplate>(`${this.baseURL}/templates/${id}/`, data);
    return response.data;
  }

  /**
   * Delete quest template
   */
  static async deleteQuestTemplate(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/templates/${id}/`);
  }

  /**
   * Publish quest template
   */
  static async publishQuestTemplate(id: string): Promise<QuestTemplate> {
    const response = await apiClient.post<QuestTemplate>(`${this.baseURL}/templates/${id}/publish/`);
    return response.data;
  }

  /**
   * Unpublish quest template
   */
  static async unpublishQuestTemplate(id: string): Promise<QuestTemplate> {
    const response = await apiClient.post<QuestTemplate>(`${this.baseURL}/templates/${id}/unpublish/`);
    return response.data;
  }

  /**
   * Reorder items in quest template
   */
  static async reorderQuestItems(questId: string, itemOrders: ItemOrderUpdate[]): Promise<{ status: string }> {
    const response = await apiClient.post<{ status: string }>(
      `${this.baseURL}/templates/${questId}/reorder_items/`,
      { item_orders: itemOrders }
    );
    return response.data;
  }

  /**
   * Add item to quest template
   */
  static async addItemToQuest(questId: string, data: {
    item_definition: string;
    order: number;
    override_duration_days?: number;
    notes?: string;
    prerequisites?: string[];
  }): Promise<QuestTemplateItem> {
    const response = await apiClient.post<QuestTemplateItem>(
      `${this.baseURL}/templates/${questId}/add_item/`,
      data
    );
    return response.data;
  }

  /**
   * Remove item from quest template
   */
  static async removeItemFromQuest(questId: string, itemId: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/templates/${questId}/remove_item/${itemId}/`);
  }

  /**
   * Create a new blank activity tied to this quest
   */
  static async createActivityForQuest(questId: string): Promise<{ activity_id: string; message: string }> {
    const response = await apiClient.post<{ activity_id: string; message: string }>(
      `${this.baseURL}/templates/${questId}/create_activity/`
    );
    return response.data;
  }

  // ============================================================
  // Quest Item Definition Management
  // ============================================================

  /**
   * List all item definitions for admin organizations
   */
  static async listItemDefinitions(itemType?: 'activity' | 'milestone'): Promise<QuestItemDefinition[]> {
    const params = itemType ? `?item_type=${itemType}` : '';
    const response = await apiClient.get<QuestItemDefinition[]>(`${this.baseURL}/item-definitions/${params}`);
    return response.data;
  }

  /**
   * Get item definition by ID
   */
  static async getItemDefinition(id: string): Promise<QuestItemDefinition> {
    const response = await apiClient.get<QuestItemDefinition>(`${this.baseURL}/item-definitions/${id}/`);
    return response.data;
  }

  /**
   * Create item definition
   */
  static async createItemDefinition(data: QuestItemDefinitionCreate): Promise<QuestItemDefinition> {
    const response = await apiClient.post<QuestItemDefinition>(`${this.baseURL}/item-definitions/`, data);
    return response.data;
  }

  /**
   * Update item definition
   */
  static async updateItemDefinition(id: string, data: Partial<QuestItemDefinitionCreate>): Promise<QuestItemDefinition> {
    const response = await apiClient.patch<QuestItemDefinition>(`${this.baseURL}/item-definitions/${id}/`, data);
    return response.data;
  }

  /**
   * Delete item definition
   */
  static async deleteItemDefinition(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/item-definitions/${id}/`);
  }

  /**
   * Get available items for a quest (not already added)
   */
  static async getAvailableItemsForQuest(questTemplateId: string): Promise<QuestItemDefinition[]> {
    const response = await apiClient.get<QuestItemDefinition[]>(
      `${this.baseURL}/item-definitions/available_for_quest/?quest_template_id=${questTemplateId}`
    );
    return response.data;
  }

  // ============================================================
  // Activity Management
  // ============================================================

  /**
   * List all activities for admin organizations
   */
  static async listActivities(): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>(`${this.baseURL}/activities/`);
    return response.data;
  }

  /**
   * Get detailed activity with versions
   */
  static async getActivity(id: string): Promise<ActivityDetail> {
    const response = await apiClient.get<ActivityDetail>(`${this.baseURL}/activities/${id}/`);
    return response.data;
  }

  /**
   * Create a new activity
   */
  static async createActivity(data: {
    slug: string;
    organization: string;
    title: string;
    description?: string;
    author_meta?: Record<string, unknown>;
    meta?: Record<string, unknown>;
  }): Promise<Activity> {
    const response = await apiClient.post<Activity>(`${this.baseURL}/activities/`, data);
    return response.data;
  }

  /**
   * Update activity
   */
  static async updateActivity(id: string, data: {
    slug?: string;
    status?: 'draft' | 'published' | 'archived';
    author_meta?: Record<string, unknown>;
  }): Promise<Activity> {
    const response = await apiClient.patch<Activity>(`${this.baseURL}/activities/${id}/`, data);
    return response.data;
  }

  /**
   * Delete activity
   */
  static async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/activities/${id}/`);
  }

  /**
   * Publish activity (latest version)
   */
  static async publishActivity(id: string): Promise<Activity> {
    const response = await apiClient.post<Activity>(`${this.baseURL}/activities/${id}/publish/`);
    return response.data;
  }

  /**
   * Unpublish activity
   */
  static async unpublishActivity(id: string): Promise<Activity> {
    const response = await apiClient.post<Activity>(`${this.baseURL}/activities/${id}/unpublish/`);
    return response.data;
  }

  /**
   * Create new version of activity
   */
  static async createActivityVersion(activityId: string, data: {
    title?: string;
    description?: string;
    meta?: Record<string, unknown>;
  }): Promise<ActivityVersion> {
    const response = await apiClient.post<ActivityVersion>(
      `${this.baseURL}/activities/${activityId}/create_version/`,
      data
    );
    return response.data;
  }

  // ============================================================
  // Activity Version Management
  // ============================================================

  /**
   * List activity versions
   */
  static async listActivityVersions(): Promise<ActivityVersion[]> {
    const response = await apiClient.get<ActivityVersion[]>(`${this.baseURL}/activity-versions/`);
    return response.data;
  }

  /**
   * Get activity version by ID
   */
  static async getActivityVersion(id: string): Promise<ActivityVersion> {
    const response = await apiClient.get<ActivityVersion>(`${this.baseURL}/activity-versions/${id}/`);
    return response.data;
  }

  /**
   * Update activity version (unpublished only)
   */
  static async updateActivityVersion(id: string, data: {
    title?: string;
    description?: string;
    meta?: Record<string, unknown>;
  }): Promise<ActivityVersion> {
    const response = await apiClient.patch<ActivityVersion>(`${this.baseURL}/activity-versions/${id}/`, data);
    return response.data;
  }

  /**
   * Add page to activity version
   */
  static async addPageToVersion(versionId: string, data: {
    title: string;
    index?: number;
    meta?: Record<string, unknown>;
  }): Promise<ActivityVersion> {
    const response = await apiClient.post<ActivityVersion>(
      `${this.baseURL}/activity-versions/${versionId}/add_page/`,
      data
    );
    return response.data;
  }

  /**
   * Reorder pages in activity version
   */
  static async reorderPages(versionId: string, pageOrders: PageOrderUpdate[]): Promise<ActivityVersion> {
    const response = await apiClient.post<ActivityVersion>(
      `${this.baseURL}/activity-versions/${versionId}/reorder_pages/`,
      { page_orders: pageOrders }
    );
    return response.data;
  }
}