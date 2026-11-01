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
    <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
      <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
        Atelier Badges &amp; Dining Attributes
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isChefSignature}
            onChange={(e) => onChefSignatureChange(e.target.checked)}
            className="rounded text-[#af101a]"
          />
          <span className="font-semibold text-[#1b1c1a]">Chef Signature</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => onBestSellerChange(e.target.checked)}
            className="rounded text-[#feae2c]"
          />
          <span className="font-semibold text-[#1b1c1a]">Best Seller</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isLimited}
            onChange={(e) => onLimitedChange(e.target.checked)}
            className="rounded text-zinc-800"
          />
          <span className="font-semibold text-[#1b1c1a]">Limited Batch</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSpicy}
            onChange={(e) => onSpicyChange(e.target.checked)}
            className="rounded text-red-600"
          />
          <span className="font-semibold text-[#1b1c1a]">Spicy Glaze</span>
        </label>
      </div>
    </div>
  );
};

