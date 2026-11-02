import React from 'react';

interface DishBadgesGroupProps {
  isChefSignature: boolean;
  onChefSignatureChange: (val: boolean) => void;
  isBestSeller: boolean;
  onBestSellerChange: (val: boolean) => void;
  isLimited: boolean;
  onLimitedChange: (val: boolean) => void;
  isSpicy: boolean;
  onSpicyChange: (val: boolean) => void;
}

export const DishBadgesGroup: React.FC<DishBadgesGroupProps> = ({
  isChefSignature,
  onChefSignatureChange,
  isBestSeller,
  onBestSellerChange,
  isLimited,
  onLimitedChange,
  isSpicy,
  onSpicyChange,
}) => {
  return (
    <div className="p-3.5 sm:p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
          Atelier Badges &amp; Dining Attributes
        </span>
        <span className="text-[10px] text-[#8f6f6c]">
          Huy hiệu nổi bật và thuộc tính phục vụ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        {/* Chef Signature */}
        <label
          className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
            isChefSignature
              ? 'bg-red-50/90 border-[#af101a] text-[#af101a] shadow-2xs ring-1 ring-[#af101a]/20'
              : 'bg-white border-[#eae8e5] text-[#1b1c1a] hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={isChefSignature}
            onChange={(e) => onChefSignatureChange(e.target.checked)}
            className="w-4 h-4 rounded text-[#af101a] accent-[#af101a] shrink-0"
          />
          <div className="min-w-0">
            <span className="font-semibold block truncate">Chef Signature</span>
            <span className="text-[10px] opacity-75 block truncate">Món bếp trưởng đề xuất</span>
          </div>
        </label>

        {/* Best Seller */}
        <label
          className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
            isBestSeller
              ? 'bg-amber-50/90 border-[#feae2c] text-[#b45309] shadow-2xs ring-1 ring-[#feae2c]/20'
              : 'bg-white border-[#eae8e5] text-[#1b1c1a] hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => onBestSellerChange(e.target.checked)}
            className="w-4 h-4 rounded text-[#feae2c] accent-[#feae2c] shrink-0"
          />
          <div className="min-w-0">
            <span className="font-semibold block truncate">Best Seller</span>
            <span className="text-[10px] opacity-75 block truncate">Món bán chạy nhất</span>
          </div>
        </label>

        {/* Limited Batch */}
        <label
          className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
            isLimited
              ? 'bg-zinc-100 border-zinc-800 text-zinc-900 shadow-2xs ring-1 ring-zinc-800/20'
              : 'bg-white border-[#eae8e5] text-[#1b1c1a] hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={isLimited}
            onChange={(e) => onLimitedChange(e.target.checked)}
            className="w-4 h-4 rounded text-zinc-800 accent-zinc-800 shrink-0"
          />
          <div className="min-w-0">
            <span className="font-semibold block truncate">Limited Batch</span>
            <span className="text-[10px] opacity-75 block truncate">Phục vụ giới hạn/ngày</span>
          </div>
        </label>

        {/* Spicy Glaze */}
        <label
          className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
            isSpicy
              ? 'bg-rose-50/90 border-rose-600 text-rose-700 shadow-2xs ring-1 ring-rose-600/20'
              : 'bg-white border-[#eae8e5] text-[#1b1c1a] hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={isSpicy}
            onChange={(e) => onSpicyChange(e.target.checked)}
            className="w-4 h-4 rounded text-rose-600 accent-rose-600 shrink-0"
          />
          <div className="min-w-0">
            <span className="font-semibold block truncate">Spicy Glaze</span>
            <span className="text-[10px] opacity-75 block truncate">Vị cay đậm đà</span>
          </div>
        </label>
      </div>
    </div>
  );
};
