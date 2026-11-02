import { apiClient } from '@/lib/api-client';
import { api } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { MenuBadge, BadgeRequest } from '@/types';

export const badgeService = {
  /**
   * Retrieves active badges for public menus
   */
  async getBadges(): Promise<MenuBadge[]> {
    try {
      const res = await apiClient.get<MenuBadge[]>(API_ENDPOINTS.BADGES.LIST);
      return res.data || [];
    } catch (err) {
      console.error('Failed to fetch public badges:', err);
      return [];
    }
  },

  /**
   * Retrieves all badges for administration
   */
  async getAdminBadges(): Promise<MenuBadge[]> {
    const res = await apiClient.get<MenuBadge[]>(API_ENDPOINTS.ADMIN.BADGES.LIST);
    return res.data || [];
  },

  /**
   * Retrieves single badge by ID
   */
  async getBadgeById(id: string): Promise<MenuBadge> {
    const res = await apiClient.get<MenuBadge>(API_ENDPOINTS.ADMIN.BADGES.DETAIL(id));
    return res.data;
  },

  /**
   * Creates a new badge
   */
  async createBadge(payload: BadgeRequest): Promise<MenuBadge> {
    const res = await apiClient.post<MenuBadge>(API_ENDPOINTS.ADMIN.BADGES.CREATE, payload);
    return res.data;
  },

  /**
   * Updates an existing badge
   */
  async updateBadge(id: string, payload: BadgeRequest): Promise<MenuBadge> {
    const res = await apiClient.put<MenuBadge>(API_ENDPOINTS.ADMIN.BADGES.UPDATE(id), payload);
    return res.data;
  },

  /**
   * Toggles badge active status
   */
  async setBadgeStatus(id: string, active: boolean): Promise<MenuBadge> {
    const res = await api.patch(API_ENDPOINTS.ADMIN.BADGES.SET_STATUS(id), { active });
    return res.data?.data;
  },

  /**
   * Deletes an unassigned badge safely
   */
  async deleteBadge(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.ADMIN.BADGES.DELETE(id));
  },
};

