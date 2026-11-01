-- V7: Upgrade Multilingual Menu Items, Restaurant Settings, and Account Audit Logs

-- 1. Create restaurant_settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_kr VARCHAR(255) NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    name_jp VARCHAR(255) NOT NULL,
    slogan_en VARCHAR(255),
    slogan_kr VARCHAR(255),
    slogan_vi VARCHAR(255),
    slogan_jp VARCHAR(255),
    description_en TEXT,
    description_kr TEXT,
    description_vi TEXT,
    description_jp TEXT,
    address_en VARCHAR(500) NOT NULL,
    address_kr VARCHAR(500) NOT NULL,
    address_vi VARCHAR(500) NOT NULL,
    address_jp VARCHAR(500) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    logo_public_id VARCHAR(255),
    banner_url VARCHAR(500),
    banner_public_id VARCHAR(255),
    opening_hour_lunch_start VARCHAR(10) NOT NULL DEFAULT '11:00',
    opening_hour_lunch_end VARCHAR(10) NOT NULL DEFAULT '15:00',
    opening_hour_dinner_start VARCHAR(10) NOT NULL DEFAULT '17:00',
    opening_hour_dinner_end VARCHAR(10) NOT NULL DEFAULT '21:00',
    last_order_time VARCHAR(10) NOT NULL DEFAULT '20:30',
    closed_days_en VARCHAR(255) DEFAULT 'Open Daily',
    closed_days_kr VARCHAR(255) DEFAULT '연중무휴',
    closed_days_vi VARCHAR(255) DEFAULT 'Mở cửa hàng ngày',
    closed_days_jp VARCHAR(255) DEFAULT '年中無休',
    holiday_notice_en VARCHAR(500),
    holiday_notice_kr VARCHAR(500),
    holiday_notice_vi VARCHAR(500),
    holiday_notice_jp VARCHAR(500),
    policy_one_dish_en VARCHAR(500) DEFAULT 'One main dish requirement per seated guest',
    policy_one_dish_kr VARCHAR(500) DEFAULT '1인 1메뉴 주문 필수',
    policy_one_dish_vi VARCHAR(500) DEFAULT 'Mỗi thực khách dùng bữa tại chỗ vui lòng gọi tối thiểu một món chính',
    policy_one_dish_jp VARCHAR(500) DEFAULT 'ご着席のお客様1名様につきメインディッシュ1品のご注文をお願いしております',
    policy_vat_en VARCHAR(500) DEFAULT '8% VAT is not included in list prices',
    policy_vat_kr VARCHAR(500) DEFAULT '메뉴 가격에 8% 부가세(VAT) 미포함',
    policy_vat_vi VARCHAR(500) DEFAULT 'Giá niêm yết chưa bao gồm 8% thuế GTGT (VAT)',
    policy_vat_jp VARCHAR(500) DEFAULT '表示価格には8%の付加価値税(VAT)は含まれておりません',
    policy_takeout_en VARCHAR(500) DEFAULT 'Takeout packaging retains crispness up to 30 mins',
    policy_takeout_kr VARCHAR(500) DEFAULT '포장 주문 시 30분 동안 바삭한 식감이 유지됩니다',
    policy_takeout_vi VARCHAR(500) DEFAULT 'Bao bì mang về giữ độ giòn tối ưu trong 30 phút',
    policy_takeout_jp VARCHAR(500) DEFAULT 'テイクアウト包装は30分間サクサクの食感を保ちます',
    vat_rate NUMERIC(5,2) DEFAULT 8.00,
    default_prep_minutes INT DEFAULT 18,
    capacity_hall INT DEFAULT 30,
    capacity_counter INT DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) DEFAULT 'SYSTEM'
);

-- Seed default Cutlet Spring restaurant settings
INSERT INTO restaurant_settings (
    id,
    name_en, name_kr, name_vi, name_jp,
    slogan_en, slogan_kr, slogan_vi, slogan_jp,
    description_en, description_kr, description_vi, description_jp,
    address_en, address_kr, address_vi, address_jp,
    phone_number, email,
    logo_url, banner_url,
    opening_hour_lunch_start, opening_hour_lunch_end,
    opening_hour_dinner_start, opening_hour_dinner_end,
    last_order_time,
    closed_days_en, closed_days_kr, closed_days_vi, closed_days_jp,
    vat_rate, default_prep_minutes, capacity_hall, capacity_counter,
    updated_at, updated_by
) VALUES (
    'default',
    'CUTLET SPRING', '봄돈까스', 'CUTLET SPRING', 'カツスプリング',
    'Artisanal Tonkatsu Atelier', '프리미엄 수제 돈카츠 아틀리에', 'Xưởng Nghệ Thuật Tonkatsu Thủ Công', '職人技が光る手作りとんかつアトリエ',
    'An artisanal Japanese-Korean Tonkatsu atelier crafting precision-fried golden cutlets with heritage culinary discipline.',
    '타협 없는 정통 기법과 엄선된 원육으로 빚어내는 프리미엄 일식-경양식 수제 돈카츠 아틀리에입니다.',
    'Nhà hàng Tonkatsu phong cách Nhật-Hàn thủ công, kết hợp tinh hoa ẩm thực truyền thống với tiêu chuẩn chiên giòn đỉnh cao.',
    '厳選された豚肉と職人技のパン粉づけで揚げる、日韓フュージョン本格手作りとんかつ専門店です。',
    '6A Street 9, Thao Dien Ward, Thu Duc City, Ho Chi Minh City',
    '호치민시 투득시 타오디엔 9번가 6A',
    '6A Đường số 9, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
    'ホーチミン市トゥードゥック市タオディエン9番通り6A',
    '039 376 2717', 'contact@cutletspring.com',
    '/images/common/1-removebg-preview.png', '/images/menu/japanese/all-star-set.jpg',
    '11:00', '15:00',
    '17:00', '21:00',
    '20:30',
    'Open Daily (No Regular Closing Days)', '연중무휴', 'Mở cửa cả tuần (Không ngày nghỉ)', '年中無休 (無休営業)',
    8.00, 18, 30, 10,
    CURRENT_TIMESTAMP, 'SYSTEM'
);

-- 2. Create account_audit_logs table
CREATE TABLE IF NOT EXISTS account_audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    admin_email VARCHAR(255) NOT NULL,
    admin_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100),
    target_id VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON account_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_admin_email ON account_audit_logs(admin_email);

-- 3. Backfill all 38 dishes with complete 4-language translations and portion info

-- Sets & Japanese Tonkatsu
UPDATE menu_items SET
    name_vi = 'Set Đặc Quyền Cutlet Spring',
    portion_en = 'Set for 1 person',
    portion_kr = '1인 세트',
    portion_vi = 'Set dành cho 1 người',
    portion_jp = '1名様用セット'
WHERE id = 'spring-signature-set';

UPDATE menu_items SET
    portion_en = '1 serving (Loin & Tenderloin)',
    portion_kr = '1인분 (등심 & 안심)',
    portion_vi = 'Phần 1 người (Thăn ngoại & Thăn nội)',
    portion_jp = '1人前 (ロース & ヒレ)'
WHERE id = 'half-and-half-pork-cutlet';

UPDATE menu_items SET
    portion_en = '1 serving (Tenderloin 6pcs)',
    portion_kr = '1인분 (안심 6조각)',
    portion_vi = 'Phần 1 người (Thăn nội 6 miếng)',
    portion_jp = '1人前 (ヒレ 6個)'
WHERE id = 'pork-tenderloin-cutlet-set';

UPDATE menu_items SET
    portion_en = '1 serving (Chicken tenderloin)',
    portion_kr = '1인분 (닭안심)',
    portion_vi = 'Phần 1 người (Ức gà phi lê)',
    portion_jp = '1人前 (鶏ささみ)'
WHERE id = 'sasami-katsu-chicken';

UPDATE menu_items SET
    name_vi = 'Katsu Vua Phô Mai',
    portion_en = '1 serving (4 large cheese pieces)',
    portion_kr = '1인분 (치즈 4조각)',
    portion_vi = 'Phần 1 người (4 miếng phô mai lớn)',
    portion_jp = '1人前 (特大チーズ4個)'
WHERE id = 'cheese-king-katsu';

UPDATE menu_items SET
    portion_en = 'Set for 1-2 persons',
    portion_kr = '1-2인 세트',
    portion_vi = 'Set cho 1-2 người',
    portion_jp = '1-2名様用セット'
WHERE id = 'all-star-atelier-set';

UPDATE menu_items SET
    portion_en = '1 serving (Chicken & Pork duo)',
    portion_kr = '1인분 (치킨 & 안심 듀오)',
    portion_vi = 'Phần 1 người (Cặp đôi Heo & Gà)',
    portion_jp = '1人前 (チキン & 豚ヒレ デュオ)'
WHERE id = 'double-tender-duo-set';

-- Korean Retro Tonkatsu
UPDATE menu_items SET
    portion_en = '1 serving (Choice of S or L)',
    portion_kr = '1인분 (S 또는 L 선택)',
    portion_vi = 'Phần 1 người (Tuỳ chọn S hoặc L)',
    portion_jp = '1人前 (SまたはL選択)'
WHERE id = 'korean-style-retro-tonkatsu';

UPDATE menu_items SET
    portion_en = '1 serving (Classic & Spicy)',
    portion_kr = '1인분 (일반 & 매운 소스)',
    portion_vi = 'Phần 1 người (Sốt thường & Sốt cay)',
    portion_jp = '1人前 (クラシック & 辛口ソース)'
WHERE id = 'half-half-korean-retro-katsu';

UPDATE menu_items SET
    portion_en = '1 serving (Choice of S or L)',
    portion_kr = '1인분 (S 또는 L 선택)',
    portion_vi = 'Phần 1 người (Tuỳ chọn S hoặc L)',
    portion_jp = '1人前 (SまたはL選択)'
WHERE id = 'spicy-korean-retro-katsu';

UPDATE menu_items SET
    portion_en = '1 serving (Rich mozzarella poured)',
    portion_kr = '1인분 (모짜렐라 듬뿍)',
    portion_vi = 'Phần 1 người (Ngập phô mai mozzarella)',
    portion_jp = '1人前 (たっぷりモッツァレラチーズ)'
WHERE id = 'cheese-bomb-katsu';

-- Curry Rice
UPDATE menu_items SET
    portion_en = '1 serving (Cutlet & Rice bowl)',
    portion_kr = '1인분 (카츠 & 밥 세트)',
    portion_vi = 'Phần 1 người (Cơm cà ri katsu thăn nội)',
    portion_jp = '1人前 (ヒレカツ & ライス)'
WHERE id = 'pork-tenderloin-katsu-curry-rice';

UPDATE menu_items SET
    description_jp = 'サクサクの豚ロースカツに自家製熟成カレーを合わせた満足感ある一皿。',
    portion_en = '1 serving (Cutlet & Rice bowl)',
    portion_kr = '1인분 (카츠 & 밥 세트)',
    portion_vi = 'Phần 1 người (Cơm cà ri katsu thăn ngoại)',
    portion_jp = '1人前 (ロースカツ & ライス)'
WHERE id = 'pork-loin-katsu-curry-rice';

UPDATE menu_items SET
    portion_en = '1 serving (Chicken & Rice bowl)',
    portion_kr = '1인분 (치킨카츠 & 밥 세트)',
    portion_vi = 'Phần 1 người (Cơm cà ri katsu gà)',
    portion_jp = '1人前 (チキンカツ & ライス)'
WHERE id = 'chicken-cutlet-curry-rice';

-- Artisan Noodles
UPDATE menu_items SET
    portion_en = 'Set for 1 person (Noodles & Cutlet)',
    portion_kr = '1인 세트 (모밀 & 카츠)',
    portion_vi = 'Set 1 người (Mì soba lạnh & Katsu)',
    portion_jp = '1名様用セット (ざるそば & カツ)'
WHERE id = 'cold-buckwheat-noodle-set';

UPDATE menu_items SET
    portion_en = '1 bowl (Cold soba noodles)',
    portion_kr = '1그릇 (냉모밀 단품)',
    portion_vi = '1 tô (Mì soba lạnh)',
    portion_jp = '1杯 (ざるそば単品)'
WHERE id = 'cold-buckwheat-noodle';

UPDATE menu_items SET
    portion_en = 'Set for 1 person (Noodles & Cutlet)',
    portion_kr = '1인 세트 (쫄면 & 카츠)',
    portion_vi = 'Set 1 người (Mì jjolmyeon cay & Katsu)',
    portion_jp = '1名様用セット (チョルミョン & カツ)'
WHERE id = 'jjolmyeon-set-with-cutlet';

UPDATE menu_items SET
    portion_en = '1 bowl (Spicy chewy noodles)',
    portion_kr = '1그릇 (매콤 쫄면 단품)',
    portion_vi = '1 tô (Mì cay jjolmyeon)',
    portion_jp = '1杯 (旨辛チョルミョン単品)'
WHERE id = 'jjolmyeon-a-la-carte';

-- Atelier Add-ons
UPDATE menu_items SET
    portion_en = '1 piece (Tenderloin cutlet)',
    portion_kr = '1조각 (특안심)',
    portion_vi = '1 miếng (Thăn nội chiên)',
    portion_jp = '1個 (特選ヒレカツ)'
WHERE id = 'addon-tenderloin-1pc';

UPDATE menu_items SET
    portion_en = '1 piece (Cheese katsu)',
    portion_kr = '1조각 (치즈카츠)',
    portion_vi = '1 miếng (Katsu phô mai)',
    portion_jp = '1個 (チーズカツ)'
WHERE id = 'addon-cheese-katsu-1pc';

UPDATE menu_items SET
    portion_en = '1 piece (Fried King Tiger prawn)',
    portion_kr = '1마리 (킹타이거 새우)',
    portion_vi = '1 con (Tôm sú King Tiger)',
    portion_jp = '1尾 (キングタイガーエビフライ)'
WHERE id = 'addon-king-tiger-shrimp';

UPDATE menu_items SET
    portion_en = '1 bowl (Heritage cream soup)',
    portion_kr = '1그릇 (경양식 크림스프)',
    portion_vi = '1 chén (Súp kem kiểu cổ điển)',
    portion_jp = '1杯 (レトロクリームスープ)'
WHERE id = 'addon-cream-soup-broth';

UPDATE menu_items SET
    portion_en = '1 bowl (Steamed Koshihikari pearl rice)',
    portion_kr = '1공기 (고시히카리 쌀밥)',
    portion_vi = '1 chén (Cơm trắng Koshihikari)',
    portion_jp = '1杯 (コシヒカリご飯)'
WHERE id = 'addon-artisan-pearl-rice';

UPDATE menu_items SET
    portion_en = '1 small plate (Creamy macaroni)',
    portion_kr = '1접시 (마카로니 샐러드)',
    portion_vi = '1 đĩa nhỏ (Salad nui macaroni)',
    portion_jp = '1皿 (マカロニサラダ)'
WHERE id = 'addon-macaroni-salad';

-- Signature Sauces
UPDATE menu_items SET
    portion_en = '1 dish (House demi-glace sauce)',
    portion_kr = '1종지 (수제 경양식 소스)',
    portion_vi = '1 chén nhỏ (Sốt Tonkatsu kiểu Hàn)',
    portion_jp = '1皿 (自家製デミグラスソース)'
WHERE id = 'addon-korean-tonkatsu-sauce';

UPDATE menu_items SET
    portion_en = '1 dish (Spicy demi sauce)',
    portion_kr = '1종지 (매운 경양식 소스)',
    portion_vi = '1 chén nhỏ (Sốt Tonkatsu cay kiểu Hàn)',
    portion_jp = '1皿 (旨辛デミグラスソース)'
WHERE id = 'addon-spicy-korean-tonkatsu-sauce';

UPDATE menu_items SET
    portion_en = '1 bowl (Aged Japanese curry sauce)',
    portion_kr = '1공기 (숙성 카레 소스)',
    portion_vi = '1 chén (Sốt cà ri Nhật Bản ủ)',
    portion_jp = '1杯 (熟成カレーソース)'
WHERE id = 'addon-curry-sauce-bowl';

UPDATE menu_items SET
    portion_en = '1 dish (Handmade fresh herb tartar)',
    portion_kr = '1종지 (수제 타르타르 소스)',
    portion_vi = '1 chén nhỏ (Sốt Tartar tươi)',
    portion_jp = '1皿 (自家製タルタルソース)'
WHERE id = 'addon-tartar-sauce';

UPDATE menu_items SET
    portion_en = '1 dish (Japanese tonkatsu sauce)',
    portion_kr = '1종지 (정통 돈카츠 소스)',
    portion_vi = '1 chén nhỏ (Sốt Tonkatsu Nhật)',
    portion_jp = '1皿 (本格とんかつソース)'
WHERE id = 'addon-tonkatsu-sauce';

UPDATE menu_items SET
    portion_en = '1 dish (Sweet chili dip)',
    portion_kr = '1종지 (스위트 칠리 소스)',
    portion_vi = '1 chén nhỏ (Sốt ớt ngọt)',
    portion_jp = '1皿 (スイートチリソース)'
WHERE id = 'addon-sweet-chili-sauce';

-- Beverages & Craft
UPDATE menu_items SET
    portion_en = '1 can (330ml)',
    portion_kr = '1캔 (330ml)',
    portion_vi = '1 lon (330ml)',
    portion_jp = '1缶 (330ml)'
WHERE id = 'coca-cola-zero-sprite';

UPDATE menu_items SET
    portion_en = '1 bottle (500ml)',
    portion_kr = '1병 (500ml)',
    portion_vi = '1 chai (500ml)',
    portion_jp = '1本 (500ml)'
WHERE id = 'dasani-pure-water';

UPDATE menu_items SET
    portion_en = '1 glass / bottle (330ml)',
    portion_kr = '1잔 (330ml)',
    portion_vi = '1 ly / chai (330ml)',
    portion_jp = '1杯 (330ml)'
WHERE id = 'strawberry-kombucha';

UPDATE menu_items SET
    portion_en = '1 glass / bottle (330ml)',
    portion_kr = '1잔 (330ml)',
    portion_vi = '1 ly / chai (330ml)',
    portion_jp = '1杯 (330ml)'
WHERE id = 'passion-fruit-kombucha';

UPDATE menu_items SET
    portion_en = '1 glass (Cold pressed, 330ml)',
    portion_kr = '1잔 (착즙 주스, 330ml)',
    portion_vi = '1 ly (Nước ép tươi, 330ml)',
    portion_jp = '1杯 (生搾りジュース, 330ml)'
WHERE id = 'unsweetened-fresh-juice';

UPDATE menu_items SET
    portion_en = '1 glass (Tropical nectar, 330ml)',
    portion_kr = '1잔 (사워솝 넥타, 330ml)',
    portion_vi = '1 ly (Sinh tố mãng cầu, 330ml)',
    portion_jp = '1杯 (サワーソップネクター, 330ml)'
WHERE id = 'soursop-nectar';

UPDATE menu_items SET
    portion_en = '1 cold draft mug (500ml)',
    portion_kr = '생맥주 1잔 (500ml)',
    portion_vi = '1 ly bia tươi ướp lạnh (500ml)',
    portion_jp = '生ビール1杯 (500ml)'
WHERE id = 'sapporo-draft-beer';

UPDATE menu_items SET
    portion_en = '1 can (330ml)',
    portion_kr = '1캔 (330ml)',
    portion_vi = '1 lon (330ml)',
    portion_jp = '1缶 (330ml)'
WHERE id = 'dr-pepper';
