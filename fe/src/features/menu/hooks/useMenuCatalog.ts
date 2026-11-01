import { useState, useMemo, useEffect, useRef } from 'react';
import { MenuItem } from '@/types';
import { useMenu } from '@/hooks/useMenu';

export interface UseMenuCatalogReturn {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  activeCategory: string;
  scrollToCategory: (catId: string) => void;
  categories: { id: string; label: string; count: number }[];
  japaneseItems: MenuItem[];
  koreanItems: MenuItem[];
  curryItems: MenuItem[];
  noodleItems: MenuItem[];
  addonItems: MenuItem[];
  sauceItems: MenuItem[];
  drinkItems: MenuItem[];
}

export const useMenuCatalog = (): UseMenuCatalogReturn => {
  const { items, isLoading, error, refetch } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>('cat-japanese');
  const isClickScrolling = useRef(false);

  const japaneseItems = useMemo(
    () => items.filter((i) => i.category === 'japanese'),
    [items]
  );
  const koreanItems = useMemo(
    () => items.filter((i) => i.category === 'korean'),
    [items]
  );
  const curryItems = useMemo(
    () => items.filter((i) => i.category === 'curry'),
    [items]
  );
  const noodleItems = useMemo(
    () => items.filter((i) => i.category === 'noodles'),
    [items]
  );
  const addonItems = useMemo(
    () => items.filter((i) => i.category === 'addons'),
    [items]
  );
  const sauceItems = useMemo(
    () => items.filter((i) => i.category === 'sauces'),
    [items]
  );
  const drinkItems = useMemo(
    () => items.filter((i) => i.category === 'drinks'),
    [items]
  );

  useEffect(() => {
    const sectionIds = [
      'cat-japanese',
      'cat-korean',
      'cat-curry',
      'cat-noodles',
      'cat-addons',
      'cat-sauces',
      'cat-drinks',
    ];

    let ticking = false;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const fullHeight = document.documentElement.scrollHeight;

          if (scrollY + windowHeight >= fullHeight - 80) {
            setActiveCategory('cat-drinks');
            ticking = false;
            return;
          }

          const threshold = 130;
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= threshold) {
                setActiveCategory(sectionIds[i]);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    isClickScrolling.current = true;
    const elem = document.getElementById(catId);
    if (elem) {
      const yOffset = window.innerWidth < 1024 ? -90 : -95;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const categories = [
    { id: 'cat-japanese', label: 'Japanese Tonkatsu', count: japaneseItems.length },
    { id: 'cat-korean', label: 'Korean Tonkatsu', count: koreanItems.length },
    { id: 'cat-curry', label: 'Curry Set', count: curryItems.length },
    { id: 'cat-noodles', label: 'Noodles', count: noodleItems.length },
    { id: 'cat-addons', label: 'Add-ons', count: addonItems.length },
    { id: 'cat-sauces', label: 'Sauces', count: sauceItems.length },
    { id: 'cat-drinks', label: 'Drinks', count: drinkItems.length },
  ];

  return {
    items,
    isLoading,
    error,
    refetch,
    activeCategory,
    scrollToCategory,
    categories,
    japaneseItems,
    koreanItems,
    curryItems,
    noodleItems,
    addonItems,
    sauceItems,
    drinkItems,
  };
};

