import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types';
import { adminService, PageResult } from '@/services/admin.service';

export interface UseAdminMenuReturn {
  pageResult: PageResult<MenuItem> | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedActive: string;
  setSelectedActive: (active: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  editingDish: MenuItem | null;
  setEditingDish: (dish: MenuItem | null) => void;
  togglingDishId: string | null;
  feedbackToast: { message: string; isError?: boolean } | null;
  showToast: (message: string, isError?: boolean) => void;
  fetchDishes: () => Promise<void>;
  handleToggleStatus: (dish: MenuItem) => Promise<void>;
  handleDelete: (dish: MenuItem) => Promise<void>;
  filteredDishes: MenuItem[];
}

export function useAdminMenu(): UseAdminMenuReturn {
  const [pageResult, setPageResult] = useState<PageResult<MenuItem> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedActive, setSelectedActive] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [togglingDishId, setTogglingDishId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = useCallback((message: string, isError = false) => {
    setFeedbackToast({ message, isError });
    setTimeout(() => setFeedbackToast(null), 3500);
  }, []);

  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeParam =
        selectedActive === 'active' ? true : selectedActive === 'inactive' ? false : undefined;
      const data = await adminService.getAdminMenuItems(
        selectedCategory || undefined,
        activeParam,
        currentPage,
        15
      );
      setPageResult(data);
    } catch (err) {
      console.error('Failed to load admin menu items:', err);
      showToast('Failed to load dishes from server', true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, selectedActive, showToast]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Interactive Animated Status Toggle with Optimistic UI & Revert
  const handleToggleStatus = async (dish: MenuItem) => {
    const previousState = dish.active !== false;
    const nextState = !previousState;
    setTogglingDishId(dish.id);

    // Optimistically update local list
    setPageResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content: prev.content.map((item) =>
          item.id === dish.id ? { ...item, active: nextState } : item
        ),
      };
    });

    try {
      await adminService.setItemStatus(dish.id, nextState);
      showToast(
        nextState
          ? `"${dish.nameEn}" is now ACTIVE on public menu`
          : `"${dish.nameEn}" is now INACTIVE and hidden from diners`
      );
    } catch (err: any) {
      // Revert optimistic update on failure
      setPageResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          content: prev.content.map((item) =>
            item.id === dish.id ? { ...item, active: previousState } : item
          ),
        };
      });
      showToast(`Failed to update status: ${err?.message || 'Server error'}`, true);
    } finally {
      setTogglingDishId(null);
    }
  };

  const handleDelete = async (dish: MenuItem) => {
    if (!window.confirm(`Are you sure you want to deactivate "${dish.nameEn}"?`)) {
      return;
    }
    try {
      await adminService.deleteMenuItem(dish.id);
      showToast(`Dish "${dish.nameEn}" deactivated successfully`);
      fetchDishes();
    } catch (err: any) {
      showToast(`Failed to delete dish: ${err.message}`, true);
    }
  };

  const dishes = pageResult?.content || [];
  const filteredDishes = dishes.filter(
    (d) =>
      d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameKr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.nameVi && d.nameVi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.nameJp && d.nameJp.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    pageResult,
    currentPage,
    setCurrentPage,
    selectedCategory,
    setSelectedCategory,
    selectedActive,
    setSelectedActive,
    searchQuery,
    setSearchQuery,
    isLoading,
    editingDish,
    setEditingDish,
    togglingDishId,
    feedbackToast,
    showToast,
    fetchDishes,
    handleToggleStatus,
    handleDelete,
    filteredDishes,
  };
}

