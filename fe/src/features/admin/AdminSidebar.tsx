import React from 'react';
import { useAuthStore } from '@/stores/auth.store';

export type AdminSection = 'dashboard' | 'menu' | 'homepage' | 'orders' | 'seating' | 'settings' | 'accounts';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
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
      id: 'orders',
      label: 'Walk-In Order Desk',
      sublabel: 'Ticket Queue & Counter Prep',
      icon: 'point_of_sale',
    },
    {
      id: 'seating',
      label: 'Counter Theater',
      sublabel: 'Counter & Hall Capacity',
      icon: 'chair_alt',
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
    <aside className="w-64 bg-[#1b1c1a] text-[#fbf9f6] flex flex-col shrink-0 border-r border-[#2b2a28] min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#af101a] flex items-center justify-center text-white shadow-lg shrink-0">
          <span className="material-symbols-outlined text-[22px]">restaurant</span>
        </div>
        <div>
          <span className="font-kr-serif text-xs text-[#feae2c] font-bold block leading-tight">
            봄돈까스
          </span>
          <h1 className="font-headline-sm text-sm font-bold tracking-wider text-white uppercase leading-tight">
            Cutlet Spring
          </h1>
          <span className="text-[10px] text-white/50 tracking-widest uppercase">
            Atelier Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
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

