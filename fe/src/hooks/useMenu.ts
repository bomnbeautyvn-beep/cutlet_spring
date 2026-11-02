import { useState, useEffect, useCallback, useRef } from 'react';
import { MenuItem } from '@/types';
import { menuService } from '@/services/menu.service';
import { subscribeToMenuUpdates } from '@/utils/menuSync';

export function useMenu(selectedCategory?: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const fetchItems = useCallback(async (silent = false) => {
    // Only show full loading spinner on initial mount or when items are empty
    if (!silent || items.length === 0) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = await menuService.getMenuItems(selectedCategory);
      setItems(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, items.length]);

  // Initial load
  useEffect(() => {
    fetchItems(false);
  }, [fetchItems]);

  // Real-time synchronization across tabs, windows, and components (no Ctrl+R needed)
  useEffect(() => {
    const unsubscribe = subscribeToMenuUpdates(() => {
      fetchItems(true); // Silent background re-fetch
    });
    return unsubscribe;
  }, [fetchItems]);

  // Auto-refresh when tab is focused or becomes visible
  useEffect(() => {
    let lastFetch = Date.now();

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetch > 3000) {
        lastFetch = Date.now();
        fetchItems(true);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
  }, [fetchItems]);

  // Periodic background polling (every 15s when active tab is visible)
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchItems(true);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchItems]);

  return {
    items,
    isLoading,
    error,
    refetch: () => fetchItems(false),
  };
}
