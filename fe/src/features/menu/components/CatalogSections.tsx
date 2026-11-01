import React from 'react';
import { MenuItem } from '@/types';
import { DishCard, CompactItemCard, MenuSection } from '@/features/menu/components';

interface CatalogSectionsProps {
  japaneseItems: MenuItem[];
  koreanItems: MenuItem[];
  curryItems: MenuItem[];
  noodleItems: MenuItem[];
  addonItems: MenuItem[];
  sauceItems: MenuItem[];
  drinkItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export const CatalogSections: React.FC<CatalogSectionsProps> = ({
  japaneseItems,
  koreanItems,
  curryItems,
  noodleItems,
  addonItems,
  sauceItems,
  drinkItems,
  onSelectItem,
}) => {
  return (
    <main className="lg:col-span-9 xl:col-span-10 space-y-12 sm:space-y-16">
      {/* 01. JAPANESE TONKATSU */}
      <MenuSection
        id="cat-japanese"
        titleEn="Japanese Tonkatsu"
        subtitleKr="일본식 정통 카츠 • Deep golden coarse panko fried at precision dual temperatures"
        note="All sets include cabbage, miso broth, pickles & pearl rice"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {japaneseItems.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              isFeatured={item.isChefSignature}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </MenuSection>

      {/* 02. KOREAN TONKATSU */}
      <MenuSection
        id="cat-korean"
        titleEn="Korean Tonkatsu"
        subtitleKr="경양식 돈까스 • 1980s Retro Seoul style thin-pounded crispy pork cutlets"
        note="Served with homemade cream corn soup, rice & spicy kimchi"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {koreanItems.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </MenuSection>

      {/* 03. CURRY SET */}
      <MenuSection
        id="cat-curry"
        titleEn="Curry Set"
        subtitleKr="수제 카레라이스 • 48-hour slow-simmered caramelized onion Japanese spiced curry"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {curryItems.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </MenuSection>

      {/* 04. NOODLES */}
      <MenuSection
        id="cat-noodles"
        titleEn="Noodles"
        subtitleKr="면 요리 • Chilled buckwheat soba & Sanuki udon with savory bonito dashi broth"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {noodleItems.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </MenuSection>

      {/* 05. ADD-ONS */}
      <MenuSection
        id="cat-addons"
        titleEn="Add-ons"
        subtitleKr="사이드 및 추가 메뉴 • Individual katsu pieces, extra soup, warm pearl rice & sides"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {addonItems.map((item) => (
            <CompactItemCard
              key={item.id}
              item={item}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </MenuSection>

      {/* 06. SAUCES */}
      <MenuSection
        id="cat-sauces"
        titleEn="Sauces"
        subtitleKr="소스 추가 • House-made tonkatsu sauces, spicy retro sauce, curry & artisanal dips"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {sauceItems.map((item) => (
            <CompactItemCard
              key={item.id}
              item={item}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </MenuSection>

      {/* 07. DRINKS */}
      <MenuSection
        id="cat-drinks"
        titleEn="Drinks"
        subtitleKr="음료 및 주류 • Craft beer, chilled sakes, Japanese sodas & mineral waters"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {drinkItems.map((item) => (
            <CompactItemCard
              key={item.id}
              item={item}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </MenuSection>
    </main>
  );
};

