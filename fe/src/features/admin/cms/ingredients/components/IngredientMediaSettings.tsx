import React from 'react';
import { SaveIngredientRequest } from '@/types';

interface IngredientMediaSettingsProps {
  currentImageUrl?: string;
  uploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: SaveIngredientRequest;
  onFormDataChange: (updater: (prev: SaveIngredientRequest) => SaveIngredientRequest) => void;
  isEditing: boolean;
}

export const IngredientMediaSettings: React.FC<IngredientMediaSettingsProps> = ({
  currentImageUrl,
  uploading,
  onImageUpload,
  formData,
  onFormDataChange,
  isEditing,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#fbf9f6] p-4 rounded-xl border border-[#eae8e5]">
      {/* Thumbnail */}
      <div className="md:col-span-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-[#eae8e5] relative flex items-center justify-center">
          {currentImageUrl ? (
            <img src={currentImageUrl} alt="Ingredient" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-[32px] text-gray-300">image</span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
              Uploading...
            </div>
          )}
        </div>
        {isEditing && (
          <label className="mt-2 text-[11px] font-bold text-[#af101a] hover:underline cursor-pointer">
            <span>Change Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
          </label>
        )}
      </div>

      {/* Settings */}
      <div className="md:col-span-8 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Display Sequence (Order)
            </label>
            <input
              type="number"
              min={1}
              value={formData.displayOrder}
              onChange={(e) =>
                onFormDataChange((prev) => ({
                  ...prev,
                  displayOrder: parseInt(e.target.value, 10) || 1,
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-white text-xs font-semibold focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Active Status
            </label>
            <div className="flex items-center h-9">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    onFormDataChange((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#af101a]"></div>
                <span className="ml-2 text-xs font-medium text-[#1b1c1a]">
                  {formData.isActive ? 'Active on Home' : 'Hidden'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

