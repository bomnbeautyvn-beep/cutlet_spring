import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export interface UseChangePasswordFormProps {
  onClose: () => void;
}

export const useChangePasswordForm = ({ onClose }: UseChangePasswordFormProps) => {
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
      setErrorMessage(
        'Please ensure the new password fulfills all security requirements and matches confirmation.'
      );
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
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to change password. Please check your current password.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};

