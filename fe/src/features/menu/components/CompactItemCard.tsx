import React from 'react';
import { MenuItem } from '@/types';

interface CompactItemCardProps {
  item: MenuItem;
  onSelectItem?: (item: MenuItem) => void;
}

export const CompactItemCard: React.FC<CompactItemCardProps> = ({ item, onSelectItem }) => {
  const isBest = Boolean(item.isBestSeller ?? item.bestSeller);
  const isChef = Boolean(item.isChefSignature ?? item.chefSignature);

  const hasImage = Boolean(
    item.image &&
    (item.image.startsWith('/images/menu/') ||
      item.image.startsWith('http://') ||
      item.image.startsWith('https://') ||
      item.image.startsWith('/'))
  );

  return (
    <div
      onClick={() => onSelectItem?.(item)}
      className="group flex flex-col justify-between h-full pb-3 cursor-pointer"
    >
      <div className="space-y-2.5">
        {/* Top Image Frame - Locked Aspect Ratio & No Radius */}
        {hasImage ? (
          <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden bg-[#efeeeb] shrink-0 border border-[#eae8e5]/80">
            <img
              src={item.image}
              alt={item.nameEn || item.nameKr}
              className="w-full h-full object-cover rounded-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              style={{ objectPosition: item.imagePosition || 'center 60%' }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {item.tags && item.tags.length > 0 && (
              <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-black/75 backdrop-blur-xs text-white font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded-none font-semibold tracking-wider">
                {item.tags[0]}
              </div>
            )}
            {isChef ? (
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#af101a] text-white font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded-none font-bold shadow-xs">
                Signature
              </div>
            ) : isBest ? (
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#feae2c] text-[#291800] font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded-none font-bold shadow-xs">
                Best
              </div>
            ) : null}
          </div>
        ) : (
          /* Locked Loading Placeholder - Guarantees horizontal title alignment across the row */
          <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden bg-[#f3f1ec] shrink-0 border border-[#eae6df] flex flex-col items-center justify-center select-none">
            <div className="flex flex-col items-center justify-center gap-1.5 text-[#8f6f6c]">
              <div className="w-5 h-5 rounded-full border-2 border-[#d5cfc5] border-t-[#af101a] animate-spin" />
              <span className="font-menu-bar text-[10px] uppercase tracking-widest font-bold text-[#8f6f6c]">
                Photo Loading...
              </span>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-black/75 backdrop-blur-xs text-white font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded-none font-semibold tracking-wider">
                {item.tags[0]}
              </div>
            )}
            {isChef ? (
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#af101a] text-white font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded-none font-bold shadow-xs">
                Signature
              </div>
            ) : isBest ? (
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#feae2c] text-[#291800] font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded-none font-bold shadow-xs">
                Best
              </div>
            ) : null}
          </div>
        )}

        {/* Multilingual Titles */}
        <div className="space-y-1">
          {item.nameKr && (
            <h4 className="font-kr-serif text-base sm:text-lg text-[#1b1c1a] font-bold tracking-tight leading-snug group-hover:text-[#af101a] transition-colors">
              {item.nameKr}
            </h4>
          )}
          {item.nameEn && (
            <div className="font-menu-title text-xs sm:text-sm text-[#1b1c1a] font-bold uppercase tracking-tight">
              {item.nameEn}
            </div>
          )}
          {item.nameVi && (
            <div className="font-body-md text-[11px] sm:text-xs text-[#8f6f6c] italic">
              {item.nameVi}
            </div>
          )}
          {item.nameJp && (
            <div className="font-jp-serif text-[11px] sm:text-xs text-[#585757]">
              {item.nameJp}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price */}
      <div className="pt-2 mt-2 flex items-baseline justify-end border-t border-[#eae8e5]/60">
        <div className="text-right">
          <span className="font-price-numeral text-xl sm:text-2xl text-[#af101a] font-black leading-none">
            {item.price}.
          </span>
        </div>
      </div>
    </div>
  );
};
