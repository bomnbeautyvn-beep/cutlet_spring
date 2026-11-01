import React from 'react';

interface PasswordPolicyChecklistProps {
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  passwordsMatch: boolean;
}

export const PasswordPolicyChecklist: React.FC<PasswordPolicyChecklistProps> = ({
  hasMinLength,
  hasUpper,
  hasLower,
  hasDigit,
  hasSpecial,
  passwordsMatch,
}) => {
  return (
    <div className="p-3 bg-[#fbf9f6] border border-[#eae8e5] rounded-lg space-y-1.5 text-[11px]">
      <div className="font-bold text-[#585757] uppercase tracking-wider mb-1">
        Security Policy Checklist
      </div>
      <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700' : 'text-gray-500'}`}>
        <span className="material-symbols-outlined text-[14px]">
          {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
        </span>
        <span>Between 8 and 72 characters</span>
      </div>
      <div
        className={`flex items-center gap-1.5 ${
          hasUpper && hasLower ? 'text-emerald-700' : 'text-gray-500'
        }`}
      >
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
      <div
        className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-[14px]">
          {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
        </span>
        <span>New password and confirmation match</span>
      </div>
    </div>
  );
};

