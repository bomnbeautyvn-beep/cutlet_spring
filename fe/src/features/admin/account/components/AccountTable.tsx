import React from 'react';
import { AdminAccount, PageResult } from '@/services/admin.service';
import { AccountTableRow } from './AccountTableRow';

interface AccountTableProps {
  accounts: AdminAccount[];
  pageResult: PageResult<AdminAccount> | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  currentAdminEmail?: string;
  togglingId: string | null;
  onToggleStatus: (acc: AdminAccount) => void;
  onEdit: (acc: AdminAccount) => void;
  onResetPassword: (acc: AdminAccount) => void;
  onDelete: (acc: AdminAccount) => void;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  pageResult,
  currentPage,
  onPageChange,
  isLoading,
  currentAdminEmail,
  togglingId,
  onToggleStatus,
  onEdit,
  onResetPassword,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
        <div className="w-7 h-7 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-wider font-bold">Loading Accounts...</span>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="py-16 text-center text-[#8f6f6c] text-xs">
        No administrator or staff accounts found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#f5f3f0] border-b border-[#eae8e5] text-[#585757] uppercase font-bold tracking-wider">
          <tr>
            <th className="py-3.5 px-4">Operator / Email</th>
            <th className="py-3.5 px-4">Role &amp; Permissions</th>
            <th className="py-3.5 px-4 text-center">Active Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eae8e5]">
          {accounts.map((acc) => (
            <AccountTableRow
              key={acc.id}
              account={acc}
              currentAdminEmail={currentAdminEmail}
              isToggling={togglingId === acc.id}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onResetPassword={onResetPassword}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {pageResult && pageResult.totalPages > 1 && (
        <div className="p-4 border-t border-[#eae8e5] flex items-center justify-between text-xs text-[#585757] bg-[#fbf9f6]">
          <span>
            Page {currentPage + 1} of {pageResult.totalPages} (Total {pageResult.totalElements} users)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 bg-white border border-[#eae8e5] rounded font-bold text-xs hover:bg-[#eae8e5] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(pageResult.totalPages - 1, currentPage + 1))}
              disabled={currentPage >= pageResult.totalPages - 1}
              className="px-3 py-1.5 bg-white border border-[#eae8e5] rounded font-bold text-xs hover:bg-[#eae8e5] disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

