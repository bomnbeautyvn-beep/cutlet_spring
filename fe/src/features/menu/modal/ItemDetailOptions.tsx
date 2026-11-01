import React from 'react';
import { MenuItem } from '@/types';

interface ItemDetailOptionsProps {
  item: MenuItem;
}

export const ItemDetailOptions: React.FC<ItemDetailOptionsProps> = ({ item }) => {
  return (
    <>
      {/* Multilingual Descriptions in 4 Languages */}
      {(item.descriptionEn ||
        item.descriptionKr ||
        item.descriptionVi ||
        item.descriptionJp) && (
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
              <span className="text-[10px] font-bold uppercase text-[#af101a] mr-1 not-italic">
                [VI]
              </span>
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
            Signature Sauces &amp; Dips:
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
    </>
  );
};

