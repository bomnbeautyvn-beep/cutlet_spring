/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminSection } from '@/features/admin/AdminSidebar';
import { AdminHeader } from '@/features/admin/AdminHeader';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { MenuManagementPage } from '@/features/admin/MenuManagementPage';
import { RestaurantSettingsPage } from '@/features/admin/RestaurantSettingsPage';
import { AccountManagementPage } from '@/features/admin/AccountManagementPage';
import { HomepageCmsPage } from '@/features/admin/cms/HomepageCmsPage';
import { DatabaseManagementPage } from '@/features/admin/database/DatabaseManagementPage';
import { ChangePasswordModal } from '@/features/admin/ChangePasswordModal';
import { ErrorBoundary } from '@/components/common';
import { useAuthStore } from '@/stores/auth.store';
import {
  SECTION_TITLES,
  getSectionFromPath,
  getPathFromSection,
} from '@/features/admin/adminNavigation';

interface AdminLayoutProps {
  routePath?: string;
  onNavigatePath?: (path: string) => void;
  onExitToPublicSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  routePath = window.location.pathname,
  onNavigatePath,
  onExitToPublicSite,
}) => {
  const { admin } = useAuthStore();
  const isAdmin = admin?.role === 'ROLE_ADMIN' || admin?.role === 'ADMIN';

  const [currentSection, setCurrentSection] = useState<AdminSection>(() =>
    getSectionFromPath(routePath)
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isNewDishModalOpen, setIsNewDishModalOpen] = useState(false);

  // Sync currentSection whenever routePath changes (e.g. browser Back / Forward buttons)
  useEffect(() => {
    const resolvedSection = getSectionFromPath(routePath);

    // Permission boundary: Staff cannot enter admin-restricted areas
    if (
      (resolvedSection === 'settings' ||
        resolvedSection === 'accounts' ||
        resolvedSection === 'homepage' ||
        resolvedSection === 'database') &&
      !isAdmin
    ) {
      const fallbackSection: AdminSection = 'menu';
      const fallbackPath = getPathFromSection(fallbackSection);
      window.history.replaceState(null, '', fallbackPath);
      setCurrentSection(fallbackSection);
      sessionStorage.setItem('last_admin_section', fallbackSection);
      onNavigatePath?.(fallbackPath);
      return;
    }

    setCurrentSection(resolvedSection);
    sessionStorage.setItem('last_admin_section', resolvedSection);

    // If on base /admin without slug, normalize URL to canonical /admin/slug
    const canonicalPath = getPathFromSection(resolvedSection);
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      window.history.replaceState(null, '', canonicalPath);
      onNavigatePath?.(canonicalPath);
    }
  }, [routePath, isAdmin, onNavigatePath]);

  const handleSelectSection = (section: AdminSection) => {
    // If staff tries to access admin-only sections, prevent
    if (
      (section === 'settings' ||
        section === 'accounts' ||
        section === 'homepage' ||
        section === 'database') &&
      !isAdmin
    ) {
      return;
    }

    const targetPath = getPathFromSection(section);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setCurrentSection(section);
    sessionStorage.setItem('last_admin_section', section);
    onNavigatePath?.(targetPath);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex flex-row relative">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <AdminHeader
          currentSectionTitle={SECTION_TITLES[currentSection]}
          onChangePasswordClick={() => setIsChangePasswordOpen(true)}
          onExitToPublicSite={onExitToPublicSite}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Section Content */}
        <main className="flex-1 pb-12">
          <ErrorBoundary
            key={currentSection}
            sectionName={SECTION_TITLES[currentSection]}
            isFullScreen={false}
          >
            {currentSection === 'dashboard' && (
              <AdminDashboard
                onNavigate={handleSelectSection}
                onOpenNewDish={() => {
                  handleSelectSection('menu');
                  setIsNewDishModalOpen(true);
                }}
              />
            )}

            {currentSection === 'menu' && (
              <MenuManagementPage
                onOpenNewDishModal={setIsNewDishModalOpen}
                isNewDishModalOpen={isNewDishModalOpen}
              />
            )}

            {currentSection === 'homepage' && isAdmin && <HomepageCmsPage />}

            {currentSection === 'settings' && isAdmin && (
              <RestaurantSettingsPage
                onNavigateToHomepage={() => handleSelectSection('homepage')}
              />
            )}

            {currentSection === 'accounts' && isAdmin && <AccountManagementPage />}

            {currentSection === 'database' && isAdmin && <DatabaseManagementPage />}
          </ErrorBoundary>
        </main>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </div>
  );
};
