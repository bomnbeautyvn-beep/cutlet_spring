import React from 'react';
import { MenuItem } from '@/types';

interface DishCardProps {
  item: MenuItem;
  onSelectItem?: (item: MenuItem, initialOptions?: any) => void;
  isFeatured?: boolean;
}

// Focal point alignments shifted down 25% as requested to frame the main dish in front
const ITEM_OBJECT_POSITIONS: Record<string, string> = {
  'half-and-half-pork-cutlet': 'center 63%',
  'pork-tenderloin-cutlet-set': 'center 63%',
  'all-star-atelier-set': 'center 60%',
  'cheese-king-katsu': 'center 60%',
  'korean-style-retro-tonkatsu': 'center 60%',
  'pork-tenderloin-katsu-curry-rice': 'center 60%',
  'jjolmyeon-set-with-cutlet': 'center 60%',
};

export const DishCard: React.FC<DishCardProps> = ({ item, isFeatured, onSelectItem }) => {
  const hasImage = Boolean(
    item.image &&
      (item.image.startsWith('/images/menu/') ||
        item.image.startsWith('http://') ||
        item.image.startsWith('https://') ||
        item.image.startsWith('/'))
  );
  const objectPosition = item.imagePosition || ITEM_OBJECT_POSITIONS[item.id] || 'center 60%';

  return (
    <div
      onClick={() => onSelectItem?.(item)}
      className={`group flex flex-col justify-between h-full pb-4 cursor-pointer ${
        isFeatured ? 'col-span-1 md:col-span-2' : ''
      }`}
    >
      <div className="space-y-4">
        {/* Top Image Frame - Locked Height & Aspect Ratio across all cards, NO RADIUS */}
        {hasImage ? (
          <div
            className={`relative w-full ${
              isFeatured
                ? 'h-60 sm:h-80 md:h-[400px]'
                : 'aspect-[4/3]'
            } rounded-none overflow-hidden bg-[#efeeeb] shrink-0 border border-[#eae8e5]/80`}
          >
            <img
              src={item.image}
              alt={item.nameEn || item.nameKr}
              className="w-full h-full object-cover rounded-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              style={{ objectPosition }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            {item.isChefSignature && (
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#af101a] text-white font-label-md text-[11px] sm:text-xs uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 tracking-wider font-bold shadow-xs rounded-none">
                Chef Signature
              </div>
            )}
            {item.isBestSeller && !item.isChefSignature && (
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#feae2c] text-[#291800] font-label-md text-[11px] sm:text-xs uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 tracking-wider font-bold shadow-xs rounded-none">
                Best Seller
              </div>
            )}
            {item.isLimited && (
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#1b1c1a] text-white font-label-md text-[9px] sm:text-[10px] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 font-bold shadow-xs rounded-none">
                Limited Daily Batch
              </div>
            )}
            {item.prepTimeMinutes && (
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#1b1c1a] shadow-xs rounded-none flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-[#835500]">schedule</span>
                <span>{item.prepTimeMinutes} min prep</span>
              </div>
            )}
          </div>
        ) : (
          /* Locked Loading Placeholder for dishes without an image - guarantees titles stay horizontally aligned */
          <div
            className={`relative w-full ${
              isFeatured
                ? 'h-60 sm:h-80 md:h-[400px]'
                : 'aspect-[4/3]'
            } rounded-none overflow-hidden bg-[#f3f1ec] shrink-0 border border-[#eae6df] flex flex-col items-center justify-center select-none`}
          >
            {/* Shimmer pulse effect */}
            <div className="flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#d5cfc5] border-t-[#af101a] animate-spin" />
              <span className="font-menu-bar text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#8f6f6c]">
                Photo Loading...
              </span>
              <span className="font-kr-serif text-[10px] text-[#a89d91]">
                사진 준비 중
              </span>
            </div>

            {item.isChefSignature && (
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#af101a] text-white font-label-md text-[11px] sm:text-xs uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 tracking-wider font-bold shadow-xs rounded-none">
                Chef Signature
              </div>
            )}
            {item.isBestSeller && !item.isChefSignature && (
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#feae2c] text-[#291800] font-label-md text-[11px] sm:text-xs uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 tracking-wider font-bold shadow-xs rounded-none">
                Best Seller
              </div>
            )}
            {item.isLimited && (
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#1b1c1a] text-white font-label-md text-[9px] sm:text-[10px] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 font-bold shadow-xs rounded-none">
                Limited Daily Batch
              </div>
            )}
            {item.prepTimeMinutes && (
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#1b1c1a] shadow-xs rounded-none flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-[#835500]">schedule</span>
                <span>{item.prepTimeMinutes} min prep</span>
              </div>
            )}
          </div>
        )}

        {/* Title, Subtitles, Portion, Big Red Price (Order: Hàn -> Anh -> Việt -> Nhật) */}
        <div className="flex flex-row items-start justify-between gap-2.5 sm:gap-3 pb-3 border-b border-[#eae8e5]/70">
          <div className="space-y-1.5 min-w-0 flex-1">
            {/* 1. Korean Primary Title */}
            {item.nameKr && (
              <div>
                <h3 className={`font-kr-serif ${isFeatured ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-[26px]'} text-[#1b1c1a] font-black tracking-tight leading-snug group-hover:text-[#af101a] transition-colors`}>
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
              <div className={`font-menu-title ${isFeatured ? 'text-base sm:text-xl' : 'text-sm sm:text-[17px]'} text-[#1b1c1a] font-bold tracking-tight uppercase leading-snug`}>
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
                  <span className={`font-price-numeral ${isFeatured ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'} text-[#af101a] font-black tracking-tight leading-none`}>
                    {item.price}.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Language Description: Hàn -> Anh -> Việt -> Nhật */}
      {isFeatured ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-sm leading-relaxed pt-3">
          {item.descriptionKr && (
            <div className="font-kr-serif text-[#1b1c1a] text-xs sm:text-sm leading-relaxed text-left">
              {item.descriptionKr}
            </div>
          )}
          {item.descriptionEn && (
            <div className="font-body-md text-[#2b2b2b] text-xs sm:text-sm leading-relaxed text-left">
              {item.descriptionEn}
            </div>
          )}
          {item.descriptionVi && (
            <div className="font-body-md text-[#2b2b2b] text-xs sm:text-sm leading-relaxed text-left">
              {item.descriptionVi}
            </div>
          )}
          {item.descriptionJp && (
            <div className="font-jp-serif text-[#1b1c1a] text-xs sm:text-sm leading-relaxed text-left">
              {item.descriptionJp}
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:block space-y-1.5 text-xs sm:text-sm leading-relaxed pt-3">
          {item.descriptionKr && (
            <div className="font-kr-serif text-[#1b1c1a] text-xs sm:text-sm leading-relaxed text-left">
              {item.descriptionKr}
            </div>
          )}
          {item.descriptionEn && (
            <div className="font-body-md text-[#2b2b2b] text-xs sm:text-sm leading-relaxed text-left">
              {item.descriptionEn}
            </div>
          )}
          {item.descriptionVi && (
            <div className="font-body-md text-[#585757] text-xs sm:text-sm leading-relaxed text-left italic">
              {item.descriptionVi}
            </div>
          )}
          {item.descriptionJp && (
            <div className="font-jp-serif text-[#585757] text-xs sm:text-sm leading-relaxed text-left">
              {item.descriptionJp}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
