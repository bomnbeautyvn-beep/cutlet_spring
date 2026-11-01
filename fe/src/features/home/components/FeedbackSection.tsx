import React from 'react';
import { Language, GoogleReview, GoogleReviewsSummary } from '@/types';

interface FeedbackSectionProps {
  language?: Language;
  reviews?: GoogleReview[];
  summary?: GoogleReviewsSummary;
}

const UI_TEXT: Record<Language, {
  badge: string;
  reviewsCount: string;
  title: string;
  subtitle: string;
  viewOnMaps: string;
  readMore: string;
  ownerReplyLabel: string;
}> = {
  VI: {
    badge: 'Đánh Giá Thực Tế Từ Google Maps',
    reviewsCount: '562+ Đánh giá',
    title: '봄돈까스 - Cutlet Spring Thảo Điền',
    subtitle: 'Điểm trung bình 4.8/5.0 từ 562+ thực khách Việt Nam và quốc tế ghé thăm',
    viewOnMaps: 'Xem trên Google Maps',
    readMore: 'Đọc thêm toàn bộ 562+ đánh giá của khách trên Google Maps',
    ownerReplyLabel: 'Phản hồi từ Cutlet Spring:',
  },
  KR: {
    badge: '구글 맵 실제 고객 리뷰',
    reviewsCount: '562+ 리뷰',
    title: '봄돈까스 - Cutlet Spring Thảo Điền',
    subtitle: '562명 이상의 글로벌 고객이 남겨주신 평균 평점 4.8/5.0',
    viewOnMaps: 'Google Maps에서 보기',
    readMore: 'Google Maps에서 562개 이상의 리뷰 모두 보기',
    ownerReplyLabel: '봄돈까스 대표 답변:',
  },
  EN: {
    badge: 'Real Google Maps Reviews',
    reviewsCount: '562+ Reviews',
    title: '봄돈까스 - Cutlet Spring Thảo Điền',
    subtitle: 'Average 4.8/5.0 rating from 562+ local and international diners',
    viewOnMaps: 'View on Google Maps',
    readMore: 'Read all 562+ reviews on Google Maps',
    ownerReplyLabel: 'Response from Cutlet Spring:',
  },
  JP: {
    badge: 'Googleマップのリアルなクチコミ',
    reviewsCount: '562+ レビュー',
    title: '봄돈까스 - Cutlet Spring Thảo Điền',
    subtitle: '562名以上の国内外のお客様から平均評価4.8/5.0を獲得',
    viewOnMaps: 'Googleマップで見る',
    readMore: 'Googleマップで562件以上のクチコミをすべて見る',
    ownerReplyLabel: 'オーナーからの返信:',
  },
};

const FALLBACK_REVIEWS: GoogleReview[] = [
  {
    id: 'review-vietnamese',
    rating: 5,
    reviewerName: 'Bích Trâm 한유미',
    reviewerInitials: 'BT',
    reviewerMetadata: 'Local Guide · 85 reviews · 232 photos',
    reviewLanguage: 'VI',
    reviewDate: '1 tháng trước',
    reviewContent:
      'Chội ôi donkatsu ở đây siu mềm siu ngon lun ý, sau tiệm donkatsu ở khu Lê Thánh Tôn mình cứ tưởng k tìm được chỗ nào ngon nữa. Nhưng ở đây thực sự rất khác biệt, đề xuất mọi người gọi ansim donkatsu chấm nước sốt siu cuốn 😋',
    ownerResponse:
      'Cutlet Spring cám ơn chị Bích Trâm ạ! Nhà hàng rất vui khi được chị yêu thích món ansim donkatsu và sẽ luôn nỗ lực giữ trọn chất lượng phục vụ.',
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'review-korean',
    rating: 5,
    reviewerName: 'KON Nam',
    reviewerInitials: 'KN',
    reviewerMetadata: 'Local Guide · 41 reviews · 66 photos',
    reviewLanguage: 'KR',
    reviewDate: '1주일 전',
    reviewContent:
      '한국보다 맛있는 돈까스. 요즘 일본 매체에도 소개되었는지 일본인들도 많고 서양인 베트남인 등 다양한 국적의 사람들이 즐기고 있음. 사장님께서도 나와서 손님응대와 먹는법 등 잘 알려주셔서 믿음이 감.',
    ownerResponse:
      '찾아주셔서 진심으로 감사드립니다! 앞으로도 초심을 잃지 않고 언제나 변함없는 맛과 정성스러운 서비스로 보답하는 봄돈까스가 되겠습니다.',
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'review-english',
    rating: 5,
    reviewerName: 'The MY World',
    reviewerInitials: 'MW',
    reviewerMetadata: 'Local Guide · 2,165 reviews · 18,526 photos',
    reviewLanguage: 'EN',
    reviewDate: '1 week ago',
    reviewContent:
      "It's Korean style Cutlet restaurant. I visited here at lunch, then I had normal mixed one, the quality was really good and the volume was quite big. I think this restaurant is one of the best Cutlet restaurant in HCMC so far, including Japanese tonkatsu restaurants.",
    ownerResponse:
      'Hello, I’m the owner of Cutlet Spring. As a Korean owner, I strive to serve authentic Japanese-style tonkatsu with a Korean touches of our own. Thank you so much for visiting Cutlet Spring!',
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'review-japanese',
    rating: 5,
    reviewerName: 'shimizu kengo',
    reviewerInitials: 'SK',
    reviewerMetadata: 'Local Guide · 21 reviews · 28 photos',
    reviewLanguage: 'JA',
    reviewDate: '2週間前',
    reviewContent:
      '日本人の友人の勧めで訪問しました。ロースカツの追加ができなかったので、ヒレ＆カレーセットを注文し、ロースをトッピングしました。ロースもヒレもカレーもどれも美味しかったです！外はサクサクで中はとてもジューシーでした。',
    ownerResponse:
      'ご来店いただき、温かいレビューをありがとうございます！これからも本場仕込みのサクサクでジューシーなとんかつをお届けできるよう努めてまいります。またのお越しを心よりお待ちしております。',
    isFeatured: true,
    isActive: true,
    displayOrder: 4,
  },
];

const INITIAL_COLORS = ['bg-[#1b1c1a]', 'bg-[#af101a]', 'bg-[#1d4ed8]', 'bg-[#835500]', 'bg-[#0f766e]'];

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
        {/* Rating Header Banner - Fully Responsive */}
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
                      <span key={i} className="material-symbols-outlined text-[13px] sm:text-[16px] fill-1">
                        star
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mobile-only badge header next to rating */}
                <div className="sm:hidden flex-1 pl-1">
                  <span className="font-label-md text-[10px] text-[#af101a] font-bold uppercase tracking-wider block">
                    {t.badge}
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
                    {t.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eae8e5] text-[#5b403d]">
                    {dynamicReviewCountBadge}
                  </span>
                </div>
                <h2 className="font-headline-lg text-lg sm:text-2xl lg:text-3xl font-bold text-[#1b1c1a] leading-tight">
                  {t.title}
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
                <span>{t.viewOnMaps}</span>
                <span className="material-symbols-outlined text-[16px] text-[#af101a] transition-transform group-hover:translate-x-0.5">
                  open_in_new
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Real Google Maps Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {displayReviews.map((review, index) => {
            const avatarBg = INITIAL_COLORS[index % INITIAL_COLORS.length];
            return (
              <div
                key={review.id}
                className="flex flex-col justify-between rounded-2xl border border-[#eae8e5] bg-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
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
                        {t.ownerReplyLabel}
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
          })}
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
