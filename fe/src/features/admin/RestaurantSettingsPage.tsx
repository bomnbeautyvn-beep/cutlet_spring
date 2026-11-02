import React from 'react';
import { useRestaurantSettingsForm } from './restaurant/hooks/useRestaurantSettingsForm';
import { RestaurantSettingsTabs } from './restaurant/components/RestaurantSettingsTabs';
import { RestaurantProfileTab } from './restaurant/components/RestaurantProfileTab';
import { RestaurantHoursTab } from './restaurant/components/RestaurantHoursTab';
import { RestaurantPoliciesTab } from './restaurant/components/RestaurantPoliciesTab';
import { EmailSmtpSettingsTab } from './restaurant/components/EmailSmtpSettingsTab';
import { UnsavedChangesNotice } from './components/UnsavedChangesNotice';

interface RestaurantSettingsPageProps {
  onNavigateToHomepage?: () => void;
}

export const RestaurantSettingsPage: React.FC<RestaurantSettingsPageProps> = ({
  onNavigateToHomepage,
}) => {
  const [isEmailDirty, setIsEmailDirty] = React.useState(false);

  const {
    isDirty,
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    feedback,
    formData,
    handleChange,
    handleSave,
    handleLogoUpload,
    handleBannerUpload,
  } = useRestaurantSettingsForm();

  const handleTabChange = (newTab: any) => {
    if (activeTab === newTab) return;
    if (activeTab === 'email' && isEmailDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes in your Email & SMTP configuration. Are you sure you want to leave without saving?'
      );
      if (!confirmLeave) return;
    }
    if (activeTab !== 'email' && isDirty) {
      const confirmLeave = window.confirm(
        'Bạn có thay đổi thông tin cửa hàng / giờ mở cửa chưa lưu. Bạn có chắc chắn muốn chuyển tab mà không lưu?'
      );
      if (!confirmLeave) return;
    }
    setActiveTab(newTab);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-3 text-[#8f6f6c]">
        <div className="w-7 h-7 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-wider font-bold">
          Loading Restaurant Settings...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">
            {activeTab === 'email' ? 'Email & SMTP Gateway Configuration' : 'Restaurant Profile & Settings'}
          </h1>
          <p className="text-xs text-[#585757] mt-0.5">
            {activeTab === 'email'
              ? 'Manage dynamic database-backed SMTP transport, encryption keys, sender identity, and test delivery'
              : 'Configure 4-language atelier profile, service hours, dining policies, and Cloudinary branding assets'}
          </p>
        </div>

        {activeTab !== 'email' && activeTab !== 'profile' && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 ${
              isDirty ? 'ring-2 ring-amber-400 ring-offset-2 animate-gentle-shake' : ''
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  {isDirty ? 'lock_reset' : 'save'}
                </span>
                <span>Save Configuration</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Unsaved Changes Lock Notice for Restaurant Settings */}
      {isDirty && activeTab !== 'email' && activeTab !== 'profile' && (
        <UnsavedChangesNotice
          isDirty={isDirty}
          isSaving={isSaving}
          onSave={handleSave}
          saveButtonText="Save Configuration"
          customMessage="Đang có chỉnh sửa thông tin nhà hàng chưa lưu!"
        />
      )}

      {/* Floating Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 shadow-sm animate-fade-in ${
            feedback.isError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedback.isError ? 'error' : 'check_circle'}
          </span>
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Navigation Tabs (Sticky) */}
      <div className="sticky top-14 sm:top-16 z-20 bg-[#fbf9f6]/95 backdrop-blur-xs py-1.5 -mx-1 px-1">
        <RestaurantSettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Form Content */}
      {activeTab === 'email' ? (
        <EmailSmtpSettingsTab onDirtyChange={setIsEmailDirty} />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'profile' && (
            <RestaurantProfileTab
              formData={formData}
              onChange={handleChange}
              onLogoUpload={handleLogoUpload}
              onBannerUpload={handleBannerUpload}
              onNavigateToHomepage={onNavigateToHomepage}
            />
          )}

          {activeTab === 'hours' && (
            <RestaurantHoursTab formData={formData} onChange={handleChange} />
          )}

          {activeTab === 'policies' && (
            <RestaurantPoliciesTab
              formData={formData}
              onChange={handleChange}
              onNavigateToHomepage={onNavigateToHomepage}
            />
          )}
        </form>
      )}
    </div>
  );
};
