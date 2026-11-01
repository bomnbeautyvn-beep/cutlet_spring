import React from 'react';
import { Language, SaveIngredientRequest } from '@/types';

interface IngredientLanguageTabProps {
  activeLangTab: Language;
  onTabChange: (lang: Language) => void;
  formData: SaveIngredientRequest;
  onFormDataChange: (updater: (prev: SaveIngredientRequest) => SaveIngredientRequest) => void;
}

export const IngredientLanguageTab: React.FC<IngredientLanguageTabProps> = ({
  activeLangTab,
  onTabChange,
  formData,
  onFormDataChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-[#eae8e5]">
        <span className="text-xs font-bold text-[#5b403d] uppercase tracking-wider">
          Multilingual Content (4 Languages Mandatory)
        </span>
        <div className="inline-flex p-1 bg-[#f5f3f0] rounded-xl border border-[#eae8e5]">
          {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onTabChange(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === lang
                  ? 'bg-[#af101a] text-white shadow-xs'
                  : 'text-[#5b403d] hover:text-[#1b1c1a]'
              }`}
            >
              {lang === 'VI' && '🇻🇳 VI'}
              {lang === 'EN' && '🇺🇸 EN'}
              {lang === 'KR' && '🇰🇷 KR'}
              {lang === 'JP' && '🇯🇵 JA'}
            </button>
          ))}
        </div>
      </div>

      {/* Vietnamese */}
      {activeLangTab === 'VI' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">
              Tên Nguyên Liệu (VI) *
            </label>
            <input
              type="text"
              required
              value={formData.nameVi}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, nameVi: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="Thịt Heo Mát Ủ 120 Giờ"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">
              Tiêu Đề Phụ (Subtitle VI)
            </label>
            <input
              type="text"
              value={formData.subtitleVi || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, subtitleVi: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              placeholder="Tiêu chuẩn khắt khe cho từng thớ thịt"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">Mô Tả Chi Tiết (VI) *</label>
            <textarea
              rows={3}
              required
              value={formData.descriptionVi}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionVi: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="Mô tả kỹ thuật ủ thịt, độ ẩm và kết cấu thớ thịt..."
            />
          </div>
        </div>
      )}

      {/* English */}
      {activeLangTab === 'EN' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">
              Ingredient Name (EN) *
            </label>
            <input
              type="text"
              required
              value={formData.nameEn}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, nameEn: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="120-Hour Wet-Aged Pork"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">
              Subtitle (EN)
            </label>
            <input
              type="text"
              value={formData.subtitleEn || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, subtitleEn: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              placeholder="Precision aging discipline"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">
              Description (EN) *
            </label>
            <textarea
              rows={3}
              required
              value={formData.descriptionEn}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionEn: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="Detailed culinary notes on ingredient sourcing..."
            />
          </div>
        </div>
      )}

      {/* Korean */}
      {activeLangTab === 'KR' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">원재료명 (KR) *</label>
            <input
              type="text"
              required
              value={formData.nameKr}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, nameKr: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="120시간 저온 습식숙성 프리미엄 원육"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">부제 (KR)</label>
            <input
              type="text"
              value={formData.subtitleKr || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, subtitleKr: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              placeholder="엄선된 원육의 깊은 풍미"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">원재료 설명 (KR) *</label>
            <textarea
              rows={3}
              required
              value={formData.descriptionKr}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionKr: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="한국어로 원재료의 특징과 가공 과정을 설명하세요..."
            />
          </div>
        </div>
      )}

      {/* Japanese */}
      {activeLangTab === 'JP' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">素材名 (JA) *</label>
            <input
              type="text"
              required
              value={formData.nameJp}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, nameJp: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
              placeholder="120時間熟成チルドポーク"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">サブタイトル (JA)</label>
            <input
              type="text"
              value={formData.subtitleJp || ''}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, subtitleJp: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              placeholder="徹底した温度管理と熟成"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5b403d] mb-1">素材説明 (JA) *</label>
            <textarea
              rows={3}
              required
              value={formData.descriptionJp}
              onChange={(e) => onFormDataChange((prev) => ({ ...prev, descriptionJp: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="日本語で素材のこだわりを記述してください..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

