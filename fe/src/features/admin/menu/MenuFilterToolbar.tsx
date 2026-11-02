import React from 'react';
import { MenuCategory } from '@/types';

interface MenuFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedActive: string;
  onActiveChange: (active: string) => void;
  categories?: MenuCategory[];
}

export const MenuFilterToolbar: React.FC<MenuFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedActive,
  onActiveChange,
  categories = [],
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded border border-[#eae8e5] shadow-xs">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
          Search
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none select-none flex items-center justify-center leading-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by EN, KO, VI, JA or ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
          Category Filter
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] cursor-pointer"
        >
          <option value="">All Categories</option>
          {/* Temporary placeholder if selectedCategory is loaded from session before categories finish fetching */}
          {selectedCategory &&
            !categories.some((c) => (c.code || c.id) === selectedCategory) &&
            !['japanese', 'korean', 'curry', 'noodles', 'addons', 'sauces', 'drinks'].includes(selectedCategory) && (
              <option value={selectedCategory}>{selectedCategory}</option>
            )}
          {categories.length > 0 ? (
            categories.map((c) => (
              <option key={c.id} value={c.code || c.id}>
                {c.name} ({c.code})
              </option>
            ))
          ) : (
            <>
              <option value="japanese">Japanese Tonkatsu</option>
              <option value="korean">Korean Retro Tonkatsu</option>
              <option value="curry">Curry Rice</option>
              <option value="noodles">Artisan Noodles</option>
              <option value="addons">Atelier Add-ons</option>
              <option value="sauces">Signature Sauces</option>
              <option value="drinks">Beverages &amp; Craft</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
          Visibility Status
        </label>
        <select
          value={selectedActive}
          onChange={(e) => onActiveChange(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] cursor-pointer"
        >
          <option value="all">All Items (Active + Inactive)</option>
          <option value="active">Active Only (Visible to Diners)</option>
          <option value="inactive">Inactive Only (Hidden)</option>
        </select>
      </div>
    </div>
  );
};
