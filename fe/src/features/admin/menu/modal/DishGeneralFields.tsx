import React from 'react';
import { DishCategory } from '@/types';

interface DishGeneralFieldsProps {
  id: string;
  onIdChange: (val: string) => void;
  isEditing: boolean;
  categoryId: DishCategory;
  onCategoryChange: (cat: DishCategory) => void;
  basePrice: number;
  onBasePriceChange: (val: number) => void;
  prepTimeMinutes: number;
  onPrepTimeChange: (val: number) => void;
  isChefSignature: boolean;
  onChefSignatureChange: (val: boolean) => void;
  isBestSeller: boolean;
  onBestSellerChange: (val: boolean) => void;
  isLimited: boolean;
  onLimitedChange: (val: boolean) => void;
  isSpicy: boolean;
  onSpicyChange: (val: boolean) => void;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  active: boolean;
  onActiveChange: (val: boolean) => void;
  sizes?: Array<{ id?: string; label: string; price: number; displayOrder?: number }>;
  onAddSize?: (label?: string, price?: number) => void;
  onRemoveSize?: (index: number) => void;
  onUpdateSize?: (index: number, field: 'label' | 'price', value: string | number) => void;
}

export const DishGeneralFields: React.FC<DishGeneralFieldsProps> = ({
  id,
  onIdChange,
  isEditing,
  categoryId,
  onCategoryChange,
  basePrice,
  onBasePriceChange,
  prepTimeMinutes,
  onPrepTimeChange,
  isChefSignature,
  onChefSignatureChange,
  isBestSeller,
  onBestSellerChange,
  isLimited,
  onLimitedChange,
  isSpicy,
  onSpicyChange,
  imagePreview,
  onFileChange,
  active,
  onActiveChange,
  sizes,
  onAddSize,
  onRemoveSize,
  onUpdateSize,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
            Identifier (Slug / ID)
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => onIdChange(e.target.value)}
            disabled={isEditing}
            placeholder="e.g. pork-tenderloin-cutlet-set"
            className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a] disabled:opacity-60"
          />
          <span className="text-[10px] text-[#8f6f6c]">
            {isEditing ? 'Immutable once created' : 'Leave empty to auto-slugify English title'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
            Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value as DishCategory)}
            className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
          >
            <option value="japanese">Japanese Tonkatsu</option>
            <option value="korean">Korean Retro Tonkatsu</option>
            <option value="curry">Curry Rice</option>
            <option value="noodles">Artisan Noodles</option>
            <option value="addons">Atelier Add-ons</option>
            <option value="sauces">Signature Sauces</option>
            <option value="drinks">Beverages &amp; Craft</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
            Base Price (Thousands VND) *
          </label>
          <div className="relative">
            <input
              type="number"
              value={basePrice}
              onChange={(e) => onBasePriceChange(Number(e.target.value))}
              min={0}
              className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
            <span className="absolute right-3 top-2.5 text-xs text-[#8f6f6c] font-bold">
              .000 VND
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
            Prep Time (Minutes)
          </label>
          <input
            type="number"
            value={prepTimeMinutes}
            onChange={(e) => onPrepTimeChange(Number(e.target.value))}
            min={1}
            className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
          />
        </div>
      </div>

      {/* Portion Sizes & Tiered Pricing Section */}
      <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
              Portion Sizes &amp; Pricing (Khẩu phần &amp; Giá theo Size)
            </span>
            <span className="text-[11px] text-[#8f6f6c]">
              Optional: Add different sizes (e.g. Regular, Large, 200g, Set 2 người) with specific prices
            </span>
          </div>
          {onAddSize && (
            <button
              type="button"
              onClick={() => onAddSize('', basePrice)}
              className="px-3 py-1.5 bg-white hover:bg-[#eae8e5] text-[#af101a] border border-[#eae8e5] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Size</span>
            </button>
          )}
        </div>

        {sizes && sizes.length > 0 ? (
          <div className="space-y-2.5">
            {sizes.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#eae8e5] shadow-2xs">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase text-[#8f6f6c] mb-0.5">
                    Size Name / Label
                  </label>
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => onUpdateSize && onUpdateSize(idx, 'label', e.target.value)}
                    placeholder="e.g. Standard, Large, 200g, Set 2 người"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div className="w-36">
                  <label className="block text-[10px] font-bold uppercase text-[#8f6f6c] mb-0.5">
                    Price (.000 VND)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={s.price}
                      onChange={(e) => onUpdateSize && onUpdateSize(idx, 'price', Number(e.target.value))}
                      min={0}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a]"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-[#8f6f6c] font-bold">
                      k
                    </span>
                  </div>
                </div>
                {onRemoveSize && (
                  <button
                    type="button"
                    onClick={() => onRemoveSize(idx)}
                    title="Remove size option"
                    className="mt-4 p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-[#8f6f6c] italic">
            No size tiers added. Orders will use the single Base Price above ({basePrice}.000 VND).
          </div>
        )}
      </div>

      {/* Badges & Special Attributes */}
      <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
          Atelier Badges &amp; Dining Attributes
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isChefSignature}
              onChange={(e) => onChefSignatureChange(e.target.checked)}
              className="rounded text-[#af101a]"
            />
            <span className="font-semibold text-[#1b1c1a]">Chef Signature</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => onBestSellerChange(e.target.checked)}
              className="rounded text-[#feae2c]"
            />
            <span className="font-semibold text-[#1b1c1a]">Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isLimited}
              onChange={(e) => onLimitedChange(e.target.checked)}
              className="rounded text-zinc-800"
            />
            <span className="font-semibold text-[#1b1c1a]">Limited Batch</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSpicy}
              onChange={(e) => onSpicyChange(e.target.checked)}
              className="rounded text-red-600"
            />
            <span className="font-semibold text-[#1b1c1a]">Spicy Glaze</span>
          </label>
        </div>
      </div>

      {/* Image Upload directly to Cloudinary */}
      <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
          Photo &amp; Cloudinary Asset
        </span>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-white border border-[#eae8e5] overflow-hidden shrink-0 flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-2xl text-gray-300">image</span>
            )}
          </div>
          <div className="space-y-1.5 flex-1">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onFileChange}
              className="text-xs text-[#585757] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#af101a] file:text-white file:cursor-pointer cursor-pointer"
            />
            <p className="text-[10px] text-[#8f6f6c]">
              PNG, JPG, WebP up to 10MB. Uploads directly to Cloudinary storage.
            </p>
          </div>
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
        <div>
          <div className="text-xs font-bold text-emerald-900">
            Visibility on Public Menu
          </div>
          <div className="text-[11px] text-emerald-700">
            When active, dish is live and orderable on the customer website
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => onActiveChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>
    </div>
  );
};

