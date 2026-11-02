import React, { useState } from 'react';
import { HeroCmsTab } from './HeroCmsTab';
import { IngredientsCmsTab } from './IngredientsCmsTab';
import { GoogleReviewsCmsTab } from './GoogleReviewsCmsTab';
import { HeaderFooterCmsTab } from './HeaderFooterCmsTab';
import { SectionsOrderCmsTab } from './SectionsOrderCmsTab';

export type CmsTab = 'hero' | 'ingredients' | 'reviews' | 'header-footer' | 'sections';

interface HomepageCmsPageProps {
  initialTab?: CmsTab;
}

export const HomepageCmsPage: React.FC<HomepageCmsPageProps> = ({ initialTab = 'hero' }) => {
  const [activeTab, setActiveTab] = useState<CmsTab>(initialTab);

  const tabs: Array<{
    id: CmsTab;
    label: string;
    sublabel: string;
    icon: string;
  }> = [
    {
      id: 'hero',
      label: 'Hero & Introduction',
      sublabel: 'Headlines, CTAs & Visual',
      icon: 'featured_video',
    },
    {
      id: 'ingredients',
      label: 'Ingredients Management',
      sublabel: '4 Atelier Foundations',
      icon: 'grocery',
    },
    {
      id: 'reviews',
      label: 'Google Reviews',
      sublabel: 'Curated Guest Feedback',
      icon: 'reviews',
    },
    {
      id: 'header-footer',
      label: 'Header & Footer',
      sublabel: 'Logo, Hotline & Notice Policies',
      icon: 'web',
    },
    {
      id: 'sections',
      label: 'Section Ordering',
      sublabel: 'Visibility & Sequence',
      icon: 'reorder',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eae8e5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#af101a]" />
            <span className="font-label-md text-xs uppercase tracking-widest text-[#af101a] font-bold">
              Cutlet Spring Atelier CMS
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-[#1b1c1a] tracking-tight mt-1">
            Homepage Content Management
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-[#585757] mt-1 leading-relaxed">
            Manage dynamic homepage sections, 4-language translations, Google reviews, and branding without hardcoded frontend text.
          </p>
        </div>

        {/* View Public Home Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#eae8e5] bg-white hover:bg-[#eae8e5] text-xs font-bold text-[#1b1c1a] transition-all shadow-2xs cursor-pointer self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[16px] text-[#af101a]">open_in_new</span>
          <span>View Public Dining Site</span>
        </a>
      </div>

      {/* CMS Sub-navigation Tabs (Sticky bar) */}
      <div className="sticky top-14 sm:top-16 z-20 bg-[#fbf9f6]/95 backdrop-blur-xs py-1.5 -mx-1 px-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-[#f5f3f0] rounded-2xl border border-[#eae8e5] shadow-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl transition-all flex flex-col items-start gap-1 text-left cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1b1c1a] shadow-xs border border-[#eae8e5]'
                    : 'text-[#5b403d] hover:bg-white/60 hover:text-[#1b1c1a]'
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={`material-symbols-outlined text-[19px] ${
                      isActive ? 'text-[#af101a]' : 'text-[#8f6f6c]'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span className="font-title-md text-xs font-bold truncate">
                    {tab.label}
                  </span>
                </div>
                <span className="text-[10px] text-[#786659] truncate w-full hidden sm:block">
                  {tab.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Panel */}
      <div className="animate-fade-in">
        {activeTab === 'hero' && <HeroCmsTab />}
        {activeTab === 'ingredients' && <IngredientsCmsTab />}
        {activeTab === 'reviews' && <GoogleReviewsCmsTab />}
        {activeTab === 'header-footer' && <HeaderFooterCmsTab />}
        {activeTab === 'sections' && <SectionsOrderCmsTab />}
      </div>
    </div>
  );
};

