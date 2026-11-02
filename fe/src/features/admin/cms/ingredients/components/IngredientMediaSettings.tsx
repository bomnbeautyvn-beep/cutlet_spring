import React, { useState, useRef } from 'react';
import { SaveIngredientRequest } from '@/types';

interface IngredientMediaSettingsProps {
  currentImageUrl?: string;
  uploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropFile?: (file: File) => void;
  formData: SaveIngredientRequest;
  onFormDataChange: (updater: (prev: SaveIngredientRequest) => SaveIngredientRequest) => void;
  isEditing: boolean;
}

export const IngredientMediaSettings: React.FC<IngredientMediaSettingsProps> = ({
  currentImageUrl,
  uploading,
  onImageUpload,
  onDropFile,
  formData,
  onFormDataChange,
  isEditing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (onDropFile) {
        onDropFile(e.dataTransfer.files[0]);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-[#fbf9f6] p-4 rounded-xl border border-[#eae8e5]">
      {/* Visual Frame & Drag-and-Drop Upload */}
      <div className="md:col-span-5 flex flex-col items-center">
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`w-full aspect-[4/3] rounded-lg overflow-hidden relative flex items-center justify-center transition-all cursor-pointer group select-none ${
            isDragging
              ? 'border-2 border-dashed border-[#af101a] bg-[#af101a]/10 ring-4 ring-[#af101a]/20 scale-[1.01]'
              : 'bg-[#f3f1ec] border border-[#eae6df] hover:border-[#af101a]/60 hover:shadow-xs'
          }`}
          title="Click hoặc kéo thả ảnh nguyên liệu vào đây"
        >
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Ingredient Visual"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          ) : (
            <div className="flex flex-col items-center text-[#8f6f6c] gap-1 p-3 text-center pointer-events-none">
              <span className="material-symbols-outlined text-[32px] text-[#c2bfb8] group-hover:text-[#af101a] transition-colors">
                add_photo_alternate
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8f6f6c] group-hover:text-[#1b1c1a] transition-colors">
                Kéo thả ảnh hoặc click để chọn
              </span>
              <span className="text-[10px] text-[#a89d91]">JPG, PNG, WEBP (tối đa 10MB)</span>
            </div>
          )}

          {/* Dragging Active Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-2xs flex flex-col items-center justify-center text-[#af101a] gap-2 z-20 animate-fade-in pointer-events-none">
              <span className="material-symbols-outlined text-[36px] animate-bounce">
                cloud_upload
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Thả ảnh vào đây để tải lên
              </span>
            </div>
          )}

          {/* Hover overlay when image exists and not dragging */}
          {currentImageUrl && !isDragging && !uploading && (
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 pointer-events-none">
              <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
              <span>Kéo thả hoặc click để đổi ảnh</span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2 z-30 pointer-events-none">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Uploading to Cloudinary...</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-2 w-full py-1.5 px-3 border border-[#eae8e5] bg-[#f5f3f0] hover:bg-[#eae8e5] text-xs font-bold text-[#1b1c1a] text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 rounded-lg shadow-2xs"
        >
          <span className="material-symbols-outlined text-[15px] text-[#af101a]">cloud_upload</span>
          <span>{uploading ? 'Processing Image...' : currentImageUrl ? 'Thay đổi ảnh nguyên liệu' : 'Chọn hoặc thả ảnh vào đây'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={onImageUpload}
          disabled={uploading}
        />
        <span className="text-[10px] text-[#8f6f6c] mt-1 text-center">
          Kéo thả trực tiếp file hoặc click chọn (JPG, PNG, WEBP)
        </span>
      </div>

      {/* Settings Column */}
      <div className="md:col-span-7 space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <div>
            <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1 whitespace-nowrap">
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
              className="w-full px-3 py-1.5 rounded-lg border border-[#eae8e5] bg-white text-xs font-semibold text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
            />
            <span className="text-[10px] text-[#8f6f6c] block mt-1 whitespace-nowrap">
              Thứ tự xuất hiện trên trang chủ (1-4)
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1 whitespace-nowrap">
              Active Status
            </label>
            <div className="h-[34px] px-3 py-1.5 rounded-lg border border-[#eae8e5] bg-white flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1b1c1a] whitespace-nowrap">
                {formData.isActive ? (
                  <span className="text-emerald-700 font-bold">Active on Home</span>
                ) : (
                  <span className="text-gray-500 font-medium">Hidden</span>
                )}
              </span>
              <label className="relative inline-flex items-center cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    onFormDataChange((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:bg-[#af101a]"></div>
              </label>
            </div>
            <span className="text-[10px] text-[#8f6f6c] block mt-1 whitespace-nowrap truncate">
              {formData.isActive ? 'Hiển thị trên phần nguyên liệu' : 'Đang ẩn khỏi trang chủ'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

