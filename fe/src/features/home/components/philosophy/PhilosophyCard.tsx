import React from 'react';
import { Language, Ingredient } from '@/types';

interface PhilosophyCardProps {
  item: Ingredient;
  language: Language;
}

export const PhilosophyCard: React.FC<PhilosophyCardProps> = ({ item, language }) => {
  const isVietnamesePrimary = language === 'VI';

  return (
    <div className="flex flex-col justify-between space-y-4">
      <div>
        {/* Top Image Frame */}
        <div className="w-full h-44 rounded-xl overflow-hidden bg-[#f3f1ec] border border-[#eae6df] flex flex-col items-center justify-center mb-4 select-none shrink-0 relative group">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.nameEn}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 text-[#8f6f6c]">
              <div className="w-6 h-6 rounded-full border-2 border-[#d5cfc5] border-t-[#af101a] animate-spin" />
              <span className="font-menu-bar text-[10px] uppercase tracking-widest font-bold text-[#8f6f6c]">
                Photo Loading...
              </span>
              <span className="font-kr-serif text-[10px] text-[#a89d91]">사진 준비 중</span>
            </div>
          )}
        </div>

        {/* Multilingual Titles: Korean -> English -> Vietnamese -> Japanese */}
        <div className="space-y-1 mb-3 pb-2.5 border-b border-[#eae8e5]/80">
          <h3 className="font-kr-serif text-lg font-bold text-[#1b1c1a] leading-tight">
            {item.nameKr}
          </h3>
          <div className="font-menu-title text-sm font-bold text-[#1b1c1a] uppercase tracking-wide">
            {item.nameEn}
          </div>
          <div className="font-body-md text-xs sm:text-sm text-[#8f6f6c] font-medium italic">
            {item.nameVi}
          </div>
          <div className="font-jp-serif text-xs text-[#585757]">{item.nameJp}</div>
        </div>

        {/* Descriptions */}
        <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed">
          {isVietnamesePrimary ? (
            <>
              <p className="font-body-md text-[#1b1c1a] leading-relaxed">{item.descriptionVi}</p>
              <p className="font-body-md text-[#585757] italic border-t border-[#eae8e5]/60 pt-2.5 leading-relaxed">
                {item.descriptionEn}
              </p>
            </>
          ) : language === 'KR' ? (
            <>
              <p className="font-body-md text-[#1b1c1a] leading-relaxed">
                {item.descriptionKr || item.descriptionEn}
              </p>
              <p className="font-body-md text-[#585757] italic border-t border-[#eae8e5]/60 pt-2.5 leading-relaxed">
                {item.descriptionEn}
              </p>
            </>
          ) : language === 'JP' ? (
            <>
              <p className="font-body-md text-[#1b1c1a] leading-relaxed">
                {item.descriptionJp || item.descriptionEn}
              </p>
              <p className="font-body-md text-[#585757] italic border-t border-[#eae8e5]/60 pt-2.5 leading-relaxed">
                {item.descriptionEn}
              </p>
            </>
          ) : (
            <>
              <p className="font-body-md text-[#1b1c1a] leading-relaxed">{item.descriptionEn}</p>
              <p className="font-body-md text-[#585757] italic border-t border-[#eae8e5]/60 pt-2.5 leading-relaxed">
                {item.descriptionVi}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

