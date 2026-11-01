import React from 'react';
import { MenuItem } from '@/types';

interface DishImageFrameProps {
  item: MenuItem;
  isFeatured?: boolean;
}

const ITEM_OBJECT_POSITIONS: Record<string, string> = {
  'half-and-half-pork-cutlet': 'center 63%',
  'pork-tenderloin-cutlet-set': 'center 63%',
  'all-star-atelier-set': 'center 60%',
  'cheese-king-katsu': 'center 60%',
  'korean-style-retro-tonkatsu': 'center 60%',
  'pork-tenderloin-katsu-curry-rice': 'center 60%',
  'jjolmyeon-set-with-cutlet': 'center 60%',
};

export const DishImageFrame: React.FC<DishImageFrameProps> = ({ item, isFeatured }) => {
  const hasImage = Boolean(
    item.image &&
      (item.image.startsWith('/images/menu/') ||
        item.image.startsWith('http://') ||
        item.image.startsWith('https://') ||
        item.image.startsWith('/'))
  );
  const objectPosition = item.imagePosition || ITEM_OBJECT_POSITIONS[item.id] || 'center 60%';

  if (hasImage) {
    return (
      <div
        className={`relative w-full ${
          isFeatured ? 'h-60 sm:h-80 md:h-[400px]' : 'aspect-[4/3]'
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
            <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-[#835500]">
              schedule
            </span>
            <span>{item.prepTimeMinutes} min prep</span>
          </div>
        )}
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
          <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-[#835500]">
            schedule
          </span>
          <span>{item.prepTimeMinutes} min prep</span>
        </div>
      )}
    </div>
  );
};

