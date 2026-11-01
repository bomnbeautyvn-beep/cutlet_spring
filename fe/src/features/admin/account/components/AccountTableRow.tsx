import React from 'react';
import { AdminAccount } from '@/services/admin.service';

interface AccountTableRowProps {
  account: AdminAccount;
  currentAdminEmail?: string;
  isToggling: boolean;
  onToggleStatus: (acc: AdminAccount) => void;
  onEdit: (acc: AdminAccount) => void;
  onResetPassword: (acc: AdminAccount) => void;
}

export const AccountTableRow: React.FC<AccountTableRowProps> = ({
  account,
  currentAdminEmail,
  isToggling,
  onToggleStatus,
  onEdit,
  onResetPassword,
}) => {
  const isCurrent = account.email.toLowerCase() === currentAdminEmail?.toLowerCase();
  const isAdminRole = account.role === 'ROLE_ADMIN' || account.role === 'ADMIN';

  return (
    <tr
      className={`hover:bg-[#fbf9f6] transition-colors ${
        !account.active ? 'opacity-60 bg-gray-50/50' : ''
      }`}
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs uppercase ${
              isAdminRole ? 'bg-[#af101a]' : 'bg-amber-600'
            }`}
          >
            {account.fullName ? account.fullName.charAt(0) : account.email.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1b1c1a] text-xs">
                {account.fullName || 'Atelier Operator'}
              </span>
              {isCurrent && (
                <span className="px-2 py-0.5 bg-[#af101a]/10 text-[#af101a] font-bold text-[9px] uppercase tracking-wider rounded-md">
                  Current Session
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#585757] block font-mono">{account.email}</span>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
              isAdminRole
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {account.role}
          </span>
          <span className="text-[10px] text-[#8f6f6c]">
            {isAdminRole ? 'Full Access' : 'Counter Operations'}
          </span>
        </div>
      </td>

      <td className="py-3.5 px-4 text-center">
        <div className="inline-flex flex-col items-center gap-1">
          <button
            type="button"
            disabled={isToggling || isCurrent}
            onClick={() => onToggleStatus(account)}
            title={
              isCurrent
                ? 'Cannot deactivate active account'
                : account.active
                ? 'Deactivate account'
                : 'Activate account'
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer disabled:opacity-40 ${
              account.active ? 'bg-emerald-600' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                account.active ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              account.active ? 'text-emerald-700' : 'text-zinc-400'
            }`}
          >
            {isToggling ? 'Syncing...' : account.active ? 'Active' : 'Deactivated'}
          </span>
        </div>
      </td>

      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(account)}
            title="Edit Full Name & Role"
            className="p-1.5 text-[#585757] hover:text-[#af101a] hover:bg-[#f5f3f0] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => onResetPassword(account)}
            title="Administrative Password Reset"
            className="p-1.5 text-[#585757] hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

