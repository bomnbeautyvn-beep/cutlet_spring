import React from 'react';
import { Language, GoogleReview, GoogleReviewsSummary } from '@/types';
import { UI_TEXT, FALLBACK_REVIEWS, INITIAL_COLORS } from './feedback/constants';
import { FeedbackBanner } from './feedback/FeedbackBanner';
import { FeedbackReviewCard } from './feedback/FeedbackReviewCard';

interface FeedbackSectionProps {
  language?: Language;
  reviews?: GoogleReview[];
  summary?: GoogleReviewsSummary;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  language = 'VI',
  reviews,
  summary,
}) => {
  const t = UI_TEXT[language] || UI_TEXT.VI;

  const displayReviews = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  const averageRating = summary?.averageRating ? Number(summary.averageRating).toFixed(1) : '4.8';
  const totalReviewsCount = summary?.totalReviewsCount ? `${summary.totalReviewsCount}+` : '562+';
  const googleMapsUrl =
    summary?.googleMapsUrl ||
    'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h';

  const dynamicSubtitle =
    language === 'KR'
      ? `${totalReviewsCount} 이상의 글로벌 고객이 남겨주신 평균 평점 ${averageRating}/5.0`
      : language === 'VI'
        ? `Điểm trung bình ${averageRating}/5.0 từ ${totalReviewsCount} thực khách ghé thăm`
        : language === 'JP'
          ? `${totalReviewsCount}件以上のお客様から平均評価${averageRating}/5.0を獲得`
          : `Average ${averageRating}/5.0 rating from ${totalReviewsCount} diners`;

  const dynamicReviewCountBadge =
    language === 'KR'
      ? `${totalReviewsCount} 리뷰`
      : language === 'VI'
        ? `${totalReviewsCount} Đánh giá`
        : language === 'JP'
          ? `${totalReviewsCount} レビュー`
          : `${totalReviewsCount} Reviews`;

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 border-b border-[#eae8e5] bg-[#fbf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating Header Banner */}
        <FeedbackBanner
          badge={t.badge}
          dynamicReviewCountBadge={dynamicReviewCountBadge}
          title={t.title}
          dynamicSubtitle={dynamicSubtitle}
          averageRating={averageRating}
          googleMapsUrl={googleMapsUrl}
          viewOnMaps={t.viewOnMaps}
        />

        {/* Real Google Maps Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {displayReviews.map((review, index) => (
            <FeedbackReviewCard
              key={review.id}
              review={review}
              avatarBg={INITIAL_COLORS[index % INITIAL_COLORS.length]}
              ownerReplyLabel={t.ownerReplyLabel}
            />
          ))}
        </div>

        {/* Bottom CTA to read more on Google Maps */}
        <div className="mt-10 text-center">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-label-md text-xs uppercase tracking-wider text-[#af101a] hover:text-[#930010] font-bold hover:underline"
          >
            <span>{t.readMore}</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
};
