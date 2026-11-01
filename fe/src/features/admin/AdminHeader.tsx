import React from 'react';
import { useAuthStore } from '@/stores/auth.store';

interface AdminHeaderProps {
  currentSectionTitle: string;
  onChangePasswordClick: () => void;
  onExitToPublicSite: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSectionTitle,
  onChangePasswordClick,
  onExitToPublicSite,
}) => {
  const { admin, logout } = useAuthStore();
  const isAdmin = admin?.role === 'ROLE_ADMIN' || admin?.role === 'ADMIN';

  return (
    <header className="h-16 bg-white border-b border-[#eae8e5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {/* Left: Section Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="font-kr-serif text-sm font-bold text-[#af101a] hidden sm:inline">봄돈까스</span>
        <span className="text-gray-300 hidden sm:inline">•</span>
        <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#1b1c1a]">
          {currentSectionTitle}
        </h2>
      </div>

      {/* Right: User Information & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role & Name Chip */}
        <div className="flex items-center gap-2 pr-2 sm:pr-4 border-r border-[#eae8e5]">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-[#1b1c1a] leading-tight">
              {admin?.fullName || 'Administrator'}
            </div>
            <div className="text-[10px] text-[#8f6f6c] font-mono leading-tight">
              {admin?.email}
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isAdmin
                ? 'bg-[#af101a]/10 text-[#af101a] border border-[#af101a]/20'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            {isAdmin ? 'Admin' : 'Staff'}
          </span>
        </div>

        {/* Change Password Button */}
        <button
          onClick={onChangePasswordClick}
          title="Change account password"
          className="p-2 text-[#585757] hover:text-[#af101a] hover:bg-[#fbf9f6] rounded-lg border border-transparent hover:border-[#eae8e5] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          <span className="hidden lg:inline">Password</span>
        </button>

        {/* View Public Site */}
        <button
          onClick={onExitToPublicSite}
          title="Open Public Menu"
          className="p-2 text-[#585757] hover:text-[#1b1c1a] hover:bg-[#fbf9f6] rounded-lg border border-transparent hover:border-[#eae8e5] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span className="hidden lg:inline">Public Site</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => logout()}
          title="Sign out of administration"
          className="px-3 py-1.5 bg-[#f5f3f0] hover:bg-red-50 text-[#585757] hover:text-red-700 hover:border-red-200 border border-[#eae8e5] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

