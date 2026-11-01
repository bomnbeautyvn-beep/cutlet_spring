import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types';
import { adminService, PageResult } from '@/services/admin.service';
import { AdminDishModal } from '@/features/admin/AdminDishModal';

interface MenuManagementPageProps {
  onOpenNewDishModal: (isOpen: boolean) => void;
  isNewDishModalOpen: boolean;
}

export const MenuManagementPage: React.FC<MenuManagementPageProps> = ({
  onOpenNewDishModal,
  isNewDishModalOpen,
}) => {
  const [pageResult, setPageResult] = useState<PageResult<MenuItem> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedActive, setSelectedActive] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [togglingDishId, setTogglingDishId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = (message: string, isError = false) => {
    setFeedbackToast({ message, isError });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeParam =
        selectedActive === 'active' ? true : selectedActive === 'inactive' ? false : undefined;
      const data = await adminService.getAdminMenuItems(
        selectedCategory || undefined,
        activeParam,
        currentPage,
        15
      );
      setPageResult(data);
    } catch (err) {
      console.error('Failed to load admin menu items:', err);
      showToast('Failed to load dishes from server', true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, selectedActive]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Interactive Animated Status Toggle with Optimistic UI & Revert
  const handleToggleStatus = async (dish: MenuItem) => {
    const previousState = dish.active !== false;
    const nextState = !previousState;
    setTogglingDishId(dish.id);

    // Optimistically update local list
    setPageResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content: prev.content.map((item) =>
          item.id === dish.id ? { ...item, active: nextState } : item
        ),
      };
    });

    try {
      await adminService.setItemStatus(dish.id, nextState);
      showToast(
        nextState
          ? `"${dish.nameEn}" is now ACTIVE on public menu`
          : `"${dish.nameEn}" is now INACTIVE and hidden from diners`
      );
    } catch (err: any) {
      // Revert optimistic update on failure
      setPageResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          content: prev.content.map((item) =>
            item.id === dish.id ? { ...item, active: previousState } : item
          ),
        };
      });
      showToast(`Failed to update status: ${err?.message || 'Server error'}`, true);
    } finally {
      setTogglingDishId(null);
    }
  };

  const handleDelete = async (dish: MenuItem) => {
    if (!window.confirm(`Are you sure you want to deactivate "${dish.nameEn}"?`)) {
      return;
    }
    try {
      await adminService.deleteMenuItem(dish.id);
      showToast(`Dish "${dish.nameEn}" deactivated successfully`);
      fetchDishes();
    } catch (err: any) {
      showToast(`Failed to delete dish: ${err.message}`, true);
    }
  };

  const dishes = pageResult?.content || [];
  const filteredDishes = dishes.filter(
    (d) =>
      d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameKr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.nameVi && d.nameVi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.nameJp && d.nameJp.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Clean Filter Toolbar - Manual Refresh button removed */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#eae8e5] shadow-xs">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Search 4 Languages
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by EN, KO, VI, JA or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Category Filter
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
          >
            <option value="">All Categories</option>
            <option value="japanese">Japanese Tonkatsu</option>
            <option value="korean">Korean Retro Tonkatsu</option>
            <option value="curry">Curry Rice</option>
            <option value="noodles">Artisan Noodles</option>
            <option value="addons">Atelier Add-ons</option>
            <option value="sauces">Signature Sauces</option>
            <option value="drinks">Beverages &amp; Craft</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Visibility Status
          </label>
          <select
            value={selectedActive}
            onChange={(e) => {
              setSelectedActive(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
          >
            <option value="all">All Items (Active + Inactive)</option>
            <option value="active">Active Only (Visible to Diners)</option>
            <option value="inactive">Inactive Only (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
            <div className="w-7 h-7 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-wider font-bold">
              Synchronizing Atelier Dishes...
            </span>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="py-16 text-center text-[#8f6f6c] text-xs">
            No dishes matching your current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f3f0] border-b border-[#eae8e5] text-[#585757] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Dish &amp; Translations</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Portion (EN / VI)</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4 text-center">Public Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e5]">
                {filteredDishes.map((dish) => {
                  const isActive = dish.active !== false;
                  const isToggling = togglingDishId === dish.id;

                  return (
                    <tr
                      key={dish.id}
                      className={`hover:bg-[#fbf9f6] transition-colors ${
                        !isActive ? 'opacity-60 bg-gray-50/50' : ''
                      }`}
                    >
                      {/* Dish Preview & 4-Language Name Stack */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#f5f3f0] overflow-hidden shrink-0 border border-[#eae8e5] flex items-center justify-center mt-0.5">
                            {dish.image ? (
                              <img
                                src={dish.image}
                                alt={dish.nameEn}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-base text-[#c2bfb8]">
                                restaurant
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-kr-serif text-xs text-[#af101a] font-bold">
                                {dish.nameKr}
                              </span>
                              {dish.nameKrSubtitle && (
                                <span className="text-[10px] text-[#8f6f6c]">
                                  {dish.nameKrSubtitle}
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-[#1b1c1a] text-sm block">
                              {dish.nameEn}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-[#585757] mt-0.5">
                              {dish.nameVi && <span>{dish.nameVi}</span>}
                              {dish.nameVi && dish.nameJp && <span>•</span>}
                              {dish.nameJp && <span className="font-jp-serif">{dish.nameJp}</span>}
                            </div>
                            <span className="text-[10px] text-[#8f6f6c] font-mono">
                              {dish.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-[#f5f3f0] text-[#5b403d] rounded-lg font-bold text-[11px] uppercase tracking-wider">
                          {dish.category}
                        </span>
                      </td>

                      {/* Portions */}
                      <td className="py-3 px-4 text-[#585757]">
                        <div className="font-semibold text-[#1b1c1a]">{dish.portionEn || '—'}</div>
                        <div className="text-[11px] text-[#8f6f6c]">{dish.portionVi || '—'}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-price-numeral font-bold text-sm text-[#1b1c1a]">
                          {dish.priceFormatted || `${dish.price}.000`}
                        </span>
                        <span className="text-[10px] text-[#8f6f6c] ml-1">VND</span>
                      </td>

                      {/* Interactive Animated Toggle Switch */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <button
                            type="button"
                            disabled={isToggling}
                            onClick={() => handleToggleStatus(dish)}
                            title={
                              isActive
                                ? 'Click to hide dish from public menu'
                                : 'Click to activate dish on public menu'
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer disabled:opacity-50 ${
                              isActive ? 'bg-emerald-600' : 'bg-zinc-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                                isActive ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              isActive ? 'text-emerald-700' : 'text-zinc-400'
                            }`}
                          >
                            {isToggling ? 'Syncing...' : isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingDish(dish);
                              onOpenNewDishModal(true);
                            }}
                            title="Edit Multilingual Dish & Cloudinary Asset"
                            className="p-1.5 text-[#585757] hover:text-[#af101a] hover:bg-[#f5f3f0] rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(dish)}
                            title="Deactivate Dish"
                            className="p-1.5 text-[#585757] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pageResult && pageResult.totalPages > 1 && (
          <div className="p-4 border-t border-[#eae8e5] flex items-center justify-between text-xs text-[#585757] bg-[#fbf9f6]">
            <span>
              Showing page {pageResult.number + 1} of {pageResult.totalPages} (Total{' '}
              {pageResult.totalElements} dishes)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1.5 bg-white border border-[#eae8e5] rounded-lg font-bold text-xs hover:bg-[#eae8e5] disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pageResult.totalPages - 1, p + 1))}
                disabled={currentPage >= pageResult.totalPages - 1}
                className="px-3 py-1.5 bg-white border border-[#eae8e5] rounded-lg font-bold text-xs hover:bg-[#eae8e5] disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
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

