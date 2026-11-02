import React, { useState } from 'react';
import { AdminSidebar, AdminSection } from '@/features/admin/AdminSidebar';
import { AdminHeader } from '@/features/admin/AdminHeader';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { MenuManagementPage } from '@/features/admin/MenuManagementPage';
import { RestaurantSettingsPage } from '@/features/admin/RestaurantSettingsPage';
import { AccountManagementPage } from '@/features/admin/AccountManagementPage';
import { HomepageCmsPage } from '@/features/admin/cms/HomepageCmsPage';
import { DatabaseManagementPage } from '@/features/admin/database/DatabaseManagementPage';
import { ChangePasswordModal } from '@/features/admin/ChangePasswordModal';
import { useAuthStore } from '@/stores/auth.store';

interface AdminLayoutProps {
  onExitToPublicSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitToPublicSite }) => {
  const { admin } = useAuthStore();
  const isAdmin = admin?.role === 'ROLE_ADMIN' || admin?.role === 'ADMIN';

  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isNewDishModalOpen, setIsNewDishModalOpen] = useState(false);

  // Section titles
  const sectionTitles: Record<AdminSection, string> = {
    dashboard: 'Atelier Dashboard & Metrics',
    menu: 'Menu Catalog Management',
    homepage: 'Homepage Content Management & CMS',
    settings: 'Restaurant Profile & Operating Settings',
    accounts: 'Account Credentials & Security Audit',
    database: 'Database Backup & Disaster Recovery',
  };

  const handleSelectSection = (section: AdminSection) => {
    // If staff tries to access admin-only sections, prevent
    if ((section === 'settings' || section === 'accounts' || section === 'homepage' || section === 'database') && !isAdmin) {
      return;
    }
    setCurrentSection(section);
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
          currentSectionTitle={sectionTitles[currentSection]}
          onChangePasswordClick={() => setIsChangePasswordOpen(true)}
          onExitToPublicSite={onExitToPublicSite}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Section Content */}
        <main className="flex-1 pb-12">
          {currentSection === 'dashboard' && (
            <AdminDashboard
              onNavigate={handleSelectSection}
              onOpenNewDish={() => {
                setCurrentSection('menu');
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
            <RestaurantSettingsPage onNavigateToHomepage={() => setCurrentSection('homepage')} />
          )}

          {currentSection === 'accounts' && isAdmin && <AccountManagementPage />}

          {currentSection === 'database' && isAdmin && <DatabaseManagementPage />}
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
