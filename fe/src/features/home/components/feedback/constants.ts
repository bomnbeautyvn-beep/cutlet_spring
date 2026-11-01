import { Language, GoogleReview } from '@/types';

export const UI_TEXT: Record<
  Language,
  {
    badge: string;
    reviewsCount: string;
    title: string;
    subtitle: string;
    viewOnMaps: string;
    readMore: string;
    ownerReplyLabel: string;
  }
> = {
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

export const FALLBACK_REVIEWS: GoogleReview[] = [
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

export const INITIAL_COLORS = [
  'bg-[#1b1c1a]',
  'bg-[#af101a]',
  'bg-[#1d4ed8]',
  'bg-[#835500]',
  'bg-[#0f766e]',
];

