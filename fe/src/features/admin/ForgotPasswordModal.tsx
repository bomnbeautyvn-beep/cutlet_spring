import React from 'react';
import { useForgotPasswordForm } from './auth/hooks/useForgotPasswordForm';
import { RequestOtpStep } from './auth/components/RequestOtpStep';
import { VerifyOtpStep } from './auth/components/VerifyOtpStep';
import { SetPasswordStep } from './auth/components/SetPasswordStep';
import { SuccessStep } from './auth/components/SuccessStep';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    step,
    setStep,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    isLoading,
    errorMessage,
    infoMessage,
    cooldown,
    policy,
    handleRequestOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleResetPassword,
  } = useForgotPasswordForm({ isOpen });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#eae8e5] p-6 space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
          <div>
            <span className="font-kr-serif text-xs text-[#af101a] font-bold">봄돈까스</span>
            <h2 className="font-headline-md text-base font-bold text-[#1b1c1a]">
              Password Recovery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eae8e5] text-[#585757] hover:text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Info Banner */}
        {infoMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* STEP 1: REQUEST OTP */}
        {step === 'REQUEST_OTP' && (
          <RequestOtpStep
            email={email}
            onEmailChange={setEmail}
            isLoading={isLoading}
            onSubmit={handleRequestOtp}
            onClose={onClose}
          />
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'VERIFY_OTP' && (
          <VerifyOtpStep
            email={email}
            otp={otp}
            onOtpChange={setOtp}
            isLoading={isLoading}
            cooldown={cooldown}
            onResendOtp={handleResendOtp}
            onSubmit={handleVerifyOtp}
            onBackToEmail={() => setStep('REQUEST_OTP')}
          />
        )}

        {/* STEP 3: SET NEW PASSWORD */}
        {step === 'SET_PASSWORD' && (
          <SetPasswordStep
            newPassword={newPassword}
            onNewPasswordChange={setNewPassword}
            confirmNewPassword={confirmNewPassword}
            onConfirmNewPasswordChange={setConfirmNewPassword}
            showNew={showNew}
            onToggleShowNew={() => setShowNew(!showNew)}
            showConfirm={showConfirm}
            onToggleShowConfirm={() => setShowConfirm(!showConfirm)}
            isLoading={isLoading}
            policy={policy}
            onSubmit={handleResetPassword}
          />
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'SUCCESS' && <SuccessStep onSuccess={onSuccess} onClose={onClose} />}
      </div>
    </div>
  );
};
