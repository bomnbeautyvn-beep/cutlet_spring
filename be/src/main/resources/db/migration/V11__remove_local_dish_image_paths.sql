-- V11: Clear local static menu image paths so dishes and content exclusively rely on Cloudinary remote URLs

-- 1. Clear local dish images from menu_items
UPDATE menu_items
SET image_url = NULL, image_public_id = NULL
WHERE image_url IS NOT NULL
  AND (image_url LIKE '/images/menu/%'
       OR image_url LIKE 'images/menu/%'
       OR (image_url NOT LIKE 'http://%' AND image_url NOT LIKE 'https://%' AND image_url NOT LIKE '//%'));

-- 2. Clear local images from homepage_hero_contents
UPDATE homepage_hero_contents
SET image_url = NULL, image_public_id = NULL
WHERE image_url IS NOT NULL
  AND (image_url LIKE '/images/menu/%'
       OR image_url LIKE 'images/menu/%'
       OR (image_url NOT LIKE 'http://%' AND image_url NOT LIKE 'https://%' AND image_url NOT LIKE '//%'));

-- 3. Clear local images from ingredients
UPDATE ingredients
SET image_url = NULL, image_public_id = NULL
WHERE image_url IS NOT NULL
  AND (image_url LIKE '/images/menu/%'
       OR image_url LIKE 'images/menu/%'
       OR (image_url NOT LIKE 'http://%' AND image_url NOT LIKE 'https://%' AND image_url NOT LIKE '//%'));

-- 4. Clear local banner image from restaurant_settings (retain logo_url which points to /images/common/...)
UPDATE restaurant_settings
SET banner_url = NULL, banner_public_id = NULL
WHERE banner_url IS NOT NULL
  AND (banner_url LIKE '/images/menu/%'
       OR banner_url LIKE 'images/menu/%');
