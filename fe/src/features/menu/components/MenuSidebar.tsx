import React, { useState, useEffect } from 'react';

export interface MenuCategoryItem {
  id: string;
  label: string;
  count: number;
}

interface MenuSidebarProps {
  activeCategory: string;
  categories: MenuCategoryItem[];
  onSelectCategory: (id: string) => void;
}

export const MenuSidebar: React.FC<MenuSidebarProps> = ({
  activeCategory,
  categories,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* MOBILE & TABLET (< lg): FLOATING LEFT EDGE TRIGGER (ALWAYS VISIBLE) */}
      <div className="lg:hidden fixed left-0 top-24 sm:top-28 z-40">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu Sections"
          className="flex items-center gap-1 pl-2 pr-1.5 py-1.5 bg-[#fbf9f6]/95 hover:bg-[#eae8e5] backdrop-blur-md rounded-r-md shadow-md border-y border-r border-[#eae8e5] active:scale-95 transition-all cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-none bg-[#af101a] flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-white">
              format_list_bulleted
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#5b403d] group-hover:text-[#1b1c1a] group-hover:translate-x-0.5 transition-all">
            chevron_right
          </span>
        </button>
      </div>

      {/* MOBILE & TABLET (< lg): SLIDE-OUT MENU SECTION DRAWER */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Container */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-[#fbf9f6] shadow-2xl flex flex-col border-r border-[#eae8e5] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#eae8e5] flex items-center justify-between shrink-0">
          <span className="font-menu-bar text-xs sm:text-sm tracking-wider text-[#1b1c1a] uppercase font-bold">
            Menu Sections
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-none border border-[#eae8e5] bg-white hover:bg-[#eae8e5] text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu sections"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Categories Navigation List - matching original color styling */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsOpen(false);
                }}
                className={`group flex items-center justify-between py-2.5 px-3 rounded-none transition-all text-left cursor-pointer w-full ${
                  isActive
                    ? 'bg-[#eae8e5]/80 text-[#af101a] font-bold border-l-2 border-[#af101a]'
                    : 'text-[#5b403d] hover:bg-[#eae8e5]/40 hover:text-[#1b1c1a]'
                }`}
              >
                <span className="font-menu-bar text-sm sm:text-base tracking-wider group-hover:translate-x-0.5 transition-transform">
                  {cat.label}
                </span>
                <span
                  className={`font-price-numeral text-xs sm:text-sm transition-colors ${
                    isActive
                      ? 'text-[#af101a] font-bold'
                      : 'text-[#8f6f6c] group-hover:text-[#1b1c1a]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* DESKTOP (lg+): Sticky Vertical Left Sidebar */}
      <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
        <div className="lg:sticky lg:top-28 pt-0 lg:pt-[76px] space-y-4">
          <div className="space-y-3">
            <div className="pb-1">
              <span className="font-menu-bar text-sm sm:text-base tracking-wider text-[#1b1c1a] uppercase font-bold">
                Menu Sections
              </span>
            </div>

            <nav className="flex flex-col space-y-1.5" id="category-nav">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`group flex items-center justify-between py-2.5 px-3 rounded-none transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#eae8e5]/80 text-[#af101a] font-bold border-l-2 border-[#af101a]'
                        : 'text-[#5b403d] hover:bg-[#eae8e5]/40 hover:text-[#1b1c1a]'
                    }`}
                  >
                    <span className="font-menu-bar text-sm tracking-wider group-hover:translate-x-0.5 transition-transform">
                      {cat.label}
                    </span>
                    <span
                      className={`font-price-numeral text-xs sm:text-sm transition-colors ${
                        isActive
                          ? 'text-[#af101a] font-bold'
                          : 'text-[#8f6f6c] group-hover:text-[#1b1c1a]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

