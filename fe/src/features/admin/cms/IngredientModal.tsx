import React from 'react';
import { Ingredient } from '@/types';
import { useIngredientModalForm } from './ingredients/hooks/useIngredientModalForm';
import { IngredientLanguageTab } from './ingredients/components/IngredientLanguageTab';
import { IngredientMediaSettings } from './ingredients/components/IngredientMediaSettings';

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
  } = useIngredientModalForm({ ingredient, isOpen, onSaved, onClose });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
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
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-[#eae8e5] text-gray-500 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

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
          <div className="pt-3 border-t border-[#eae8e5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{ingredient ? 'Update Ingredient' : 'Create Ingredient'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
