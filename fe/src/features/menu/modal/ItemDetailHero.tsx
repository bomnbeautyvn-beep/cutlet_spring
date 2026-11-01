import React from 'react';
import { MenuItem } from '@/types';

interface ItemDetailHeroProps {
  item: MenuItem;
}

export const ItemDetailHero: React.FC<ItemDetailHeroProps> = ({ item }) => {
  const hasImage = Boolean(
    item.image &&
      (item.image.startsWith('/images/menu/') ||
        item.image.startsWith('http://') ||
        item.image.startsWith('https://') ||
        item.image.startsWith('/'))
  );

  return (
    <div className="relative w-full h-56 sm:h-64 bg-[#efeeeb] shrink-0 flex items-center justify-center overflow-hidden">
      {hasImage ? (
        <img
          src={item.image}
          alt={item.nameEn || item.nameKr}
          className="w-full h-full object-cover"
          style={{ objectPosition: item.imagePosition || 'center 60%' }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
          <span className="material-symbols-outlined text-4xl text-[#c2bfb8]">restaurant</span>
          <span className="font-menu-bar text-xs uppercase tracking-widest text-[#8f6f6c] font-bold">
            Atelier Presentation
          </span>
        </div>
      )}

      {/* Badges */}
      <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-2">
        {item.isChefSignature && (
          <span className="bg-[#af101a] text-white font-label-md text-[11px] uppercase px-2.5 py-0.5 tracking-wider font-bold shadow-xs">
            Chef Signature
          </span>
        )}
        {item.isBestSeller && !item.isChefSignature && (
          <span className="bg-[#feae2c] text-[#291800] font-label-md text-[11px] uppercase px-2.5 py-0.5 tracking-wider font-bold shadow-xs">
            Best Seller
          </span>
        )}
        {item.isLimited && (
          <span className="bg-[#5b403d] text-white font-label-md text-[11px] uppercase px-2.5 py-0.5 tracking-wider font-bold shadow-xs">
            Limited Daily Batch
          </span>
        )}
        {item.prepTimeMinutes && (
          <span className="bg-white/90 text-[#1b1c1a] font-label-md text-[11px] uppercase px-2 py-0.5 tracking-wider font-semibold shadow-xs">
            {item.prepTimeMinutes} MIN PREP
          </span>
        )}
      </div>
    </div>
  );
};

