import React from 'react';
import { Language } from '@/types';

interface DishMultilingualSectionProps {
  activeLang: Language;
  onActiveLangChange: (lang: Language) => void;
  // Vietnamese
  nameVi: string;
  onNameViChange: (val: string) => void;
  portionVi: string;
  onPortionViChange: (val: string) => void;
  descriptionVi: string;
  onDescriptionViChange: (val: string) => void;
  // English
  nameEn: string;
  onNameEnChange: (val: string) => void;
  portionEn: string;
  onPortionEnChange: (val: string) => void;
  descriptionEn: string;
  onDescriptionEnChange: (val: string) => void;
  // Korean
  nameKr: string;
  onNameKrChange: (val: string) => void;
  nameKrSubtitle?: string;
  onNameKrSubtitleChange?: (val: string) => void;
  portionKr: string;
  onPortionKrChange: (val: string) => void;
  descriptionKr: string;
  onDescriptionKrChange: (val: string) => void;
  // Japanese
  nameJp: string;
  onNameJpChange: (val: string) => void;
  portionJp: string;
  onPortionJpChange: (val: string) => void;
  descriptionJp: string;
  onDescriptionJpChange: (val: string) => void;
  // Validation errors
  errors: Record<string, string>;
}

export const DishMultilingualSection: React.FC<DishMultilingualSectionProps> = ({
  activeLang,
  onActiveLangChange,
  nameVi,
  onNameViChange,
  portionVi,
  onPortionViChange,
  descriptionVi,
  onDescriptionViChange,
  nameEn,
  onNameEnChange,
  portionEn,
  onPortionEnChange,
  descriptionEn,
  onDescriptionEnChange,
  nameKr,
  onNameKrChange,
  nameKrSubtitle = '',
  onNameKrSubtitleChange,
  portionKr,
  onPortionKrChange,
  descriptionKr,
  onDescriptionKrChange,
  nameJp,
  onNameJpChange,
  portionJp,
  onPortionJpChange,
  descriptionJp,
  onDescriptionJpChange,
  errors,
}) => {
  // Check completeness per language
  const isViComplete = Boolean(nameVi.trim() && portionVi.trim() && descriptionVi.trim());
  const isEnComplete = Boolean(nameEn.trim() && portionEn.trim() && descriptionEn.trim());
  const isKrComplete = Boolean(nameKr.trim() && portionKr.trim() && descriptionKr.trim());
  const isJpComplete = Boolean(nameJp.trim() && portionJp.trim() && descriptionJp.trim());

  const languageStatus: Record<Language, boolean> = {
    VI: isViComplete,
    EN: isEnComplete,
    KR: isKrComplete,
    JP: isJpComplete,
  };

  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header and In-Section Language Tabs (Hero Pattern) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
        <div>
          <h3 className="font-headline-sm text-base sm:text-lg font-bold text-[#1b1c1a]">
            Multilingual Menu Content
          </h3>
          <p className="text-xs text-[#585757]">
            Culinary nomenclature, portion specifications, and tasting notes across 4 mandatory languages
          </p>
        </div>

        {/* 4-Language Tabs - Softened Modern Atelier Styling */}
        <div className="inline-flex flex-wrap p-1.5 bg-[#f5f3f0] rounded-xl border border-[#eae8e5] gap-1">
          {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => {
            const isComplete = languageStatus[lang];
            const isActive = activeLang === lang;

            return (
              <button
                key={lang}
                type="button"
                onClick={() => onActiveLangChange(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#af101a] text-white shadow-xs'
                    : 'text-[#5b403d] hover:text-[#1b1c1a] hover:bg-white/60'
                }`}
              >
                <span>
                  {lang === 'VI' && '🇻🇳 Tiếng Việt'}
                  {lang === 'EN' && '🇺🇸 English'}
                  {lang === 'KR' && '🇰🇷 한국어'}
                  {lang === 'JP' && '🇯🇵 日本語'}
                </span>
                {!isComplete && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-amber-300' : 'bg-[#af101a]'
                    }`}
                    title="Incomplete content"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Form Fields */}
      {activeLang === 'VI' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-[#8f6f6c] pb-1 border-b border-[#f3f1ec]">
            <span className="font-bold text-[#1b1c1a]">🇻🇳 Thông tin Tiếng Việt (Bắt buộc)</span>
            <span>Hiển thị trên thực đơn Tiếng Việt</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Tên món ăn (VI) *
              </label>
              <input
                type="text"
                value={nameVi}
                onChange={(e) => onNameViChange(e.target.value)}
                placeholder="Ví dụ: Set Cơm Thịt Heo Nạc Lưng Chiên Xù"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs font-semibold text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.nameVi ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.nameVi && <span className="text-[10px] text-red-600 block mt-1">{errors.nameVi}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Định lượng khẩu phần (VI) *
              </label>
              <input
                type="text"
                value={portionVi}
                onChange={(e) => onPortionViChange(e.target.value)}
                placeholder="Ví dụ: Phần 1 người (6 miếng nạc thăn mềm)"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.portionVi ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.portionVi && <span className="text-[10px] text-red-600 block mt-1">{errors.portionVi}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Mô tả ẩm thực &amp; hương vị (VI) *
            </label>
            <textarea
              rows={3}
              value={descriptionVi}
              onChange={(e) => onDescriptionViChange(e.target.value)}
              placeholder="Mô tả hương vị, nguyên liệu tuyển chọn và nghệ thuật tẩm bột..."
              className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs leading-relaxed text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                errors.descriptionVi ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
              }`}
              required
            />
            {errors.descriptionVi && <span className="text-[10px] text-red-600 block mt-1">{errors.descriptionVi}</span>}
          </div>
        </div>
      )}

      {activeLang === 'EN' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-[#8f6f6c] pb-1 border-b border-[#f3f1ec]">
            <span className="font-bold text-[#1b1c1a]">🇺🇸 English Profile (Mandatory)</span>
            <span>Displayed for international guests</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Dish Name (EN) *
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => onNameEnChange(e.target.value)}
                placeholder="e.g. Pork Tenderloin Cutlet Set"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs font-semibold text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.nameEn ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.nameEn && <span className="text-[10px] text-red-600 block mt-1">{errors.nameEn}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Portion Specification (EN) *
              </label>
              <input
                type="text"
                value={portionEn}
                onChange={(e) => onPortionEnChange(e.target.value)}
                placeholder="e.g. 1 serving (6 tenderloin pieces)"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.portionEn ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.portionEn && <span className="text-[10px] text-red-600 block mt-1">{errors.portionEn}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Culinary Description (EN) *
            </label>
            <textarea
              rows={3}
              value={descriptionEn}
              onChange={(e) => onDescriptionEnChange(e.target.value)}
              placeholder="Detailed culinary notes, ingredients, and preparation techniques in English..."
              className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs leading-relaxed text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                errors.descriptionEn ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
              }`}
              required
            />
            {errors.descriptionEn && <span className="text-[10px] text-red-600 block mt-1">{errors.descriptionEn}</span>}
          </div>
        </div>
      )}

      {activeLang === 'KR' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-[#8f6f6c] pb-1 border-b border-[#f3f1ec]">
            <span className="font-bold text-[#1b1c1a]">🇰🇷 한국어 정보 (Mandatory)</span>
            <span>한국인 고객 및 헤리티지 표기</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                메뉴명 (KO) *
              </label>
              <input
                type="text"
                value={nameKr}
                onChange={(e) => onNameKrChange(e.target.value)}
                placeholder="예: 안심카츠 정식"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs font-semibold text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.nameKr ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.nameKr && <span className="text-[10px] text-red-600 block mt-1">{errors.nameKr}</span>}
            </div>

            {onNameKrSubtitleChange && (
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  소제목 / 부제 (Optional)
                </label>
                <input
                  type="text"
                  value={nameKrSubtitle}
                  onChange={(e) => onNameKrSubtitleChange(e.target.value)}
                  placeholder="예: (히레카츠)"
                  className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                포션 정보 (KO) *
              </label>
              <input
                type="text"
                value={portionKr}
                onChange={(e) => onPortionKrChange(e.target.value)}
                placeholder="예: 1인분 (안심 6조각)"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.portionKr ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.portionKr && <span className="text-[10px] text-red-600 block mt-1">{errors.portionKr}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              메뉴 설명 (KO) *
            </label>
            <textarea
              rows={3}
              value={descriptionKr}
              onChange={(e) => onDescriptionKrChange(e.target.value)}
              placeholder="한국어로 메뉴의 특징, 튀김 기법과 조리법을 상세히 입력하세요..."
              className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs leading-relaxed text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                errors.descriptionKr ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
              }`}
              required
            />
            {errors.descriptionKr && <span className="text-[10px] text-red-600 block mt-1">{errors.descriptionKr}</span>}
          </div>
        </div>
      )}

      {activeLang === 'JP' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-[#8f6f6c] pb-1 border-b border-[#f3f1ec]">
            <span className="font-bold text-[#1b1c1a]">🇯🇵 日本語情報 (必須)</span>
            <span>日本人のお客様向け・職人技の紹介</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                料理名 (JA) *
              </label>
              <input
                type="text"
                value={nameJp}
                onChange={(e) => onNameJpChange(e.target.value)}
                placeholder="例: ヒレかつ定食"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs font-semibold text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.nameJp ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.nameJp && <span className="text-[10px] text-red-600 block mt-1">{errors.nameJp}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                ボリューム / 前数 (JA) *
              </label>
              <input
                type="text"
                value={portionJp}
                onChange={(e) => onPortionJpChange(e.target.value)}
                placeholder="例: 1人前 (ヒレ 6個)"
                className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                  errors.portionJp ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
                }`}
                required
              />
              {errors.portionJp && <span className="text-[10px] text-red-600 block mt-1">{errors.portionJp}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              料理説明 (JA) *
            </label>
            <textarea
              rows={3}
              value={descriptionJp}
              onChange={(e) => onDescriptionJpChange(e.target.value)}
              placeholder="日本語で料理のこだわり、低温調理や揚げ上がりの特徴を入力してください..."
              className={`w-full px-3 py-2 rounded-lg border bg-[#fbf9f6] text-xs leading-relaxed text-[#1b1c1a] focus:outline-none focus:border-[#af101a] ${
                errors.descriptionJp ? 'border-red-500 bg-red-50/20' : 'border-[#eae8e5]'
              }`}
              required
            />
            {errors.descriptionJp && <span className="text-[10px] text-red-600 block mt-1">{errors.descriptionJp}</span>}
          </div>
        </div>
      )}
    </div>
  );
};
