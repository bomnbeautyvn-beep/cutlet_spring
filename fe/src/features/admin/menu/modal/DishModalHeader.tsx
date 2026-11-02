import React from 'react';
import { MenuItem } from '@/types';

interface DishModalHeaderProps {
  dish: MenuItem | null;
  isEditing: boolean;
  onClose: () => void;
}

export const DishModalHeader: React.FC<DishModalHeaderProps> = ({ dish, isEditing, onClose }) => {
  return (
    <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-[#eae8e5] bg-[#fbf9f6]">
      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-kr-serif text-[11px] sm:text-xs text-[#af101a] font-bold">봄돈까스</span>
          <span className="text-gray-300">•</span>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#585757]">
            {isEditing ? `Edit: ${dish?.id}` : 'New Atelier Dish'}
          </span>
        </div>
        <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#1b1c1a]">
          {isEditing ? `Edit "${dish?.nameEn || dish?.nameVi || dish?.id}"` : 'Add New Menu Item'}
        </h2>
      </div>
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#eae8e5] text-[#585757] hover:text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#eae8e5]"
      >
        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
      </button>
    </div>
  );
};
