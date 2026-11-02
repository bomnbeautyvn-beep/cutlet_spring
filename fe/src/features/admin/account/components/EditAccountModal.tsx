import React from 'react';
import { AdminAccount } from '@/services/admin.service';

interface EditAccountModalProps {
  editingAccount: AdminAccount | null;
  onClose: () => void;
  onFullNameChange: (val: string) => void;
  onRoleChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  editingAccount,
  onClose,
  onFullNameChange,
  onRoleChange,
  onSubmit,
}) => {
  if (!editingAccount) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded shadow-2xl border border-[#eae8e5] p-6 space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
          <div>
            <h2 className="text-base font-bold text-[#1b1c1a]">Edit Account</h2>
            <p className="text-[11px] text-[#585757] font-mono">{editingAccount.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-[#eae8e5] text-gray-500 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#585757] uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={editingAccount.fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#585757] uppercase tracking-wider mb-1">
              Role Authority *
            </label>
            <select
              value={editingAccount.role}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
            >
              <option value="ROLE_STAFF">ROLE_STAFF</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold uppercase tracking-wider rounded shadow-md cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

