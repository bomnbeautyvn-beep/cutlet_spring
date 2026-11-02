import React from 'react';

interface SuccessStepProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onSuccess, onClose }) => {
  return (
    <div className="py-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
        <span className="material-symbols-outlined text-[32px]">check_circle</span>
      </div>

      <div>
        <h3 className="font-headline-md text-base font-bold text-[#1b1c1a]">
          Password Reset Successful
        </h3>
        <p className="text-xs text-[#585757] mt-1 max-w-sm mx-auto">
          Your administrator credentials have been updated in PostgreSQL. All active sessions have
          been invalidated for security.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            onSuccess();
            onClose();
          }}
          className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md cursor-pointer"
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
};

