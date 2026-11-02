import React, { useState, useEffect } from 'react';
import { MenuCategory } from '@/types';
import { adminService } from '@/services/admin.service';
import { notifyMenuUpdated } from '@/utils/menuSync';
import { CategoryModal } from './CategoryModal';

export const CategoryManagementTab: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [modalCategory, setModalCategory] = useState<MenuCategory | null | 'NEW'>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load menu categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggleStatus = async (cat: MenuCategory) => {
    try {
      setTogglingId(cat.id);
      const nextStatus = !cat.active;
      await adminService.setCategoryStatus(cat.id, nextStatus);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, active: nextStatus } : c))
      );
      notifyMenuUpdated();
      setSuccessToast(`Category "${cat.name}" is now ${nextStatus ? 'active' : 'inactive'}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to toggle category status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (cat: MenuCategory) => {
    if (cat.assignedCount && cat.assignedCount > 0) {
      alert(`Cannot delete category "${cat.name}" because it has ${cat.assignedCount} assigned dish(es). Reassign dishes first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete category "${cat.name}"?`)) {
      return;
    }

    try {
      setDeletingId(cat.id);
      await adminService.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      notifyMenuUpdated();
      setSuccessToast(`Category "${cat.name}" deleted successfully`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast & Alert */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-fade-in shadow-xs">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2 animate-fade-in shadow-xs">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Subheader Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#eae8e5] rounded shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#1b1c1a] uppercase tracking-wider">
            Menu Categories Configuration
          </h2>
          <p className="text-xs text-[#585757]">
            Dynamic category groupings used for menu categorization and filter navigation
          </p>
        </div>

        <button
          onClick={() => setModalCategory('NEW')}
          className="px-4 py-2 bg-[#af101a] hover:bg-[#930010] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Category</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#eae8e5] rounded overflow-x-auto shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[#585757] text-xs gap-2">
            <div className="w-5 h-5 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
            <span>Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8f6f6c]">
            No categories found. Create a category to start organizing dishes.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eae8e5] bg-[#fbf9f6] text-[10px] uppercase font-bold text-[#5b403d] tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Code / Slug</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Assigned Dishes</th>
                <th className="py-3 px-4 text-center">Active Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e5]">
              {categories.map((cat) => {
                const isActive = cat.active !== false;
                const isToggling = togglingId === cat.id;

                return (
                  <tr key={cat.id} className="hover:bg-[#fcfbf9] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#585757]">
                      #{cat.displayOrder || 1}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#af101a] font-semibold">
                      {cat.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1b1c1a]">{cat.name}</div>
                      {cat.description && (
                        <div className="text-[11px] text-[#8f6f6c] truncate max-w-xs">
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-[#f5f3f0] text-[#1b1c1a] border border-[#eae8e5]">
                        {cat.assignedCount ?? 0} dishes
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() => handleToggleStatus(cat)}
                          title={
                            isActive
                              ? 'Click to hide category from public menu'
                              : 'Click to activate category on public menu'
                          }
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer disabled:opacity-50 ${
                            isActive ? 'bg-emerald-600' : 'bg-zinc-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${
                              isActive ? 'translate-x-5' : 'translate-x-1'
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
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setModalCategory(cat)}
                          className="p-1.5 text-[#585757] hover:text-[#1b1c1a] hover:bg-[#eae8e5] rounded transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={deletingId === cat.id}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete category"
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
        )}
      </div>

      {/* Category Modal */}
      {modalCategory && (
        <CategoryModal
          category={modalCategory === 'NEW' ? null : modalCategory}
          onClose={() => setModalCategory(null)}
          onSaved={() => {
            loadCategories();
            notifyMenuUpdated();
            setSuccessToast('Category saved successfully');
            setTimeout(() => setSuccessToast(null), 3000);
          }}
        />
      )}
    </div>
  );
};
