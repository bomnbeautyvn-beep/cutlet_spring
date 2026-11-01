import React from 'react';
import { MenuItem } from '@/types';
import { ItemDetailHero } from './modal/ItemDetailHero';
import { ItemDetailHeader } from './modal/ItemDetailHeader';
import { ItemDetailOptions } from './modal/ItemDetailOptions';

interface ItemDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#eae8e5] overflow-y-auto flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow text-[#1b1c1a] hover:bg-[#af101a] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Hero Frame */}
        <ItemDetailHero item={item} />

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Header Title Block */}
          <ItemDetailHeader item={item} />

          {/* Options, Sauces & Addons */}
          <ItemDetailOptions item={item} />

          {/* Close Action Button */}
          <div className="pt-3 border-t border-[#eae8e5]">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1b1c1a] hover:bg-[#333] text-white font-label-lg text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
