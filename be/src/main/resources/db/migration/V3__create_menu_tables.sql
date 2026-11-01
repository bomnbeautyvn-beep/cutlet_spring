CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL REFERENCES menu_categories(id),
    name_en VARCHAR(255) NOT NULL,
    name_kr VARCHAR(255) NOT NULL,
    name_kr_subtitle VARCHAR(255),
    name_jp VARCHAR(255),
    name_vi VARCHAR(255),
    description_en TEXT NOT NULL,
    description_kr TEXT NOT NULL,
    description_vi TEXT,
    description_jp TEXT,
    portion_en VARCHAR(100),
    portion_vi VARCHAR(100),
    portion_kr VARCHAR(100),
    portion_jp VARCHAR(100),
    base_price INT NOT NULL,
    prep_time_minutes INT NOT NULL DEFAULT 15,
    image_url VARCHAR(500),
    image_public_id VARCHAR(255),
    alt_text VARCHAR(500),
    is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
    is_chef_signature BOOLEAN NOT NULL DEFAULT FALSE,
    is_limited BOOLEAN NOT NULL DEFAULT FALSE,
    is_spicy BOOLEAN NOT NULL DEFAULT FALSE,
    spice_level INT NOT NULL DEFAULT 0,
    spice_note VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_item_dish_types (
    menu_item_id VARCHAR(100) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    dish_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (menu_item_id, dish_type)
);

CREATE TABLE IF NOT EXISTS menu_item_tags (
    menu_item_id VARCHAR(100) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (menu_item_id, tag)
);

CREATE TABLE IF NOT EXISTS menu_item_features (
    menu_item_id VARCHAR(100) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    feature VARCHAR(255) NOT NULL,
    PRIMARY KEY (menu_item_id, feature)
);

CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_active ON menu_items(active);

