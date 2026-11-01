import React from 'react';
import { Language, PageView, HomepageHero } from '@/types';

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
  // Multilingual helper based on selected language
  const getBadgeText = () => {
    if (!hero) return 'Established 2023';
    switch (language) {
      case 'KR': return hero.badgeTextKr || hero.badgeTextEn || '2023년 개업';
      case 'VI': return hero.badgeTextVi || hero.badgeTextEn || 'Thành lập 2023';
      case 'JP': return hero.badgeTextJp || hero.badgeTextEn || '2023年創業';
      default: return hero.badgeTextEn || 'Established 2023';
    }
  };

  const getTagline = () => {
    if (!hero) return '타협하지 않는 원재료와 장인정신';
    switch (language) {
      case 'KR': return hero.taglineKr || '타협하지 않는 원재료와 장인정신';
      case 'VI': return hero.taglineVi || hero.taglineEn || 'Nguyên liệu chuẩn mực và tinh thần nghệ nhân';
      case 'JP': return hero.taglineJp || hero.taglineEn || '妥協なき厳選素材と職人魂';
      default: return hero.taglineEn || hero.taglineKr || 'Uncompromising Ingredients and Craftsmanship';
    }
  };

  const getHeadline = () => {
    if (!hero) {
      return {
        primary: 'Nghệ Thuật Tonkatsu',
        sub: 'Thủ Công',
        secondary: 'The Art of Hand Crafted Cutlets',
      };
    }
    switch (language) {
      case 'KR':
        return {
          primary: hero.headlineKr || '장인정신으로 빚어낸',
          sub: '황금빛 수제 돈카츠',
          secondary: hero.titleKr || '타협 없는 정통 기법의 황금빛 돈카츠',
        };
      case 'VI':
        return {
          primary: hero.headlineVi || 'Nghệ Thuật Tonkatsu',
          sub: 'Thủ Công',
          secondary: hero.titleVi || 'The Art of Hand Crafted Cutlets',
        };
      case 'JP':
        return {
          primary: hero.headlineJp || '職人技が紡ぐ極上',
          sub: '手作りとんかつ',
          secondary: hero.titleJp || '黄金色に輝く極上とんかつ',
        };
      default:
        return {
          primary: hero.headlineEn || 'The Art of Hand Crafted',
          sub: 'Cutlets Atelier',
          secondary: hero.titleEn || 'Precision Fried Golden Tonkatsu',
        };
    }
  };

  const getDescription = () => {
    if (!hero) {
      return '120-hour wet-aged chilled pork, house-baked breadcrumbs freshly ground every dawn, and precision-fried golden cutlets. Served with rich fruit-simmered artisanal demi-glace and crisp mountain cabbage in an intimate Scandinavian-Japanese dining room.';
    }
    switch (language) {
      case 'KR': return hero.descriptionKr || hero.descriptionEn;
      case 'VI': return hero.descriptionVi || hero.descriptionEn;
      case 'JP': return hero.descriptionJp || hero.descriptionEn;
      default: return hero.descriptionEn;
    }
  };

  const getCtaText = () => {
    if (!hero) {
      return language === 'KR'
        ? '전체 메뉴 둘러보기'
        : language === 'VI'
          ? 'Xem Thực Đơn Đầy Đủ'
          : language === 'JP'
            ? 'メニューを見る'
            : 'Explore Full Menu';
    }
    switch (language) {
      case 'KR': return hero.ctaTextKr || '전체 메뉴 둘러보기';
      case 'VI': return hero.ctaTextVi || 'Xem Thực Đơn Đầy Đủ';
      case 'JP': return hero.ctaTextJp || 'メニューを見る';
      default: return hero.ctaTextEn || 'Explore Full Menu';
    }
  };

  const getDishTitle = () => {
    if (!hero) return 'Signature Hire Katsu Medallion';
    switch (language) {
      case 'KR': return hero.dishTitleKr || hero.dishTitleEn || '시그니처 히레카츠 메달리온';
      case 'VI': return hero.dishTitleVi || hero.dishTitleEn || 'Signature Hire Katsu Medallion';
      case 'JP': return hero.dishTitleJp || hero.dishTitleEn || '極上ヒレカツ メダリオン';
      default: return hero.dishTitleEn || 'Signature Hire Katsu Medallion';
    }
  };

  const getDishDesc = () => {
    if (!hero) return { main: 'Natural Rosy Hue', sub: '100% Fully Cooked' };
    switch (language) {
      case 'KR': return { main: hero.dishDescKr || '자연스러운 선홍빛', sub: '100% 완벽한 조리' };
      case 'VI': return { main: hero.dishDescVi || 'Natural Rosy Hue', sub: '100% Fully Cooked' };
      case 'JP': return { main: hero.dishDescJp || '自然な桜色', sub: '100%芯まで火入れ' };
      default: return { main: hero.dishDescEn || 'Natural Rosy Hue', sub: '100% Fully Cooked' };
    }
  };

  const getMetricLabels = () => {
    const m1Val = hero?.metric1Value || '120h';
    const m2Val = hero?.metric2Value || '100%';
    const m3Val = hero?.metric3Value || 'Daily';

    let m1Label = 'Wet-Aged Chilled Pork';
    let m2Label = 'Never Frozen Quality';
    let m3Label = 'Fresh Bakery Panko';

    if (hero) {
      switch (language) {
        case 'KR':
          m1Label = hero.metric1LabelKr || m1Label;
          m2Label = hero.metric2LabelKr || m2Label;
          m3Label = hero.metric3LabelKr || m3Label;
          break;
        case 'VI':
          m1Label = hero.metric1LabelVi || m1Label;
          m2Label = hero.metric2LabelVi || m2Label;
          m3Label = hero.metric3LabelVi || m3Label;
          break;
        case 'JP':
          m1Label = hero.metric1LabelJp || m1Label;
          m2Label = hero.metric2LabelJp || m2Label;
          m3Label = hero.metric3LabelJp || m3Label;
          break;
        default:
          m1Label = hero.metric1LabelEn || m1Label;
          m2Label = hero.metric2LabelEn || m2Label;
          m3Label = hero.metric3LabelEn || m3Label;
          break;
      }
    }

    return { m1Val, m1Label, m2Val, m2Label, m3Val, m3Label };
  };

  const headline = getHeadline();
  const metrics = getMetricLabels();
  const dishDesc = getDishDesc();

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
                {getBadgeText()}
              </span>
            </div>

            {/* Korean / Stylistic Accent Subhead */}
            <span className="text-xl md:text-2xl text-[#af101a] font-bold tracking-tight mb-2">
              {getTagline()}
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
              {getDescription()}
            </p>

            {/* Action Button */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={() => {
                  const target = (hero?.ctaTarget || 'menu') as PageView;
                  setCurrentView(target);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#af101a] text-white font-label-lg text-xs md:text-sm uppercase tracking-wider rounded-lg shadow-md hover:bg-[#d32f2f] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{getCtaText()}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Quick Highlight Metrics / Bento Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f5f3f0] p-4 rounded-xl shadow-xs border border-[#eae8e5]">
              <div className="flex flex-col">
                <span className="font-price-numeral text-2xl text-[#af101a] font-extrabold">{metrics.m1Val}</span>
                <span className="font-body-sm text-xs text-[#585757]">{metrics.m1Label}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-price-numeral text-2xl text-[#1b1c1a] font-extrabold">{metrics.m2Val}</span>
                <span className="font-body-sm text-xs text-[#585757]">{metrics.m2Label}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-price-numeral text-2xl text-[#835500] font-extrabold">{metrics.m3Val}</span>
                <span className="font-body-sm text-xs text-[#585757]">{metrics.m3Label}</span>
              </div>
            </div>
          </div>

          {/* Right Visual (5 Cols): Chopstick Holding Pink Cutlet + Editorial Seals */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Background Atmospheric Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#feae2c]/20 via-[#ffdad6]/20 to-transparent rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>

            {/* Hero Dish Visual Frame */}
            <div className="relative w-full max-w-md p-2 overflow-hidden">
              <div className="relative w-full h-[440px] sm:h-[480px] rounded-xl overflow-hidden bg-[#f3f1ec] border border-[#eae6df] group flex flex-col items-center justify-center select-none">
                {hero?.imageUrl ? (
                  <img
                    src={hero.imageUrl}
                    alt={getDishTitle()}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#d5cfc5] border-t-[#af101a] animate-spin" />
                    <span className="font-menu-bar text-xs sm:text-sm uppercase tracking-widest font-bold text-[#8f6f6c]">
                      Photo Loading...
                    </span>
                    <span className="font-kr-serif text-[11px] sm:text-xs text-[#a89d91]">
                      사진 준비 중
                    </span>
                  </div>
                )}

                {/* Overlaid Editorial Kanji/Hangul Stamp */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded shadow-sm border border-[#eae8e5]">
                  <span className="font-label-md text-xs tracking-widest text-[#af101a] uppercase font-bold block">
                    봄돈까스
                  </span>
                  <span className="font-body-sm text-[10px] text-[#585757] block">
                    AUTUMN BATCH
                  </span>
                </div>

                {/* Vertical Accent Seal Box */}
                <div className="absolute top-4 right-4 bg-[#af101a] text-white px-2.5 py-3.5 rounded flex flex-col items-center justify-center shadow-lg">
                  <span className="font-label-md text-[11px] [writing-mode:vertical-rl] tracking-widest uppercase font-bold">
                    수제 빵가루
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#feae2c] mt-2"></span>
                </div>

                {/* Bottom Floating Spec Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-md flex items-center justify-between border border-[#eae8e5]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#af101a] text-[20px]">
                      restaurant
                    </span>
                    <div>
                      <span className="font-title-md text-xs font-bold text-[#1b1c1a] block">
                        {getDishTitle()}
                      </span>
                      <div className="font-body-sm text-[11px] text-[#585757] leading-tight">
                        <div>{dishDesc.main}</div>
                        <div className="text-[10px] text-[#835500] font-medium">{dishDesc.sub}</div>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#feae2c]/30 text-[#835500] font-label-md text-[10px] uppercase font-bold rounded">
                    BEST
                  </span>
                </div>
              </div>

              {/* Footnote Under Cutlet */}
              <div className="mt-3 flex items-center justify-end px-1">
                <button
                  onClick={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-label-md text-[#af101a] font-bold text-xs hover:underline cursor-pointer flex items-center gap-1 group"
                >
                  <span>{getCtaText()}</span>
                  <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
