import React from 'react';
import { useHeaderFooterCmsForm } from './header-footer/hooks/useHeaderFooterCmsForm';
import { HeaderBrandingSection } from './header-footer/components/HeaderBrandingSection';
import { HeaderFooterLanguageContent } from './header-footer/components/HeaderFooterLanguageContent';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';
import { UnsavedChangesNotice } from '@/features/admin/components/UnsavedChangesNotice';

export const HeaderFooterCmsTab: React.FC = () => {
  const {
    isDirty,
    settings,
    loading,
    saving,
    uploading,
    activeLangTab,
    setActiveLangTab,
    message,
    setMessage,
    formData,
    setFormData,
    handleSave,
    handleLogoUpload,
  } = useHeaderFooterCmsForm();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Header &amp; Footer Settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Visual Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Toàn Bộ Website > Thanh Điều Hướng Header & Chân Trang Footer"
        publicUrl="/"
        description="Hiển thị xuyên suốt ở thanh điều hướng trên cùng (Logo, Hotline) và chân trang (Footer) của tất cả các trang: Trang chủ, Thực đơn, Giới thiệu. Bao gồm Tên nhãn hiệu, Slogan, Địa chỉ nhà hàng, Giờ mở cửa, Quy định dùng bữa tại chỗ và Bản quyền website."
        previewHint="Đây là nguồn quản lý thương hiệu & địa chỉ chuẩn của Cutlet Spring (thay thế và đồng bộ tập trung cho các trường trùng lặp trước đây bên Restaurant Settings)."
      />

      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
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

      {/* Top Section: Logo Upload & Hotline */}
      <HeaderBrandingSection
        settings={settings}
        uploading={uploading}
        onLogoUpload={handleLogoUpload}
        formData={formData}
        onFormDataChange={setFormData}
      />

      {/* Multilingual Content Tabs */}
      <HeaderFooterLanguageContent
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
          saveButtonText="Save Header & Footer Changes"
          customMessage="Đang có chỉnh sửa Header & Footer chưa được lưu!"
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
              <span>Save Header &amp; Footer Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
