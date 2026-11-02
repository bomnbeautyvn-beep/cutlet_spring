import React, { useState, useRef } from 'react';

interface DishPricingAndImageSectionProps {
  basePrice: number;
  onBasePriceChange: (val: number) => void;
  prepTimeMinutes: number;
  onPrepTimeChange: (val: number) => void;
  hasSizes: boolean;
  onHasSizesChange: (val: boolean) => void;
  sizes: Array<{ id?: string; label: string; price: number; displayOrder?: number }>;
  onAddSize: (label?: string, price?: number) => void;
  onRemoveSize: (index: number) => void;
  onUpdateSize: (index: number, field: 'label' | 'price', val: string | number) => void;
  sizesError?: string;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropFile?: (file: File) => void;
  uploading?: boolean;
  uploadError?: string | null;
}

export const DishPricingAndImageSection: React.FC<DishPricingAndImageSectionProps> = ({
  basePrice,
  onBasePriceChange,
  prepTimeMinutes,
  onPrepTimeChange,
  hasSizes,
  onHasSizesChange,
  sizes,
  onAddSize,
  onRemoveSize,
  onUpdateSize,
  sizesError,
  imagePreview,
  onFileChange,
  onDropFile,
  uploading = false,
  uploadError,
}) => {
  const formattedVnd = (Number(basePrice) * 1000).toLocaleString('vi-VN') + ' VND';
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
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-3.5 sm:p-5 shadow-xs space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#eae8e5]">
        <div>
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-[#1b1c1a]">
            Pricing &amp; Image
          </h3>
          <p className="text-[11px] sm:text-xs text-[#585757]">
            Artisanal photo asset (Cloudinary), base dining pricing, and portion size variants
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Image Asset & Drag-and-Drop Cloudinary Upload */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`w-full aspect-[4/3] rounded-xl overflow-hidden relative flex items-center justify-center transition-all cursor-pointer group select-none ${
              isDragging
                ? 'border-2 border-dashed border-[#af101a] bg-[#af101a]/10 ring-4 ring-[#af101a]/20 scale-[1.01]'
                : 'bg-[#f3f1ec] border border-[#eae6df] hover:border-[#af101a]/60 hover:shadow-xs'
            }`}
            title="Click hoặc kéo thả ảnh món ăn vào đây"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Dish Visual"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div className="flex flex-col items-center text-[#8f6f6c] gap-1.5 p-4 text-center pointer-events-none">
                <span className="material-symbols-outlined text-[32px] sm:text-[36px] text-[#c2bfb8] group-hover:text-[#af101a] transition-colors">
                  add_photo_alternate
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8f6f6c] group-hover:text-[#1b1c1a] transition-colors">
                  Kéo thả ảnh hoặc click để chọn
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#a89d91]">JPG, PNG, WEBP (tối đa 10MB)</span>
              </div>
            )}

            {/* Dragging Active Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-2xs flex flex-col items-center justify-center text-[#af101a] gap-2 z-20 animate-fade-in pointer-events-none">
                <span className="material-symbols-outlined text-[42px] animate-bounce">
                  cloud_upload
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Thả ảnh vào đây để tải lên
                </span>
              </div>
            )}

            {/* Hover overlay when image exists and not dragging */}
            {imagePreview && !isDragging && !uploading && (
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] sm:text-xs font-bold gap-1 pointer-events-none">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                <span>Kéo thả hoặc click để đổi ảnh</span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-[11px] sm:text-xs font-bold gap-2 z-30 pointer-events-none">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading to Cloudinary...</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-2.5 sm:mt-3 w-full py-1.5 sm:py-2 px-3 border border-[#eae8e5] bg-[#f5f3f0] hover:bg-[#eae8e5] text-[11px] sm:text-xs font-bold text-[#1b1c1a] text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 rounded-lg shadow-2xs"
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#af101a]">cloud_upload</span>
            <span>{uploading ? 'Processing Image...' : imagePreview ? 'Thay đổi ảnh món ăn' : 'Chọn hoặc thả ảnh vào đây'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onFileChange}
            disabled={uploading}
          />
          <span className="text-[9px] sm:text-[10px] text-[#8f6f6c] mt-1 text-center">
            Kéo thả trực tiếp file hoặc click chọn (JPG, PNG, WEBP)
          </span>
          {uploadError && (
            <span className="text-[10px] sm:text-[11px] text-red-600 font-medium mt-1 text-center">
              {uploadError}
            </span>
          )}
        </div>

        {/* Right Column: Pricing, VND Display, Prep Time & Sizes */}
        <div className="md:col-span-7 space-y-3.5 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Base Price */}
            <div>
              <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Base Price (Thousands VND) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={basePrice || ''}
                  onChange={(e) => onBasePriceChange(Number(e.target.value))}
                  placeholder="e.g. 180"
                  className="w-full px-3 py-1.5 sm:py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
                <span className="absolute right-3 top-2 sm:top-2.5 text-[11px] sm:text-xs text-[#8f6f6c] font-medium pointer-events-none">
                  k VND
                </span>
              </div>
              <div className="mt-1 text-[11px] sm:text-xs text-[#af101a] font-price-numeral font-bold">
                = {formattedVnd}
              </div>
            </div>

            {/* Prep Time (No increase/decrease stepper, purely direct entry) */}
            <div>
              <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Prep Time (Minutes)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={prepTimeMinutes || ''}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    onPrepTimeChange(clean ? Number(clean) : 0);
                  }}
                  placeholder="15"
                  className="w-full px-3 py-1.5 sm:py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#af101a] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 top-2 sm:top-2.5 text-[11px] sm:text-xs text-[#8f6f6c] font-medium pointer-events-none">
                  min
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#8f6f6c] block mt-1">
                Thời gian chiên và chuẩn bị tại bếp
              </span>
            </div>
          </div>

          {/* Size-based Pricing Section */}
          <div className="pt-2.5 sm:pt-3 border-t border-[#eae8e5] space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                  Size-based Tiered Pricing
                </span>
                <p className="text-[10px] sm:text-[11px] text-[#585757]">
                  Tùy chọn kích cỡ (S/M/L hoặc Phần tiêu chuẩn / Phần lớn)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSizes}
                  onChange={(e) => onHasSizesChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:rounded-full after:transition-all peer-checked:bg-[#af101a]"></div>
              </label>
            </div>

            {hasSizes && (
              <div className="p-2.5 sm:p-3.5 bg-[#fbf9f6] border border-[#eae8e5] rounded-xl space-y-2">
                {sizesError && (
                  <p className="text-[11px] text-red-600 font-medium">{sizesError}</p>
                )}

                {sizes.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={s.label}
                      onChange={(e) => onUpdateSize(idx, 'label', e.target.value)}
                      placeholder="Size label (e.g. Size M, Phần lớn)"
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a]"
                    />
                    <div className="relative w-24 sm:w-28">
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={s.price || ''}
                        onChange={(e) => onUpdateSize(idx, 'price', Number(e.target.value))}
                        placeholder="Price"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded-lg font-semibold focus:outline-none focus:border-[#af101a]"
                      />
                      <span className="absolute right-2.5 top-1.5 text-[10px] text-gray-400">k</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveSize(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove size"
                    >
                      <span className="material-symbols-outlined text-[17px]">delete</span>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => onAddSize()}
                  className="w-full py-1.5 sm:py-2 border border-dashed border-[#eae8e5] hover:border-[#af101a] text-[#af101a] text-[11px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>Add Size Option</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
