import React from 'react';
import { MenuItem } from '@/types';

interface ItemDetailHeroProps {
  item: MenuItem;
}

export const ItemDetailHero: React.FC<ItemDetailHeroProps> = ({ item }) => {
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

  return (
    <div className="relative w-full h-52 sm:h-64 bg-[#efeeeb] shrink-0 flex items-center justify-center overflow-hidden">
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

      {/* Badges Container - naturally wraps without horizontal overflow on 320px screens */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-none">
        {isChef && (
          <span className="bg-[#af101a] text-white font-label-md text-[10px] sm:text-[11px] uppercase px-2 sm:px-2.5 py-0.5 tracking-wider font-bold shadow-xs">
            Chef Signature
          </span>
        )}
        {isBest && !isChef && (
          <span className="bg-[#feae2c] text-[#291800] font-label-md text-[10px] sm:text-[11px] uppercase px-2 sm:px-2.5 py-0.5 tracking-wider font-bold shadow-xs">
            Best Seller
          </span>
        )}
        {isLim && (
          <span className="bg-[#1b1c1a] text-white font-label-md text-[10px] sm:text-[11px] uppercase px-2 sm:px-2.5 py-0.5 tracking-wider font-bold shadow-xs">
            Limited Daily Batch
          </span>
        )}
        {isSp && (
          <span className="bg-red-600 text-white font-label-md text-[10px] sm:text-[11px] uppercase px-2 sm:px-2.5 py-0.5 tracking-wider font-bold shadow-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
            <span>Spicy Glaze</span>
          </span>
        )}
        {item.prepTimeMinutes && item.prepTimeMinutes > 0 && (
          <span className="bg-white/95 backdrop-blur-xs text-[#1b1c1a] font-label-md text-[10px] sm:text-[11px] uppercase px-2 py-0.5 tracking-wider font-semibold shadow-xs">
            {item.prepTimeMinutes} MIN PREP
          </span>
        )}
      </div>
    </div>
  );
};
