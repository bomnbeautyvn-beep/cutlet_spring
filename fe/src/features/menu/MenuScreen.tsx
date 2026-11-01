import React from 'react';
import { MenuItem, Language } from '@/types';
import { useUIStore } from '@/stores/ui.store';
import { useMenuCatalog } from '@/features/menu/hooks/useMenuCatalog';
import { ItemDetailModal } from '@/features/menu/ItemDetailModal';
import { MenuSidebar } from '@/features/menu/components';
import { CatalogSections } from '@/features/menu/components/CatalogSections';

interface MenuScreenProps {
  language?: Language;
  onSelectItem?: (item: MenuItem) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = () => {
  const {
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
  } = useMenuCatalog();

  const { selectedItemForModal, openItemDetail, closeItemDetail } = useUIStore();

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
            type="button"
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
          <CatalogSections
            japaneseItems={japaneseItems}
            koreanItems={koreanItems}
            curryItems={curryItems}
            noodleItems={noodleItems}
            addonItems={addonItems}
            sauceItems={sauceItems}
            drinkItems={drinkItems}
            onSelectItem={openItemDetail}
          />
        </div>
      </div>
    </div>
  );
};
