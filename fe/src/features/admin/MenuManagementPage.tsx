import React from 'react';
import { AdminDishModal } from '@/features/admin/AdminDishModal';
import { useAdminMenu } from './menu/hooks/useAdminMenu';
import { MenuFilterToolbar } from './menu/MenuFilterToolbar';
import { MenuTable } from './menu/MenuTable';
import { MenuPagination } from './menu/MenuPagination';

interface MenuManagementPageProps {
  onOpenNewDishModal: (isOpen: boolean) => void;
  isNewDishModalOpen: boolean;
}

export const MenuManagementPage: React.FC<MenuManagementPageProps> = ({
  onOpenNewDishModal,
  isNewDishModalOpen,
}) => {
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

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">
            Menu Catalog Management
          </h1>
          <p className="text-xs text-[#585757] mt-0.5">
            Manage dishes, 4-language translations (EN, KO, VI, JA), active status, and Cloudinary photos
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDish(null);
            onOpenNewDishModal(true);
          }}
          className="px-4 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Menu Item</span>
        </button>
      </div>

      {/* Floating Feedback Toast */}
      {feedbackToast && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 shadow-sm animate-fade-in ${
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
      />

      {/* Dishes Table */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] shadow-xs overflow-hidden">
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
