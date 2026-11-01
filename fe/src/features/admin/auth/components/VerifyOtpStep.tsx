import React from 'react';

interface VerifyOtpStepProps {
  email: string;
  otp: string;
  onOtpChange: (val: string) => void;
  isLoading: boolean;
  cooldown: number;
  onResendOtp: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToEmail: () => void;
}

export const VerifyOtpStep: React.FC<VerifyOtpStepProps> = ({
  email,
  otp,
  onOtpChange,
  isLoading,
  cooldown,
  onResendOtp,
  onSubmit,
  onBackToEmail,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-3 bg-[#fbf9f6] border border-[#eae8e5] rounded-xl text-xs space-y-1">
        <div className="text-[#585757]">Verification code sent to:</div>
        <div className="font-bold text-[#1b1c1a] font-mono">{email}</div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1.5">
          6-Digit Security OTP
        </label>
        <input
          type="text"
          maxLength={6}
          required
          autoFocus
          value={otp}
          onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, ''))}
          placeholder="• • • • • •"
          className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold py-2.5 bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
        />
        <div className="flex items-center justify-between text-[11px] text-[#8f6f6c] mt-1.5">
          <span>Valid for 5 minutes</span>
          <button
            type="button"
            disabled={cooldown > 0 || isLoading}
            onClick={onResendOtp}
            className="text-[#af101a] font-bold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
          </button>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToEmail}
          className="text-xs text-[#585757] hover:text-[#1b1c1a] font-bold cursor-pointer"
        >
          Change Email
        </button>
        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="px-5 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Verify &amp; Continue</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

