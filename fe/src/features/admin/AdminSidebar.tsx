import React from 'react';
import { useAuthStore } from '@/stores/auth.store';

export type AdminSection = 'dashboard' | 'menu' | 'homepage' | 'settings' | 'accounts';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpen = false,
  onClose,
}) => {
  const { admin } = useAuthStore();
  const isAdmin = admin?.role === 'ROLE_ADMIN' || admin?.role === 'ADMIN';

  const navItems: Array<{
    id: AdminSection;
    label: string;
    sublabel: string;
    icon: string;
    adminOnly?: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      sublabel: 'Overview & Service Status',
      icon: 'dashboard',
    },
    {
      id: 'menu',
      label: 'Menu Management',
      sublabel: 'Catalog & 4-Language Dishes',
      icon: 'restaurant_menu',
    },
    {
      id: 'homepage',
      label: 'Homepage Management',
      sublabel: 'CMS Hero, Ingredients & Reviews',
      icon: 'view_quilt',
      adminOnly: true,
    },
    {
      id: 'settings',
      label: 'Restaurant Settings',
      sublabel: 'Profile, Hours & Policies',
      icon: 'tune',
      adminOnly: true,
    },
    {
      id: 'accounts',
      label: 'Account Management',
      sublabel: 'Admins, Staff & Audit Trail',
      icon: 'manage_accounts',
      adminOnly: true,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:w-64 bg-[#1b1c1a] text-[#fbf9f6] flex flex-col shrink-0 border-r border-[#2b2a28] min-h-screen transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#af101a] flex items-center justify-center text-white shadow-lg shrink-0">
            <span className="material-symbols-outlined text-[22px]">restaurant</span>
          </div>
          <div className="min-w-0">
            <span className="font-kr-serif text-xs text-[#feae2c] font-bold block leading-tight">
              봄돈까스
            </span>
            <h1 className="font-headline-sm text-sm font-bold tracking-wider text-white uppercase leading-tight truncate">
              Cutlet Spring
            </h1>
            <span className="text-[10px] text-white/50 tracking-widest uppercase">
              Atelier Portal
            </span>
          </div>
        </div>

        {/* Close Button on Mobile */}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectSection(item.id);
                onClose?.();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 cursor-pointer group ${
                isActive
                  ? 'bg-[#af101a] text-white font-bold shadow-md'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-[#feae2c]'
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold leading-tight truncate">
                  {item.label}
                </div>
                <div
                  className={`text-[10px] truncate leading-tight ${
                    isActive ? 'text-white/80' : 'text-white/40'
                  }`}
                >
                  {item.sublabel}
                </div>
              </div>
              {item.adminOnly && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase">
                  Admin
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-white/10 text-white/50 text-[11px] space-y-1">
        <div className="flex items-center justify-between">
          <span>Security Protocol</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Session + CSRF
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-white/40">
          <span>Storage</span>
          <span>PostgreSQL + Cloudinary</span>
        </div>
      </div>
    </aside>
  );
};

