import React from 'react';
import { Language, Ingredient } from '@/types';

interface PhilosophySectionProps {
  language?: Language;
  ingredients?: Ingredient[];
  sectionTitle?: {
    titleEn?: string;
    titleKr?: string;
    titleVi?: string;
    titleJp?: string;
    subtitleEn?: string;
    subtitleKr?: string;
    subtitleVi?: string;
    subtitleJp?: string;
  };
}

const FALLBACK_INGREDIENTS: Ingredient[] = [
  {
    id: 'chilled-pork',
    nameKr: '냉장육',
    nameEn: 'Chilled Pork',
    nameVi: 'Thịt Heo Mát',
    nameJp: 'チルドポーク',
    subtitleEn: '120-Hour Wet Aging',
    subtitleKr: '120시간 저온 습식숙성',
    subtitleVi: 'Ủ Lạnh 120 Giờ',
    subtitleJp: '120時間低温熟成',
    descriptionEn:
      'We serve fresh chilled pork that has never been frozen. Our owner personally trims and inspects each cut of pork, removing any pieces that do not meet our standards. The pork is then chilled and aged for 120 hours to achieve better tenderness and flavor.',
    descriptionKr:
      '저희는 한 번도 얼리지 않은 최상급 신선 냉장육만을 고집합니다. 대표가 직접 모든 원육을 손질하고 엄격하게 선별하여 기준에 미치지 못하는 부위는 과감히 제외합니다. 이후 120시간 동안 정밀한 저온 습식 숙성을 거쳐 최상의 부드러움과 깊은 풍미를 완성합니다.',
    descriptionVi:
      'Chúng tôi sử dụng thịt heo mát tươi, chưa từng qua đông lạnh. Chủ quán trực tiếp sơ chế và kiểm tra từng miếng thịt, loại bỏ những phần không đạt tiêu chuẩn. Sau đó, thịt được ủ mát trong 120h để đạt độ mềm và hương vị tốt hơn.',
    descriptionJp:
      '当店では一度も冷凍していない新鮮なチルドポークのみを使用しています。店主自ら一枚一枚丁寧にトリミング・検品し、基準に満たない肉は一切使用しません。その後120時間じっくりとウェットエイジング熟成させ、極上の柔らかさと旨味を引き出します。',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'breadcrumbs',
    nameKr: '빵가루',
    nameEn: 'Breadcrumbs',
    nameVi: 'Bột Chiên Xù',
    nameJp: 'パン粉',
    subtitleEn: 'Daily In-House Bakery Panko',
    subtitleKr: '매일 새벽 직접 굽는 생빵가루',
    subtitleVi: 'Nướng Bánh & Xay Mới Mỗi Sáng',
    subtitleJp: '毎朝焼き上げる自家製生パン粉',
    descriptionEn:
      'House-baked bread, made fresh every morning, is turned into our signature breadcrumbs for a crispy, light, and non-greasy coating.',
    descriptionKr:
      '매일 새벽 매장에서 정성스럽게 직접 구워낸 신선한 식빵을 적정 입자로 분쇄하여 사용합니다. 튀김옷이 기름을 머금지 않고 시간이 지나도 가볍고 바삭한 식감을 유지합니다.',
    descriptionVi:
      'Chúng tôi tự nướng bánh mì mới mỗi sáng và xay thành loại bột chiên xù đặc trưng của quán. Lớp áo chiên nhờ vậy giòn rụm, nhẹ và không ngấy mỡ.',
    descriptionJp:
      '毎朝店内で焼き上げる自家製食パンを、最適な粗さで挽いた特製生パン粉を使用。油切れが良く、軽やかでサクサクとした心地よい食感が長続きします。',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'tonkatsu-sauce-dressing',
    nameKr: '돈카츠 소스 & 드레싱',
    nameEn: 'Tonkatsu Sauce & Dressing',
    nameVi: 'Sốt Tonkatsu & Dressing',
    nameJp: 'とんかつソース & ドレッシング',
    subtitleEn: 'Artisanal Fruit-Simmered Sauce',
    subtitleKr: '생과채를 듬뿍 졸인 수제 비법 소스',
    subtitleVi: 'Sốt Trái Cây Thủ Công',
    subtitleJp: '自家製果実煮込みソース',
    descriptionEn:
      'Our tonkatsu sauce and dressing are all homemade based on our original recipes. We use plenty of fresh fruits and vegetables to create a rich, balanced flavor.',
    descriptionKr:
      '시판 소스를 사용하지 않고 독창적인 레시피로 매장에서 직접 끓여냅니다. 사과, 양파, 토마토 등 풍부한 신선 과채를 듬뿍 넣어 자연스러운 단맛과 산미가 완벽한 조화를 이룹니다.',
    descriptionVi:
      'Sốt tonkatsu và dressing đều được chúng tôi tự làm theo công thức riêng. Chúng tôi dùng nhiều trái cây và rau củ tươi để tạo nên hương vị đậm đà, cân bằng.',
    descriptionJp:
      '市販品は一切使わず、独自のオリジナルレシピで丁寧に手作りしています。新鮮なフルーツや香味野菜を贅沢に使用し、奥深いコクと程よい酸味の調和を追求しています。',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cabbage',
    nameKr: '양배추',
    nameEn: 'Cabbage',
    nameVi: 'Bắp Cải',
    nameJp: 'キャベツ',
    subtitleEn: 'Ultra-Thin Hand Sliced Morning Batch',
    subtitleKr: '매일 아침 얇게 채 썬 신선 양배추',
    subtitleVi: 'Bào Tươi Mỗi Sáng',
    subtitleJp: '極細切り毎朝仕込み',
    descriptionEn:
      'We serve freshly sliced cabbage prepared every morning, delivering an ultra-crisp refreshing balance to our golden cutlets.',
    descriptionKr:
      '매일 아침 수확한 신선한 양배추만을 선별하여 아주 얇게 채 썰어 준비합니다. 차가운 얼음물에 담가 아삭한 식감을 극대화하여 튀김 요리와 최상의 궁합을 선사합니다.',
    descriptionVi:
      'Chúng tôi phục vụ bắp cải tươi được bào mới mỗi sáng.',
    descriptionJp:
      '毎朝厳選した瑞々しいキャベツを、極薄の千切りにしてご提供。冷水で締めることで際立つシャキシャキとした食感が、香ばしいとんかつの美味しさを一層引き立てます。',
    displayOrder: 4,
    isActive: true,
  },
];

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  language = 'VI',
  ingredients,
  sectionTitle,
}) => {
  const isVietnamesePrimary = language === 'VI';
  const displayItems = ingredients && ingredients.length > 0 ? ingredients : FALLBACK_INGREDIENTS;

  const getHeaderBadge = () => {
    switch (language) {
      case 'KR': return sectionTitle?.subtitleKr || '봄돈까스의 4대 원재료';
      case 'VI': return sectionTitle?.subtitleVi || '봄돈까스의 원재료';
      case 'JP': return sectionTitle?.subtitleJp || '職人技を支える4つのこだわり';
      default: return sectionTitle?.subtitleEn || 'Four Foundations of Our Culinary Craft';
    }
  };

  const getMainHeader = () => {
    switch (language) {
      case 'KR': return sectionTitle?.titleKr || 'INGREDIENTS / 원재료의 미학';
      case 'VI': return sectionTitle?.titleVi || 'INGREDIENTS / NGUYÊN LIỆU';
      case 'JP': return sectionTitle?.titleJp || 'INGREDIENTS / 厳選素材';
      default: return sectionTitle?.titleEn || 'INGREDIENTS / ARTISANAL FOUNDATIONS';
    }
  };

  return (
    <section className="w-full py-16 lg:py-24 border-b border-[#eae8e5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#eae8e5]">
          <div>
            <div className="font-label-md text-xs uppercase tracking-widest text-[#af101a] font-bold mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#af101a]" />
              {getHeaderBadge()}
            </div>
            <h2 className="font-headline-lg text-3xl lg:text-4xl text-[#1b1c1a] font-bold tracking-tight">
              {getMainHeader()}
            </h2>
          </div>
          <div className="font-menu-bar text-xs uppercase tracking-widest text-[#8f6f6c] font-bold mt-2 md:mt-0">
            Cutlet Spring Menu
          </div>
        </div>

        {/* 4 Ingredients Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between space-y-4"
            >
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
                      <span className="font-kr-serif text-[10px] text-[#a89d91]">
                        사진 준비 중
                      </span>
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
                  <div className="font-jp-serif text-xs text-[#585757]">
                    {item.nameJp}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed">
                  {isVietnamesePrimary ? (
                    <>
                      <p className="font-body-md text-[#1b1c1a] leading-relaxed">
                        {item.descriptionVi}
                      </p>
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
                      <p className="font-body-md text-[#1b1c1a] leading-relaxed">
                        {item.descriptionEn}
                      </p>
                      <p className="font-body-md text-[#585757] italic border-t border-[#eae8e5]/60 pt-2.5 leading-relaxed">
                        {item.descriptionVi}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
