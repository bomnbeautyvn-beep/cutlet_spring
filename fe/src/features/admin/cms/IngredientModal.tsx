import React, { useState } from 'react';
import { Ingredient } from '@/types';
import { useIngredientModalForm } from './ingredients/hooks/useIngredientModalForm';
import { IngredientLanguageTab } from './ingredients/components/IngredientLanguageTab';
import { IngredientMediaSettings } from './ingredients/components/IngredientMediaSettings';
import { UnsavedChangesNotice } from '@/features/admin/components/UnsavedChangesNotice';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  ingredient?: Ingredient | null;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  ingredient,
}) => {
  const {
    isDirty,
    activeLangTab,
    setActiveLangTab,
    saving,
    uploading,
    errorMessage,
    formData,
    setFormData,
    currentImageUrl,
    handleSubmit,
    handleImageUpload,
    handleFileDrop,
  } = useIngredientModalForm({ ingredient, isOpen, onSaved, onClose });

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!isOpen) return null;

  const handleRequestClose = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleRequestClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#eae8e5] p-6 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
          <div>
            <span className="font-kr-serif text-xs text-[#af101a] font-bold">봄돈까스 아틀리에</span>
            <h2 className="font-headline-md text-base font-bold text-[#1b1c1a]">
              {ingredient ? 'Edit Atelier Foundation' : 'Add New Ingredient Foundation'}
            </h2>
          </div>
          <button
            onClick={handleRequestClose}
            className="w-7 h-7 rounded-full hover:bg-[#eae8e5] text-gray-500 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Exit Confirmation Dialog */}
        {showExitConfirm && (
          <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-950 animate-gentle-shake text-center space-y-3">
            <div className="flex items-center justify-center gap-2 font-bold text-sm">
              <span className="material-symbols-outlined text-amber-700">lock</span>
              <span>Bạn có chỉnh sửa nguyên liệu chưa lưu!</span>
            </div>
            <p className="text-xs text-amber-900">
              Dữ liệu sẽ bị mất nếu đóng ngay lúc này. Bạn có muốn tiếp tục chỉnh sửa không?
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-1.5 bg-[#af101a] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#930010] cursor-pointer"
              >
                Tiếp tục chỉnh sửa
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 border border-[#eae8e5] bg-white text-gray-700 text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-100 cursor-pointer"
              >
                Thoát không lưu
              </button>
            </div>
          </div>
        )}

        {isDirty && (
          <UnsavedChangesNotice
            isDirty={isDirty}
            isSaving={saving}
            onSave={handleSubmit}
            saveButtonText={ingredient ? 'Update Ingredient' : 'Create Ingredient'}
            customMessage="Đang có chỉnh sửa nguyên liệu chưa lưu!"
          />
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Media & Order Settings */}
          <IngredientMediaSettings
            currentImageUrl={currentImageUrl}
            uploading={uploading}
            onImageUpload={handleImageUpload}
            onDropFile={handleFileDrop}
            formData={formData}
            onFormDataChange={setFormData}
            isEditing={Boolean(ingredient?.id)}
          />

          {/* Multilingual Tabs */}
          <IngredientLanguageTab
            activeLangTab={activeLangTab}
            onTabChange={setActiveLangTab}
            formData={formData}
            onFormDataChange={setFormData}
          />

          {/* Actions */}
          <div className="pt-3 border-t border-[#eae8e5] flex items-center justify-between gap-2">
            <div className="text-[11px] text-[#8f6f6c]">
              EN is mandatory. VI, KO, and JA are optional.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRequestClose}
                disabled={saving}
                className="px-4 py-2 font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-5 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold uppercase tracking-wider rounded shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
                  isDirty ? 'ring-2 ring-amber-400 ring-offset-1 animate-gentle-shake' : ''
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">
                      {isDirty ? 'lock_reset' : 'save'}
                    </span>
                    <span>{ingredient ? 'Update Ingredient' : 'Create Ingredient'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
