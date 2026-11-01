import React from 'react';
import { HeaderFooterSettings, UpdateHeaderFooterRequest } from '@/types';

interface HeaderBrandingSectionProps {
  settings: HeaderFooterSettings | null;
  uploading: boolean;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: UpdateHeaderFooterRequest;
  onFormDataChange: (updater: (prev: UpdateHeaderFooterRequest) => UpdateHeaderFooterRequest) => void;
}

export const HeaderBrandingSection: React.FC<HeaderBrandingSectionProps> = ({
  settings,
  uploading,
  onLogoUpload,
  formData,
  onFormDataChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      {/* Logo Uploader */}
      <div className="md:col-span-4 flex flex-col items-center justify-center">
        <div className="w-full h-32 rounded-xl bg-[#fbf9f6] border border-[#eae8e5] p-4 flex items-center justify-center relative group">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Brand Logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-center text-[#8f6f6c]">
              <span className="material-symbols-outlined text-[32px] block">branding_watermark</span>
              <span className="text-xs font-semibold">No Logo Uploaded</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          )}
        </div>

        <label className="mt-3 w-full py-2 px-3 border border-[#eae8e5] bg-[#f5f3f0] hover:bg-[#eae8e5] rounded-xl text-xs font-bold text-[#1b1c1a] text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs">
          <span className="material-symbols-outlined text-[16px] text-[#af101a]">cloud_upload</span>
          <span>{uploading ? 'Uploading...' : 'Replace Brand Logo'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onLogoUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Hotline & Established Controls */}
      <div className="md:col-span-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Direct Hotline (Phone Number)
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-bold focus:outline-none focus:border-[#af101a]"
              placeholder="039 376 2717"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Established Year
            </label>
            <input
              type="text"
              value={formData.establishedYear}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, establishedYear: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="2023"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-[#f5f3f0] rounded-xl border border-[#eae8e5]">
          <div>
            <span className="text-xs font-bold text-[#1b1c1a] block">Show Hotline in Public Header</span>
            <span className="text-[11px] text-[#585757]">
              Displays direct phone call pill in the right corner of the navigation bar
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hotlineVisible}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, hotlineVisible: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#af101a]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

