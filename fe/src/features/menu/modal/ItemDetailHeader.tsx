import React from 'react';
import { MenuItem } from '@/types';

interface ItemDetailHeaderProps {
  item: MenuItem;
}

export const ItemDetailHeader: React.FC<ItemDetailHeaderProps> = ({ item }) => {
  return (
    <div className="border-b border-[#eae8e5] pb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-kr-serif text-lg md:text-xl text-[#af101a] font-bold block">
            {item.nameKr}
            {item.nameKrSubtitle && (
              <span className="text-sm text-[#8f6f6c] font-normal ml-2">
                {item.nameKrSubtitle}
              </span>
            )}
          </span>
          <h2 className="font-headline-md text-xl md:text-2xl text-[#1b1c1a] font-bold mt-0.5">
            {item.nameEn}
          </h2>
          {item.nameVi && (
            <p className="font-body-md text-xs sm:text-sm text-[#5b403d] font-medium mt-0.5">
              {item.nameVi}
            </p>
          )}
          {item.nameJp && (
            <p className="font-jp-serif text-xs text-[#8f6f6c] mt-0.5">{item.nameJp}</p>
          )}
        </div>

        <div className="text-right shrink-0">
          <span className="font-price-numeral text-2xl md:text-3xl text-[#af101a] font-extrabold">
            {item.priceFormatted || `${item.price}.000`}
          </span>
          <span className="font-label-md text-xs text-[#585757] ml-1">VND</span>
        </div>
      </div>

      {(item.portionEn || item.portionKr || item.portionVi || item.portionJp) && (
        <div className="flex flex-wrap items-center gap-2 mt-2 px-2.5 py-1.5 bg-[#f5f3f0] text-[#5b403d] rounded-lg text-xs">
          <span className="material-symbols-outlined text-[15px] text-[#af101a]">room_service</span>
          {item.portionEn && <span className="font-semibold text-[#1b1c1a]">{item.portionEn}</span>}
          {item.portionKr && <span className="text-[#8f6f6c] font-kr-serif">• {item.portionKr}</span>}
          {item.portionVi && <span className="text-[#5b403d]">• {item.portionVi}</span>}
          {item.portionJp && <span className="text-[#8f6f6c] font-jp-serif">• {item.portionJp}</span>}
        </div>
      )}
    </div>
  );
};

