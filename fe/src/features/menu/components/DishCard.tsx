import React from 'react';
import { MenuItem } from '@/types';
import { DishImageFrame } from './dish/DishImageFrame';
import { DishPricing } from './dish/DishPricing';
import { DishDescriptions } from './dish/DishDescriptions';

interface DishCardProps {
  item: MenuItem;
  onSelectItem?: (item: MenuItem, initialOptions?: any) => void;
  isFeatured?: boolean;
}

export const DishCard: React.FC<DishCardProps> = ({ item, isFeatured, onSelectItem }) => {
  return (
    <div
      onClick={() => onSelectItem?.(item)}
      className={`group flex flex-col justify-between h-full pb-4 cursor-pointer ${
        isFeatured ? 'col-span-1 md:col-span-2' : ''
      }`}
    >
      <div className="space-y-4">
        {/* Top Image Frame */}
        <DishImageFrame item={item} isFeatured={isFeatured} />

        {/* Title, Subtitles, Portion, Big Red Price (Order: Hàn -> Anh -> Việt -> Nhật) */}
        <div className="flex flex-row items-start justify-between gap-2.5 sm:gap-3 pb-3 border-b border-[#eae8e5]/70">
          <div className="space-y-1.5 min-w-0 flex-1">
            {/* 1. Korean Primary Title */}
            {item.nameKr && (
              <div>
                <h3
                  className={`font-kr-serif ${
                    isFeatured ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-[26px]'
                  } text-[#1b1c1a] font-black tracking-tight leading-snug group-hover:text-[#af101a] transition-colors`}
                >
                  {item.nameKr}
                </h3>
                {item.nameKrSubtitle && (
                  <div className="text-xs sm:text-sm text-[#585757] font-semibold tracking-normal mt-0.5">
                    {item.nameKrSubtitle}
                  </div>
                )}
              </div>
            )}

            {/* 2. English Subtitle */}
            {item.nameEn && (
              <div
                className={`font-menu-title ${
                  isFeatured ? 'text-base sm:text-xl' : 'text-sm sm:text-[17px]'
                } text-[#1b1c1a] font-bold tracking-tight uppercase leading-snug`}
              >
                {item.nameEn}
              </div>
            )}

            {/* 3. Vietnamese Subtitle */}
            {item.nameVi && (
              <div className="font-body-md text-xs sm:text-base text-[#8f6f6c] font-medium italic">
                {item.nameVi}
              </div>
            )}

            {/* 4. Japanese Subtitle */}
            {item.nameJp && (
              <div className="font-jp-serif text-xs sm:text-sm text-[#585757]">
                {item.nameJp}
              </div>
            )}
          </div>

          {/* Portions & Big Red Price */}
          <DishPricing item={item} isFeatured={isFeatured} />
        </div>
      </div>

      {/* 4-Language Description: Hàn -> Anh -> Việt -> Nhật */}
      <DishDescriptions item={item} isFeatured={isFeatured} />
    </div>
  );
};
