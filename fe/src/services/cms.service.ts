import { apiClient } from '@/lib/api-client';
import { api } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api.constants';
import {
  HomepagePublicData,
  HomepageSection,
  UpdateHomepageSectionRequest,
  HomepageHero,
  UpdateHomepageHeroRequest,
  Ingredient,
  SaveIngredientRequest,
  GoogleReview,
  SaveGoogleReviewRequest,
  GoogleReviewsSummary,
  HeaderFooterSettings,
  UpdateHeaderFooterRequest,
} from '@/types';

export const cmsService = {
  // =========================================================================
  // PUBLIC ENDPOINTS
  // =========================================================================

  async getHomepageData(): Promise<HomepagePublicData> {
    const response = await apiClient.get<HomepagePublicData>(API_ENDPOINTS.PUBLIC_CMS.HOMEPAGE);
    return response.data;
  },

  async getIngredients(): Promise<Ingredient[]> {
    const response = await apiClient.get<Ingredient[]>(API_ENDPOINTS.PUBLIC_CMS.INGREDIENTS);
    return response.data;
  },

  async getReviews(): Promise<GoogleReview[]> {
    const response = await apiClient.get<GoogleReview[]>(API_ENDPOINTS.PUBLIC_CMS.REVIEWS);
    return response.data;
  },

  async getReviewsSummary(): Promise<GoogleReviewsSummary> {
    const response = await apiClient.get<GoogleReviewsSummary>(API_ENDPOINTS.PUBLIC_CMS.REVIEWS_SUMMARY);
    return response.data;
  },

  async getHeaderFooter(): Promise<HeaderFooterSettings> {
    const response = await apiClient.get<HeaderFooterSettings>(API_ENDPOINTS.PUBLIC_CMS.HEADER_FOOTER);
    return response.data;
  },

  // =========================================================================
  // ADMIN CMS: SECTIONS
  // =========================================================================

  async getAdminSections(): Promise<HomepageSection[]> {
    const response = await apiClient.get<HomepageSection[]>(API_ENDPOINTS.ADMIN.CMS.SECTIONS.LIST);
    return response.data;
  },

  async updateAdminSection(id: string, payload: UpdateHomepageSectionRequest): Promise<HomepageSection> {
    const response = await apiClient.put<HomepageSection>(API_ENDPOINTS.ADMIN.CMS.SECTIONS.UPDATE(id), payload);
    return response.data;
  },

  async reorderAdminSections(sectionIds: string[]): Promise<HomepageSection[]> {
    const response = await apiClient.put<HomepageSection[]>(API_ENDPOINTS.ADMIN.CMS.SECTIONS.REORDER, sectionIds);
    return response.data;
  },

  // =========================================================================
  // ADMIN CMS: HERO
  // =========================================================================

  async getAdminHero(): Promise<HomepageHero> {
    const response = await apiClient.get<HomepageHero>(API_ENDPOINTS.ADMIN.CMS.HERO.GET);
    return response.data;
  },

  async updateAdminHero(payload: UpdateHomepageHeroRequest): Promise<HomepageHero> {
    const response = await apiClient.put<HomepageHero>(API_ENDPOINTS.ADMIN.CMS.HERO.UPDATE, payload);
    return response.data;
  },

  async uploadHeroImage(file: File): Promise<HomepageHero> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ success: boolean; data: HomepageHero }>(
      API_ENDPOINTS.ADMIN.CMS.HERO.IMAGE,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },

  // =========================================================================
  // ADMIN CMS: INGREDIENTS
  // =========================================================================

  async getAdminIngredients(): Promise<Ingredient[]> {
    const response = await apiClient.get<Ingredient[]>(API_ENDPOINTS.ADMIN.CMS.INGREDIENTS.LIST);
    return response.data;
  },

  async getAdminIngredient(id: string): Promise<Ingredient> {
    const response = await apiClient.get<Ingredient>(API_ENDPOINTS.ADMIN.CMS.INGREDIENTS.DETAIL(id));
    return response.data;
  },

  async createAdminIngredient(payload: SaveIngredientRequest): Promise<Ingredient> {
    const response = await apiClient.post<Ingredient>(API_ENDPOINTS.ADMIN.CMS.INGREDIENTS.CREATE, payload);
    return response.data;
  },

  async updateAdminIngredient(id: string, payload: SaveIngredientRequest): Promise<Ingredient> {
    const response = await apiClient.put<Ingredient>(API_ENDPOINTS.ADMIN.CMS.INGREDIENTS.UPDATE(id), payload);
    return response.data;
  },

  async toggleAdminIngredientStatus(id: string): Promise<Ingredient> {
    const response = await apiClient.patch<Ingredient>(API_ENDPOINTS.ADMIN.CMS.INGREDIENTS.TOGGLE_STATUS(id));
    return response.data;
  },

  async deleteAdminIngredient(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.ADMIN.CMS.INGREDIENTS.DELETE(id));
  },

  async uploadIngredientImage(id: string, file: File): Promise<Ingredient> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ success: boolean; data: Ingredient }>(
      API_ENDPOINTS.ADMIN.CMS.INGREDIENTS.IMAGE(id),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },

  // =========================================================================
  // ADMIN CMS: GOOGLE REVIEWS
  // =========================================================================

  async getAdminReviews(): Promise<GoogleReview[]> {
    const response = await apiClient.get<GoogleReview[]>(API_ENDPOINTS.ADMIN.CMS.REVIEWS.LIST);
    return response.data;
  },

  async getAdminReview(id: string): Promise<GoogleReview> {
    const response = await apiClient.get<GoogleReview>(API_ENDPOINTS.ADMIN.CMS.REVIEWS.DETAIL(id));
    return response.data;
  },

  async createAdminReview(payload: SaveGoogleReviewRequest): Promise<GoogleReview> {
    const response = await apiClient.post<GoogleReview>(API_ENDPOINTS.ADMIN.CMS.REVIEWS.CREATE, payload);
    return response.data;
  },

  async updateAdminReview(id: string, payload: SaveGoogleReviewRequest): Promise<GoogleReview> {
    const response = await apiClient.put<GoogleReview>(API_ENDPOINTS.ADMIN.CMS.REVIEWS.UPDATE(id), payload);
    return response.data;
  },

  async toggleAdminReviewStatus(id: string): Promise<GoogleReview> {
    const response = await apiClient.patch<GoogleReview>(API_ENDPOINTS.ADMIN.CMS.REVIEWS.TOGGLE_STATUS(id));
    return response.data;
  },

  async toggleAdminReviewFeatured(id: string): Promise<GoogleReview> {
    const response = await apiClient.patch<GoogleReview>(API_ENDPOINTS.ADMIN.CMS.REVIEWS.TOGGLE_FEATURED(id));
    return response.data;
  },

  async deleteAdminReview(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.ADMIN.CMS.REVIEWS.DELETE(id));
  },

  // =========================================================================
  // ADMIN CMS: HEADER & FOOTER
  // =========================================================================

  async getAdminHeaderFooter(): Promise<HeaderFooterSettings> {
    const response = await apiClient.get<HeaderFooterSettings>(API_ENDPOINTS.ADMIN.CMS.HEADER_FOOTER.GET);
    return response.data;
  },

  async updateAdminHeaderFooter(payload: UpdateHeaderFooterRequest): Promise<HeaderFooterSettings> {
    const response = await apiClient.put<HeaderFooterSettings>(API_ENDPOINTS.ADMIN.CMS.HEADER_FOOTER.UPDATE, payload);
    return response.data;
  },

  async uploadHeaderLogo(file: File): Promise<HeaderFooterSettings> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ success: boolean; data: HeaderFooterSettings }>(
      API_ENDPOINTS.ADMIN.CMS.HEADER_FOOTER.LOGO,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },
};

