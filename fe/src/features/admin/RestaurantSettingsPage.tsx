import React from 'react';
import { useRestaurantSettingsForm } from './restaurant/hooks/useRestaurantSettingsForm';
import { RestaurantSettingsTabs } from './restaurant/components/RestaurantSettingsTabs';
import { RestaurantProfileTab } from './restaurant/components/RestaurantProfileTab';
import { RestaurantHoursTab } from './restaurant/components/RestaurantHoursTab';
import { RestaurantPoliciesTab } from './restaurant/components/RestaurantPoliciesTab';

export const RestaurantSettingsPage: React.FC = () => {
  const {
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
            Restaurant Profile &amp; Settings
          </h1>
          <p className="text-xs text-[#585757] mt-0.5">
            Configure 4-language atelier profile, service hours, dining policies, and Cloudinary branding assets
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

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

      {/* Navigation Tabs */}
      <RestaurantSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'profile' && (
          <RestaurantProfileTab
            formData={formData}
            onChange={handleChange}
            onLogoUpload={handleLogoUpload}
            onBannerUpload={handleBannerUpload}
          />
        )}

        {activeTab === 'hours' && (
          <RestaurantHoursTab formData={formData} onChange={handleChange} />
        )}

        {activeTab === 'policies' && (
          <RestaurantPoliciesTab formData={formData} onChange={handleChange} />
        )}
      </form>
    </div>
  );
};
