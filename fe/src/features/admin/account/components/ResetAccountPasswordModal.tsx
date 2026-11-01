import React from 'react';
import { AdminAccount } from '@/services/admin.service';

interface ResetAccountPasswordModalProps {
  resettingAccount: AdminAccount | null;
  onClose: () => void;
  newPasswordValue: string;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ResetAccountPasswordModal: React.FC<ResetAccountPasswordModalProps> = ({
  resettingAccount,
  onClose,
  newPasswordValue,
  onPasswordChange,
  onSubmit,
}) => {
  if (!resettingAccount) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#eae8e5] p-6 space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
          <div>
            <h2 className="text-base font-bold text-amber-900">Admin Password Reset</h2>
            <p className="text-[11px] text-[#585757] font-mono">{resettingAccount.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-[#eae8e5] text-gray-500 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <p className="text-[#585757]">
            Set a new temporary or permanent password for this operator. They can change it upon
            login.
          </p>

          <div>
            <label className="block font-bold text-[#585757] uppercase tracking-wider mb-1">
              New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPasswordValue}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Min 8 chars, uppercase, lowercase, digit, symbol"
              className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

