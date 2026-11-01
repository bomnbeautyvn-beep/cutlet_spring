import { Ingredient } from '@/types';

export const FALLBACK_INGREDIENTS: Ingredient[] = [
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
    descriptionVi: 'Chúng tôi phục vụ bắp cải tươi được bào mới mỗi sáng.',
    descriptionJp:
      '毎朝厳選した瑞々しいキャベツを、極薄の千切りにしてご提供。冷水で締めることで際立つシャキシャキとした食感が、香ばしいとんかつの美味しさを一層引き立てます。',
    displayOrder: 4,
    isActive: true,
  },
];

