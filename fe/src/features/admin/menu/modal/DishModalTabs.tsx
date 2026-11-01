import React from 'react';
import { ModalTab } from '../hooks/useAdminDishForm';

interface DishModalTabsProps {
  activeTab: ModalTab;
  onTabChange: (tab: ModalTab) => void;
  isEnValid: boolean;
  isKoValid: boolean;
  isViValid: boolean;
  isJaValid: boolean;
  isGeneralValid: boolean;
}

export const DishModalTabs: React.FC<DishModalTabsProps> = ({
  activeTab,
  onTabChange,
  isEnValid,
  isKoValid,
  isViValid,
  isJaValid,
  isGeneralValid,
}) => {
  const tabs: { id: ModalTab; label: string; isValid: boolean }[] = [
    { id: 'en', label: 'English (EN)', isValid: isEnValid },
    { id: 'ko', label: '한국어 (KO)', isValid: isKoValid },
    { id: 'vi', label: 'Tiếng Việt (VI)', isValid: isViValid },
    { id: 'ja', label: '日本語 (JA)', isValid: isJaValid },
    { id: 'general', label: 'Pricing & Image', isValid: isGeneralValid },
  ];

  return (
    <div className="flex items-center border-b border-[#eae8e5] bg-[#f5f3f0] px-4 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'border-[#af101a] text-[#af101a] bg-white'
                : 'border-transparent text-[#585757] hover:text-[#1b1c1a]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                tab.isValid ? 'bg-emerald-500' : 'bg-red-500 ring-2 ring-red-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

