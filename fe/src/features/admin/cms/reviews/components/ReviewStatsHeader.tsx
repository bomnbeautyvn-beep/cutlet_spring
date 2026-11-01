import React from 'react';
import { GoogleReviewsSummary } from '@/types';

interface ReviewStatsHeaderProps {
  summary: GoogleReviewsSummary | null;
  onAddReview: () => void;
}

export const ReviewStatsHeader: React.FC<ReviewStatsHeaderProps> = ({
  summary,
  onAddReview,
}) => {
  const avgRating = summary?.averageRating ? Number(summary.averageRating).toFixed(1) : '4.8';
  const totalCount = summary?.totalReviewsCount || 562;

  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] flex flex-col items-center justify-center shadow-2xs shrink-0">
          <span className="font-headline-lg text-2xl font-extrabold text-[#1b1c1a] leading-none">
            {avgRating}
          </span>
          <div className="flex items-center text-amber-500 mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined text-[12px] fill-1">
                star
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-label-md text-xs uppercase tracking-widest text-[#af101a] font-bold">
              Google Maps Verified Feedback
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eae8e5] text-[#5b403d]">
              {totalCount}+ Reviews Total
            </span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a] mt-0.5">
            봄돈까스 - Cutlet Spring Thảo Điền
          </h3>
          <span className="text-xs text-[#585757] block">
            Curate featured guest experiences and publish authentic owner replies
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddReview}
        className="px-5 py-2.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">add_comment</span>
        <span>Add Curated Review</span>
      </button>
    </div>
  );
};

