import React, { useState, useEffect } from 'react';
import { MenuCategory } from '@/types';
import { adminService } from '@/services/admin.service';
import { CategoryModal } from './CategoryModal';

export const CategoryManagementTab: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [modalCategory, setModalCategory] = useState<MenuCategory | null | 'NEW'>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      const nextStatus = !cat.active;
      await adminService.setCategoryStatus(cat.id, nextStatus);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, active: nextStatus } : c))
      );
      setSuccessToast(`Category "${cat.name}" is now ${nextStatus ? 'active' : 'inactive'}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to toggle category status');
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
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-none flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-none flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Subheader Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#eae8e5] rounded-none">
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
          className="px-4 py-2 bg-[#af101a] hover:bg-[#930010] text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Category</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#eae8e5] rounded-none overflow-x-auto shadow-xs">
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
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e5]">
              {categories.map((cat) => (
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-mono bg-[#f5f3f0] text-[#1b1c1a] border border-[#eae8e5]">
                      {cat.assignedCount ?? 0} dishes
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-none border cursor-pointer transition-colors ${
                        cat.active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{cat.active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setModalCategory(cat)}
                        className="p-1.5 text-[#585757] hover:text-[#1b1c1a] hover:bg-[#eae8e5] rounded-none transition-colors cursor-pointer"
                        title="Edit category"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deletingId === cat.id}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-none transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete category"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
            setSuccessToast('Category saved successfully');
            setTimeout(() => setSuccessToast(null), 3000);
          }}
        />
      )}
    </div>
  );
};

