import React from 'react';
import { PageView } from '@/types';

interface HeroDishVisualProps {
  imageUrl?: string;
  dishTitle: string;
  dishDesc: {
    main: string;
    sub: string;
  };
  ctaText: string;
  onNavigateMenu: () => void;
}

export const HeroDishVisual: React.FC<HeroDishVisualProps> = ({
  imageUrl,
  dishTitle,
  dishDesc,
  ctaText,
  onNavigateMenu,
}) => {
  return (
    <div className="lg:col-span-5 relative flex justify-center items-center">
      {/* Background Atmospheric Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#feae2c]/20 via-[#ffdad6]/20 to-transparent rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>

      {/* Hero Dish Visual Frame */}
      <div className="relative w-full max-w-md p-2 overflow-hidden">
        <div className="relative w-full h-[440px] sm:h-[480px] rounded-xl overflow-hidden bg-[#f3f1ec] border border-[#eae6df] group flex flex-col items-center justify-center select-none">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={dishTitle}
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
                  {dishTitle}
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
            type="button"
            onClick={onNavigateMenu}
            className="font-label-md text-[#af101a] font-bold text-xs hover:underline cursor-pointer flex items-center gap-1 group"
          >
            <span>{ctaText}</span>
            <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

