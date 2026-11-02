-- V13: Make non-English translations optional for menu_items and ingredients
-- English (EN) remains the canonical required language. Korean (KO), Vietnamese (VI), and Japanese (JA) are optional.

-- 1. menu_items
ALTER TABLE menu_items ALTER COLUMN name_kr DROP NOT NULL;
ALTER TABLE menu_items ALTER COLUMN description_kr DROP NOT NULL;

-- 2. ingredients
ALTER TABLE ingredients ALTER COLUMN name_kr DROP NOT NULL;
ALTER TABLE ingredients ALTER COLUMN name_vi DROP NOT NULL;
ALTER TABLE ingredients ALTER COLUMN name_jp DROP NOT NULL;
ALTER TABLE ingredients ALTER COLUMN description_kr DROP NOT NULL;
ALTER TABLE ingredients ALTER COLUMN description_vi DROP NOT NULL;
ALTER TABLE ingredients ALTER COLUMN description_jp DROP NOT NULL;

