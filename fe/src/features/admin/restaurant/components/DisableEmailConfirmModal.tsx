import React from 'react';

interface DisableEmailConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DisableEmailConfirmModal: React.FC<DisableEmailConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-amber-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-amber-50 text-amber-900 flex items-center gap-3 border-b border-amber-200">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Disable Email Delivery?</h3>
            <p className="text-[11px] text-amber-700">Security &amp; recovery alert</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-[#1b1c1a] font-semibold leading-relaxed">
            Disabling email service will prevent administrators from receiving OTP codes for password recovery.
          </p>
          <p className="text-xs text-[#585757] leading-relaxed">
            While disabled, password reset requests will not send verification emails to any administrative accounts. Are you sure you want to turn off the dynamic email service?
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-[#fbf9f6] border-t border-[#eae8e5] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#585757] hover:bg-[#eae8e5] rounded-xl transition-all cursor-pointer"
          >
            Keep Enabled
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Yes, Disable Email Service
          </button>
        </div>
      </div>
    </div>
  );
};

