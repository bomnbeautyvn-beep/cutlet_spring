import React from 'react';
import { MenuItem } from '@/types';

interface ItemDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const hasImage = Boolean(
    item.image &&
      (item.image.startsWith('/images/menu/') ||
        item.image.startsWith('http://') ||
        item.image.startsWith('https://') ||
        item.image.startsWith('/'))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#eae8e5] overflow-y-auto flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow text-[#1b1c1a] hover:bg-[#af101a] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Hero Frame */}
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

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Header Title Block */}
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
                  <p className="font-jp-serif text-xs text-[#8f6f6c] mt-0.5">
                    {item.nameJp}
                  </p>
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

          {/* Multilingual Descriptions in 4 Languages */}
          {(item.descriptionEn || item.descriptionKr || item.descriptionVi || item.descriptionJp) && (
            <div className="space-y-3">
              <span className="font-label-md text-xs uppercase tracking-wider text-[#585757] font-semibold block">
                Atelier Notes &amp; Multilingual Preparation
              </span>
              {item.descriptionEn && (
                <p className="font-body-md text-xs sm:text-sm text-[#3b3a38] leading-relaxed">
                  <span className="text-[10px] font-bold uppercase text-[#af101a] mr-1">[EN]</span>
                  {item.descriptionEn}
                </p>
              )}
              {item.descriptionKr && (
                <p className="font-kr-serif text-xs text-[#6e6b66] leading-relaxed">
                  <span className="text-[10px] font-bold uppercase text-[#af101a] mr-1">[KO]</span>
                  {item.descriptionKr}
                </p>
              )}
              {item.descriptionVi && (
                <p className="font-body-md text-xs text-[#5b403d] leading-relaxed italic">
                  <span className="text-[10px] font-bold uppercase text-[#af101a] mr-1 not-italic">[VI]</span>
                  {item.descriptionVi}
                </p>
              )}
              {item.descriptionJp && (
                <p className="font-jp-serif text-xs text-[#6e6b66] leading-relaxed">
                  <span className="text-[10px] font-bold uppercase text-[#af101a] mr-1">[JA]</span>
                  {item.descriptionJp}
                </p>
              )}
            </div>
          )}

          {/* Size Options if any */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="space-y-2">
              <span className="font-label-md text-xs uppercase tracking-wider text-[#585757] font-semibold block">
                Portion Sizes:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map((size) => (
                  <div
                    key={size.label}
                    className="p-2.5 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-[#1b1c1a]">Size {size.label}</span>
                    <span className="font-price-numeral font-bold text-[#af101a]">
                      {size.price}.000 VND
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sauces & Pairings */}
          {item.sauceOptions && item.sauceOptions.length > 0 && (
            <div className="space-y-2">
              <span className="font-label-md text-xs uppercase tracking-wider text-[#585757] font-semibold block">
                Signature Sauces & Dips:
              </span>
              <div className="flex flex-wrap gap-2">
                {item.sauceOptions.map((sauce) => (
                  <span
                    key={sauce}
                    className="px-3 py-1 bg-[#f5f3f0] border border-[#eae8e5] text-[#5b403d] text-xs rounded-full font-medium"
                  >
                    {sauce}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Addons / Pairings */}
          {item.addons && item.addons.length > 0 && (
            <div className="space-y-2">
              <span className="font-label-md text-xs uppercase tracking-wider text-[#585757] font-semibold block">
                Recommended Atelier Add-ons:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.addons.map((addon) => (
                  <div
                    key={addon.name}
                    className="p-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] flex items-center justify-between text-xs text-[#5b403d]"
                  >
                    <span>{addon.name}</span>
                    <span className="font-bold text-[#af101a]">+{addon.price}k</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Action Button */}
          <div className="pt-3 border-t border-[#eae8e5]">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1b1c1a] hover:bg-[#333] text-white font-label-lg text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
