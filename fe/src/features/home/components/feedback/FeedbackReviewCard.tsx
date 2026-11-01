import React from 'react';
import { GoogleReview } from '@/types';

interface FeedbackReviewCardProps {
  review: GoogleReview;
  avatarBg: string;
  ownerReplyLabel: string;
}

export const FeedbackReviewCard: React.FC<FeedbackReviewCardProps> = ({
  review,
  avatarBg,
  ownerReplyLabel,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#eae8e5] bg-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Header: Stars */}
        <div className="flex items-center text-amber-500 mb-3">
          {[...Array(review.rating || 5)].map((_, i) => (
            <span key={i} className="material-symbols-outlined text-[17px] fill-1">
              star
            </span>
          ))}
        </div>

        {/* Local Guide Credential Tag */}
        {review.reviewerMetadata && (
          <div className="mb-3">
            <span className="text-[10px] font-bold text-[#835500] bg-[#feae2c]/15 px-2 py-0.5 rounded-full border border-[#feae2c]/30 inline-block">
              {review.reviewerMetadata}
            </span>
          </div>
        )}

        {/* Main Quote in original native language */}
        <p className="font-body-md text-xs sm:text-[13px] leading-relaxed text-[#2a241f] italic">
          &ldquo;{review.reviewContent}&rdquo;
        </p>

        {/* Owner Response Box in corresponding language */}
        {review.ownerResponse && (
          <div className="mt-4 p-3 rounded-xl bg-[#f5f3f0] border-l-2 border-[#af101a] text-[11px] text-[#5b403d] space-y-1">
            <span className="font-bold text-[#af101a] uppercase text-[10px] block tracking-wide">
              {ownerReplyLabel}
            </span>
            <p className="line-clamp-4 leading-relaxed text-[11px]">
              {review.ownerResponse}
            </p>
          </div>
        )}
      </div>

      {/* Author Footer */}
      <div className="mt-5 pt-4 border-t border-[#f2ede7] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {review.reviewerAvatarUrl ? (
            <img
              src={review.reviewerAvatarUrl}
              alt={review.reviewerName}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs ${avatarBg}`}
            >
              {review.reviewerInitials || review.reviewerName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-title-md text-xs sm:text-sm font-bold text-[#1b1c1a] truncate">
              {review.reviewerName}
            </h4>
            <span className="font-body-sm text-[10px] sm:text-[11px] text-[#786659] block">
              {review.reviewDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

