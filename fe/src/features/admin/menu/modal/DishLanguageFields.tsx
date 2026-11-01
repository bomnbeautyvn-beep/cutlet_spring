import React from 'react';

interface DishLanguageFieldsProps {
  language: 'en' | 'ko' | 'vi' | 'ja';
  name: string;
  onNameChange: (val: string) => void;
  nameError?: string;
  subtitle?: string;
  onSubtitleChange?: (val: string) => void;
  portion: string;
  onPortionChange: (val: string) => void;
  portionError?: string;
  description: string;
  onDescriptionChange: (val: string) => void;
  descriptionError?: string;
}

const CONFIG = {
  en: {
    header: 'English Multilingual Profile (Mandatory)',
    subhead: 'Required for international diners',
    nameLabel: 'Dish Name (EN) *',
    namePlaceholder: 'e.g. Pork Tenderloin Cutlet Set',
    portionLabel: 'Portion Specification (EN) *',
    portionPlaceholder: 'e.g. 1 serving (6 tenderloin pieces)',
    descLabel: 'Culinary Description (EN) *',
    descPlaceholder: 'Detailed culinary notes and preparation details in English...',
  },
  ko: {
    header: '한국어 정보 (Mandatory)',
    subhead: '한국인 고객 및 헤리티지 표기',
    nameLabel: '메뉴명 (KO) *',
    namePlaceholder: '예: 안심카츠',
    subtitleLabel: '소제목 / 부제 (Optional)',
    subtitlePlaceholder: '예: (닭안심 카츠)',
    portionLabel: '1인분 구성 / 포션 정보 (KO) *',
    portionPlaceholder: '예: 1인분 (안심 6조각)',
    descLabel: '메뉴 설명 (KO) *',
    descPlaceholder: '한국어로 메뉴의 특징과 조리법을 입력하세요...',
  },
  vi: {
    header: 'Thông tin Tiếng Việt (Bắt buộc)',
    subhead: 'Hiển thị cho thực khách Việt Nam',
    nameLabel: 'Tên món ăn (VI) *',
    namePlaceholder: 'Ví dụ: Set Cơm Thịt Heo Nạc Lưng Chiên Xù',
    portionLabel: 'Định lượng khẩu phần (VI) *',
    portionPlaceholder: 'Ví dụ: Phần 1 người (6 miếng nạc thăn mềm)',
    descLabel: 'Mô tả món ăn (VI) *',
    descPlaceholder: 'Mô tả hương vị, nguyên liệu và nước sốt bằng Tiếng Việt...',
  },
  ja: {
    header: '日本語情報 (必須)',
    subhead: '日本人のお客様向け',
    nameLabel: '料理名 (JA) *',
    namePlaceholder: '例: ヒレかつ定食',
    portionLabel: 'ボリューム / 前数 (JA) *',
    portionPlaceholder: '例: 1人前 (ヒレ 6個)',
    descLabel: '料理説明 (JA) *',
    descPlaceholder: '日本語で料理のこだわりや味の特徴を入力してください...',
  },
};

export const DishLanguageFields: React.FC<DishLanguageFieldsProps> = ({
  language,
  name,
  onNameChange,
  nameError,
  subtitle,
  onSubtitleChange,
  portion,
  onPortionChange,
  portionError,
  description,
  onDescriptionChange,
  descriptionError,
}) => {
  const c = CONFIG[language];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-[#eae8e5]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          {c.header}
        </h3>
        <span className="text-[11px] text-[#8f6f6c]">{c.subhead}</span>
      </div>

      <div className={subtitle !== undefined ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
            {c.nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={c.namePlaceholder}
            className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
              nameError ? 'border-red-500' : 'border-[#eae8e5]'
            }`}
          />
          {nameError && <p className="text-[11px] text-red-600 mt-1">{nameError}</p>}
        </div>

        {subtitle !== undefined && onSubtitleChange && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
              {'subtitleLabel' in c ? c.subtitleLabel : 'Subtitle'}
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => onSubtitleChange(e.target.value)}
              placeholder={'subtitlePlaceholder' in c ? c.subtitlePlaceholder : ''}
              className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
          {c.portionLabel}
        </label>
        <input
          type="text"
          value={portion}
          onChange={(e) => onPortionChange(e.target.value)}
          placeholder={c.portionPlaceholder}
          className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
            portionError ? 'border-red-500' : 'border-[#eae8e5]'
          }`}
        />
        {portionError && <p className="text-[11px] text-red-600 mt-1">{portionError}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
          {c.descLabel}
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={c.descPlaceholder}
          className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
            descriptionError ? 'border-red-500' : 'border-[#eae8e5]'
          }`}
        />
        {descriptionError && (
          <p className="text-[11px] text-red-600 mt-1">{descriptionError}</p>
        )}
      </div>
    </div>
  );
};

