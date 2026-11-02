import React from 'react';
import { HomepageHero, UpdateHomepageHeroRequest } from '@/types';

interface HeroVisualStatusCardProps {
  hero: HomepageHero | null;
  uploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: UpdateHomepageHeroRequest;
  onFormDataChange: (updater: (prev: UpdateHomepageHeroRequest) => UpdateHomepageHeroRequest) => void;
}

export const HeroVisualStatusCard: React.FC<HeroVisualStatusCardProps> = ({
  hero,
  uploading,
  onImageUpload,
  formData,
  onFormDataChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-4 flex flex-col items-center justify-center">
        <div className="w-full h-48 rounded-xl overflow-hidden bg-[#f3f1ec] border border-[#eae6df] relative flex items-center justify-center group">
          {hero?.imageUrl ? (
            <img src={hero.imageUrl} alt="Hero Visual" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-[#8f6f6c] gap-1">
              <span className="material-symbols-outlined text-[32px]">image</span>
              <span className="text-xs font-semibold">No Image Uploaded</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading to Cloudinary...
            </div>
          )}
        </div>

        <label className="mt-3 w-full py-2 px-3 border border-[#eae8e5] bg-[#f5f3f0] hover:bg-[#eae8e5] rounded-xl text-xs font-bold text-[#1b1c1a] text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs">
          <span className="material-symbols-outlined text-[16px] text-[#af101a]">cloud_upload</span>
          <span>{uploading ? 'Uploading...' : 'Replace Hero Visual'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="md:col-span-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
          <div>
            <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">Hero Section Status</h3>
            <p className="text-xs text-[#585757]">
              Control whether the Hero header is visible on the public dining site
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#af101a]"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              CTA Target Route (Đích đến khi bấm nút)
            </label>
            <div className="flex gap-2">
              <select
                value={['menu', 'about-us', 'reviews', 'location'].includes(formData.ctaTarget) ? formData.ctaTarget : 'custom'}
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    onFormDataChange((prev) => ({ ...prev, ctaTarget: e.target.value }));
                  }
                }}
                className="w-1/2 px-2.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-medium focus:outline-none focus:border-[#af101a] cursor-pointer"
              >
                <option value="menu">menu (Xem Thực Đơn)</option>
                <option value="about-us">about-us (Về Cutlet Spring)</option>
                <option value="reviews">reviews (Đánh Giá)</option>
                <option value="location">location (Bản Đồ)</option>
                <option value="custom">Tùy chỉnh...</option>
              </select>
              <input
                type="text"
                value={formData.ctaTarget}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, ctaTarget: e.target.value }))}
                placeholder="e.g. menu"
                className="w-1/2 px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-medium focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <span className="text-[10px] text-[#8f6f6c] mt-1 block">
              Mặc định: 'menu' để chuyển hướng sang thực đơn khi khách click nút kêu gọi
            </span>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Metric 1 (Wet Aging - Thời gian ủ thịt)
            </label>
            <input
              type="text"
              value={formData.metric1Value}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, metric1Value: e.target.value }))}
              placeholder="120h"
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-medium focus:outline-none focus:border-[#af101a]"
            />
            <span className="text-[10px] text-[#8f6f6c] mt-1 block">
              Hiển thị số liệu nổi bật ở góc dưới bên trái của khối Hero
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

