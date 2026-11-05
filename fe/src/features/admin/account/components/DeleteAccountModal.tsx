import React from 'react';
import { AdminAccount } from '@/services/admin.service';

interface DeleteAccountModalProps {
  account: AdminAccount | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  account,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !account) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded shadow-2xl border border-[#eae8e5] p-6 space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded bg-red-100 text-[#ba1a1a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">delete_forever</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-headline-md text-base font-bold text-[#1b1c1a]">
              Delete Operator Account
            </h3>
            <p className="text-xs text-[#585757]">
              Are you sure you want to permanently remove this administrative account?
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-[#fbf9f6] border border-[#eae8e5] rounded text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#585757]">Operator:</span>
            <span className="font-bold text-[#1b1c1a]">{account.fullName || 'Atelier Staff'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#585757]">Email Address:</span>
            <span className="font-mono text-[#1b1c1a]">{account.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#585757]">Role:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
              {account.role}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#ba1a1a] bg-red-50 p-2.5 rounded border border-red-200">
          This action is irreversible. The operator will immediately lose all administrative access and credentials will be removed.
        </p>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#585757] hover:bg-[#eae8e5] rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Delete Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
