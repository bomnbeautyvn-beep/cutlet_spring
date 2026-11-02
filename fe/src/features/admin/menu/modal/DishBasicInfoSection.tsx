import React from 'react';
import { MenuCategory } from '@/types';

interface DishBasicInfoSectionProps {
  id: string;
  onIdChange: (val: string) => void;
  isEditing: boolean;
  categoryId: string;
  onCategoryChange: (val: string) => void;
  categories: MenuCategory[];
  active: boolean;
  onActiveChange: (val: boolean) => void;
}

export const DishBasicInfoSection: React.FC<DishBasicInfoSectionProps> = ({
  id,
  onIdChange,
  isEditing,
  categoryId,
  onCategoryChange,
  categories,
  active,
  onActiveChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#eae8e5]">
        <div>
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-[#1b1c1a]">
            Basic Information
          </h3>
          <p className="text-[11px] sm:text-xs text-[#585757]">
            System identifier slug, menu catalog category assignment, and public dining visibility
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-start">
        {/* Identifier / Slug */}
        <div>
          <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1 whitespace-nowrap">
            Identifier (Slug / ID) *
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => onIdChange(e.target.value)}
            disabled={isEditing}
            placeholder="e.g. spring-signature-set"
            className="w-full px-3 py-1.5 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs font-mono text-[#1b1c1a] focus:outline-none focus:border-[#af101a] disabled:opacity-60 disabled:bg-gray-100 cursor-text"
            required
          />
          <span className="text-[10px] text-[#8f6f6c] block mt-1 whitespace-nowrap truncate">
            {isEditing ? 'ID cannot be changed after creation' : 'Unique URL slug (auto-generated if blank)'}
          </span>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1 whitespace-nowrap">
            Menu Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold text-[#1b1c1a] focus:outline-none focus:border-[#af101a] cursor-pointer"
            required
          >
            {categoryId && !categories.some((c) => (c.code || c.id) === categoryId) && (
              <option value={categoryId}>{categoryId}</option>
            )}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.code || cat.id}>
                {cat.name} ({cat.code})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-[#8f6f6c] block mt-1 whitespace-nowrap">
            Loaded dynamically from backend categories
          </span>
        </div>

        {/* Visibility on Public Menu */}
        <div>
          <label className="block text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1 whitespace-nowrap">
            Public Menu Visibility
          </label>
          <div className="flex items-center gap-2.5 pt-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => onActiveChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:bg-[#af101a]"></div>
            </label>
            <span className="text-xs font-semibold text-[#1b1c1a] whitespace-nowrap">
              {active ? (
                <span className="text-emerald-700 font-bold">Active (Visible)</span>
              ) : (
                <span className="text-gray-500">Draft (Hidden)</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
