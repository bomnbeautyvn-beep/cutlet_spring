import React, { useState } from 'react';

interface SendTestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => Promise<void>;
  isLoading: boolean;
}

export const SendTestEmailModal: React.FC<SendTestEmailModalProps> = ({
  isOpen,
  onClose,
  onSend,
  isLoading,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = recipientEmail.trim();

    if (!email) {
      setValidationError('Please enter a recipient email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address (e.g. admin@example.com).');
      return;
    }

    setValidationError(null);
    await onSend(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#eae8e5] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#1b1c1a] text-white flex items-center justify-between border-b-2 border-[#af101a]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#af101a] text-xl">forward_to_inbox</span>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Send Diagnostic Test Email</h3>
              <p className="text-[11px] text-[#c2beba]">Verify live SMTP delivery and HTML template rendering</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] text-xs text-[#585757] leading-relaxed">
            A branded test email will be dispatched through your active SMTP server configuration. Check your inbox and spam folder to confirm delivery.
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              Recipient Email Address <span className="text-[#af101a]">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. admin@cutletspring.com"
              value={recipientEmail}
              onChange={(e) => {
                setRecipientEmail(e.target.value);
                if (validationError) setValidationError(null);
              }}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none transition-all placeholder:text-[#c2beba]"
            />
            {validationError && (
              <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {validationError}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#eae8e5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold text-[#585757] hover:bg-[#f5f3f0] rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Send Test Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

