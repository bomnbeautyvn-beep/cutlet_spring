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
    <section className="space-y-4 sm:space-y-6 scroll-mt-28 sm:scroll-mt-32" id={id}>
      <div className="pb-2.5 flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-3">
        <div>
          <h2 className="font-menu-bar text-2xl sm:text-3xl lg:text-4xl text-[#1b1c1a] tracking-tight">
            {titleEn}
          </h2>
          <p className="font-kr-serif text-xs sm:text-sm text-[#5b403d] mt-1">
            {subtitleKr}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          {note && (
            <span className="text-xs sm:text-sm text-[#585757] italic block font-medium">
              {note}
            </span>
          )}
          <span className="text-[11px] sm:text-xs text-[#8f6f6c] italic block mt-0.5">
            Prices do not include VAT 8%
          </span>
        </div>
      </div>

      {children}
    </section>
  );
};
