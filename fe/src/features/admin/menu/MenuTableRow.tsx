import React from 'react';
import { MenuItem } from '@/types';

interface MenuTableRowProps {
  dish: MenuItem;
  isToggling: boolean;
  onToggleStatus: (dish: MenuItem) => void;
  onEdit: (dish: MenuItem) => void;
  onDelete: (dish: MenuItem) => void;
}

export const MenuTableRow: React.FC<MenuTableRowProps> = ({
  dish,
  isToggling,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isActive = dish.active !== false;

  const hasImage = Boolean(
    dish.image &&
      (dish.image.startsWith('http://') ||
        dish.image.startsWith('https://') ||
        dish.image.startsWith('//'))
  );

  return (
    <tr
      className={`hover:bg-[#fbf9f6] transition-colors ${
        !isActive ? 'opacity-60 bg-gray-50/50' : ''
      }`}
    >
      {/* Dish Preview & 4-Language Name Stack */}
      <td className="py-3 px-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#f5f3f0] overflow-hidden shrink-0 border border-[#eae8e5] flex items-center justify-center mt-0.5">
            {hasImage ? (
              <img
                src={dish.image}
                alt={dish.nameEn}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-base text-[#c2bfb8]">
                restaurant
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-kr-serif text-xs text-[#af101a] font-bold">
                {dish.nameKr}
              </span>
              {dish.nameKrSubtitle && (
                <span className="text-[10px] text-[#8f6f6c]">
                  {dish.nameKrSubtitle}
                </span>
              )}
            </div>
            <span className="font-bold text-[#1b1c1a] text-sm block">
              {dish.nameEn}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-[#585757] mt-0.5">
              {dish.nameVi && <span>{dish.nameVi}</span>}
              {dish.nameVi && dish.nameJp && <span>•</span>}
              {dish.nameJp && <span className="font-jp-serif">{dish.nameJp}</span>}
            </div>
            <span className="text-[10px] text-[#8f6f6c] font-mono">
              {dish.id}
            </span>

            {/* Atelier Badges: Dynamic & Legacy Harmonized */}
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
              {dish.badges && dish.badges.length > 0 ? (
                dish.badges.map((b) => (
                  <span
                    key={b.id}
                    className="px-2 py-0.5 text-white text-[9px] font-bold uppercase rounded-md tracking-wider shadow-2xs flex items-center gap-1"
                    style={{ backgroundColor: b.badgeColor || '#af101a' }}
                  >
                    {b.icon && (
                      <span className="material-symbols-outlined text-[10px]">{b.icon}</span>
                    )}
                    <span>{b.name}</span>
                  </span>
                ))
              ) : (
                <>
                  {(dish.isChefSignature ?? dish.chefSignature) && (
                    <span className="px-2 py-0.5 bg-[#af101a] text-white text-[9px] font-bold uppercase rounded-md tracking-wider shadow-2xs">
                      Signature
                    </span>
                  )}
                  {(dish.isBestSeller ?? dish.bestSeller) && (
                    <span className="px-2 py-0.5 bg-[#feae2c] text-[#291800] text-[9px] font-bold uppercase rounded-md tracking-wider shadow-2xs">
                      Best Seller
                    </span>
                  )}
                  {(dish.isLimited ?? dish.limited) && (
                    <span className="px-2 py-0.5 bg-[#1b1c1a] text-white text-[9px] font-bold uppercase rounded-md tracking-wider shadow-2xs">
                      Limited
                    </span>
                  )}
                  {(dish.isSpicy ?? dish.spicy) && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase rounded-md tracking-wider shadow-2xs flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">local_fire_department</span>
                      <span>Spicy</span>
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-4">
        <span className="px-2.5 py-1 bg-[#f5f3f0] text-[#5b403d] rounded-md font-bold text-[11px] uppercase tracking-wider border border-[#eae8e5]">
          {dish.category}
        </span>
      </td>

      {/* Portions */}
      <td className="py-3 px-4 text-[#585757]">
        <div className="font-semibold text-[#1b1c1a]">{dish.portionEn || '—'}</div>
        <div className="text-[11px] text-[#8f6f6c]">{dish.portionVi || '—'}</div>
      </td>

      {/* Price */}
      <td className="py-3 px-4">
        <span className="font-price-numeral font-bold text-sm text-[#1b1c1a]">
          {dish.priceFormatted || `${dish.price}.000`}
        </span>
        <span className="text-[10px] text-[#8f6f6c] ml-1">VND</span>
      </td>

      {/* Interactive Toggle Switch */}
      <td className="py-3 px-4 text-center">
        <div className="inline-flex flex-col items-center gap-1">
          <button
            type="button"
            disabled={isToggling}
            onClick={() => onToggleStatus(dish)}
            title={
              isActive
                ? 'Click to hide dish from public menu'
                : 'Click to activate dish on public menu'
            }
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer disabled:opacity-50 ${
              isActive ? 'bg-emerald-600' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${
                isActive ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              isActive ? 'text-emerald-700' : 'text-zinc-400'
            }`}
          >
            {isToggling ? 'Syncing...' : isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(dish)}
            title="Edit Multilingual Dish & Cloudinary Asset"
            className="p-1.5 text-[#585757] hover:text-[#af101a] hover:bg-[#f5f3f0] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(dish)}
            title="Deactivate Dish"
            className="p-1.5 text-[#585757] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};
