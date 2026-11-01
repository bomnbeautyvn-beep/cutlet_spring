import React, { useState } from 'react';
import { MenuItem, DishCategory } from '@/types';
import { adminService, MenuItemPayload } from '@/services/admin.service';

interface AdminDishModalProps {
  dish: MenuItem | null; // null = new dish
  onClose: () => void;
  onSaved: () => void;
}

type ModalTab = 'general' | 'en' | 'ko' | 'vi' | 'ja';

export const AdminDishModal: React.FC<AdminDishModalProps> = ({ dish, onClose, onSaved }) => {
  const isEditing = Boolean(dish);
  const [activeTab, setActiveTab] = useState<ModalTab>('en');

  // General Fields
  const [id, setId] = useState(dish?.id || '');
  const [categoryId, setCategoryId] = useState<DishCategory>(dish?.category || 'japanese');
  const [basePrice, setBasePrice] = useState<number>(dish?.price || 180);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(dish?.prepTimeMinutes || 15);
  const [active, setActive] = useState(dish?.active !== false);
  const [isChefSignature, setIsChefSignature] = useState(Boolean(dish?.isChefSignature));
  const [isBestSeller, setIsBestSeller] = useState(Boolean(dish?.isBestSeller));
  const [isLimited, setIsLimited] = useState(Boolean(dish?.isLimited));
  const [isSpicy, setIsSpicy] = useState(Boolean(dish?.isSpicy));
  const [spiceLevel, setSpiceLevel] = useState<number>(dish?.spiceLevel || 0);
  const [spiceNote, setSpiceNote] = useState(dish?.spiceNote || '');

  // English (EN) - Required
  const [nameEn, setNameEn] = useState(dish?.nameEn || '');
  const [descriptionEn, setDescriptionEn] = useState(dish?.descriptionEn || '');
  const [portionEn, setPortionEn] = useState(dish?.portionEn || '1 serving');

  // Korean (KO) - Required
  const [nameKr, setNameKr] = useState(dish?.nameKr || '');
  const [nameKrSubtitle, setNameKrSubtitle] = useState(dish?.nameKrSubtitle || '');
  const [descriptionKr, setDescriptionKr] = useState(dish?.descriptionKr || '');
  const [portionKr, setPortionKr] = useState(dish?.portionKr || '1인분');

  // Vietnamese (VI) - Required
  const [nameVi, setNameVi] = useState(dish?.nameVi || '');
  const [descriptionVi, setDescriptionVi] = useState(dish?.descriptionVi || '');
  const [portionVi, setPortionVi] = useState(dish?.portionVi || 'Phần 1 người');

  // Japanese (JA) - Required
  const [nameJp, setNameJp] = useState(dish?.nameJp || '');
  const [descriptionJp, setDescriptionJp] = useState(dish?.descriptionJp || '');
  const [portionJp, setPortionJp] = useState(dish?.portionJp || '1人前');

  // Image & Upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(dish?.image || null);
  const [altText, setAltText] = useState(dish?.altText || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab completion validation helpers
  const isEnValid = Boolean(nameEn.trim() && descriptionEn.trim() && portionEn.trim());
  const isKoValid = Boolean(nameKr.trim() && descriptionKr.trim() && portionKr.trim());
  const isViValid = Boolean(nameVi.trim() && descriptionVi.trim() && portionVi.trim());
  const isJaValid = Boolean(nameJp.trim() && descriptionJp.trim() && portionJp.trim());
  const isGeneralValid = basePrice > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // English
    if (!nameEn.trim()) errors.nameEn = 'English name (EN) is required';
    if (!descriptionEn.trim()) errors.descriptionEn = 'English description (EN) is required';
    if (!portionEn.trim()) errors.portionEn = 'English portion info (EN) is required';

    // Korean
    if (!nameKr.trim()) errors.nameKr = 'Korean name (KO) is required';
    if (!descriptionKr.trim()) errors.descriptionKr = 'Korean description (KO) is required';
    if (!portionKr.trim()) errors.portionKr = 'Korean portion info (KO) is required';

    // Vietnamese
    if (!nameVi.trim()) errors.nameVi = 'Vietnamese name (VI) is required';
    if (!descriptionVi.trim()) errors.descriptionVi = 'Vietnamese description (VI) is required';
    if (!portionVi.trim()) errors.portionVi = 'Vietnamese portion info (VI) is required';

    // Japanese
    if (!nameJp.trim()) errors.nameJp = 'Japanese name (JA) is required';
    if (!descriptionJp.trim()) errors.descriptionJp = 'Japanese description (JA) is required';
    if (!portionJp.trim()) errors.portionJp = 'Japanese portion info (JA) is required';

    // Pricing
    if (!basePrice || basePrice <= 0) errors.basePrice = 'Base price must be greater than zero';

    setValidationErrors(errors);

    // Auto-focus the first tab that has an error
    if (errors.en || errors.nameEn || errors.descriptionEn || errors.portionEn) {
      setActiveTab('en');
    } else if (errors.ko || errors.nameKr || errors.descriptionKr || errors.portionKr) {
      setActiveTab('ko');
    } else if (errors.vi || errors.nameVi || errors.descriptionVi || errors.portionVi) {
      setActiveTab('vi');
    } else if (errors.ja || errors.nameJp || errors.descriptionJp || errors.portionJp) {
      setActiveTab('ja');
    } else if (errors.basePrice) {
      setActiveTab('general');
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      setErrorMessage('Please complete all mandatory 4-language fields (EN, KO, VI, JA).');
      return;
    }

    setIsSubmitting(true);

    const payload: MenuItemPayload = {
      id: id.trim() || undefined,
      categoryId,
      nameEn: nameEn.trim(),
      nameKr: nameKr.trim(),
      nameKrSubtitle: nameKrSubtitle.trim() || undefined,
      nameVi: nameVi.trim(),
      nameJp: nameJp.trim(),
      descriptionEn: descriptionEn.trim(),
      descriptionKr: descriptionKr.trim(),
      descriptionVi: descriptionVi.trim(),
      descriptionJp: descriptionJp.trim(),
      portionEn: portionEn.trim(),
      portionKr: portionKr.trim(),
      portionVi: portionVi.trim(),
      portionJp: portionJp.trim(),
      basePrice: Number(basePrice),
      prepTimeMinutes: Number(prepTimeMinutes),
      altText: altText.trim() || undefined,
      isChefSignature,
      isBestSeller,
      isLimited,
      isSpicy,
      spiceLevel: isSpicy ? spiceLevel : 0,
      spiceNote: isSpicy ? spiceNote.trim() : undefined,
      active,
    };

    try {
      let savedDishId = dish?.id;
      if (isEditing && dish) {
        await adminService.updateMenuItem(dish.id, payload);
      } else {
        const created = await adminService.createMenuItem(payload);
        savedDishId = created.id;
      }

      // If a new image was chosen, upload it to Cloudinary via backend
      if (imageFile && savedDishId) {
        await adminService.uploadImage(savedDishId, imageFile);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to save menu dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#eae8e5] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eae8e5] bg-[#fbf9f6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-kr-serif text-xs text-[#af101a] font-bold">봄돈까스</span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#585757]">
                {isEditing ? `Edit: ${dish?.id}` : 'New Atelier Dish'}
              </span>
            </div>
            <h2 className="font-headline-md text-xl font-bold text-[#1b1c1a]">
              {isEditing ? `Edit "${dish?.nameEn}"` : 'Add New Menu Item'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eae8e5] text-[#585757] hover:text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 4-Language + General Navigation Tabs */}
        <div className="flex items-center border-b border-[#eae8e5] bg-[#f5f3f0] px-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'en'
                ? 'border-[#af101a] text-[#af101a] bg-white'
                : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
            }`}
          >
            <span>English (EN)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isEnValid ? 'bg-emerald-500' : 'bg-red-500 ring-2 ring-red-200'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ko')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ko'
                ? 'border-[#af101a] text-[#af101a] bg-white'
                : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
            }`}
          >
            <span>한국어 (KO)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isKoValid ? 'bg-emerald-500' : 'bg-red-500 ring-2 ring-red-200'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vi')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vi'
                ? 'border-[#af101a] text-[#af101a] bg-white'
                : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
            }`}
          >
            <span>Tiếng Việt (VI)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isViValid ? 'bg-emerald-500' : 'bg-red-500 ring-2 ring-red-200'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ja')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ja'
                ? 'border-[#af101a] text-[#af101a] bg-white'
                : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
            }`}
          >
            <span>日本語 (JA)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isJaValid ? 'bg-emerald-500' : 'bg-red-500 ring-2 ring-red-200'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-[#af101a] text-[#af101a] bg-white'
                : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
            }`}
          >
            <span>Pricing &amp; Image</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isGeneralValid ? 'bg-emerald-500' : 'bg-red-500 ring-2 ring-red-200'
              }`}
            />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: ENGLISH */}
          {activeTab === 'en' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#eae8e5]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                  English Multilingual Profile (Mandatory)
                </h3>
                <span className="text-[11px] text-[#8f6f6c]">Required for international diners</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Dish Name (EN) *
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Pork Tenderloin Cutlet Set"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.nameEn ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.nameEn && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.nameEn}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Portion Specification (EN) *
                </label>
                <input
                  type="text"
                  value={portionEn}
                  onChange={(e) => setPortionEn(e.target.value)}
                  placeholder="e.g. 1 serving (6 tenderloin pieces)"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.portionEn ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.portionEn && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.portionEn}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Culinary Description (EN) *
                </label>
                <textarea
                  rows={4}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Detailed culinary notes and preparation details in English..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.descriptionEn ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.descriptionEn && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.descriptionEn}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: KOREAN */}
          {activeTab === 'ko' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#eae8e5]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                  한국어 정보 (Mandatory)
                </h3>
                <span className="text-[11px] text-[#8f6f6c]">한국인 고객 및 헤리티지 표기</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                    메뉴명 (KO) *
                  </label>
                  <input
                    type="text"
                    value={nameKr}
                    onChange={(e) => setNameKr(e.target.value)}
                    placeholder="예: 안심카츠"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                      validationErrors.nameKr ? 'border-red-500' : 'border-[#eae8e5]'
                    }`}
                  />
                  {validationErrors.nameKr && (
                    <p className="text-[11px] text-red-600 mt-1">{validationErrors.nameKr}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                    소제목 / 부제 (Optional)
                  </label>
                  <input
                    type="text"
                    value={nameKrSubtitle}
                    onChange={(e) => setNameKrSubtitle(e.target.value)}
                    placeholder="예: (닭안심 카츠)"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  1인분 구성 / 포션 정보 (KO) *
                </label>
                <input
                  type="text"
                  value={portionKr}
                  onChange={(e) => setPortionKr(e.target.value)}
                  placeholder="예: 1인분 (안심 6조각)"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.portionKr ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.portionKr && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.portionKr}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  메뉴 설명 (KO) *
                </label>
                <textarea
                  rows={4}
                  value={descriptionKr}
                  onChange={(e) => setDescriptionKr(e.target.value)}
                  placeholder="한국어로 메뉴의 특징과 조리법을 입력하세요..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.descriptionKr ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.descriptionKr && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.descriptionKr}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VIETNAMESE */}
          {activeTab === 'vi' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#eae8e5]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                  Tiếng Việt (Bắt buộc)
                </h3>
                <span className="text-[11px] text-[#8f6f6c]">Dành cho thực khách bản địa Việt Nam</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Tên món ăn (VI) *
                </label>
                <input
                  type="text"
                  value={nameVi}
                  onChange={(e) => setNameVi(e.target.value)}
                  placeholder="Ví dụ: Set Thịt Thăn Nội Heo"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.nameVi ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.nameVi && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.nameVi}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Khẩu phần / Số lượng (VI) *
                </label>
                <input
                  type="text"
                  value={portionVi}
                  onChange={(e) => setPortionVi(e.target.value)}
                  placeholder="Ví dụ: Phần 1 người (6 miếng thăn nội)"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.portionVi ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.portionVi && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.portionVi}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Mô tả món ăn (VI) *
                </label>
                <textarea
                  rows={4}
                  value={descriptionVi}
                  onChange={(e) => setDescriptionVi(e.target.value)}
                  placeholder="Mô tả hương vị, nguyên liệu và nước sốt bằng Tiếng Việt..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.descriptionVi ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.descriptionVi && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.descriptionVi}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: JAPANESE */}
          {activeTab === 'ja' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#eae8e5]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                  日本語情報 (必須)
                </h3>
                <span className="text-[11px] text-[#8f6f6c]">日本人のお客様向け</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  料理名 (JA) *
                </label>
                <input
                  type="text"
                  value={nameJp}
                  onChange={(e) => setNameJp(e.target.value)}
                  placeholder="例: ヒレかつ定食"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.nameJp ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.nameJp && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.nameJp}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  ボリューム / 前数 (JA) *
                </label>
                <input
                  type="text"
                  value={portionJp}
                  onChange={(e) => setPortionJp(e.target.value)}
                  placeholder="例: 1人前 (ヒレ 6個)"
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.portionJp ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.portionJp && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.portionJp}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  料理説明 (JA) *
                </label>
                <textarea
                  rows={4}
                  value={descriptionJp}
                  onChange={(e) => setDescriptionJp(e.target.value)}
                  placeholder="日本語で料理のこだわりや味の特徴を入力してください..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border rounded-xl focus:outline-none focus:border-[#af101a] ${
                    validationErrors.descriptionJp ? 'border-red-500' : 'border-[#eae8e5]'
                  }`}
                />
                {validationErrors.descriptionJp && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.descriptionJp}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GENERAL SETTINGS, PRICING & IMAGE */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Identifier (Slug / ID)
                  </label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    disabled={isEditing}
                    placeholder="e.g. pork-tenderloin-cutlet-set"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a] disabled:opacity-60"
                  />
                  <span className="text-[10px] text-[#8f6f6c]">
                    {isEditing ? 'Immutable once created' : 'Leave empty to auto-slugify English title'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value as DishCategory)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  >
                    <option value="japanese">Japanese Tonkatsu</option>
                    <option value="korean">Korean Retro Tonkatsu</option>
                    <option value="curry">Curry Rice</option>
                    <option value="noodles">Artisan Noodles</option>
                    <option value="addons">Atelier Add-ons</option>
                    <option value="sauces">Signature Sauces</option>
                    <option value="drinks">Beverages & Craft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Base Price (Thousands VND) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      min={0}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#8f6f6c] font-bold">
                      .000 VND
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    min={1}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
              </div>

              {/* Badges & Special Attributes */}
              <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
                  Atelier Badges &amp; Dining Attributes
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChefSignature}
                      onChange={(e) => setIsChefSignature(e.target.checked)}
                      className="rounded text-[#af101a]"
                    />
                    <span className="font-semibold text-[#1b1c1a]">Chef Signature</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded text-[#feae2c]"
                    />
                    <span className="font-semibold text-[#1b1c1a]">Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLimited}
                      onChange={(e) => setIsLimited(e.target.checked)}
                      className="rounded text-zinc-800"
                    />
                    <span className="font-semibold text-[#1b1c1a]">Limited Batch</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSpicy}
                      onChange={(e) => setIsSpicy(e.target.checked)}
                      className="rounded text-red-600"
                    />
                    <span className="font-semibold text-[#1b1c1a]">Spicy Glaze</span>
                  </label>
                </div>
              </div>

              {/* Image Upload directly to Cloudinary */}
              <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
                  Photo &amp; Cloudinary Asset
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white border border-[#eae8e5] overflow-hidden shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-gray-300">image</span>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="text-xs text-[#585757] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#af101a] file:text-white file:cursor-pointer cursor-pointer"
                    />
                    <p className="text-[10px] text-[#8f6f6c]">
                      PNG, JPG, WebP up to 10MB. Uploads directly to Cloudinary storage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <div>
                  <div className="text-xs font-bold text-emerald-900">
                    Visibility on Public Menu
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    When active, dish is live and orderable on the customer website
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#eae8e5] bg-[#fbf9f6] flex items-center justify-between">
          <div className="text-xs text-[#8f6f6c] hidden sm:block">
            All 4 languages (EN, KO, VI, JA) are strictly mandatory.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#585757] hover:bg-[#eae8e5] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Dish...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{isEditing ? 'Save Changes' : 'Create Dish'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
