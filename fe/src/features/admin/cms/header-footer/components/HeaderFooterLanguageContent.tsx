import React from 'react';
import { Language, UpdateHeaderFooterRequest } from '@/types';

interface HeaderFooterLanguageContentProps {
  activeLangTab: Language;
  onTabChange: (lang: Language) => void;
  formData: UpdateHeaderFooterRequest;
  onFormDataChange: (updater: (prev: UpdateHeaderFooterRequest) => UpdateHeaderFooterRequest) => void;
}

export const HeaderFooterLanguageContent: React.FC<HeaderFooterLanguageContentProps> = ({
  activeLangTab,
  onTabChange,
  formData,
  onFormDataChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
        <div>
          <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
            Multilingual Policies &amp; Brand Descriptions
          </h3>
          <p className="text-xs text-[#585757]">
            Notice rules (1-dish requirement, VAT notice, takeout crispness) and copyright texts
          </p>
        </div>

        {/* Language Switcher */}
        <div className="inline-flex p-1 bg-[#f5f3f0] rounded-xl border border-[#eae8e5]">
          {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onTabChange(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === lang
                  ? 'bg-[#af101a] text-white shadow-xs'
                  : 'text-[#5b403d] hover:text-[#1b1c1a]'
              }`}
            >
              {lang === 'VI' && '🇻🇳 Tiếng Việt'}
              {lang === 'EN' && '🇺🇸 English'}
              {lang === 'KR' && '🇰🇷 한국어'}
              {lang === 'JP' && '🇯🇵 日本語'}
            </button>
          ))}
        </div>
      </div>

      {/* Vietnamese */}
      {activeLangTab === 'VI' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Tên Thương Hiệu (VI) *</label>
              <input
                type="text"
                value={formData.brandNameVi}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandNameVi: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Khẩu Hiệu / Slogan (VI)</label>
              <input
                type="text"
                value={formData.brandSloganVi || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandSloganVi: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">Đoạn Văn Giới Thiệu Chân Trang (Footer About VI)</label>
            <textarea
              rows={2}
              value={formData.footerAboutVi || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, footerAboutVi: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Chính Sách 1 Món / Khách (VI)</label>
              <input
                type="text"
                value={formData.policyOneDishVi || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyOneDishVi: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Quy Định Thuế VAT (VI)</label>
              <input
                type="text"
                value={formData.policyVatVi || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyVatVi: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Quy Định Đồ Mang Về (VI)</label>
              <input
                type="text"
                value={formData.policyTakeoutVi || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyTakeoutVi: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">Văn Bản Bản Quyền (Copyright Text VI)</label>
            <input
              type="text"
              value={formData.copyrightTextVi || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, copyrightTextVi: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>
      )}

      {/* English */}
      {activeLangTab === 'EN' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Brand Name (EN) *</label>
              <input
                type="text"
                value={formData.brandNameEn}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandNameEn: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Brand Slogan (EN)</label>
              <input
                type="text"
                value={formData.brandSloganEn || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandSloganEn: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">Footer About Description (EN)</label>
            <textarea
              rows={2}
              value={formData.footerAboutEn || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, footerAboutEn: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">One Main Dish Rule (EN)</label>
              <input
                type="text"
                value={formData.policyOneDishEn || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyOneDishEn: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">VAT Policy Notice (EN)</label>
              <input
                type="text"
                value={formData.policyVatEn || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyVatEn: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Takeout Packaging Policy (EN)</label>
              <input
                type="text"
                value={formData.policyTakeoutEn || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyTakeoutEn: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">Copyright Text (EN)</label>
            <input
              type="text"
              value={formData.copyrightTextEn || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, copyrightTextEn: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>
      )}

      {/* Korean */}
      {activeLangTab === 'KR' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">브랜드명 (KR) *</label>
              <input
                type="text"
                value={formData.brandNameKr}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandNameKr: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">브랜드 슬로건 (KR)</label>
              <input
                type="text"
                value={formData.brandSloganKr || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandSloganKr: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">푸터 브랜드 소개 (KR)</label>
            <textarea
              rows={2}
              value={formData.footerAboutKr || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, footerAboutKr: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">1인 1메뉴 정책 (KR)</label>
              <input
                type="text"
                value={formData.policyOneDishKr || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyOneDishKr: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">부가세 정책 안내 (KR)</label>
              <input
                type="text"
                value={formData.policyVatKr || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyVatKr: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">포장 정책 안내 (KR)</label>
              <input
                type="text"
                value={formData.policyTakeoutKr || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyTakeoutKr: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">저작권 표기 (KR)</label>
            <input
              type="text"
              value={formData.copyrightTextKr || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, copyrightTextKr: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>
      )}

      {/* Japanese */}
      {activeLangTab === 'JP' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">ブランド名 (JP) *</label>
              <input
                type="text"
                value={formData.brandNameJp}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandNameJp: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">スローガン (JP)</label>
              <input
                type="text"
                value={formData.brandSloganJp || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, brandSloganJp: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">フッター店舗紹介 (JP)</label>
            <textarea
              rows={2}
              value={formData.footerAboutJp || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, footerAboutJp: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">ワンオーダー制規約 (JP)</label>
              <input
                type="text"
                value={formData.policyOneDishJp || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyOneDishJp: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">VAT税規定 (JP)</label>
              <input
                type="text"
                value={formData.policyVatJp || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyVatJp: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">テイクアウト規定 (JP)</label>
              <input
                type="text"
                value={formData.policyTakeoutJp || ''}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, policyTakeoutJp: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">著作権表記 (JP)</label>
            <input
              type="text"
              value={formData.copyrightTextJp || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, copyrightTextJp: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

