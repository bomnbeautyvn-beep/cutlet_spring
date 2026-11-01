import React from 'react';

interface FeedbackBannerProps {
  badge: string;
  dynamicReviewCountBadge: string;
  title: string;
  dynamicSubtitle: string;
  averageRating: string;
  googleMapsUrl: string;
  viewOnMaps: string;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  badge,
  dynamicReviewCountBadge,
  title,
  dynamicSubtitle,
  averageRating,
  googleMapsUrl,
  viewOnMaps,
}) => {
  return (
    <div className="bg-[#f5f3f0] border border-[#eae8e5] rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
          {/* Left Rating Box */}
          <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex flex-col items-center justify-center bg-white border border-[#eae8e5] rounded-xl px-4 py-2 sm:px-5 sm:py-3 shadow-2xs shrink-0 min-w-[76px] sm:min-w-[90px]">
              <span className="font-headline-lg text-3xl sm:text-5xl font-extrabold text-[#1b1c1a] leading-none">
                {averageRating}
              </span>
              <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[13px] sm:text-[16px] fill-1"
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            {/* Mobile-only badge header next to rating */}
            <div className="sm:hidden flex-1 pl-1">
              <span className="font-label-md text-[10px] text-[#af101a] font-bold uppercase tracking-wider block">
                {badge}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eae8e5] text-[#5b403d]">
                  {dynamicReviewCountBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-label-md text-[11px] text-[#af101a] font-bold uppercase tracking-widest block">
                {badge}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eae8e5] text-[#5b403d]">
                {dynamicReviewCountBadge}
              </span>
            </div>
            <h2 className="font-headline-lg text-lg sm:text-2xl lg:text-3xl font-bold text-[#1b1c1a] leading-tight">
              {title}
            </h2>
            <p className="font-body-sm text-xs sm:text-sm text-[#585757] mt-1 leading-relaxed">
              {dynamicSubtitle}
            </p>
          </div>
        </div>

        {/* Link to Google Maps */}
        <div className="w-full lg:w-auto shrink-0 pt-1 lg:pt-0">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl bg-white hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] font-label-md text-xs uppercase tracking-wider font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer text-center group active:scale-98"
          >
            <span>{viewOnMaps}</span>
            <span className="material-symbols-outlined text-[16px] text-[#af101a] transition-transform group-hover:translate-x-0.5">
              open_in_new
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

