import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    // Attempt session restoration on initial mount
    store.checkAuth();
  }, []);

  return store;
}

