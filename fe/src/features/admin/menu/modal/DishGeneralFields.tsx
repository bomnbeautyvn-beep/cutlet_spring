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

