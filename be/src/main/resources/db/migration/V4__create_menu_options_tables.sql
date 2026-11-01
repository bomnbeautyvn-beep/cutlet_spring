CREATE TABLE IF NOT EXISTS menu_item_size_options (
    id BIGSERIAL PRIMARY KEY,
    menu_item_id VARCHAR(100) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_item_sauce_options (
    id BIGSERIAL PRIMARY KEY,
    menu_item_id VARCHAR(100) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_item_addons (
    id BIGSERIAL PRIMARY KEY,
    menu_item_id VARCHAR(100) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_size_options_item ON menu_item_size_options(menu_item_id);
CREATE INDEX idx_sauce_options_item ON menu_item_sauce_options(menu_item_id);
CREATE INDEX idx_addons_item ON menu_item_addons(menu_item_id);

