import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, USE_MOCK_DATA } from '@/constants/api.constants';
import { MenuItem, MenuCategory } from '@/types';
import { MOCK_MENU_ITEMS } from '@/data/mock/menu.mock';

export const menuService = {
  /**
   * Fetch all active menu items from real backend, optionally filtered by category
   */
  async getMenuItems(category?: string): Promise<MenuItem[]> {
    if (USE_MOCK_DATA) {
      if (!category || category === 'all') {
        return MOCK_MENU_ITEMS;
      }
      return MOCK_MENU_ITEMS.filter((item) => item.category === category);
    }

    try {
      const response = await apiClient.get<MenuItem[]>(API_ENDPOINTS.MENU.LIST, {
        params: category && category !== 'all' ? { category } : undefined,
      });
      return response.data || [];
    } catch (error) {
      console.warn('Backend API unavailable, falling back to local catalog:', error);
      if (!category || category === 'all') {
        return MOCK_MENU_ITEMS;
      }
      return MOCK_MENU_ITEMS.filter((item) => item.category === category);
    }
  },

  /**
   * Fetch a single menu item by ID
   */
  async getMenuItemById(id: string): Promise<MenuItem | null> {
    if (USE_MOCK_DATA) {
      const found = MOCK_MENU_ITEMS.find((item) => item.id === id);
      return found || null;
    }

    try {
      const response = await apiClient.get<MenuItem>(API_ENDPOINTS.MENU.DETAIL(id));
      return response.data;
    } catch {
      const found = MOCK_MENU_ITEMS.find((item) => item.id === id);
      return found || null;
    }
  },

  /**
   * Fetch chef signature & best seller items
   */
  async getFeaturedItems(): Promise<MenuItem[]> {
    const isSpecial = (item: MenuItem) =>
      Boolean((item.isChefSignature ?? item.chefSignature) || (item.isBestSeller ?? item.bestSeller));

    if (USE_MOCK_DATA) {
      return MOCK_MENU_ITEMS.filter(isSpecial);
    }

    try {
      const response = await apiClient.get<MenuItem[]>(API_ENDPOINTS.MENU.FEATURED);
      return response.data || [];
    } catch {
      return MOCK_MENU_ITEMS.filter(isSpecial);
    }
  },

  /**
   * Fetch menu categories from real backend
   */
  async getCategories(): Promise<MenuCategory[]> {
    try {
      const response = await apiClient.get<MenuCategory[]>(API_ENDPOINTS.CATEGORIES.LIST);
      return response.data || [];
    } catch (error) {
      console.warn('Could not fetch categories from backend, returning defaults:', error);
      return [
        { id: 'japanese', code: 'japanese', name: 'Japanese Tonkatsu', displayOrder: 1, active: true },
        { id: 'korean', code: 'korean', name: 'Korean Tonkatsu', displayOrder: 2, active: true },
        { id: 'curry', code: 'curry', name: 'Curry Set', displayOrder: 3, active: true },
        { id: 'noodles', code: 'noodles', name: 'Noodles', displayOrder: 4, active: true },
        { id: 'addons', code: 'addons', name: 'Add-ons', displayOrder: 5, active: true },
        { id: 'sauces', code: 'sauces', name: 'Sauces', displayOrder: 6, active: true },
        { id: 'drinks', code: 'drinks', name: 'Drinks', displayOrder: 7, active: true },
      ];
    }
  },
};
