import React from 'react';
import { useHeroCmsForm } from './hero/hooks/useHeroCmsForm';
import { HeroVisualStatusCard } from './hero/components/HeroVisualStatusCard';
import { HeroLanguageTabContent } from './hero/components/HeroLanguageTabContent';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';
import { UnsavedChangesNotice } from '@/features/admin/components/UnsavedChangesNotice';

export const HeroCmsTab: React.FC = () => {
  const {
    isDirty,
    hero,
    loading,
    saving,
    uploading,
    message,
    setMessage,
    activeLangTab,
    setActiveLangTab,
    formData,
    setFormData,
    handleSave,
    handleImageUpload,
  } = useHeroCmsForm();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Hero Configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Visual Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Đầu Trang Chủ (Hero Banner)"
        publicUrl="/#hero"
        description="Màn hình đầu tiên xuất hiện ngay khi thực khách vừa truy cập website Cutlet Spring (https://cutletspring.com/). Bao gồm Tiêu đề lớn 4 thứ tiếng, Khẩu hiệu triết lý Tonkatsu, Nút bấm CTA dẫn tới Thực đơn, Khung ảnh minh họa món cắt lát đặc trưng và 3 chỉ số cam kết (Wet Aging 120h, 100% Thịt mát, Bột chiên tươi)."
        previewHint="Khi tắt công tắc 'Hero Section Status', toàn bộ khối Hero này sẽ được ẩn khỏi màn hình trang chủ của thực khách."
      />

      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded flex items-center justify-between text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Bar: Hero Visual & Status */}
      <HeroVisualStatusCard
        hero={hero}
        uploading={uploading}
        onImageUpload={handleImageUpload}
        formData={formData}
        onFormDataChange={setFormData}
      />

      {/* Multilingual 4-Language Tabs */}
      <HeroLanguageTabContent
        activeLangTab={activeLangTab}
        onTabChange={setActiveLangTab}
        formData={formData}
        onFormDataChange={setFormData}
      />

      {/* Unsaved Changes Lock Notice */}
      {isDirty && (
        <UnsavedChangesNotice
          isDirty={isDirty}
          isSaving={saving}
          onSave={handleSave}
          saveButtonText="Save Hero Changes"
          customMessage="Đang có chỉnh sửa Hero Banner chưa được lưu!"
        />
      )}

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-2.5 rounded bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 ${
            isDirty ? 'ring-2 ring-amber-400 ring-offset-2 animate-gentle-shake' : ''
          }`}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">
                {isDirty ? 'lock_reset' : 'save'}
              </span>
              <span>Save Hero Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
