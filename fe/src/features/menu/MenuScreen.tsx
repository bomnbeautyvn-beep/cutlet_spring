import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MenuItem, Language } from '@/types';
import { useMenu } from '@/hooks/useMenu';
import { useUIStore } from '@/stores/ui.store';
import { ItemDetailModal } from '@/features/menu/ItemDetailModal';
import {
  DishCard,
  CompactItemCard,
  MenuSidebar,
  MenuSection,
} from '@/features/menu/components';

interface MenuScreenProps {
  language?: Language;
  onSelectItem?: (item: MenuItem) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = () => {
  const { items, isLoading, error, refetch } = useMenu();
  const { selectedItemForModal, openItemDetail, closeItemDetail } = useUIStore();
  const [activeCategory, setActiveCategory] = useState<string>('cat-japanese');
  const isClickScrolling = useRef(false);

  // Group items dynamically by category from real backend
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

  // Scroll-spy: seamlessly tracks current viewing section as user scrolls
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

          // If scrolled near bottom of page, highlight the last section
          if (scrollY + windowHeight >= fullHeight - 80) {
            setActiveCategory('cat-drinks');
            ticking = false;
            return;
          }

          // Search sections from bottom to top
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

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Detail Modal */}
      {selectedItemForModal && (
        <ItemDetailModal
          item={selectedItemForModal}
          onClose={closeItemDetail}
        />
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 gap-3 text-[#af101a]">
          <div className="w-6 h-6 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
          <span className="font-menu-bar text-sm uppercase tracking-wider font-semibold text-[#5b403d]">
            Curating Atelier Catalog...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && items.length === 0 && (
        <div className="max-w-md mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-3">
          <span className="material-symbols-outlined text-3xl text-[#af101a]">error_outline</span>
          <p className="text-sm text-red-700 font-medium">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#af101a] text-white text-xs font-bold uppercase rounded-lg shadow hover:bg-[#d32f2f] transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Main Body Grid: Sticky Left Category Index & Right Food Spreads */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-6 lg:py-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12">
          {/* CATEGORY NAVIGATION: Sticky Horizontal Bar (< lg) & Sticky Sidebar (lg+) */}
          <MenuSidebar
            activeCategory={activeCategory}
            categories={categories}
            onSelectCategory={scrollToCategory}
          />

          {/* RIGHT MAIN CONTENT: The Dish Catalog */}
          <main className="lg:col-span-9 xl:col-span-10 space-y-12 sm:space-y-16">
            {/* 01. JAPANESE TONKATSU */}
            <MenuSection
              id="cat-japanese"
              titleEn="Japanese Tonkatsu"
              subtitleKr="일본식 정통 카츠 • Deep golden coarse panko fried at precision dual temperatures"
              note="All sets include cabbage, miso broth, pickles & pearl rice"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {japaneseItems.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    isFeatured={item.isChefSignature}
                    onSelectItem={openItemDetail}
                  />
                ))}
              </div>
            </MenuSection>

            {/* 02. KOREAN TONKATSU */}
            <MenuSection
              id="cat-korean"
              titleEn="Korean Tonkatsu"
              subtitleKr="경양식 돈까스 • 1980s Retro Seoul style thin-pounded crispy pork cutlets"
              note="Served with homemade cream corn soup, rice & spicy kimchi"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {koreanItems.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    onSelectItem={openItemDetail}
                  />
                ))}
              </div>
            </MenuSection>

            {/* 03. CURRY SET */}
            <MenuSection
              id="cat-curry"
              titleEn="Curry Set"
              subtitleKr="수제 카레라이스 • 48-hour slow-simmered caramelized onion Japanese spiced curry"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {curryItems.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    onSelectItem={openItemDetail}
                  />
                ))}
              </div>
            </MenuSection>

            {/* 04. NOODLES */}
            <MenuSection
              id="cat-noodles"
              titleEn="Noodles"
              subtitleKr="면 요리 • Chilled buckwheat soba & Sanuki udon with savory bonito dashi broth"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {noodleItems.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    onSelectItem={openItemDetail}
                  />
                ))}
              </div>
            </MenuSection>

            {/* 05. ADD-ONS */}
            <MenuSection
              id="cat-addons"
              titleEn="Add-ons"
              subtitleKr="사이드 및 추가 메뉴 • Individual katsu pieces, extra soup, warm pearl rice & sides"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {addonItems.map((item) => (
                  <CompactItemCard
                    key={item.id}
                    item={item}
                    onSelectItem={openItemDetail}
                  />
                ))}
              </div>
            </MenuSection>

            {/* 06. SAUCES */}
            <MenuSection
              id="cat-sauces"
              titleEn="Sauces"
              subtitleKr="소스 추가 • House-made tonkatsu sauces, spicy retro sauce, curry & artisanal dips"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {sauceItems.map((item) => (
                  <CompactItemCard
                    key={item.id}
                    item={item}
                    onSelectItem={openItemDetail}
                  />
                ))}
              </div>
            </MenuSection>

            {/* 07. DRINKS */}
            <MenuSection
              id="cat-drinks"
              titleEn="Drinks"
              subtitleKr="음료 및 주류 • Craft beer, chilled sakes, Japanese sodas & mineral waters"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {drinkItems.map((item) => (
                  <CompactItemCard
                    key={item.id}
                    item={item}
                    onSelectItem={openItemDetail}
                  />
                ))}
              </div>
            </MenuSection>
          </main>
        </div>
      </div>
    </div>
  );
};
