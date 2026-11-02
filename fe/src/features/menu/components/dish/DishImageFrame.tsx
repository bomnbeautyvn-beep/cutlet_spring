import React from 'react';
import { MenuItem } from '@/types';

interface DishImageFrameProps {
  item: MenuItem;
  isFeatured?: boolean;
}

export const DishImageFrame: React.FC<DishImageFrameProps> = ({ item, isFeatured }) => {
  const isChef = Boolean(item.isChefSignature ?? item.chefSignature);
  const isBest = Boolean(item.isBestSeller ?? item.bestSeller);
  const isLim = Boolean(item.isLimited ?? item.limited);
  const isSp = Boolean(item.isSpicy ?? item.spicy);

  const hasImage = Boolean(
    item.image &&
      (item.image.startsWith('http://') ||
        item.image.startsWith('https://') ||
        item.image.startsWith('//'))
  );

  const objectPosition = item.imagePosition || 'center 60%';

  const renderBadges = () => (
    <>
      {/* Top Left Badges */}
      {(isChef || isBest) && (
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1.5 max-w-[65%] z-10 pointer-events-none">
          {isChef && (
            <div className="bg-[#af101a] text-white font-label-md text-[10px] sm:text-xs uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-wider font-bold shadow-xs">
              Chef Signature
            </div>
          )}
          {isBest && !isChef && (
            <div className="bg-[#feae2c] text-[#291800] font-label-md text-[10px] sm:text-xs uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-wider font-bold shadow-xs">
              Best Seller
            </div>
          )}
        </div>
      )}

      {/* Top Right Badges */}
      {(isLim || isSp) && (
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex flex-wrap items-center justify-end gap-1.5 max-w-[45%] z-10 pointer-events-none">
          {isLim && (
            <div className="bg-[#1b1c1a] text-white font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold shadow-xs">
              Limited
            </div>
          )}
          {isSp && (
            <div className="bg-red-600 text-white font-label-md text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold shadow-xs flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[11px]">local_fire_department</span>
              <span>Spicy</span>
            </div>
          )}
        </div>
      )}

      {/* Prep Time Tag */}
      {item.prepTimeMinutes && item.prepTimeMinutes > 0 && (
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#1b1c1a] shadow-xs flex items-center gap-1 z-10 pointer-events-none">
          <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-[#835500]">
            schedule
          </span>
          <span>{item.prepTimeMinutes} min prep</span>
        </div>
      )}
    </>
  );

  if (hasImage) {
    return (
      <div
        className={`relative w-full ${
          isFeatured ? 'h-60 sm:h-80 md:h-[400px]' : 'aspect-[4/3]'
        } rounded-none overflow-hidden bg-[#eae8e5] shrink-0 border border-[#eae8e5]`}
      >
        <img
          src={item.image}
          alt={item.altText || item.nameEn || item.nameKr}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
          style={{ objectPosition }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {renderBadges()}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${
        isFeatured ? 'h-60 sm:h-80 md:h-[400px]' : 'aspect-[4/3]'
      } rounded-none overflow-hidden bg-[#f3f1ec] shrink-0 border border-[#eae6df] flex flex-col items-center justify-center select-none`}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#d5cfc5] border-t-[#af101a] animate-spin" />
        <span className="font-menu-bar text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#8f6f6c]">
          Photo Loading...
        </span>
        <span className="font-kr-serif text-[10px] text-[#a89d91]">사진 준비 중</span>
      </div>

      {renderBadges()}
    </div>
  );
};
