import React from 'react';

interface AccountFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedActive: string;
  onActiveChange: (active: string) => void;
}

export const AccountFilterToolbar: React.FC<AccountFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedActive,
  onActiveChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#eae8e5] shadow-xs">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
          Search Accounts
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by email or full name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
          Role Filter
        </label>
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
        >
          <option value="">All Roles</option>
          <option value="ROLE_ADMIN">ROLE_ADMIN (Full Atelier Access)</option>
          <option value="ROLE_STAFF">ROLE_STAFF (Menu &amp; Counter Operations)</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
          Account Status
        </label>
        <select
          value={selectedActive}
          onChange={(e) => onActiveChange(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
        >
          <option value="all">All Accounts (Active &amp; Inactive)</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>
    </div>
  );
};

