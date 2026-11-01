import React from 'react';
import { Language, Ingredient } from '@/types';
import { FALLBACK_INGREDIENTS } from './philosophy/fallbackIngredients';
import { PhilosophyCard } from './philosophy/PhilosophyCard';

interface PhilosophySectionProps {
  language?: Language;
  ingredients?: Ingredient[];
  sectionTitle?: {
    titleEn?: string;
    titleKr?: string;
    titleVi?: string;
    titleJp?: string;
    subtitleEn?: string;
    subtitleKr?: string;
    subtitleVi?: string;
    subtitleJp?: string;
  };
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  language = 'VI',
  ingredients,
  sectionTitle,
}) => {
  const displayItems = ingredients && ingredients.length > 0 ? ingredients : FALLBACK_INGREDIENTS;

  const getHeaderBadge = () => {
    switch (language) {
      case 'KR':
        return sectionTitle?.subtitleKr || '봄돈까스의 4대 원재료';
      case 'VI':
        return sectionTitle?.subtitleVi || '봄돈까스의 원재료';
      case 'JP':
        return sectionTitle?.subtitleJp || '職人技を支える4つのこだわり';
      default:
        return sectionTitle?.subtitleEn || 'Four Foundations of Our Culinary Craft';
    }
  };

  const getMainHeader = () => {
    switch (language) {
      case 'KR':
        return sectionTitle?.titleKr || 'INGREDIENTS / 원재료의 미학';
      case 'VI':
        return sectionTitle?.titleVi || 'INGREDIENTS / NGUYÊN LIỆU';
      case 'JP':
        return sectionTitle?.titleJp || 'INGREDIENTS / 厳選素材';
      default:
        return sectionTitle?.titleEn || 'INGREDIENTS / ARTISANAL FOUNDATIONS';
    }
  };

  return (
    <section className="w-full py-16 lg:py-24 border-b border-[#eae8e5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#eae8e5]">
          <div>
            <div className="font-label-md text-xs uppercase tracking-widest text-[#af101a] font-bold mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#af101a]" />
              {getHeaderBadge()}
            </div>
            <h2 className="font-headline-lg text-3xl lg:text-4xl text-[#1b1c1a] font-bold tracking-tight">
              {getMainHeader()}
            </h2>
          </div>
          <div className="font-menu-bar text-xs uppercase tracking-widest text-[#8f6f6c] font-bold mt-2 md:mt-0">
            Cutlet Spring Menu
          </div>
        </div>

        {/* 4 Ingredients Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayItems.map((item) => (
            <PhilosophyCard key={item.id} item={item} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
};
