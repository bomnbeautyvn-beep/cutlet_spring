import { create } from 'zustand';
import { PageView, Language, MenuItem } from '@/types';

interface UIState {
  currentView: PageView;
  language: Language;
  selectedItemForModal: MenuItem | null;
  modalInitialOptions: any | null;

  setCurrentView: (view: PageView) => void;
  setLanguage: (lang: Language) => void;
  openItemDetail: (item: MenuItem, initialOptions?: any) => void;
  closeItemDetail: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentView: 'home',
  language: 'EN',
  selectedItemForModal: null,
  modalInitialOptions: null,

  setCurrentView: (view) => {
    set({ currentView: view });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  setLanguage: (language) => set({ language }),

  openItemDetail: (item, initialOptions = null) =>
    set({
      selectedItemForModal: item,
      modalInitialOptions: initialOptions,
    }),

  closeItemDetail: () =>
    set({
      selectedItemForModal: null,
      modalInitialOptions: null,
    }),
}));
