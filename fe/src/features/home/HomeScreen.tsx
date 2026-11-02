import React from 'react';
import { Language, PageView, MenuItem } from '@/types';
import {
  HeroSection,
  PhilosophySection,
  FeedbackSection,
  LocationMapSection,
} from '@/features/home/components';
import { useHomepageData } from './hooks/useHomepageData';

interface HomeScreenProps {
  setCurrentView: (view: PageView) => void;
  language: Language;
  onSelectItem?: (item: MenuItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setCurrentView,
  language,
}) => {
  const { data } = useHomepageData();

  // If sections exist in backend response, sort by displayOrder and filter active
  const activeSections = data?.sections && data.sections.length > 0
    ? [...data.sections].filter(s => s.isActive).sort((a, b) => a.displayOrder - b.displayOrder)
    : null;

  // Render a specific section by key
  const renderSectionByKey = (key: string) => {
    switch (key) {
      case 'hero':
        if (data?.hero?.isActive === false) return null;
        return (
          <HeroSection
            key="hero"
            setCurrentView={setCurrentView}
            language={language}
            hero={data?.hero}
          />
        );
      case 'ingredients':
        return (
          <PhilosophySection
            key="ingredients"
            language={language}
            ingredients={data?.ingredients}
            sectionTitle={
              data?.sections?.find(s => s.sectionKey === 'ingredients')
                ? {
                    titleEn: data.sections.find(s => s.sectionKey === 'ingredients')?.titleEn,
                    titleKr: data.sections.find(s => s.sectionKey === 'ingredients')?.titleKr,
                    titleVi: data.sections.find(s => s.sectionKey === 'ingredients')?.titleVi,
                    titleJp: data.sections.find(s => s.sectionKey === 'ingredients')?.titleJp,
                    subtitleEn: data.sections.find(s => s.sectionKey === 'ingredients')?.subtitleEn,
                    subtitleKr: data.sections.find(s => s.sectionKey === 'ingredients')?.subtitleKr,
                    subtitleVi: data.sections.find(s => s.sectionKey === 'ingredients')?.subtitleVi,
                    subtitleJp: data.sections.find(s => s.sectionKey === 'ingredients')?.subtitleJp,
                  }
                : undefined
            }
          />
        );
      case 'reviews':
        return (
          <FeedbackSection
            key="reviews"
            language={language}
            reviews={data?.reviews}
            summary={data?.reviewsSummary}
          />
        );
      case 'location':
        return (
          <LocationMapSection
            key="location"
            language={language}
            restaurant={data?.restaurant}
          />
        );
      case 'info':
        // Restaurant information is integrated inside LocationMapSection
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {activeSections ? (
        activeSections.map(sec => renderSectionByKey(sec.sectionKey))
      ) : (
        <>
          {/* Default fallback order when loading or offline */}
          {data?.hero?.isActive !== false && (
            <HeroSection
              setCurrentView={setCurrentView}
              language={language}
              hero={data?.hero}
            />
          )}
          <PhilosophySection
            language={language}
            ingredients={data?.ingredients}
          />
          <FeedbackSection
            language={language}
            reviews={data?.reviews}
            summary={data?.reviewsSummary}
          />
          <LocationMapSection
            language={language}
            restaurant={data?.restaurant}
          />
        </>
      )}
    </div>
  );
};
