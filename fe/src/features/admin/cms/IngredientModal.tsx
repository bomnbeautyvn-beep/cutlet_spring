import React, { useState, useEffect } from 'react';
import { Ingredient, SaveIngredientRequest, Language } from '@/types';
import { cmsService } from '@/services/cms.service';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  ingredient?: Ingredient | null;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  ingredient,
}) => {
  const [activeLangTab, setActiveLangTab] = useState<Language>('VI');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SaveIngredientRequest>({
    nameEn: '',
    nameKr: '',
    nameVi: '',
    nameJp: '',
    subtitleEn: '',
    subtitleKr: '',
    subtitleVi: '',
    subtitleJp: '',
    descriptionEn: '',
    descriptionKr: '',
    descriptionVi: '',
    descriptionJp: '',
    displayOrder: 1,
    isActive: true,
  });

  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (ingredient) {
      setFormData({
        id: ingredient.id,
        nameEn: ingredient.nameEn || '',
        nameKr: ingredient.nameKr || '',
        nameVi: ingredient.nameVi || '',
        nameJp: ingredient.nameJp || '',
        subtitleEn: ingredient.subtitleEn || '',
        subtitleKr: ingredient.subtitleKr || '',
        subtitleVi: ingredient.subtitleVi || '',
        subtitleJp: ingredient.subtitleJp || '',
        descriptionEn: ingredient.descriptionEn || '',
        descriptionKr: ingredient.descriptionKr || '',
        descriptionVi: ingredient.descriptionVi || '',
        descriptionJp: ingredient.descriptionJp || '',
        displayOrder: ingredient.displayOrder,
        isActive: ingredient.isActive,
      });
      setCurrentImageUrl(ingredient.imageUrl);
    } else {
      setFormData({
        nameEn: '',
        nameKr: '',
        nameVi: '',
        nameJp: '',
        subtitleEn: '',
        subtitleKr: '',
        subtitleVi: '',
        subtitleJp: '',
        descriptionEn: '',
        descriptionKr: '',
        descriptionVi: '',
        descriptionJp: '',
        displayOrder: 1,
        isActive: true,
      });
      setCurrentImageUrl(undefined);
    }
    setErrorMessage(null);
  }, [ingredient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      // Validate all 4 languages are present
      if (!formData.nameEn?.trim() || !formData.nameKr?.trim() || !formData.nameVi?.trim() || !formData.nameJp?.trim()) {
        setErrorMessage('All 4 language names (EN, KR, VI, JP) are strictly required.');
        setSaving(false);
        return;
      }
      if (!formData.descriptionEn?.trim() || !formData.descriptionKr?.trim() || !formData.descriptionVi?.trim() || !formData.descriptionJp?.trim()) {
        setErrorMessage('All 4 language descriptions (EN, KR, VI, JP) are strictly required.');
        setSaving(false);
        return;
      }

      if (ingredient?.id) {
        await cmsService.updateAdminIngredient(ingredient.id, formData);
      } else {
        await cmsService.createAdminIngredient(formData);
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save ingredient');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ingredient?.id) return;

    try {
      setUploading(true);
      setErrorMessage(null);
      const updated = await cmsService.uploadIngredientImage(ingredient.id, file);
      setCurrentImageUrl(updated.imageUrl);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#eae8e5] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#eae8e5] flex items-center justify-between bg-[#fbf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#af101a]/10 flex items-center justify-center text-[#af101a]">
              <span className="material-symbols-outlined text-[22px]">grocery</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
                {ingredient ? 'Edit Atelier Ingredient' : 'Add New Ingredient'}
              </h2>
              <span className="text-xs text-[#585757]">
                Mandatory 4-Language Standard (EN, KR, VI, JP)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#585757] hover:bg-[#eae8e5] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Image & Display Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-4 rounded-xl bg-[#f5f3f0] border border-[#eae8e5]">
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="w-full h-32 rounded-xl overflow-hidden bg-white border border-[#eae8e5] relative flex items-center justify-center group">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="Ingredient Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-[#8f6f6c] p-2">
                    <span className="material-symbols-outlined text-[28px] block">image</span>
                    <span className="text-[10px] font-semibold">No Image</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold gap-1">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>

              {ingredient?.id ? (
                <label className="mt-2 text-[11px] font-bold text-[#af101a] hover:underline cursor-pointer flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">upload</span>
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              ) : (
                <span className="mt-1 text-[10px] text-[#786659] italic text-center">
                  Save ingredient first to upload photo
                </span>
              )}
            </div>

            <div className="sm:col-span-7 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#eae8e5] bg-white text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-[#1b1c1a]">Active on Website</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#af101a]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 4-Language Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#eae8e5] pb-2">
              <span className="text-xs font-bold text-[#5b403d] uppercase tracking-wider">
                Multilingual Details
              </span>
              <div className="inline-flex p-1 bg-[#f5f3f0] rounded-xl border border-[#eae8e5]">
                {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLangTab(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeLangTab === lang
                        ? 'bg-[#af101a] text-white shadow-xs'
                        : 'text-[#5b403d] hover:text-[#1b1c1a]'
                    }`}
                  >
                    {lang}
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
                    value={formData.nameVi}
                    onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                    placeholder="Thịt Heo Mát"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    Tiêu Đề Phụ (Subtitle VI)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleVi}
                    onChange={(e) => setFormData({ ...formData, subtitleVi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                    placeholder="Ủ Lạnh 120 Giờ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    Mô Tả Chi Tiết (Description VI) *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionVi}
                    onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
                    placeholder="Chúng tôi sử dụng thịt heo mát tươi, chưa từng qua đông lạnh..."
                    required
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
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                    placeholder="Chilled Pork"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    Subtitle (EN)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleEn}
                    onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                    placeholder="120-Hour Wet Aging"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    Description (EN) *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
                    placeholder="We serve fresh chilled pork that has never been frozen..."
                    required
                  />
                </div>
              </div>
            )}

            {/* Korean */}
            {activeLangTab === 'KR' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    원재료명 (KR) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameKr}
                    onChange={(e) => setFormData({ ...formData, nameKr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                    placeholder="냉장육"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    서브타이틀 (KR)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleKr}
                    onChange={(e) => setFormData({ ...formData, subtitleKr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                    placeholder="120시간 저온 습식숙성"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    상세 설명 (KR) *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionKr}
                    onChange={(e) => setFormData({ ...formData, descriptionKr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
                    placeholder="저희는 한 번도 얼리지 않은 최상급 신선 냉장육만을 고집합니다..."
                    required
                  />
                </div>
              </div>
            )}

            {/* Japanese */}
            {activeLangTab === 'JP' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    原材料名 (JP) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameJp}
                    onChange={(e) => setFormData({ ...formData, nameJp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                    placeholder="チルドポーク"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    サブタイトル (JP)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleJp}
                    onChange={(e) => setFormData({ ...formData, subtitleJp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                    placeholder="120時間低温熟成"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b403d] mb-1">
                    詳細説明 (JP) *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionJp}
                    onChange={(e) => setFormData({ ...formData, descriptionJp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
                    placeholder="当店では一度も冷凍していない新鮮なチルドポークのみを使用しています..."
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#eae8e5] bg-white hover:bg-[#f5f3f0] text-[#5b403d] font-label-md text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{ingredient ? 'Save Changes' : 'Create Ingredient'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

