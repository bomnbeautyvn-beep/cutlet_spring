-- V8: Create Homepage CMS Tables (Sections, Hero, Ingredients, Google Reviews, and Restaurant Settings Extensions)

-- 1. Extend restaurant_settings table with Google metadata and Header/Footer settings
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1) DEFAULT 4.8;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS google_review_count INT DEFAULT 562;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS google_maps_url VARCHAR(500) DEFAULT 'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS google_maps_embed_url VARCHAR(1000) DEFAULT 'https://maps.google.com/maps?q=10.8037915,106.7449356+(%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring)&t=&z=17&ie=UTF8&iwloc=B&output=embed';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS established_year VARCHAR(10) DEFAULT '2023';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS copyright_text_en VARCHAR(255) DEFAULT '© 2025 CUTLET SPRING Atelier. All Rights Reserved.';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS copyright_text_kr VARCHAR(255) DEFAULT '© 2025 CUTLET SPRING 아틀리에. All Rights Reserved.';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS copyright_text_vi VARCHAR(255) DEFAULT '© 2025 Xưởng CUTLET SPRING. Bảo lưu mọi quyền.';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS copyright_text_jp VARCHAR(255) DEFAULT '© 2025 CUTLET SPRING アトリエ. 無断転載を禁じます。';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS hotline_visible BOOLEAN DEFAULT TRUE;

UPDATE restaurant_settings
SET google_rating = 4.8,
    google_review_count = 562,
    google_maps_url = 'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
    google_maps_embed_url = 'https://maps.google.com/maps?q=10.8037915,106.7449356+(%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring)&t=&z=17&ie=UTF8&iwloc=B&output=embed',
    established_year = '2023',
    copyright_text_en = '© 2025 CUTLET SPRING Atelier. All Rights Reserved.',
    copyright_text_kr = '© 2025 CUTLET SPRING 아틀리에. All Rights Reserved.',
    copyright_text_vi = '© 2025 Xưởng CUTLET SPRING. Bảo lưu mọi quyền.',
    copyright_text_jp = '© 2025 CUTLET SPRING アトリエ. 無断転載を禁じます。',
    hotline_visible = TRUE
WHERE id = 'default';

-- 2. Create homepage_sections table
CREATE TABLE IF NOT EXISTS homepage_sections (
    id VARCHAR(50) PRIMARY KEY,
    section_key VARCHAR(50) NOT NULL UNIQUE,
    title_en VARCHAR(255) NOT NULL,
    title_kr VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NOT NULL,
    subtitle_en VARCHAR(500),
    subtitle_kr VARCHAR(500),
    subtitle_vi VARCHAR(500),
    subtitle_jp VARCHAR(500),
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO homepage_sections (
    id, section_key,
    title_en, title_kr, title_vi, title_jp,
    subtitle_en, subtitle_kr, subtitle_vi, subtitle_jp,
    display_order, is_active
) VALUES
(
    'sec-hero', 'hero',
    'Hero & Introduction', '히어로 & 소개', 'Phần Mở Đầu & Giới Thiệu', 'ヒーロー & イントロダクション',
    'The Art of Hand Crafted Cutlets', '타협하지 않는 원재료와 장인정신', 'Nghệ Thuật Tonkatsu Thủ Công', '妥協なき厳選素材と職人魂',
    1, TRUE
),
(
    'sec-ingredients', 'ingredients',
    'Ingredients', '원재료의 미학', 'Nguyên Liệu Tuyển Chọn', '厳選素材',
    'Four Foundations of Our Culinary Craft', '봄돈까스의 4대 원재료 철학', '4 Nền Tảng Nguyên Liệu Cốt Lõi', '職人技を支える4つのこだわり',
    2, TRUE
),
(
    'sec-reviews', 'reviews',
    'Customer Feedback', '구글 고객 리뷰', 'Đánh Giá Của Khách Hàng', 'お客様のクチコミ',
    'Real Google Maps Reviews from Diners', '구글 맵 실제 고객 리뷰', 'Đánh giá thực tế từ Google Maps', 'Googleマップのリアルなクチコミ',
    3, TRUE
),
(
    'sec-location', 'location',
    'Atelier Location', '찾아오시는 길', 'Vị Trí Cửa Hàng', '店舗アクセス',
    'Our Thao Dien Atelier Map & Hours', '타오디엔 아틀리에 위치 및 운영 시간', 'Bản đồ vị trí & Giờ mở cửa Thảo Điền', 'タオディエン店 アクセス & 営業時間',
    4, TRUE
),
(
    'sec-info', 'info',
    'Restaurant Information', '매장 정보 및 정책', 'Thông Tin & Chính Sách', '店舗案内 & ポリシー',
    'Dining Guidelines and Service Policies', '이용 안내 및 다이닝 정책', 'Hướng dẫn dịch vụ và chính sách phục vụ', 'ご利用案内およびダイニングポリシー',
    5, TRUE
);

-- 3. Create homepage_hero_contents table
CREATE TABLE IF NOT EXISTS homepage_hero_contents (
    id VARCHAR(50) PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_kr VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NOT NULL,
    headline_en VARCHAR(255) NOT NULL,
    headline_kr VARCHAR(255) NOT NULL,
    headline_vi VARCHAR(255) NOT NULL,
    headline_jp VARCHAR(255) NOT NULL,
    tagline_en VARCHAR(500),
    tagline_kr VARCHAR(500),
    tagline_vi VARCHAR(500),
    tagline_jp VARCHAR(500),
    description_en TEXT NOT NULL,
    description_kr TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    description_jp TEXT NOT NULL,
    cta_text_en VARCHAR(100) NOT NULL,
    cta_text_kr VARCHAR(100) NOT NULL,
    cta_text_vi VARCHAR(100) NOT NULL,
    cta_text_jp VARCHAR(100) NOT NULL,
    cta_target VARCHAR(100) NOT NULL DEFAULT 'menu',
    image_url VARCHAR(500),
    image_public_id VARCHAR(255),
    badge_text_en VARCHAR(100) DEFAULT 'Established 2023',
    badge_text_kr VARCHAR(100) DEFAULT '2023년 개업',
    badge_text_vi VARCHAR(100) DEFAULT 'Thành lập 2023',
    badge_text_jp VARCHAR(100) DEFAULT '2023年創業',
    dish_title_en VARCHAR(255) DEFAULT 'Signature Hire Katsu Medallion',
    dish_title_kr VARCHAR(255) DEFAULT '시그니처 히레카츠 메달리온',
    dish_title_vi VARCHAR(255) DEFAULT 'Mề Đay Tonkatsu Nạc Lưng Đặc Trưng',
    dish_title_jp VARCHAR(255) DEFAULT '極上ヒレカツ メダリオン',
    dish_desc_en VARCHAR(255) DEFAULT 'Natural Rosy Hue · 100% Fully Cooked',
    dish_desc_kr VARCHAR(255) DEFAULT '자연스러운 선홍빛 · 100% 완벽한 조리',
    dish_desc_vi VARCHAR(255) DEFAULT 'Sắc hồng tự nhiên · Chín chuẩn 100%',
    dish_desc_jp VARCHAR(255) DEFAULT '自然な桜色 · 100%芯まで火入れ',
    metric1_value VARCHAR(50) DEFAULT '120h',
    metric1_label_en VARCHAR(100) DEFAULT 'Wet-Aged Chilled Pork',
    metric1_label_kr VARCHAR(100) DEFAULT '120시간 습식숙성 냉장육',
    metric1_label_vi VARCHAR(100) DEFAULT 'Thịt heo mát ủ 120 giờ',
    metric1_label_jp VARCHAR(100) DEFAULT '120時間熟成チルドポーク',
    metric2_value VARCHAR(50) DEFAULT '100%',
    metric2_label_en VARCHAR(100) DEFAULT 'Never Frozen Quality',
    metric2_label_kr VARCHAR(100) DEFAULT '비냉동 최상급 원육',
    metric2_label_vi VARCHAR(100) DEFAULT 'Tuyệt đối không đông lạnh',
    metric2_label_jp VARCHAR(100) DEFAULT '完全非冷凍のこだわり',
    metric3_value VARCHAR(50) DEFAULT 'Daily',
    metric3_label_en VARCHAR(100) DEFAULT 'Fresh Bakery Panko',
    metric3_label_kr VARCHAR(100) DEFAULT '매일 새벽 직접 구운 빵가루',
    metric3_label_vi VARCHAR(100) DEFAULT 'Bột chiên tươi nướng mỗi sáng',
    metric3_label_jp VARCHAR(100) DEFAULT '毎朝焼き上げる生パン粉',
    display_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO homepage_hero_contents (
    id,
    title_en, title_kr, title_vi, title_jp,
    headline_en, headline_kr, headline_vi, headline_jp,
    tagline_en, tagline_kr, tagline_vi, tagline_jp,
    description_en, description_kr, description_vi, description_jp,
    cta_text_en, cta_text_kr, cta_text_vi, cta_text_jp,
    cta_target, image_url, image_public_id,
    badge_text_en, badge_text_kr, badge_text_vi, badge_text_jp,
    dish_title_en, dish_title_kr, dish_title_vi, dish_title_jp,
    dish_desc_en, dish_desc_kr, dish_desc_vi, dish_desc_jp,
    metric1_value, metric1_label_en, metric1_label_kr, metric1_label_vi, metric1_label_jp,
    metric2_value, metric2_label_en, metric2_label_kr, metric2_label_vi, metric2_label_jp,
    metric3_value, metric3_label_en, metric3_label_kr, metric3_label_vi, metric3_label_jp,
    display_order, is_active
) VALUES (
    'default-hero',
    'The Art of Hand Crafted Cutlets', '타협하지 않는 원재료와 장인정신', 'Nghệ Thuật Tonkatsu Thủ Công', '職人技が紡ぐ手作りとんかつの芸術',
    'Precision Fried Golden Tonkatsu', '타협 없는 정통 기법의 황금빛 돈카츠', 'Tonkatsu Hoàng Kim Chiên Chuẩn Xác', '黄金色に輝く極上とんかつ',
    'Uncompromising Ingredients and Craftsmanship', '타협하지 않는 원재료와 장인정신', 'Nguyên liệu chuẩn mực và tinh thần nghệ nhân', '妥協なき厳選素材と職人魂',
    '120-hour wet-aged chilled pork, house-baked breadcrumbs freshly ground every dawn, and precision-fried golden cutlets. Served with rich fruit-simmered artisanal demi-glace and crisp mountain cabbage in an intimate Scandinavian-Japanese dining room.',
    '120시간 저온 습식숙성 프리미엄 원육, 매일 새벽 직접 구워 분쇄한 생빵가루, 장인의 정밀한 유온 제어로 완성한 황금빛 돈카츠. 신선한 과채를 듬뿍 졸여낸 수제 데미그라스 소스와 아삭한 고랭지 양배추를 편안한 다이닝 공간에서 만나보세요.',
    '120-hour wet-aged chilled pork, house-baked breadcrumbs freshly ground every dawn, and precision-fried golden cutlets. Served with rich fruit-simmered artisanal demi-glace and crisp mountain cabbage in an intimate Scandinavian-Japanese dining room.',
    '120時間じっくりとウェットエイジング熟成させた極上チルドポーク、毎朝自家製パンを焼き上げて作る特製生パン粉、そして職人技で黄金色に揚げ上げるとんかつ。新鮮な果実を煮込んだ特製デミグラスソースと瑞々しい千切りキャベツを、落ち着きある空間でお楽しみください。',
    'Explore Full Menu', '전체 메뉴 둘러보기', 'Xem Thực Đơn Đầy Đủ', 'メニューを見る',
    'menu', '/images/menu/japanese/all-star-set.jpg', 'cutlet_spring/hero/all_star_set',
    'Established 2023', '2023년 개업', 'Thành lập 2023', '2023年創業',
    'Signature Hire Katsu Medallion', '시그니처 히레카츠 메달리온', 'Signature Hire Katsu Medallion', '極上ヒレカツ メダリオン',
    'Natural Rosy Hue · 100% Fully Cooked', '자연스러운 선홍빛 · 100% 완벽한 조리', 'Natural Rosy Hue · 100% Fully Cooked', '自然な桜色 · 100%芯まで火入れ',
    '120h', 'Wet-Aged Chilled Pork', '120시간 습식숙성 냉장육', 'Wet-Aged Chilled Pork', '120時間熟成チルドポーク',
    '100%', 'Never Frozen Quality', '비냉동 최상급 원육', 'Never Frozen Quality', '完全非冷凍のこだわり',
    'Daily', 'Fresh Bakery Panko', '매일 새벽 직접 구운 빵가루', 'Fresh Bakery Panko', '毎朝焼き上げる生パン粉',
    1, TRUE
);

-- 4. Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_kr VARCHAR(255) NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    name_jp VARCHAR(255) NOT NULL,
    subtitle_en VARCHAR(255),
    subtitle_kr VARCHAR(255),
    subtitle_vi VARCHAR(255),
    subtitle_jp VARCHAR(255),
    description_en TEXT NOT NULL,
    description_kr TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    description_jp TEXT NOT NULL,
    image_url VARCHAR(500),
    image_public_id VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ingredients (
    id,
    name_en, name_kr, name_vi, name_jp,
    subtitle_en, subtitle_kr, subtitle_vi, subtitle_jp,
    description_en, description_kr, description_vi, description_jp,
    image_url, image_public_id, display_order, is_active
) VALUES
(
    'chilled-pork',
    'Chilled Pork', '냉장육', 'Thịt Heo Mát', 'チルドポーク',
    '120-Hour Wet Aging', '120시간 저온 습식숙성', 'Ủ Lạnh 120 Giờ', '120時間低温熟成',
    'We serve fresh chilled pork that has never been frozen. Our owner personally trims and inspects each cut of pork, removing any pieces that do not meet our standards. The pork is then chilled and aged for 120 hours to achieve better tenderness and flavor.',
    '저희는 한 번도 얼리지 않은 최상급 신선 냉장육만을 고집합니다. 대표가 직접 모든 원육을 손질하고 엄격하게 선별하여 기준에 미치지 못하는 부위는 과감히 제외합니다. 이후 120시간 동안 정밀한 저온 습식 숙성을 거쳐 최상의 부드러움과 깊은 풍미를 완성합니다.',
    'Chúng tôi sử dụng thịt heo mát tươi, chưa từng qua đông lạnh. Chủ quán trực tiếp sơ chế và kiểm tra từng miếng thịt, loại bỏ những phần không đạt tiêu chuẩn. Sau đó, thịt được ủ mát trong 120h để đạt độ mềm và hương vị tốt hơn.',
    '当店では一度も冷凍していない新鮮なチルドポークのみを使用しています。店主自ら一枚一枚丁寧にトリミング・検品し、基準に満たない肉は一切使用しません。その後120時間じっくりとウェットエイジング熟成させ、極上の柔らかさと旨味を引き出します。',
    '/images/menu/japanese/hire-cutlet-set.jpg', 'cutlet_spring/ingredients/chilled_pork', 1, TRUE
),
(
    'breadcrumbs',
    'Breadcrumbs', '빵가루', 'Bột Chiên Xù', 'パン粉',
    'Daily In-House Bakery Panko', '매일 새벽 직접 굽는 생빵가루', 'Nướng Bánh & Xay Mới Mỗi Sáng', '毎朝焼き上げる自家製生パン粉',
    'House-baked bread, made fresh every morning, is turned into our signature breadcrumbs for a crispy, light, and non-greasy coating.',
    '매일 새벽 매장에서 정성스럽게 직접 구워낸 신선한 식빵을 적정 입자로 분쇄하여 사용합니다. 튀김옷이 기름을 머금지 않고 시간이 지나도 가볍고 바삭한 식감을 유지합니다.',
    'Chúng tôi tự nướng bánh mì mới mỗi sáng và xay thành loại bột chiên xù đặc trưng của quán. Lớp áo chiên nhờ vậy giòn rụm, nhẹ và không ngấy mỡ.',
    '毎朝店内で焼き上げる自家製食パンを、最適な粗さで挽いた特製生パン粉を使用。油切れが良く、軽やかでサクサクとした心地よい食感が長続きします。',
    '/images/menu/japanese/cheese-cutlet-set.jpg', 'cutlet_spring/ingredients/breadcrumbs', 2, TRUE
),
(
    'tonkatsu-sauce-dressing',
    'Tonkatsu Sauce & Dressing', '돈카츠 소스 & 드레싱', 'Sốt Tonkatsu & Dressing', 'とんかつソース & ドレッシング',
    'Artisanal Fruit-Simmered Sauce', '생과채를 듬뿍 졸인 수제 비법 소스', 'Sốt Trái Cây Thủ Công', '自家製果実煮込みソース',
    'Our tonkatsu sauce and dressing are all homemade based on our original recipes. We use plenty of fresh fruits and vegetables to create a rich, balanced flavor.',
    '시판 소스를 사용하지 않고 독창적인 레시피로 매장에서 직접 끓여냅니다. 사과, 양파, 토마토 등 풍부한 신선 과채를 듬뿍 넣어 자연스러운 단맛과 산미가 완벽한 조화를 이룹니다.',
    'Sốt tonkatsu và dressing đều được chúng tôi tự làm theo công thức riêng. Chúng tôi dùng nhiều trái cây và rau củ tươi để tạo nên hương vị đậm đà, cân bằng.',
    '市販品は一切使わず、独自のオリジナルレシピで丁寧に手作りしています。新鮮なフルーツや香味野菜を贅沢に使用し、奥深いコクと程よい酸味の調和を追求しています。',
    '/images/menu/japanese/special-sauce-dish.jpg', 'cutlet_spring/ingredients/sauce_dressing', 3, TRUE
),
(
    'cabbage',
    'Cabbage', '양배추', 'Bắp Cải', 'キャベツ',
    'Ultra-Thin Hand Sliced Morning Batch', '매일 아침 얇게 채 썬 신선 양배추', 'Bào Tươi Mỗi Sáng', '極細切り毎朝仕込み',
    'We serve freshly sliced cabbage prepared every morning, delivering an ultra-crisp refreshing balance to our golden cutlets.',
    '매일 아침 수확한 신선한 양배추만을 선별하여 아주 얇게 채 썰어 준비합니다. 차가운 얼음물에 담가 아삭한 식감을 극대화하여 튀김 요리와 최상의 궁합을 선사합니다.',
    'Chúng tôi phục vụ bắp cải tươi được bào mới mỗi sáng.',
    '毎朝厳選した瑞々しいキャベツを、極薄の千切りにしてご提供。冷水で締めることで際立つシャキシャキとした食感が、香ばしいとんかつの美味しさを一層引き立てます。',
    '/images/menu/japanese/fresh-cabbage.jpg', 'cutlet_spring/ingredients/cabbage', 4, TRUE
);

-- 5. Create google_reviews table
CREATE TABLE IF NOT EXISTS google_reviews (
    id VARCHAR(50) PRIMARY KEY,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_initials VARCHAR(10) NOT NULL,
    reviewer_avatar_url VARCHAR(500),
    reviewer_metadata VARCHAR(255),
    rating INT NOT NULL DEFAULT 5,
    review_language VARCHAR(10) NOT NULL DEFAULT 'VI',
    review_content TEXT NOT NULL,
    review_date VARCHAR(100) NOT NULL,
    owner_response TEXT,
    owner_response_date VARCHAR(100),
    review_url VARCHAR(500),
    is_featured BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO google_reviews (
    id,
    reviewer_name, reviewer_initials, reviewer_avatar_url, reviewer_metadata,
    rating, review_language, review_content, review_date,
    owner_response, owner_response_date, review_url,
    is_featured, is_active, display_order
) VALUES
(
    'review-vietnamese',
    'Bích Trâm 한유미', 'BT', NULL, 'Local Guide · 85 reviews · 232 photos',
    5, 'VI',
    'Chội ôi donkatsu ở đây siu mềm siu ngon lun ý, sau tiệm donkatsu ở khu Lê Thánh Tôn mình cứ tưởng k tìm được chỗ nào ngon nữa. Nhưng ở đây thực sự rất khác biệt, đề xuất mọi người gọi ansim donkatsu chấm nước sốt siu cuốn 😋',
    '1 tháng trước',
    'Cutlet Spring cám ơn chị Bích Trâm ạ! Nhà hàng rất vui khi được chị yêu thích món ansim donkatsu và sẽ luôn nỗ lực giữ trọn chất lượng phục vụ.',
    '1 tháng trước',
    'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
    TRUE, TRUE, 1
),
(
    'review-korean',
    'KON Nam', 'KN', NULL, 'Local Guide · 41 reviews · 66 photos',
    5, 'KR',
    '한국보다 맛있는 돈까스. 요즘 일본 매체에도 소개되었는지 일본인들도 많고 서양인 베트남인 등 다양한 국적의 사람들이 즐기고 있음. 사장님께서도 나와서 손님응대와 먹는법 등 잘 알려주셔서 믿음이 감.',
    '1주일 전',
    '찾아주셔서 진심으로 감사드립니다! 앞으로도 초심을 잃지 않고 언제나 변함없는 맛과 정성스러운 서비스로 보답하는 봄돈까스가 되겠습니다.',
    '1주일 전',
    'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
    TRUE, TRUE, 2
),
(
    'review-english',
    'The MY World', 'MW', NULL, 'Local Guide · 2,165 reviews · 18,526 photos',
    5, 'EN',
    'It''s Korean style Cutlet restaurant. I visited here at lunch, then I had normal mixed one, the quality was really good and the volume was quite big. I think this restaurant is one of the best Cutlet restaurant in HCMC so far, including Japanese tonkatsu restaurants.',
    '1 week ago',
    'Hello, I’m the owner of Cutlet Spring. As a Korean owner, I strive to serve authentic Japanese-style tonkatsu with a Korean touches of our own. Thank you so much for visiting Cutlet Spring!',
    '1 week ago',
    'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
    TRUE, TRUE, 3
),
(
    'review-japanese',
    'shimizu kengo', 'SK', NULL, 'Local Guide · 21 reviews · 28 photos',
    5, 'JA',
    '日本人の友人の勧めで訪問しました。ロースカツの追加ができなかったので、ヒレ＆カレーセットを注文し、ロースをトッピングしました。ロースもヒレもカレーもどれも美味しかったです！外はサクサクで中はとてもジューシーでした。',
    '2週間前',
    'ご来店いただき、温かいレビューをありがとうございます！これからも本場仕込みのサクサクでジューシーなとんかつをお届けできるよう努めてまいります。またのお越しを心よりお待ちしております。',
    '2週間前',
    'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
    TRUE, TRUE, 4
);

