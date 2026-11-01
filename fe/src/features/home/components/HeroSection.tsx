import React from 'react';
import { Language, PageView, HomepageHero } from '@/types';
import { useHeroContent } from './hero/useHeroContent';
import { HeroBentoMetrics } from './hero/HeroBentoMetrics';
import { HeroDishVisual } from './hero/HeroDishVisual';

interface HeroSectionProps {
  setCurrentView: (view: PageView) => void;
  language: Language;
  hero?: HomepageHero | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setCurrentView,
  language,
  hero,
}) => {
  const {
    badgeText,
    tagline,
    headline,
    description,
    ctaText,
    dishTitle,
    dishDesc,
    metrics,
  } = useHeroContent(hero, language);

  const handleCtaClick = () => {
    const target = (hero?.ctaTarget || 'menu') as PageView;
    setCurrentView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#fbf9f6] py-12 lg:py-20 border-b border-[#eae8e5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col z-10">
            {/* Overline Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#eae8e5] rounded-full font-label-md text-xs uppercase tracking-widest text-[#1b1c1a] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#af101a]"></span>
                {badgeText}
              </span>
            </div>

            {/* Korean / Stylistic Accent Subhead */}
            <span className="text-xl md:text-2xl text-[#af101a] font-bold tracking-tight mb-2">
              {tagline}
            </span>

            {/* Main Multilingual Headline */}
            <h1 className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl text-[#1b1c1a] font-bold leading-[1.12] mb-5">
              {headline.primary} <br />
              <span className="inline-block">{headline.sub}</span>
              <span className="italic font-normal text-[#5b403d] block mt-1">
                {headline.secondary}
              </span>
            </h1>

            {/* Body Description */}
            <p className="font-body-lg text-sm sm:text-base text-[#5b403d] max-w-xl mb-8 leading-relaxed">
              {description}
            </p>

            {/* Action Button */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                type="button"
                onClick={handleCtaClick}
                className="px-6 py-3.5 bg-[#af101a] text-white font-label-lg text-xs md:text-sm uppercase tracking-wider rounded-lg shadow-md hover:bg-[#d32f2f] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{ctaText}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Quick Highlight Metrics / Bento Bar */}
            <HeroBentoMetrics metrics={metrics} />
          </div>

          {/* Right Visual (5 Cols): Chopstick Holding Pink Cutlet + Editorial Seals */}
          <HeroDishVisual
            imageUrl={hero?.imageUrl}
            dishTitle={dishTitle}
            dishDesc={dishDesc}
            ctaText={ctaText}
            onNavigateMenu={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </div>
    </section>
  );
};
