import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types';
import { adminService, PageResult } from '@/services/admin.service';
import { notifyMenuUpdated, subscribeToMenuUpdates } from '@/utils/menuSync';

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
  fetchDishes: (silent?: boolean) => Promise<void>;
  handleToggleStatus: (dish: MenuItem) => Promise<void>;
  handleDelete: (dish: MenuItem) => void;
  deletingDish: MenuItem | null;
  setDeletingDish: (dish: MenuItem | null) => void;
  isDeleting: boolean;
  confirmDeleteDish: () => Promise<void>;
  filteredDishes: MenuItem[];
}

const SESSION_CATEGORY_KEY = 'admin_menu_selected_category';
const SESSION_ACTIVE_KEY = 'admin_menu_selected_active';

export function useAdminMenu(): UseAdminMenuReturn {
  const [pageResult, setPageResult] = useState<PageResult<MenuItem> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedCategory, setSelectedCategoryState] = useState<string>(() => {
    try {
      return sessionStorage.getItem(SESSION_CATEGORY_KEY) || '';
    } catch {
      return '';
    }
  });
  const [selectedActive, setSelectedActiveState] = useState<string>(() => {
    try {
      return sessionStorage.getItem(SESSION_ACTIVE_KEY) || 'all';
    } catch {
      return 'all';
    }
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setSelectedCategory = useCallback((cat: string) => {
    setSelectedCategoryState(cat);
    try {
      if (cat) {
        sessionStorage.setItem(SESSION_CATEGORY_KEY, cat);
      } else {
        sessionStorage.removeItem(SESSION_CATEGORY_KEY);
      }
    } catch {}
  }, []);

  const setSelectedActive = useCallback((active: string) => {
    setSelectedActiveState(active);
    try {
      if (active && active !== 'all') {
        sessionStorage.setItem(SESSION_ACTIVE_KEY, active);
      } else {
        sessionStorage.removeItem(SESSION_ACTIVE_KEY);
      }
    } catch {}
  }, []);

  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [togglingDishId, setTogglingDishId] = useState<string | null>(null);
  const [deletingDish, setDeletingDish] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = useCallback((message: string, isError = false) => {
    setFeedbackToast({ message, isError });
    setTimeout(() => setFeedbackToast(null), 3500);
  }, []);

  const fetchDishes = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
    }
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
    fetchDishes(false);
  }, [fetchDishes]);

  // Real-time synchronization across tabs, windows, and components
  useEffect(() => {
    const unsubscribe = subscribeToMenuUpdates(() => {
      fetchDishes(true); // Silent re-fetch
    });
    return unsubscribe;
  }, [fetchDishes]);

  // Auto-refresh when tab is focused or becomes visible
  useEffect(() => {
    let lastFetch = Date.now();

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetch > 3000) {
        lastFetch = Date.now();
        fetchDishes(true);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
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
      notifyMenuUpdated();
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

  const handleDelete = (dish: MenuItem) => {
    setDeletingDish(dish);
  };

  const confirmDeleteDish = async () => {
    if (!deletingDish) return;
    try {
      setIsDeleting(true);
      await adminService.deleteMenuItem(deletingDish.id);
      showToast(`Món "${deletingDish.nameEn}" đã được chuyển sang trạng thái ngưng phục vụ`);
      notifyMenuUpdated();
      fetchDishes();
      setDeletingDish(null);
    } catch (err: any) {
      showToast(`Không thể xóa món ăn: ${err.message}`, true);
    } finally {
      setIsDeleting(false);
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
    deletingDish,
    setDeletingDish,
    isDeleting,
    confirmDeleteDish,
    filteredDishes,
  };
}

