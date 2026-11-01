import { Language, HomepageHero } from '@/types';

export interface HeroContentResult {
  badgeText: string;
  tagline: string;
  headline: {
    primary: string;
    sub: string;
    secondary: string;
  };
  description: string;
  ctaText: string;
  dishTitle: string;
  dishDesc: {
    main: string;
    sub: string;
  };
  metrics: {
    m1Val: string;
    m1Label: string;
    m2Val: string;
    m2Label: string;
    m3Val: string;
    m3Label: string;
  };
}

export const useHeroContent = (
  hero: HomepageHero | null | undefined,
  language: Language
): HeroContentResult => {
  const getBadgeText = () => {
    if (!hero) return 'Established 2023';
    switch (language) {
      case 'KR':
        return hero.badgeTextKr || hero.badgeTextEn || '2023년 개업';
      case 'VI':
        return hero.badgeTextVi || hero.badgeTextEn || 'Thành lập 2023';
      case 'JP':
        return hero.badgeTextJp || hero.badgeTextEn || '2023年創業';
      default:
        return hero.badgeTextEn || 'Established 2023';
    }
  };

  const getTagline = () => {
    if (!hero) return '타협하지 않는 원재료와 장인정신';
    switch (language) {
      case 'KR':
        return hero.taglineKr || '타협하지 않는 원재료와 장인정신';
      case 'VI':
        return hero.taglineVi || hero.taglineEn || 'Nguyên liệu chuẩn mực và tinh thần nghệ nhân';
      case 'JP':
        return hero.taglineJp || hero.taglineEn || '妥協なき厳選素材と職人魂';
      default:
        return hero.taglineEn || hero.taglineKr || 'Uncompromising Ingredients and Craftsmanship';
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
      case 'KR':
        return hero.descriptionKr || hero.descriptionEn;
      case 'VI':
        return hero.descriptionVi || hero.descriptionEn;
      case 'JP':
        return hero.descriptionJp || hero.descriptionEn;
      default:
        return hero.descriptionEn;
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
      case 'KR':
        return hero.ctaTextKr || '전체 메뉴 둘러보기';
      case 'VI':
        return hero.ctaTextVi || 'Xem Thực Đơn Đầy Đủ';
      case 'JP':
        return hero.ctaTextJp || 'メニューを見る';
      default:
        return hero.ctaTextEn || 'Explore Full Menu';
    }
  };

  const getDishTitle = () => {
    if (!hero) return 'Signature Hire Katsu Medallion';
    switch (language) {
      case 'KR':
        return hero.dishTitleKr || hero.dishTitleEn || '시그니처 히레카츠 메달리온';
      case 'VI':
        return hero.dishTitleVi || hero.dishTitleEn || 'Signature Hire Katsu Medallion';
      case 'JP':
        return hero.dishTitleJp || hero.dishTitleEn || '極上ヒレカツ メダリオン';
      default:
        return hero.dishTitleEn || 'Signature Hire Katsu Medallion';
    }
  };

  const getDishDesc = () => {
    if (!hero) return { main: 'Natural Rosy Hue', sub: '100% Fully Cooked' };
    switch (language) {
      case 'KR':
        return { main: hero.dishDescKr || '자연스러운 선홍빛', sub: '100% 완벽한 조리' };
      case 'VI':
        return { main: hero.dishDescVi || 'Natural Rosy Hue', sub: '100% Fully Cooked' };
      case 'JP':
        return { main: hero.dishDescJp || '自然な桜色', sub: '100%芯まで火入れ' };
      default:
        return { main: hero.dishDescEn || 'Natural Rosy Hue', sub: '100% Fully Cooked' };
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

  return {
    badgeText: getBadgeText(),
    tagline: getTagline(),
    headline: getHeadline(),
    description: getDescription(),
    ctaText: getCtaText(),
    dishTitle: getDishTitle(),
    dishDesc: getDishDesc(),
    metrics: getMetricLabels(),
  };
};

