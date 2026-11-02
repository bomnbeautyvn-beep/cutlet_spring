import React from 'react';
import { RestaurantSettings } from '@/services/admin.service';

interface RestaurantProfileTabProps {
  formData: Partial<RestaurantSettings>;
  onChange: (field: keyof RestaurantSettings, value: any) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RestaurantProfileTab: React.FC<RestaurantProfileTabProps> = ({
  formData,
  onChange,
  onLogoUpload,
}) => {
  return (
    <div className="space-y-6">
      {/* Cloudinary Atelier Logo Upload */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs">
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

      {/* Names in 4 Languages */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Restaurant Name in 4 Mandatory Languages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              English Name (EN) *
            </label>
            <input
              type="text"
              value={formData.nameEn || ''}
              onChange={(e) => onChange('nameEn', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              한국어 상호 (KO) *
            </label>
            <input
              type="text"
              value={formData.nameKr || ''}
              onChange={(e) => onChange('nameKr', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Tên Nhà Hàng (VI) *
            </label>
            <input
              type="text"
              value={formData.nameVi || ''}
              onChange={(e) => onChange('nameVi', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              店舗名 (JA) *
            </label>
            <input
              type="text"
              value={formData.nameJp || ''}
              onChange={(e) => onChange('nameJp', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>
      </div>

      {/* Slogans in 4 Languages */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Atelier Slogan / Headline in 4 Languages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Slogan (EN)
            </label>
            <input
              type="text"
              value={formData.sloganEn || ''}
              onChange={(e) => onChange('sloganEn', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              슬로건 (KO)
            </label>
            <input
              type="text"
              value={formData.sloganKr || ''}
              onChange={(e) => onChange('sloganKr', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Khẩu hiệu (VI)
            </label>
            <input
              type="text"
              value={formData.sloganVi || ''}
              onChange={(e) => onChange('sloganVi', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              キャッチコピー (JA)
            </label>
            <input
              type="text"
              value={formData.sloganJp || ''}
              onChange={(e) => onChange('sloganJp', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>
      </div>

      {/* Addresses in 4 Languages & Contact */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Contact &amp; Physical Address (4 Languages)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Telephone Direct Line *
            </label>
            <input
              type="text"
              value={formData.phoneNumber || ''}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Address (EN) *
            </label>
            <input
              type="text"
              value={formData.addressEn || ''}
              onChange={(e) => onChange('addressEn', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              주소 (KO) *
            </label>
            <input
              type="text"
              value={formData.addressKr || ''}
              onChange={(e) => onChange('addressKr', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Địa chỉ (VI) *
            </label>
            <input
              type="text"
              value={formData.addressVi || ''}
              onChange={(e) => onChange('addressVi', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              住所 (JA) *
            </label>
            <input
              type="text"
              value={formData.addressJp || ''}
              onChange={(e) => onChange('addressJp', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

