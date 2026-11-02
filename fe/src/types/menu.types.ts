export type DishCategory = 'japanese' | 'korean' | 'curry' | 'noodles' | 'addons' | 'sauces' | 'drinks';

export interface MenuCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
  active: boolean;
  assignedCount?: number;
}

export interface CategoryPayload {
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface MenuBadge {
  id: string;
  code: string;
  name: string;
  nameVi?: string;
  nameKr?: string;
  nameJp?: string;
  description?: string;
  badgeColor?: string;
  icon?: string;
  displayOrder: number;
  active: boolean;
  assignedCount?: number;
}

export interface BadgeRequest {
  code: string;
  name: string;
  nameVi?: string;
  nameKr?: string;
  nameJp?: string;
  description?: string;
  badgeColor?: string;
  icon?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface MenuSizeOption {
  id?: string;
  label: string;
  price: number;
  displayOrder?: number;
}

export interface MenuSauceOption {
  id?: string;
  name: string;
  displayOrder?: number;
}

export interface MenuAddon {
  id?: string;
  name: string;
  price: number;
  displayOrder?: number;
}

export interface MenuItem {
  id: string;
  nameEn: string;
  nameKr: string;
  nameKrSubtitle?: string;
  nameJp?: string;
  nameVi?: string;
  category: DishCategory;
  price: number; // in thousands VND, e.g. 200 = 200.000 VND
  priceFormatted?: string;
  prepTimeMinutes?: number;
  image?: string;
  imagePublicId?: string;
  imagePosition?: string;
  altText?: string;
  descriptionEn?: string;
  descriptionKr?: string;
  descriptionVi?: string;
  descriptionJp?: string;
  portionEn?: string;
  portionVi?: string;
  portionKr?: string;
  portionJp?: string;
  tags?: string[];
  dishTypes: string[]; // for filtering: 'pork', 'chicken', 'cheese', 'spicy', 'noodles', 'drinks'
  isBestSeller?: boolean;
  bestSeller?: boolean;
  isChefSignature?: boolean;
  chefSignature?: boolean;
  isLimited?: boolean;
  limited?: boolean;
  isSpicy?: boolean;
  spicy?: boolean;
  spiceLevel?: number; // 1, 2, 3
  spiceNote?: string;
  sizes?: MenuSizeOption[];
  sauceOptions?: string[];
  addons?: MenuAddon[];
  badges?: MenuBadge[];
  badgeIds?: string[];
  subBullet1?: string;
  subBullet2?: string;
  features?: string[];
  active?: boolean;
  displayOrder?: number;
}
