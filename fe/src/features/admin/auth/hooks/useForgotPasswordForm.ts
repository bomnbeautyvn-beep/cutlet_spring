import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

export type ForgotPasswordStep = 'REQUEST_OTP' | 'VERIFY_OTP' | 'SET_PASSWORD' | 'SUCCESS';

interface UseForgotPasswordFormProps {
  isOpen: boolean;
}

export function useForgotPasswordForm({ isOpen }: UseForgotPasswordFormProps) {
  const [step, setStep] = useState<ForgotPasswordStep>('REQUEST_OTP');
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

  // Reset form when reopened
  useEffect(() => {
    if (!isOpen) {
      setStep('REQUEST_OTP');
      setEmail('');
      setOtp('');
      setResetToken('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrorMessage(null);
      setInfoMessage(null);
    }
  }, [isOpen]);

  // Password policy live verification
  const hasMinLength = newPassword.length >= 8 && newPassword.length <= 72;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
  const isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasDigit && hasSpecial && passwordsMatch;

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
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to send verification code.'
      );
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
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to resend verification code.'
      );
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
      setResetToken(result.resetToken);
      setStep('SET_PASSWORD');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Invalid or expired verification code.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password satisfies all policy requirements.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(
        email.trim(),
        resetToken,
        newPassword,
        confirmNewPassword
      );
      setStep('SUCCESS');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    policy: {
      hasMinLength,
      hasUpper,
      hasLower,
      hasDigit,
      hasSpecial,
      passwordsMatch,
      isPasswordValid,
    },
    handleRequestOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleResetPassword,
  };
}

