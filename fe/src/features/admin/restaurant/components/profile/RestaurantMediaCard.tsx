import React from 'react';
import { RestaurantSettings } from '@/services/admin.service';

interface RestaurantMediaCardProps {
  formData: Partial<RestaurantSettings>;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RestaurantMediaCard: React.FC<RestaurantMediaCardProps> = ({
  formData,
  onLogoUpload,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs">
      {/* Logo */}
      <div className="space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
          Atelier Logo (Cloudinary)
        </span>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-[#fbf9f6] border border-[#eae8e5] p-2 flex items-center justify-center shrink-0">
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-3xl text-gray-300">image</span>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={onLogoUpload}
              className="text-xs text-[#585757] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1b1c1a] file:text-white cursor-pointer"
            />
            <p className="text-[10px] text-[#8f6f6c] mt-1">Recommended transparent PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

