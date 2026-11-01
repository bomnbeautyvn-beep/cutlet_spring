import { create } from 'zustand';
import { authService, AdminUser } from '@/services/auth.service';

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const admin = await authService.login(email, password);
      set({ admin, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message || 'Invalid email or password',
      });
      return false;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const admin = await authService.getCurrentAdmin();
      set({ admin, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      set({ admin: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout network errors
    } finally {
      set({ admin: null, isAuthenticated: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));

