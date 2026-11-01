import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types';
import { menuService } from '@/services/menu.service';

export function useMenu(selectedCategory?: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await menuService.getMenuItems(selectedCategory);
      setItems(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
  };
}
