import { RestaurantSettings } from './restaurant.types';

export interface HomepageSection {
  id: string;
  sectionKey: string;
  titleEn: string;
  titleKr: string;
  titleVi: string;
  titleJp: string;
  subtitleEn?: string;
  subtitleKr?: string;
  subtitleVi?: string;
  subtitleJp?: string;
  displayOrder: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface UpdateHomepageSectionRequest {
  sectionKey: string;
  titleEn: string;
  titleKr: string;
  titleVi: string;
  titleJp: string;
  subtitleEn?: string;
  subtitleKr?: string;
  subtitleVi?: string;
  subtitleJp?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface HomepageHero {
  id: string;
  titleEn: string;
  titleKr: string;
  titleVi: string;
  titleJp: string;
  headlineEn: string;
  headlineKr: string;
  headlineVi: string;
  headlineJp: string;
  taglineEn?: string;
  taglineKr?: string;
  taglineVi?: string;
  taglineJp?: string;
  descriptionEn: string;
  descriptionKr: string;
  descriptionVi: string;
  descriptionJp: string;
  ctaTextEn: string;
  ctaTextKr: string;
  ctaTextVi: string;
  ctaTextJp: string;
  ctaTarget: string;
  imageUrl?: string;
  imagePublicId?: string;
  badgeTextEn?: string;
  badgeTextKr?: string;
  badgeTextVi?: string;
  badgeTextJp?: string;
  dishTitleEn?: string;
  dishTitleKr?: string;
  dishTitleVi?: string;
  dishTitleJp?: string;
  dishDescEn?: string;
  dishDescKr?: string;
  dishDescVi?: string;
  dishDescJp?: string;
  metric1Value?: string;
  metric1LabelEn?: string;
  metric1LabelKr?: string;
  metric1LabelVi?: string;
  metric1LabelJp?: string;
  metric2Value?: string;
  metric2LabelEn?: string;
  metric2LabelKr?: string;
  metric2LabelVi?: string;
  metric2LabelJp?: string;
  metric3Value?: string;
  metric3LabelEn?: string;
  metric3LabelKr?: string;
  metric3LabelVi?: string;
  metric3LabelJp?: string;
  displayOrder: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface UpdateHomepageHeroRequest {
  titleEn: string;
  titleKr: string;
  titleVi: string;
  titleJp: string;
  headlineEn: string;
  headlineKr: string;
  headlineVi: string;
  headlineJp: string;
  taglineEn?: string;
  taglineKr?: string;
  taglineVi?: string;
  taglineJp?: string;
  descriptionEn: string;
  descriptionKr: string;
  descriptionVi: string;
  descriptionJp: string;
  ctaTextEn: string;
  ctaTextKr: string;
  ctaTextVi: string;
  ctaTextJp: string;
  ctaTarget?: string;
  badgeTextEn?: string;
  badgeTextKr?: string;
  badgeTextVi?: string;
  badgeTextJp?: string;
  dishTitleEn?: string;
  dishTitleKr?: string;
  dishTitleVi?: string;
  dishTitleJp?: string;
  dishDescEn?: string;
  dishDescKr?: string;
  dishDescVi?: string;
  dishDescJp?: string;
  metric1Value?: string;
  metric1LabelEn?: string;
  metric1LabelKr?: string;
  metric1LabelVi?: string;
  metric1LabelJp?: string;
  metric2Value?: string;
  metric2LabelEn?: string;
  metric2LabelKr?: string;
  metric2LabelVi?: string;
  metric2LabelJp?: string;
  metric3Value?: string;
  metric3LabelEn?: string;
  metric3LabelKr?: string;
  metric3LabelVi?: string;
  metric3LabelJp?: string;
  isActive?: boolean;
}

export interface Ingredient {
  id: string;
  nameEn: string;
  nameKr: string;
  nameVi: string;
  nameJp: string;
  subtitleEn?: string;
  subtitleKr?: string;
  subtitleVi?: string;
  subtitleJp?: string;
  descriptionEn: string;
  descriptionKr: string;
  descriptionVi: string;
  descriptionJp: string;
  imageUrl?: string;
  imagePublicId?: string;
  displayOrder: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface SaveIngredientRequest {
  id?: string;
  nameEn: string;
  nameKr: string;
  nameVi: string;
  nameJp: string;
  subtitleEn?: string;
  subtitleKr?: string;
  subtitleVi?: string;
  subtitleJp?: string;
  descriptionEn: string;
  descriptionKr: string;
  descriptionVi: string;
  descriptionJp: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface GoogleReview {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  reviewerAvatarUrl?: string;
  reviewerMetadata?: string;
  rating: number;
  reviewLanguage: string;
  reviewContent: string;
  reviewDate: string;
  ownerResponse?: string;
  ownerResponseDate?: string;
  reviewUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  updatedAt?: string;
}

export interface SaveGoogleReviewRequest {
  id?: string;
  reviewerName: string;
  reviewerInitials?: string;
  reviewerAvatarUrl?: string;
  reviewerMetadata?: string;
  rating: number;
  reviewLanguage: string;
  reviewContent: string;
  reviewDate: string;
  ownerResponse?: string;
  ownerResponseDate?: string;
  reviewUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
}

export interface GoogleReviewsSummary {
  averageRating: number;
  totalReviewsCount: number;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
}

export interface HeaderFooterSettings {
  logoUrl?: string;
  logoPublicId?: string;
  phoneNumber?: string;
  hotlineVisible?: boolean;
  email?: string;
  brandNameEn?: string;
  brandNameKr?: string;
  brandNameVi?: string;
  brandNameJp?: string;
  brandSloganEn?: string;
  brandSloganKr?: string;
  brandSloganVi?: string;
  brandSloganJp?: string;
  footerAboutEn?: string;
  footerAboutKr?: string;
  footerAboutVi?: string;
  footerAboutJp?: string;
  addressEn?: string;
  addressKr?: string;
  addressVi?: string;
  addressJp?: string;
  lunchHours?: string;
  dinnerHours?: string;
  lastOrderTime?: string;
  closedDaysEn?: string;
  closedDaysKr?: string;
  closedDaysVi?: string;
  closedDaysJp?: string;
  policyOneDishEn?: string;
  policyOneDishKr?: string;
  policyOneDishVi?: string;
  policyOneDishJp?: string;
  policyVatEn?: string;
  policyVatKr?: string;
  policyVatVi?: string;
  policyVatJp?: string;
  policyTakeoutEn?: string;
  policyTakeoutKr?: string;
  policyTakeoutVi?: string;
  policyTakeoutJp?: string;
  establishedYear?: string;
  copyrightTextEn?: string;
  copyrightTextKr?: string;
  copyrightTextVi?: string;
  copyrightTextJp?: string;
  updatedAt?: string;
}

export interface UpdateHeaderFooterRequest {
  phoneNumber?: string;
  hotlineVisible?: boolean;
  email?: string;
  brandNameEn: string;
  brandNameKr: string;
  brandNameVi: string;
  brandNameJp: string;
  brandSloganEn?: string;
  brandSloganKr?: string;
  brandSloganVi?: string;
  brandSloganJp?: string;
  footerAboutEn?: string;
  footerAboutKr?: string;
  footerAboutVi?: string;
  footerAboutJp?: string;
  addressEn?: string;
  addressKr?: string;
  addressVi?: string;
  addressJp?: string;
  closedDaysEn?: string;
  closedDaysKr?: string;
  closedDaysVi?: string;
  closedDaysJp?: string;
  policyOneDishEn?: string;
  policyOneDishKr?: string;
  policyOneDishVi?: string;
  policyOneDishJp?: string;
  policyVatEn?: string;
  policyVatKr?: string;
  policyVatVi?: string;
  policyVatJp?: string;
  policyTakeoutEn?: string;
  policyTakeoutKr?: string;
  policyTakeoutVi?: string;
  policyTakeoutJp?: string;
  establishedYear?: string;
  copyrightTextEn?: string;
  copyrightTextKr?: string;
  copyrightTextVi?: string;
  copyrightTextJp?: string;
}

export interface HomepagePublicData {
  sections: HomepageSection[];
  hero: HomepageHero | null;
  ingredients: Ingredient[];
  reviewsSummary: GoogleReviewsSummary;
  reviews: GoogleReview[];
  restaurant: RestaurantSettings;
  headerFooter: HeaderFooterSettings;
}

