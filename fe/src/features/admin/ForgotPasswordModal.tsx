import React, { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'REQUEST_OTP' | 'VERIFY_OTP' | 'SET_PASSWORD' | 'SUCCESS';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>('REQUEST_OTP');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  // In-memory single-use reset token only - never stored in localStorage
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Resend cooldown timer (60 seconds)
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  // Password policy live verification
  const hasMinLength = newPassword.length >= 8 && newPassword.length <= 72;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasDigit && hasSpecial && passwordsMatch;

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }

    setIsLoading(true);
    try {
      const msg = await authService.forgotPassword(email.trim());
      setInfoMessage(msg);
      setStep('VERIFY_OTP');
      setCooldown(60);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);
    try {
      const msg = await authService.forgotPassword(email.trim());
      setInfoMessage(msg);
      setCooldown(60);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage('Please enter the full 6-digit numeric verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.verifyResetOtp(email.trim(), otp.trim());
      // Hold single-use token in in-memory state
      setResetToken(result.resetToken);
      setStep('SET_PASSWORD');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isPasswordValid) {
      setErrorMessage('Please satisfy all password security requirements before proceeding.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email.trim(), resetToken, newPassword, confirmNewPassword);
      // Immediately discard memory reset token
      setResetToken('');
      setStep('SUCCESS');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to reset password. Token may have expired.');
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
            <span className="material-symbols-outlined text-[#af101a] text-2xl">password</span>
            <div>
              <h3 className="font-bold text-base">Account Password Recovery</h3>
              <p className="text-[11px] text-[#c2beba]">Multi-step email OTP verification</p>
            </div>
          </div>
          {step !== 'SUCCESS' && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">info</span>
              <span>{infoMessage}</span>
            </div>
          )}

          {/* STEP 1: Request OTP */}
          {step === 'REQUEST_OTP' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <p className="text-xs text-[#585757] leading-relaxed">
                Enter your registered administrator email address. If an active account matches, a 6-digit verification code will be sent.
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@cutletspring.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1b1c1a] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Send Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 'VERIFY_OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-[#fbf9f6] p-3 rounded-lg border border-[#eae8e5] text-xs text-[#585757]">
                We sent a single-use 6-digit code to <strong className="text-[#1b1c1a]">{email}</strong>. The code expires in 5 minutes.
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  placeholder="123456"
                  className="w-full px-3.5 py-3 text-center text-2xl font-mono tracking-widest bg-[#fbf9f6] border border-[#eae8e5] rounded-lg focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#585757]">
                <button
                  type="button"
                  onClick={() => setStep('REQUEST_OTP')}
                  className="text-gray-500 hover:underline cursor-pointer"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || isLoading}
                  className="text-[#af101a] font-bold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Verify Code</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 'SET_PASSWORD' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-xs text-[#585757]">
                Code verified. Choose a strong new password for <strong className="text-[#1b1c1a]">{email}</strong>.
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

              {/* Confirm Password */}
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
                    placeholder="Re-type new password"
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

              {/* Security Checklist */}
              <div className="p-3 bg-[#fbf9f6] border border-[#eae8e5] rounded-lg space-y-1.5 text-[11px]">
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
                  <span>Uppercase and lowercase letters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasDigit ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {hasDigit ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>At least one number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>At least one special symbol (!@#$%^&*...)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Passwords match</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid}
                className="w-full py-3 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 'SUCCESS' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#1b1c1a]">Password Reset Complete</h4>
                <p className="text-xs text-[#585757] mt-1 max-w-xs mx-auto">
                  Your administrator password was securely updated. All active sessions have been invalidated.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full py-3 bg-[#1b1c1a] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Sign In With New Password</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

