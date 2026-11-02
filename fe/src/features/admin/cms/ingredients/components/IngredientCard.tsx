import React from 'react';
import { Ingredient } from '@/types';

interface IngredientCardProps {
  ingredient: Ingredient;
  isBusy: boolean;
  onToggleStatus: (id: string) => void;
  onEdit: (item: Ingredient) => void;
  onDelete: (id: string, name: string) => void;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient: item,
  isBusy,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`flex flex-col justify-between rounded border bg-white p-5 shadow-xs transition-all duration-300 relative ${
        item.isActive ? 'border-[#eae8e5]' : 'border-gray-300 opacity-60 bg-gray-50'
      }`}
    >
      <div>
        {/* Visual Frame - 30% longer with subtle rounded corners */}
        <div className="w-full h-52 rounded overflow-hidden bg-[#f3f1ec] border border-[#eae6df] mb-4 relative flex items-center justify-center group shadow-2xs">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.nameEn}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-center text-[#8f6f6c] p-2">
              <span className="material-symbols-outlined text-[32px] block">image</span>
              <span className="text-[11px] font-semibold">No Image</span>
            </div>
          )}

          {/* Order Badge */}
          <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
            #{item.displayOrder}
          </div>

          {/* Status Pill */}
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                item.isActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-gray-200 text-gray-700 border border-gray-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-600' : 'bg-gray-400'}`}
              />
              {item.isActive ? 'Active' : 'Hidden'}
            </span>
          </div>
        </div>

        {/* Multilingual Titles */}
        <div className="space-y-1 pb-3 border-b border-[#eae8e5]">
          <h4 className="font-kr-serif text-base font-bold text-[#1b1c1a] leading-tight">
            {item.nameKr}
          </h4>
          <div className="font-menu-title text-xs font-bold text-[#af101a] uppercase tracking-wide">
            {item.nameEn}
          </div>
          <div className="text-xs text-[#585757] font-medium">
            {item.nameVi} · <span className="font-jp-serif">{item.nameJp}</span>
          </div>
        </div>

        {/* Subtitle */}
        {item.subtitleEn && (
          <div className="mt-2 text-[11px] font-bold text-[#835500]">
            {item.subtitleVi || item.subtitleEn}
          </div>
        )}

        {/* Description snippet */}
        <p className="mt-2 text-xs text-[#5b403d] leading-relaxed line-clamp-3">
          {item.descriptionVi || item.descriptionEn}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-[#eae8e5] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggleStatus(item.id)}
          disabled={isBusy}
          className={`text-[11px] font-bold px-2.5 py-1.5 rounded border transition-all cursor-pointer ${
            item.isActive
              ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
              : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          {isBusy ? '...' : item.isActive ? 'Hide' : 'Publish'}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 rounded text-[#5b403d] hover:bg-[#eae8e5] transition-colors cursor-pointer"
            title="Edit Ingredient"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id, item.nameEn)}
            disabled={isBusy}
            className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete Ingredient"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

