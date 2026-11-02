import React, { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ForgotPasswordModal } from '@/features/admin/ForgotPasswordModal';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('admin@cutletspring.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetSuccessMessage(null);
    const success = await login(email, password);
    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#eae8e5] rounded shadow-xl">
      <div className="text-center mb-6">
        <span className="font-kr-serif text-sm text-[#af101a] font-bold block">봄돈까스</span>
        <h2 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">Atelier Administration</h2>
        <p className="text-xs text-[#585757] mt-1">Management Portal for Cutlet Spring</p>
      </div>

      {resetSuccessMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
              Password
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs text-[#af101a] font-bold hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] text-[#1b1c1a]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#af101a] hover:bg-[#d32f2f] text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
              <span>Sign In</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-[#8f6f6c]">
          Default credential: <code className="bg-[#f5f3f0] px-1 py-0.5 rounded">admin@cutletspring.com</code> / <code className="bg-[#f5f3f0] px-1 py-0.5 rounded">admin123</code>
        </p>
      </form>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSuccess={() => {
          setResetSuccessMessage('Password successfully reset! Please sign in with your new password.');
          setPassword('');
        }}
      />
    </div>
  );
};

