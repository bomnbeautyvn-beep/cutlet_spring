import React from 'react';
import { Language, UpdateHomepageHeroRequest } from '@/types';

interface HeroLanguageTabContentProps {
  activeLangTab: Language;
  onTabChange: (lang: Language) => void;
  formData: UpdateHomepageHeroRequest;
  onFormDataChange: (updater: (prev: UpdateHomepageHeroRequest) => UpdateHomepageHeroRequest) => void;
}

export const HeroLanguageTabContent: React.FC<HeroLanguageTabContentProps> = ({
  activeLangTab,
  onTabChange,
  formData,
  onFormDataChange,
}) => {
  return (
    <div className="bg-white rounded border border-[#eae8e5] p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
        <div>
          <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
            4-Language Content Configuration
          </h3>
          <p className="text-xs text-[#585757]">
            Configure headlines, subtitles, descriptions, and CTAs across all supported languages
          </p>
        </div>

        {/* Language Switcher Tabs */}
        <div className="inline-flex p-1 bg-[#f5f3f0] rounded border border-[#eae8e5]">
          {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onTabChange(lang)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
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

      {/* Dynamic Fields for Selected Language */}
      {activeLangTab === 'VI' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Tiêu Đề Chính (Headline)
            </label>
            <input
              type="text"
              value={formData.headlineVi}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, headlineVi: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="Nghệ Thuật Tonkatsu Thủ Công"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Tiêu Đề Phụ / Khẩu Hiệu (Title / Secondary)
            </label>
            <input
              type="text"
              value={formData.titleVi}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, titleVi: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="Tonkatsu Hoàng Kim Chiên Chuẩn Xác"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Khẩu Hiệu Nhỏ (Tagline)
            </label>
            <input
              type="text"
              value={formData.taglineVi}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, taglineVi: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="Nguyên liệu chuẩn mực và tinh thần nghệ nhân"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Đoạn Văn Giới Thiệu (Description)
            </label>
            <textarea
              rows={4}
              value={formData.descriptionVi}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionVi: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="Thịt heo mát ủ ẩm 120 giờ, bột chiên xù tươi tự nướng mỗi sáng..."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Nút Kêu Gọi Hành Động (CTA Button)
              </label>
              <input
                type="text"
                value={formData.ctaTextVi}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, ctaTextVi: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                placeholder="Xem Thực Đơn Đầy Đủ"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Nhãn Thống Kê 1 (120h)
              </label>
              <input
                type="text"
                value={formData.metric1LabelVi}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, metric1LabelVi: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                placeholder="Thịt heo mát ủ 120 giờ"
              />
            </div>
          </div>
        </div>
      )}

      {activeLangTab === 'EN' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Main Headline (EN)
            </label>
            <input
              type="text"
              value={formData.headlineEn}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, headlineEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="The Art of Hand Crafted Cutlets"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Secondary Title (EN)
            </label>
            <input
              type="text"
              value={formData.titleEn}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, titleEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="Precision Fried Golden Tonkatsu"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Tagline (EN)
            </label>
            <input
              type="text"
              value={formData.taglineEn}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, taglineEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="Uncompromising Ingredients and Craftsmanship"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Body Description (EN)
            </label>
            <textarea
              rows={4}
              value={formData.descriptionEn}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="120-hour wet-aged chilled pork, house-baked breadcrumbs..."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                CTA Button Label (EN)
              </label>
              <input
                type="text"
                value={formData.ctaTextEn}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, ctaTextEn: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                placeholder="Explore Full Menu"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Metric 1 Label (EN)
              </label>
              <input
                type="text"
                value={formData.metric1LabelEn}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, metric1LabelEn: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                placeholder="Wet-Aged Chilled Pork"
              />
            </div>
          </div>
        </div>
      )}

      {activeLangTab === 'KR' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              메인 헤드라인 (Headline KR)
            </label>
            <input
              type="text"
              value={formData.headlineKr}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, headlineKr: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="타협 없는 정통 기법의 황금빛 돈카츠"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              서브 타이틀 (Title KR)
            </label>
            <input
              type="text"
              value={formData.titleKr}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, titleKr: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="장인정신으로 빚어낸 수제 돈카츠의 미학"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              강조 문구 (Tagline KR)
            </label>
            <input
              type="text"
              value={formData.taglineKr}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, taglineKr: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="타협하지 않는 원재료와 장인정신"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              본문 설명 (Description KR)
            </label>
            <textarea
              rows={4}
              value={formData.descriptionKr}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionKr: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="120시간 저온 습식숙성 프리미엄 원육, 매일 새벽 직접 구워 분쇄한 생빵가루..."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                CTA 버튼 라벨 (KR)
              </label>
              <input
                type="text"
                value={formData.ctaTextKr}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, ctaTextKr: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                placeholder="전체 메뉴 보기"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                통계 1 라벨 (KR)
              </label>
              <input
                type="text"
                value={formData.metric1LabelKr}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, metric1LabelKr: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                placeholder="120시간 습식숙성 냉장육"
              />
            </div>
          </div>
        </div>
      )}

      {activeLangTab === 'JP' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              メイン見出し (Headline JA)
            </label>
            <input
              type="text"
              value={formData.headlineJp}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, headlineJp: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="職人技が光る手作りとんかつの真髄"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              サブタイトル (Title JA)
            </label>
            <input
              type="text"
              value={formData.titleJp}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, titleJp: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="黄金色に揚がる本格極上とんかつ"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              キャッチフレーズ (Tagline JA)
            </label>
            <input
              type="text"
              value={formData.taglineJp}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, taglineJp: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
              placeholder="厳選された素材と匠の技"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              説明文 (Description JA)
            </label>
            <textarea
              rows={4}
              value={formData.descriptionJp}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionJp: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="120時間熟成チルドポーク、毎朝焼き上げる自家製生パン粉..."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                CTA ボタン表示 (JA)
              </label>
              <input
                type="text"
                value={formData.ctaTextJp}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, ctaTextJp: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                placeholder="全メニューを見る"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                指標1ラベル (JA)
              </label>
              <input
                type="text"
                value={formData.metric1LabelJp}
                onChange={(e) => onFormDataChange((prev) => ({ ...prev, metric1LabelJp: e.target.value }))}
                className="w-full px-3.5 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                placeholder="120時間熟成チルドポーク"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

