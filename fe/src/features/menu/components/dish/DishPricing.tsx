import React from 'react';
import { MenuItem } from '@/types';

interface DishPricingProps {
  item: MenuItem;
  isFeatured?: boolean;
}

export const DishPricing: React.FC<DishPricingProps> = ({ item, isFeatured }) => {
  return (
    <div className="flex flex-col items-end justify-start gap-1 shrink-0 text-right">
      {(item.portionEn || item.portionVi) && (
        <div className="text-right text-xs sm:text-sm text-[#585757] leading-tight font-medium">
          {item.portionEn && <div className="font-semibold text-[#1b1c1a]">{item.portionEn}</div>}
          {item.portionVi && <div className="text-[11px] sm:text-xs text-[#585757]">{item.portionVi}</div>}
        </div>
      )}
      <div className="text-right">
        {item.sizes && item.sizes.length > 0 ? (
          <div className="flex flex-col items-end gap-1">
            {item.sizes.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-2 font-bold">
                {s.label === 'S' || s.label === 'L' ? (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-none bg-[#feae2c] text-[#291800] text-[10px] sm:text-[11px] font-black flex items-center justify-center shadow-xs">
                    {s.label}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-[#585757] font-semibold">{s.label}</span>
                )}
                <span className="font-price-numeral text-xl sm:text-3xl text-[#af101a] font-black leading-none">
                  {s.price}.
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <span
              className={`font-price-numeral ${
                isFeatured ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'
              } text-[#af101a] font-black tracking-tight leading-none`}
            >
              {item.price}.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

