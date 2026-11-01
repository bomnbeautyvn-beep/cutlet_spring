import React from 'react';
import { useAuthStore } from '@/stores/auth.store';

interface AdminHeaderProps {
  currentSectionTitle: string;
  onChangePasswordClick: () => void;
  onExitToPublicSite: () => void;
  onToggleSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSectionTitle,
  onChangePasswordClick,
  onExitToPublicSite,
  onToggleSidebar,
}) => {
  const { admin, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-[#eae8e5] px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {/* Left: Mobile Menu Toggle & Section Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1 text-[#585757] hover:text-[#1b1c1a] hover:bg-[#f5f3f0] rounded-lg lg:hidden cursor-pointer flex items-center justify-center shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <span className="font-kr-serif text-sm font-bold text-[#af101a] hidden sm:inline shrink-0">
          봄돈까스
        </span>
        <span className="text-gray-300 hidden sm:inline shrink-0">•</span>
        <h2 className="font-headline-md text-sm sm:text-base lg:text-lg font-bold text-[#1b1c1a] truncate">
          {currentSectionTitle}
        </h2>
      </div>

      {/* Right: User Information & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* User Information */}
        <div className="hidden md:flex items-center gap-2 pr-3 border-r border-[#eae8e5]">
          <div className="text-right">
            <div className="text-xs font-bold text-[#1b1c1a] leading-tight">
              {admin?.fullName || 'Administrator'}
            </div>
            <div className="text-[10px] text-[#8f6f6c] font-mono leading-tight">
              {admin?.email}
            </div>
          </div>
        </div>

        {/* Change Password Button */}
        <button
          onClick={onChangePasswordClick}
          title="Change account password"
          className="p-1.5 sm:p-2 text-[#585757] hover:text-[#af101a] hover:bg-[#fbf9f6] rounded-lg border border-transparent hover:border-[#eae8e5] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          <span className="hidden xl:inline">Password</span>
        </button>

        {/* View Public Site */}
        <button
          onClick={onExitToPublicSite}
          title="Open Public Menu"
          className="p-1.5 sm:p-2 text-[#585757] hover:text-[#1b1c1a] hover:bg-[#fbf9f6] rounded-lg border border-transparent hover:border-[#eae8e5] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span className="hidden xl:inline">Public Site</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => logout()}
          title="Sign out of administration"
          className="px-2.5 sm:px-3 py-1.5 bg-[#f5f3f0] hover:bg-red-50 text-[#585757] hover:text-red-700 hover:border-red-200 border border-[#eae8e5] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

