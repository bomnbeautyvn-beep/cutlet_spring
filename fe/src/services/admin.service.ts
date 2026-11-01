import { apiClient } from '@/lib/api-client';
import { api } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { MenuItem, MenuCategory, RestaurantSettings, EmailConfig, UpdateEmailConfigPayload, SendTestEmailPayload } from '@/types';
export type { RestaurantSettings, EmailConfig, UpdateEmailConfigPayload, SendTestEmailPayload };

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface MenuItemPayload {
  id?: string;
  categoryId: string;
  nameEn: string;
  nameKr: string;
  nameKrSubtitle?: string;
  nameJp: string;
  nameVi: string;
  descriptionEn: string;
  descriptionKr: string;
  descriptionVi: string;
  descriptionJp: string;
  portionEn: string;
  portionVi: string;
  portionKr: string;
  portionJp: string;
  basePrice: number;
  prepTimeMinutes?: number;
  imageUrl?: string;
  imagePublicId?: string;
  altText?: string;
  isBestSeller?: boolean;
  isChefSignature?: boolean;
  isLimited?: boolean;
  isSpicy?: boolean;
  spiceLevel?: number;
  spiceNote?: string;
  active?: boolean;
  displayOrder?: number;
  dishTypes?: string[];
  tags?: string[];
  sizes?: { label: string; price: number; displayOrder?: number }[];
  sauceOptions?: string[];
  addons?: { name: string; price: number; displayOrder?: number }[];
}


export interface AdminAccount {
  id: string;
  email: string;
  fullName: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountAuditLog {
  id: string;
  adminEmail: string;
  adminName?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalDishes: number;
  activeDishes: number;
  inactiveDishes: number;
  totalCategories: number;
  activeCategories: number;
  totalAccounts: number;
  activeAccounts: number;
  isOpenNow: boolean;
  currentSession: 'LUNCH' | 'DINNER' | 'AFTERNOON_PREP_BREAK' | 'CLOSED';
  lunchHours: string;
  dinnerHours: string;
  lastOrderTime: string;
  capacityHall: number;
  capacityCounter: number;
  categoryDistribution: Record<string, number>;
}

export const adminService = {
  /**
   * Retrieves paginated dishes for administrator portal
   */
  async getAdminMenuItems(
    categoryId?: string,
    active?: boolean,
    page = 0,
    size = 20
  ): Promise<PageResult<MenuItem>> {
    const res = await apiClient.get<PageResult<MenuItem>>(API_ENDPOINTS.ADMIN.MENU.LIST, {
      params: {
        categoryId: categoryId || undefined,
        active: active !== undefined ? active : undefined,
        page,
        size,
      },
    });
    return res.data;
  },

  /**
   * Retrieves a single dish by ID with admin options
   */
  async getAdminMenuItemById(id: string): Promise<MenuItem> {
    const res = await apiClient.get<MenuItem>(API_ENDPOINTS.ADMIN.MENU.DETAIL(id));
    return res.data;
  },

  /**
   * Creates a new menu dish
   */
  async createMenuItem(payload: MenuItemPayload): Promise<MenuItem> {
    const res = await apiClient.post<MenuItem>(API_ENDPOINTS.ADMIN.MENU.CREATE, payload);
    return res.data;
  },

  /**
   * Updates an existing dish
   */
  async updateMenuItem(id: string, payload: MenuItemPayload): Promise<MenuItem> {
    const res = await apiClient.put<MenuItem>(API_ENDPOINTS.ADMIN.MENU.UPDATE(id), payload);
    return res.data;
  },

  /**
   * Sets active status directly via PATCH /api/admin/menu/{id}/status
   */
  async setItemStatus(id: string, active: boolean): Promise<MenuItem> {
    const res = await api.patch(API_ENDPOINTS.ADMIN.MENU.SET_STATUS(id), { active });
    return res.data?.data;
  },

  /**
   * Toggles active visibility status
   */
  async toggleItemActive(id: string): Promise<MenuItem> {
    const res = await api.patch(API_ENDPOINTS.ADMIN.MENU.TOGGLE_ACTIVE(id));
    return res.data?.data;
  },

  /**
   * Deactivates / soft-deletes a menu item
   */
  async deleteMenuItem(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.ADMIN.MENU.DELETE(id));
  },

  /**
   * Uploads dish image directly to Cloudinary via backend multipart endpoint
   */
  async uploadImage(id: string, file: File): Promise<MenuItem> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post(API_ENDPOINTS.ADMIN.MENU.IMAGE_UPLOAD(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data?.data;
  },

  /**
   * Removes dish image from Cloudinary
   */
  async deleteImage(id: string): Promise<MenuItem> {
    const res = await apiClient.delete<MenuItem>(API_ENDPOINTS.ADMIN.MENU.IMAGE_DELETE(id));
    return res.data;
  },

  /**
   * Retrieves all categories for admin management
   */
  async getCategories(): Promise<MenuCategory[]> {
    const res = await apiClient.get<MenuCategory[]>(API_ENDPOINTS.ADMIN.CATEGORIES.LIST);
    return res.data || [];
  },

  /**
   * Live dashboard stats
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const res = await apiClient.get<AdminDashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD.STATS);
    return res.data;
  },

  /**
   * Restaurant settings
   */
  async getRestaurantSettings(): Promise<RestaurantSettings> {
    const res = await apiClient.get<RestaurantSettings>(API_ENDPOINTS.ADMIN.RESTAURANT.SETTINGS);
    return res.data;
  },

  async updateRestaurantSettings(payload: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    const res = await apiClient.put<RestaurantSettings>(API_ENDPOINTS.ADMIN.RESTAURANT.SETTINGS, payload);
    return res.data;
  },

  async uploadRestaurantLogo(file: File): Promise<RestaurantSettings> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(API_ENDPOINTS.ADMIN.RESTAURANT.LOGO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data;
  },

  async uploadRestaurantBanner(file: File): Promise<RestaurantSettings> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(API_ENDPOINTS.ADMIN.RESTAURANT.BANNER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data;
  },

  /**
   * Dynamic Email & SMTP Configuration Management
   */
  async getEmailConfig(): Promise<EmailConfig> {
    const res = await apiClient.get<EmailConfig>(API_ENDPOINTS.ADMIN.EMAIL.GET);
    return res.data;
  },

  async updateEmailConfig(payload: UpdateEmailConfigPayload): Promise<EmailConfig> {
    const res = await apiClient.put<EmailConfig>(API_ENDPOINTS.ADMIN.EMAIL.UPDATE, payload);
    return res.data;
  },

  async testSmtpConnection(): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<void>(API_ENDPOINTS.ADMIN.EMAIL.TEST_CONNECTION);
    return { success: !!res.success, message: res.message || 'SMTP connection verified successfully' };
  },

  async sendTestEmail(payload: SendTestEmailPayload): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<void>(API_ENDPOINTS.ADMIN.EMAIL.SEND_TEST, payload);
    return { success: !!res.success, message: res.message || 'Test email dispatched successfully' };
  },

  /**
   * Account management
   */
  async getAccounts(query?: string, role?: string, active?: boolean, page = 0, size = 15): Promise<PageResult<AdminAccount>> {
    const res = await apiClient.get<PageResult<AdminAccount>>(API_ENDPOINTS.ADMIN.ACCOUNTS.LIST, {
      params: { query, role, active, page, size },
    });
    return res.data;
  },

  async createAccount(payload: { email: string; fullName: string; password: string; role: string }): Promise<AdminAccount> {
    const res = await apiClient.post<AdminAccount>(API_ENDPOINTS.ADMIN.ACCOUNTS.CREATE, payload);
    return res.data;
  },

  async updateAccount(id: string, payload: { fullName: string; role: string }): Promise<AdminAccount> {
    const res = await apiClient.put<AdminAccount>(API_ENDPOINTS.ADMIN.ACCOUNTS.UPDATE(id), payload);
    return res.data;
  },

  async setAccountStatus(id: string, active: boolean): Promise<AdminAccount> {
    const res = await api.patch(API_ENDPOINTS.ADMIN.ACCOUNTS.SET_STATUS(id), { active });
    return res.data?.data;
  },

  async resetAccountPassword(id: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ADMIN.ACCOUNTS.RESET_PASSWORD(id), { newPassword });
  },

  async getAuditLogs(page = 0, size = 20): Promise<PageResult<AccountAuditLog>> {
    const res = await apiClient.get<PageResult<AccountAuditLog>>(API_ENDPOINTS.ADMIN.ACCOUNTS.AUDIT_LOGS, {
      params: { page, size },
    });
    return res.data;
  },
};
