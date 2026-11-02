import React, { useState, useEffect } from 'react';
import { AdminDishModal } from '@/features/admin/AdminDishModal';
import { useAdminMenu } from './menu/hooks/useAdminMenu';
import { MenuFilterToolbar } from './menu/MenuFilterToolbar';
import { MenuTable } from './menu/MenuTable';
import { MenuPagination } from './menu/MenuPagination';
import { CategoryManagementTab } from './category/CategoryManagementTab';
import { BadgeManagementTab } from './badge/BadgeManagementTab';
import { adminService } from '@/services/admin.service';
import { MenuCategory } from '@/types';

type MenuTabKey = 'dishes' | 'categories' | 'badges';

interface MenuManagementPageProps {
  onOpenNewDishModal: (isOpen: boolean) => void;
  isNewDishModalOpen: boolean;
}

export const MenuManagementPage: React.FC<MenuManagementPageProps> = ({
  onOpenNewDishModal,
  isNewDishModalOpen,
}) => {
  const [activeMenuTab, setActiveMenuTab] = useState<MenuTabKey>('dishes');
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  const {
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
    filteredDishes,
  } = useAdminMenu();

  // Load categories for filter toolbar
  useEffect(() => {
    let isMounted = true;
    adminService.getCategories().then((cats) => {
      if (isMounted) setCategories(cats);
    }).catch(console.error);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">
            Menu Catalog Management
          </h1>
          <p className="text-xs text-[#585757] mt-0.5">
            Manage dishes, 4-language translations, dynamic categories, and atelier badges
          </p>
        </div>

        {activeMenuTab === 'dishes' && (
          <button
            onClick={() => {
              setEditingDish(null);
              onOpenNewDishModal(true);
            }}
            className="px-4 py-2.5 bg-[#af101a] hover:bg-[#930010] text-white text-xs font-bold uppercase tracking-wider rounded-none transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Menu Item</span>
          </button>
        )}
      </div>

      {/* Top Tab Switcher - Japanese Atelier Sharp Styling */}
      <div className="flex border-b border-[#eae8e5] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveMenuTab('dishes')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-2 rounded-none whitespace-nowrap ${
            activeMenuTab === 'dishes'
              ? 'border-[#af101a] text-[#af101a] bg-white'
              : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          <span>Dishes Catalog</span>
        </button>

        <button
          onClick={() => setActiveMenuTab('categories')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-2 rounded-none whitespace-nowrap ${
            activeMenuTab === 'categories'
              ? 'border-[#af101a] text-[#af101a] bg-white'
              : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">category</span>
          <span>Menu Categories</span>
        </button>

        <button
          onClick={() => setActiveMenuTab('badges')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-2 rounded-none whitespace-nowrap ${
            activeMenuTab === 'badges'
              ? 'border-[#af101a] text-[#af101a] bg-white'
              : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">stars</span>
          <span>Atelier Badges</span>
        </button>
      </div>

      {/* Floating Feedback Toast */}
      {feedbackToast && (
        <div
          className={`p-3.5 rounded-none border text-xs flex items-center gap-2.5 shadow-xs animate-fade-in ${
            feedbackToast.isError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedbackToast.isError ? 'error' : 'check_circle'}
          </span>
          <span className="font-medium">{feedbackToast.message}</span>
        </div>
      )}

      {/* Tab 1: Dishes Catalog */}
      {activeMenuTab === 'dishes' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter Toolbar */}
          <MenuFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(0);
            }}
            selectedActive={selectedActive}
            onActiveChange={(active) => {
              setSelectedActive(active);
              setCurrentPage(0);
            }}
            categories={categories}
          />

          {/* Dishes Table */}
          <div className="bg-white rounded-none border border-[#eae8e5] shadow-xs overflow-hidden">
            <MenuTable
              dishes={filteredDishes}
              isLoading={isLoading}
              togglingDishId={togglingDishId}
              onToggleStatus={handleToggleStatus}
              onEdit={(dish) => {
                setEditingDish(dish);
                onOpenNewDishModal(true);
              }}
              onDelete={handleDelete}
            />

            {pageResult && (
              <MenuPagination
                pageResult={pageResult}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Category Management */}
      {activeMenuTab === 'categories' && (
        <div className="animate-fade-in">
          <CategoryManagementTab />
        </div>
      )}

      {/* Tab 3: Atelier Badges Management */}
      {activeMenuTab === 'badges' && (
        <div className="animate-fade-in">
          <BadgeManagementTab />
        </div>
      )}

      {/* Edit or Create Dish Modal */}
      {isNewDishModalOpen && (
        <AdminDishModal
          dish={editingDish}
          onClose={() => {
            onOpenNewDishModal(false);
            setEditingDish(null);
          }}
          onSaved={() => {
            fetchDishes();
            showToast('Dish successfully synchronized with backend catalog');
          }}
        />
      )}
    </div>
  );
};
