-- V12: Create Menu Badges and Menu Item Badge Relations

CREATE TABLE IF NOT EXISTS menu_badges (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100),
    name_kr VARCHAR(100),
    name_jp VARCHAR(100),
    description VARCHAR(255),
    badge_color VARCHAR(50) DEFAULT '#af101a',
    icon VARCHAR(50) DEFAULT 'star',
    display_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_item_badges (
    menu_item_id VARCHAR(100) NOT NULL,
    badge_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (menu_item_id, badge_id),
    CONSTRAINT fk_mib_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_mib_badge FOREIGN KEY (badge_id) REFERENCES menu_badges(id) ON DELETE RESTRICT
);

-- Seed standard Atelier badges
INSERT INTO menu_badges (
    id, code, name, name_vi, name_kr, name_jp,
    description, badge_color, icon, display_order, active
) VALUES
(
    'chef-signature', 'chef-signature', 'Chef Signature',
    'Món bếp trưởng đề xuất', '셰프 시그니처', 'シェフのおすすめ',
    'Handcrafted chef signature recipe recommendation',
    '#af101a', 'restaurant', 1, TRUE
),
(
    'best-seller', 'best-seller', 'Best Seller',
    'Món bán chạy nhất', '베스트 셀러', 'ベストセラー',
    'Guest favorite top-selling culinary item',
    '#feae2c', 'star', 2, TRUE
),
(
    'limited-batch', 'limited-batch', 'Limited Batch',
    'Phục vụ giới hạn/ngày', '일일 한정 수량', '数量限定',
    'Prepared in limited artisanal batches daily',
    '#1b1c1a', 'timer', 3, TRUE
),
(
    'spicy-glaze', 'spicy-glaze', 'Spicy Glaze',
    'Vị cay đặc trưng', '매콤한 맛', 'スパイシー',
    'Bold spicy glaze finish',
    '#e11d48', 'local_fire_department', 4, TRUE
);

-- Migrate existing boolean flags into relational table
INSERT INTO menu_item_badges (menu_item_id, badge_id)
SELECT id, 'chef-signature' FROM menu_items WHERE is_chef_signature = TRUE;

INSERT INTO menu_item_badges (menu_item_id, badge_id)
SELECT id, 'best-seller' FROM menu_items WHERE is_best_seller = TRUE;

INSERT INTO menu_item_badges (menu_item_id, badge_id)
SELECT id, 'limited-batch' FROM menu_items WHERE is_limited = TRUE;

INSERT INTO menu_item_badges (menu_item_id, badge_id)
SELECT id, 'spicy-glaze' FROM menu_items WHERE is_spicy = TRUE;

