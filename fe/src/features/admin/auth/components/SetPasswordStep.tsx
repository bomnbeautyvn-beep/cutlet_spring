import React from 'react';

interface SetPasswordStepProps {
  newPassword: string;
  onNewPasswordChange: (val: string) => void;
  confirmNewPassword: string;
  onConfirmNewPasswordChange: (val: string) => void;
  showNew: boolean;
  onToggleShowNew: () => void;
  showConfirm: boolean;
  onToggleShowConfirm: () => void;
  isLoading: boolean;
  policy: {
    hasMinLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasDigit: boolean;
    hasSpecial: boolean;
    passwordsMatch: boolean;
    isPasswordValid: boolean;
  };
  onSubmit: (e: React.FormEvent) => void;
}

export const SetPasswordStep: React.FC<SetPasswordStepProps> = ({
  newPassword,
  onNewPasswordChange,
  confirmNewPassword,
  onConfirmNewPasswordChange,
  showNew,
  onToggleShowNew,
  showConfirm,
  onToggleShowConfirm,
  isLoading,
  policy,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1.5">
          New Password *
        </label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="Enter secure password"
            className="w-full pr-10 pl-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
          <button
            type="button"
            onClick={onToggleShowNew}
            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showNew ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1.5">
          Confirm New Password *
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            required
            value={confirmNewPassword}
            onChange={(e) => onConfirmNewPasswordChange(e.target.value)}
            placeholder="Confirm new password"
            className="w-full pr-10 pl-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
          <button
            type="button"
            onClick={onToggleShowConfirm}
            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showConfirm ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      {/* Password Policy Live Requirements */}
      <div className="p-3 bg-[#fbf9f6] rounded border border-[#eae8e5] space-y-1.5 text-[11px]">
        <div className="font-bold text-[#585757] uppercase tracking-wider text-[10px]">
          Password Requirements:
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[14px] ${
                policy.hasMinLength ? 'text-emerald-600' : 'text-gray-300'
              }`}
            >
              {policy.hasMinLength ? 'check_circle' : 'circle'}
            </span>
            <span className={policy.hasMinLength ? 'text-[#1b1c1a]' : 'text-gray-400'}>
              8–72 characters
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[14px] ${
                policy.hasUpper ? 'text-emerald-600' : 'text-gray-300'
              }`}
            >
              {policy.hasUpper ? 'check_circle' : 'circle'}
            </span>
            <span className={policy.hasUpper ? 'text-[#1b1c1a]' : 'text-gray-400'}>
              Uppercase letter (A-Z)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[14px] ${
                policy.hasLower ? 'text-emerald-600' : 'text-gray-300'
              }`}
            >
              {policy.hasLower ? 'check_circle' : 'circle'}
            </span>
            <span className={policy.hasLower ? 'text-[#1b1c1a]' : 'text-gray-400'}>
              Lowercase letter (a-z)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[14px] ${
                policy.hasDigit ? 'text-emerald-600' : 'text-gray-300'
              }`}
            >
              {policy.hasDigit ? 'check_circle' : 'circle'}
            </span>
            <span className={policy.hasDigit ? 'text-[#1b1c1a]' : 'text-gray-400'}>
              Numeric digit (0-9)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[14px] ${
                policy.hasSpecial ? 'text-emerald-600' : 'text-gray-300'
              }`}
            >
              {policy.hasSpecial ? 'check_circle' : 'circle'}
            </span>
            <span className={policy.hasSpecial ? 'text-[#1b1c1a]' : 'text-gray-400'}>
              Special character
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[14px] ${
                policy.passwordsMatch ? 'text-emerald-600' : 'text-gray-300'
              }`}
            >
              {policy.passwordsMatch ? 'check_circle' : 'circle'}
            </span>
            <span className={policy.passwordsMatch ? 'text-[#1b1c1a]' : 'text-gray-400'}>
              Passwords match
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end">
        <button
          type="submit"
          disabled={isLoading || !policy.isPasswordValid}
          className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              <span>Commit New Password</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

