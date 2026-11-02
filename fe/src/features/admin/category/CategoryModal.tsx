import React, { useState, useMemo } from 'react';
import { MenuCategory, CategoryPayload } from '@/types';
import { adminService } from '@/services/admin.service';
import { UnsavedChangesNotice } from '@/features/admin/components/UnsavedChangesNotice';

interface CategoryModalProps {
  category: MenuCategory | null; // null = create new
  onClose: () => void;
  onSaved: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(category);

  const [code, setCode] = useState(category?.code || '');
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [displayOrder, setDisplayOrder] = useState<number>(category?.displayOrder || 1);
  const [active, setActive] = useState(category?.active !== false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const isDirty = useMemo(() => {
    if (!category) {
      return Boolean(code.trim() || name.trim() || description.trim());
    }
    return (
      code !== category.code ||
      name !== category.name ||
      description !== (category.description || '') ||
      displayOrder !== category.displayOrder ||
      active !== category.active
    );
  }, [category, code, name, description, displayOrder, active]);

  const handleRequestClose = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Category code is required (e.g. "signature-sets")');
      return;
    }
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setIsSubmitting(true);
    const payload: CategoryPayload = {
      code: code.trim().toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      description: description.trim() || undefined,
      displayOrder: Number(displayOrder) || 1,
      active,
    };

    try {
      if (isEditing && category) {
        await adminService.updateCategory(category.id, payload);
      } else {
        await adminService.createCategory(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save category';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
      onClick={handleRequestClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded shadow-2xl border border-[#eae8e5] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eae8e5] bg-[#fbf9f6]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#af101a]">
              Menu Catalog Organization
            </span>
            <h2 className="font-headline-md text-lg font-bold text-[#1b1c1a]">
              {isEditing ? `Edit Category: ${category?.name}` : 'New Menu Category'}
            </h2>
          </div>
          <button
            onClick={handleRequestClose}
            className="w-8 h-8 rounded hover:bg-[#eae8e5] text-[#585757] hover:text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Exit Confirmation Dialog */}
        {showExitConfirm && (
          <div className="p-4 bg-amber-50 border-b border-amber-300 text-amber-950 animate-gentle-shake text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
              <span className="material-symbols-outlined text-amber-700 text-sm">lock</span>
              <span>Đang có thay đổi chưa lưu!</span>
            </div>
            <p className="text-[11px] text-amber-900">
              Bạn có chắc chắn muốn hủy bỏ thay đổi danh mục này không?
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1 bg-[#af101a] text-white text-[11px] font-bold rounded cursor-pointer"
              >
                Tiếp tục sửa
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 border border-amber-300 bg-white text-gray-700 text-[11px] font-bold rounded cursor-pointer"
              >
                Hủy bỏ và thoát
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {isDirty && (
            <UnsavedChangesNotice
              isDirty={isDirty}
              isSaving={isSubmitting}
              onSave={handleSubmit}
              saveButtonText={isEditing ? 'Save Category' : 'Create Category'}
              customMessage="Có thay đổi danh mục chưa lưu!"
            />
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Category Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. japanese-curry"
                className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-mono text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
                required
              />
              <span className="text-[10px] text-[#8f6f6c] block mt-1">Unique slug code</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
              />
              <span className="text-[10px] text-[#8f6f6c] block mt-1">Sort order in menu tabs</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Category Display Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Japanese Tonkatsu &amp; Rice Sets"
              className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of dishes classified under this category..."
              className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:bg-[#af101a]"></div>
            </label>
            <span className="text-xs font-semibold text-[#1b1c1a]">
              {active ? 'Active (Visible on public menu)' : 'Inactive (Draft / Hidden)'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
            <button
              type="button"
              onClick={handleRequestClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#585757] hover:bg-[#eae8e5] border border-[#eae8e5] rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 bg-[#af101a] hover:bg-[#930010] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                isDirty ? 'ring-2 ring-amber-400 ring-offset-1 animate-gentle-shake' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">
                    {isDirty ? 'lock_reset' : 'save'}
                  </span>
                  <span>{isEditing ? 'Save Category' : 'Create Category'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
