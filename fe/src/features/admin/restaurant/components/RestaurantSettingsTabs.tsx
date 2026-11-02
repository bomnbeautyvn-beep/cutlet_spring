import React from 'react';

export type SettingsTab = 'hours' | 'policies' | 'email' | 'profile';

interface RestaurantSettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const RestaurantSettingsTabs: React.FC<RestaurantSettingsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex items-center gap-2 border-b border-[#eae8e5] pb-2 flex-wrap">
      <button
        type="button"
        onClick={() => onTabChange('hours')}
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
          activeTab === 'hours'
            ? 'bg-[#1b1c1a] text-white shadow-xs'
            : 'text-[#585757] hover:bg-[#f5f3f0]'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">schedule</span>
        <span>Operating Hours &amp; Sessions</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('policies')}
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
          activeTab === 'policies'
            ? 'bg-[#1b1c1a] text-white shadow-xs'
            : 'text-[#585757] hover:bg-[#f5f3f0]'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">countertops</span>
        <span>Dining Capacities &amp; Operations</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('email')}
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
          activeTab === 'email'
            ? 'bg-[#1b1c1a] text-white shadow-xs'
            : 'text-[#585757] hover:bg-[#f5f3f0]'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">mail</span>
        <span>Email &amp; SMTP Gateway</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('profile')}
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
          activeTab === 'profile'
            ? 'bg-[#1b1c1a] text-white shadow-xs'
            : 'text-[#8f6f6c] hover:bg-[#f5f3f0]'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">storefront</span>
        <span>Branding &amp; Identity (In Homepage CMS)</span>
      </button>
    </div>
  );
};

