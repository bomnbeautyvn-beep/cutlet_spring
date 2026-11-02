import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { MenuItem, MenuCategory } from '@/types';

export const menuService = {
  /**
   * Fetch all active menu items from backend API, optionally filtered by category
   */
  async getMenuItems(category?: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<MenuItem[]>(API_ENDPOINTS.MENU.LIST, {
        params: category && category !== 'all' ? { category } : undefined,
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch menu items from API:', error);
      return [];
    }
  },

  /**
   * Fetch a single menu item by ID from backend API
   */
  async getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
      const response = await apiClient.get<MenuItem>(API_ENDPOINTS.MENU.DETAIL(id));
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch menu item ${id} from API:`, error);
      return null;
    }
  },

  /**
   * Fetch chef signature & best seller items from backend API
   */
  async getFeaturedItems(): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<MenuItem[]>(API_ENDPOINTS.MENU.FEATURED);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch featured menu items from API:', error);
      return [];
    }
  },

  /**
   * Fetch menu categories from backend API
   */
  async getCategories(): Promise<MenuCategory[]> {
    try {
      const response = await apiClient.get<MenuCategory[]>(API_ENDPOINTS.CATEGORIES.LIST);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch categories from API:', error);
      return [];
    }
  },
};
