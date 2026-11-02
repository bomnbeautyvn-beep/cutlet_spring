import React from 'react';

interface RequestOtpStepProps {
  email: string;
  onEmailChange: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const RequestOtpStep: React.FC<RequestOtpStepProps> = ({
  email,
  onEmailChange,
  isLoading,
  onSubmit,
  onClose,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-xs text-[#585757] leading-relaxed">
        Enter your registered administrator email address. We will dispatch a 6-digit numeric
        verification code valid for 5 minutes.
      </p>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1.5">
          Admin Email
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
            mail
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="admin@cutletspring.com"
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] font-mono"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#585757] hover:bg-[#eae8e5] rounded transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending Code...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Send OTP Code</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

