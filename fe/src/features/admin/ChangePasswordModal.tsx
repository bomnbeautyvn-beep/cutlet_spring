import React from 'react';
import { useChangePasswordForm } from './auth/hooks/useChangePasswordForm';
import { PasswordPolicyChecklist } from './auth/components/PasswordPolicyChecklist';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showCurrent,
    setShowCurrent,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    isLoading,
    errorMessage,
    isSuccess,
    hasMinLength,
    hasUpper,
    hasLower,
    hasDigit,
    hasSpecial,
    passwordsMatch,
    isFormValid,
    handleSubmit,
  } = useChangePasswordForm({ onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded max-w-md w-full border border-[#eae8e5] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#1b1c1a] text-white flex items-center justify-between border-b-2 border-[#af101a]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#af101a] text-2xl">lock_reset</span>
            <div>
              <h3 className="font-bold text-base">Change Administrator Password</h3>
              <p className="text-[11px] text-[#c2beba]">Update your back-office security credentials</p>
            </div>
          </div>
          {!isSuccess && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h4 className="font-bold text-lg text-[#1b1c1a]">Password Updated Successfully</h4>
              <p className="text-xs text-[#585757] max-w-xs mx-auto">
                All existing sessions have been invalidated. Redirecting you to sign in with your new credentials...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter existing password"
                    autoComplete="current-password"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer flex items-center justify-center"
                    title={showCurrent ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showCurrent ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new strong password"
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer flex items-center justify-center"
                    title={showNew ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showNew ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer flex items-center justify-center"
                    title={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Security Policy Checklist */}
              <PasswordPolicyChecklist
                hasMinLength={hasMinLength}
                hasUpper={hasUpper}
                hasLower={hasLower}
                hasDigit={hasDigit}
                hasSpecial={hasSpecial}
                passwordsMatch={passwordsMatch}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1b1c1a] font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="px-5 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold text-xs uppercase tracking-wider rounded shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">security</span>
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
