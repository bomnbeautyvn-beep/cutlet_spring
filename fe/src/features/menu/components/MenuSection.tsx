import React from 'react';

interface MenuSectionProps {
  id: string;
  titleEn: string;
  subtitleKr: string;
  note?: string;
  children: React.ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  id,
  titleEn,
  subtitleKr,
  note,
  children,
}) => {
  return (
    <section className="space-y-6 sm:space-y-8 scroll-mt-28 sm:scroll-mt-32" id={id}>
      {/* Section Header with generous, elegant artisanal spacing */}
      <div className="pb-3.5 sm:pb-4 border-b border-[#eae8e5]/80 flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-6">
        {/* Title and Multilingual Description */}
        <div className="space-y-2 min-w-0 max-w-2xl">
          <h2 className="font-menu-bar text-2xl sm:text-3xl lg:text-4xl text-[#1b1c1a] tracking-tight leading-tight">
            {titleEn}
          </h2>
          <p className="font-kr-serif text-xs sm:text-sm text-[#5b403d] leading-relaxed break-words">
            {subtitleKr}
          </p>
        </div>

        {/* Dining Notes & VAT Notice - clearly separated */}
        <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0 space-y-1.5 sm:space-y-2">
          {note && (
            <span className="text-xs sm:text-sm text-[#585757] italic block font-medium leading-snug break-words">
              {note}
            </span>
          )}
          <span className="text-[11px] sm:text-xs text-[#8f6f6c] italic block font-normal leading-normal">
            Prices do not include VAT 8%
          </span>
        </div>
      </div>

      {children}
    </section>
  );
};
