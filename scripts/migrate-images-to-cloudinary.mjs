#!/usr/bin/env node

/**
 * Cutlet Spring - Cloudinary Image Asset Migration Utility
 * 
 * Safely migrates existing local menu images from `fe/public/images/menu/`
 * to Cloudinary storage and synchronizes dish records.
 * 
 * Usage:
 *   node scripts/migrate-images-to-cloudinary.mjs
 * 
 * Environment variables:
 *   BACKEND_URL      - Cutlet Spring backend URL (default: http://localhost:8080)
 *   ADMIN_EMAIL      - Admin email (default: admin@cutletspring.com)
 *   ADMIN_PASSWORD   - Admin password (default: admin123)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cutletspring.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const MENU_IMAGES_DIR = path.join(rootDir, 'fe', 'public', 'images', 'menu');

const DISH_FILENAME_MAP = {
  'half-and-half-pork-cutlet.jpg': 'half-and-half-pork-cutlet',
  'pork-tenderloin-cutlet.jpg': 'pork-tenderloin-cutlet-set',
  'sasami-katsu.png': 'sasami-katsu-chicken',
  'cheese-king-katsu.jpg': 'cheese-king-katsu',
  'all-star-set.jpg': 'all-star-atelier-set',
  'korean-style-tonkatsu.jpg': 'korean-style-retro-tonkatsu',
  'cheese-bomb-katsu.png': 'cheese-bomb-katsu',
  'pork-tenderloin-katsu-curry-rice.jpg': 'pork-tenderloin-katsu-curry-rice',
  'jjolmyeon-set.jpg': 'jjolmyeon-set-with-cutlet',
};

async function runMigration() {
  console.log('====================================================');
  console.log(' CUTLET SPRING - CLOUDINARY IMAGE MIGRATION UTILITY ');
  console.log('====================================================');
  console.log(`Backend API : ${BACKEND_URL}`);
  console.log(`Assets Root : ${MENU_IMAGES_DIR}\n`);

  if (!fs.existsSync(MENU_IMAGES_DIR)) {
    console.error(`Error: Menu images directory not found at ${MENU_IMAGES_DIR}`);
    process.exit(1);
  }

  // 1. Check health
  try {
    const healthRes = await fetch(`${BACKEND_URL}/actuator/health`);
    if (!healthRes.ok) {
      console.warn(`Warning: Backend health returned status ${healthRes.status}`);
    } else {
      console.log('✓ Backend service reachable.');
    }
  } catch (err) {
    console.error(`✗ Cannot reach backend at ${BACKEND_URL}. Ensure Spring Boot is running.`);
    console.error(`  Run: cd be && ./mvnw spring-boot:run\n`);
    process.exit(1);
  }

  // 2. Authenticate admin
  console.log(`Authenticating as ${ADMIN_EMAIL}...`);
  let sessionCookie = null;
  let xsrfToken = null;

  try {
    // Get CSRF token
    const csrfRes = await fetch(`${BACKEND_URL}/api/auth/csrf`);
    const csrfCookieHeader = csrfRes.headers.get('set-cookie');
    if (csrfCookieHeader) {
      const match = csrfCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
      if (match) xsrfToken = match[1];
    }
    const csrfJson = await csrfRes.json();
    if (csrfJson?.data?.token) xsrfToken = csrfJson.data.token;

    // Login
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }

    const setCookie = loginRes.headers.get('set-cookie');
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }

    console.log('✓ Administrator authenticated successfully.\n');
  } catch (err) {
    console.error(`✗ Failed to authenticate admin: ${err.message}`);
    process.exit(1);
  }

  // 3. Scan and migrate images
  console.log('Scanning local menu images for migration to Cloudinary:');
  const uploaded = [];
  const skipped = [];
  const errors = [];

  for (const [filename, dishId] of Object.entries(DISH_FILENAME_MAP)) {
    // Search file recursively in menu directory
    let foundPath = null;
    const searchDirs = ['japanese', 'korean', 'curry', 'noodles', 'addons', 'sauces', 'drinks'];
    for (const sub of searchDirs) {
      const testPath = path.join(MENU_IMAGES_DIR, sub, filename);
      if (fs.existsSync(testPath)) {
        foundPath = testPath;
        break;
      }
    }

    if (!foundPath) {
      console.log(`  - [SKIPPED] ${filename}: file not found on disk.`);
      skipped.push(filename);
      continue;
    }

    const fileBuffer = fs.readFileSync(foundPath);
    const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const blob = new Blob([fileBuffer], { type: mimeType });

    const formData = new FormData();
    formData.append('file', blob, filename);

    try {
      const uploadRes = await fetch(`${BACKEND_URL}/api/admin/menu/${dishId}/image`, {
        method: 'POST',
        headers: {
          ...(sessionCookie ? { Cookie: sessionCookie } : {}),
          ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`Status ${uploadRes.status}: ${errorText}`);
      }

      const json = await uploadRes.json();
      console.log(`  ✓ [MIGRATED] ${dishId} -> ${json?.data?.image || 'Cloudinary'}`);
      uploaded.push({ dishId, filename, url: json?.data?.image });
    } catch (err) {
      console.error(`  ✗ [FAILED] ${dishId} (${filename}): ${err.message}`);
      errors.push({ dishId, filename, error: err.message });
    }
  }

  console.log('\n====================================================');
  console.log(` MIGRATION COMPLETE: ${uploaded.length} Uploaded, ${skipped.length} Skipped, ${errors.length} Errors`);
  console.log('====================================================');
}

runMigration().catch((err) => {
  console.error('Unhandled migration failure:', err);
  process.exit(1);
});

