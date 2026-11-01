import React, { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Validation checks for live feedback
  const hasMinLength = newPassword.length >= 8 && newPassword.length <= 72;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
  const isFormValid =
    hasMinLength &&
    hasUpper &&
    hasLower &&
    hasDigit &&
    hasSpecial &&
    passwordsMatch &&
    currentPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isFormValid) {
      setErrorMessage('Please ensure the new password fulfills all security requirements and matches confirmation.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('New password cannot be the same as your current password.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword, confirmNewPassword);
      setIsSuccess(true);
      setTimeout(async () => {
        await logout();
        onClose();
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to change password. Please check your current password.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#eae8e5] shadow-2xl overflow-hidden">
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
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
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
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Security Policy Checklist */}
              <div className="p-3 bg-[#fbf9f6] border border-[#eae8e5] rounded-lg space-y-1.5 text-[11px]">
                <div className="font-bold text-[#585757] uppercase tracking-wider mb-1">Security Policy Checklist</div>
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Between 8 and 72 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {hasUpper && hasLower ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Uppercase (A-Z) and lowercase (a-z) letters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasDigit ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {hasDigit ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>At least one numeric digit (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>At least one special character (!@#$%^&*...)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>New password and confirmation match</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1b1c1a] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="px-5 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

