/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminSection } from './AdminSidebar';

export const ADMIN_SECTIONS: AdminSection[] = [
  'dashboard',
  'menu',
  'homepage',
  'settings',
  'accounts',
  'database',
];

export const SECTION_TITLES: Record<AdminSection, string> = {
  dashboard: 'Atelier Dashboard & Metrics',
  menu: 'Menu Catalog Management',
  homepage: 'Homepage Content Management & CMS',
  settings: 'Restaurant Profile & Operating Settings',
  accounts: 'Account Credentials & Security Audit',
  database: 'Database Backup & Disaster Recovery',
};

/**
 * Extracts the AdminSection from a URL pathname.
 * Supports: /admin/menu, /admin/dashboard, /admin, /fe/admin/menu, etc.
 */
export function getSectionFromPath(pathname: string): AdminSection {
  const normalized = pathname.replace(/^\/fe/, '');
  const match = normalized.match(/^\/admin\/?([^\/]*)/i);
  if (match) {
    const slug = match[1]?.toLowerCase();
    if (slug && (ADMIN_SECTIONS as string[]).includes(slug)) {
      return slug as AdminSection;
    }
  }

  // Fallback to last active section saved in session if visiting base /admin
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem('last_admin_section') as AdminSection | null;
    if (saved && (ADMIN_SECTIONS as string[]).includes(saved)) {
      return saved;
    }
  }

  return 'dashboard';
}

/**
 * Maps an AdminSection to its distinct canonical URL path.
 */
export function getPathFromSection(section: AdminSection): string {
  return `/admin/${section}`;
}

