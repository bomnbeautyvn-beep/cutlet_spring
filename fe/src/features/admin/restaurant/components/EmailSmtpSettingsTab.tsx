import React, { useState, useEffect } from 'react';
import { adminService, EmailConfig, UpdateEmailConfigPayload } from '@/services/admin.service';
import { SendTestEmailModal } from './SendTestEmailModal';
import { DisableEmailConfirmModal } from './DisableEmailConfirmModal';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';

interface EmailSmtpSettingsTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

export const EmailSmtpSettingsTab: React.FC<EmailSmtpSettingsTabProps> = ({ onDirtyChange }) => {
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [formData, setFormData] = useState<UpdateEmailConfigPayload>({
    host: 'smtp.gmail.com',
    port: 587,
    username: '',
    password: '',
    smtpAuth: true,
    smtpStarttls: true,
    fromEmail: 'noreply@cutletspring.com',
    fromName: 'Cutlet Spring Security',
    enabled: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Modals
  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  // Status & Feedback
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; isError?: boolean } | null>(null);

  const showFeedback = (message: string, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getEmailConfig();
      setConfig(data);
      setFormData({
        host: data.host,
        port: data.port,
        username: data.username,
        password: '', // Never populate plaintext password
        smtpAuth: data.smtpAuth,
        smtpStarttls: data.smtpStarttls,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        enabled: data.enabled,
      });
    } catch (err: any) {
      console.error('Failed to load email configuration:', err);
      showFeedback(`Failed to load email configuration: ${err?.message || 'Server error'}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Track unsaved modifications against loaded database config
  const isDirty = React.useMemo(() => {
    if (!config) return false;
    if (formData.password && formData.password.trim().length > 0) return true;
    return (
      formData.host !== config.host ||
      formData.port !== config.port ||
      formData.username !== config.username ||
      formData.smtpAuth !== config.smtpAuth ||
      formData.smtpStarttls !== config.smtpStarttls ||
      formData.fromEmail !== config.fromEmail ||
      formData.fromName !== config.fromName ||
      formData.enabled !== config.enabled
    );
  }, [formData, config]);

  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  // Warn about unsaved changes before browser navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleFieldChange = (field: keyof UpdateEmailConfigPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUsernameChange = (val: string) => {
    setFormData((prev) => {
      const next = { ...prev, username: val };
      if (!prev.fromEmail || prev.fromEmail === 'noreply@cutletspring.com' || prev.fromEmail === prev.username) {
        next.fromEmail = val;
      }
      return next;
    });
  };

  const applyPreset = (preset: 'gmail587' | 'ssl465') => {
    if (preset === 'gmail587') {
      setFormData((prev) => ({
        ...prev,
        host: prev.host || 'smtp.gmail.com',
        port: 587,
        smtpAuth: true,
        smtpStarttls: true,
      }));
    } else if (preset === 'ssl465') {
      setFormData((prev) => ({
        ...prev,
        host: prev.host || 'smtp.gmail.com',
        port: 465,
        smtpAuth: true,
        smtpStarttls: false,
      }));
    }
  };

  const handleToggleEnabled = () => {
    if (formData.enabled) {
      // Prompt warning before turning off
      setIsDisableModalOpen(true);
    } else {
      setFormData((prev) => ({ ...prev, enabled: true }));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.host || !formData.host.trim()) {
      return 'SMTP Host is required.';
    }
    if (!formData.port || formData.port < 1 || formData.port > 65535) {
      return 'Port must be a valid number between 1 and 65535.';
    }
    if (!formData.username || !formData.username.trim()) {
      return 'Vui lòng nhập tài khoản Gmail / Email gửi.';
    }
    if (!formData.fromEmail || !formData.fromEmail.trim()) {
      formData.fromEmail = formData.username.trim();
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.fromEmail.trim())) {
      return 'Địa chỉ email người gửi không hợp lệ.';
    }
    return null;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const error = validateForm();
    if (error) {
      showFeedback(error, true);
      return;
    }

    try {
      setIsSaving(true);
      const updated = await adminService.updateEmailConfig(formData);
      setConfig(updated);
      setFormData((prev) => ({ ...prev, password: '' })); // Clear local input
      showFeedback('Email and SMTP configuration successfully saved!');
    } catch (err: any) {
      showFeedback(`Failed to save email settings: ${err?.response?.data?.message || err?.message || 'Server error'}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsTestingConnection(true);
      setConnectionStatus('idle');
      setConnectionMessage('');
      const res = await adminService.testSmtpConnection();
      setConnectionStatus('success');
      setConnectionMessage(res.message);
      showFeedback(res.message);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Connection test failed';
      setConnectionStatus('error');
      setConnectionMessage(msg);
      showFeedback(msg, true);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSendTestEmail = async (recipientEmail: string) => {
    try {
      setIsSendingTest(true);
      const res = await adminService.sendTestEmail({ recipientEmail });
      setIsTestEmailModalOpen(false);
      showFeedback(res.message);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to dispatch test email';
      showFeedback(msg, true);
    } finally {
      setIsSendingTest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#eae8e5] flex flex-col items-center justify-center min-h-[300px] gap-3 text-[#8f6f6c]">
        <div className="w-7 h-7 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-wider font-bold">
          Loading Email &amp; SMTP Settings...
        </span>
      </div>
    );
  }

  const isSslDirect = formData.port === 465;

  return (
    <div className="space-y-6">
      {/* Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Hệ Thống Email Tự Động (Backend Gateway)"
        description="Cấu hình kết nối máy chủ gửi mail SMTP (Host, Port, SSL/TLS, Tài khoản mã hóa bảo mật AES-256). Sử dụng để gửi email tự động tới khách hàng (Xác nhận đặt bàn) và gửi mã OTP đặt lại mật khẩu cho tài khoản quản trị viên."
        previewHint="Bạn có thể nhấn 'Send Test Email' bên dưới để kiểm tra gửi thử một email thực tế tới hộp thư của bạn."
      />

      {/* Floating Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 shadow-sm animate-fade-in ${
            feedback.isError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedback.isError ? 'error' : 'check_circle'}
          </span>
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-2xl text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-gentle-shake">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-600 text-lg animate-pulse">lock</span>
            <span className="font-bold">
              🔒 Có thay đổi cấu hình SMTP chưa lưu! Vui lòng nhấn &quot;Save Changes&quot; để áp dụng.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#af101a] hover:bg-[#930010] text-white font-bold rounded text-[11px] uppercase tracking-wider cursor-pointer transition-all shadow-xs shrink-0 self-end sm:self-auto flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">save</span>
            <span>Save Changes</span>
          </button>
        </div>
      )}

      {/* SMTP Incomplete Configuration Warning */}
      {(!config?.passwordConfigured || !formData.username) && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-3 shadow-xs animate-fade-in">
          <span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">warning</span>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
              SMTP Gateway Not Fully Configured
            </h4>
            <p className="text-amber-800 leading-relaxed">
              Outgoing credentials have not been configured or stored. Administrative password reset OTPs and system alerts will not be delivered until a valid SMTP host, account username, and password are saved.
            </p>
          </div>
        </div>
      )}

      {/* 1. Status & Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#af101a] text-lg">forward_to_inbox</span>
              <span>Email Service Status &amp; Live Connectivity</span>
            </h3>
            <p className="text-[11px] text-[#585757] mt-0.5">
              Live status of database-driven outbound email delivery for password OTPs and administrative alerts
            </p>
          </div>

          {/* Service Enabled Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1b1c1a]">Email Service:</span>
            <button
              type="button"
              onClick={handleToggleEnabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                formData.enabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                formData.enabled
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {formData.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Connection Status */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#585757]">
              Transport Connection
            </span>
            <div className="flex items-center gap-2">
              {connectionStatus === 'idle' && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded-md">
                  Not tested yet
                </span>
              )}
              {connectionStatus === 'success' && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Connected
                </span>
              )}
              {connectionStatus === 'error' && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-800 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  Failed
                </span>
              )}
            </div>
            {connectionMessage && (
              <p className="text-[10px] text-[#585757] truncate mt-1" title={connectionMessage}>
                {connectionMessage}
              </p>
            )}
          </div>

          {/* Active Host & Port */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#585757]">
              SMTP Gateway
            </span>
            <div className="text-xs font-bold text-[#1b1c1a] font-mono truncate">
              {formData.host || 'Not set'}:{formData.port}
            </div>
            <span className="text-[10px] text-[#8f6f6c]">
              {isSslDirect ? 'Direct SSL/TLS' : formData.smtpStarttls ? 'STARTTLS Enabled' : 'Plain / Standard'}
            </span>
          </div>

          {/* Password Security Status */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#585757]">
              Stored Password Status
            </span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#af101a] text-[16px]">lock</span>
              <span
                className={`text-[11px] font-bold ${
                  config?.passwordConfigured ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {config?.passwordConfigured ? 'AES-256-GCM Encrypted' : 'No Password Set'}
              </span>
            </div>
            <p className="text-[10px] text-[#8f6f6c]">Protected at rest in PostgreSQL</p>
          </div>

          {/* Last Updated */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#585757]">
              Last Configuration Update
            </span>
            <div className="text-xs font-semibold text-[#1b1c1a] truncate">
              {config?.updatedAt ? new Date(config.updatedAt).toLocaleString() : 'System Default'}
            </div>
            <p className="text-[10px] text-[#8f6f6c]">Live reload without server restart</p>
          </div>
        </div>
      </div>

      {/* 2. SMTP Server Configuration Card - Simplified Email & Password */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#af101a] text-lg">mail</span>
            <span>Tài khoản gửi Email (Gmail SMTP)</span>
          </h3>
          <p className="text-[11px] text-[#585757] mt-0.5">
            Chỉ cần nhập tài khoản Gmail và Mật khẩu ứng dụng (Google App Password) để gửi email khôi phục mật khẩu và thông báo hệ thống.
          </p>
        </div>

        {/* Hướng dẫn lấy Mật khẩu ứng dụng từ Google (Google App Password) */}
        <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-blue-600 text-lg">key</span>
              <span>Hướng dẫn lấy Mật khẩu ứng dụng Google (16 ký tự)</span>
            </div>
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[11px] uppercase tracking-wider transition-colors shadow-xs w-fit cursor-pointer"
            >
              <span>Mở Google App Passwords</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </a>
          </div>

          <div className="text-xs text-blue-900 space-y-1.5 leading-relaxed bg-white/70 p-3 rounded-xl border border-blue-100">
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-700 shrink-0">Bước 1:</span>
              <span>
                Đảm bảo tài khoản Google đã bật <strong>Xác minh 2 bước</strong> tại{' '}
                <a
                  href="https://myaccount.google.com/signinoptions/two-step-verification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 font-semibold inline-flex items-center gap-0.5"
                >
                  myaccount.google.com/signinoptions/two-step-verification
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-700 shrink-0">Bước 2:</span>
              <span>
                Truy cập liên kết{' '}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 font-semibold inline-flex items-center gap-0.5"
                >
                  myaccount.google.com/apppasswords
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a> (hoặc bấm nút xanh bên trên).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-700 shrink-0">Bước 3:</span>
              <span>
                Nhập tên ứng dụng bất kỳ (ví dụ: <code className="bg-blue-100/80 px-1.5 py-0.5 rounded text-blue-950 font-bold">Cutlet Spring</code>) rồi nhấn <strong>Tạo (Create)</strong>.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-700 shrink-0">Bước 4:</span>
              <span>
                Google sẽ hiển thị mã gồm <strong>16 ký tự</strong> (ví dụ: <code className="bg-amber-100/80 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold">abcd efgh ijkl mnop</code>). Sao chép và dán vào ô <em>Mật khẩu ứng dụng</em> bên dưới.
              </span>
            </div>
          </div>
        </div>

        {/* 2 Fields: Email & App Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email / Gmail Account */}
          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              Tài khoản Gmail / Email gửi (Username) <span className="text-[#af101a]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="e.g. myapah7605@gmail.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none transition-all placeholder:text-gray-400"
            />
            <p className="text-[10px] text-[#8f6f6c] mt-1">
              Địa chỉ Gmail dùng để xác thực và gửi thư ra bên ngoài
            </p>
          </div>

          {/* Password / App Password */}
          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              Mật khẩu ứng dụng (Google App Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder={
                  config?.passwordConfigured
                    ? '•••••••••••••••• (Đã lưu an toàn - để trống nếu không đổi)'
                    : 'Dán 16 ký tự mật khẩu ứng dụng tại đây'
                }
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none font-mono transition-all placeholder:text-[#8f6f6c]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-[10px] text-[#8f6f6c] mt-1">
              {config?.passwordConfigured
                ? 'Mật khẩu đã được mã hóa AES-256-GCM. Để trống nếu không muốn thay đổi.'
                : 'Dán mật khẩu ứng dụng 16 ký tự được cấp từ Google.'}
            </p>
          </div>
        </div>

        {/* Tùy chọn máy chủ nâng cao (ẩn mặc định) */}
        <div className="pt-2 border-t border-[#eae8e5]/80">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#585757] hover:text-[#af101a] transition-colors cursor-pointer select-none"
          >
            <span
              className="material-symbols-outlined text-[18px] transition-transform duration-200"
              style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none' }}
            >
              expand_more
            </span>
            <span>Tùy chọn máy chủ nâng cao (Host, Port, STARTTLS)</span>
            <span className="text-[10px] font-normal text-[#8f6f6c]">
              (Mặc định: smtp.gmail.com:587 STARTTLS)
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#1b1c1a] uppercase tracking-wider">
                  Cấu hình kết nối máy chủ
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#585757] uppercase font-bold">Mẫu nhanh:</span>
                  <button
                    type="button"
                    onClick={() => applyPreset('gmail587')}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] rounded transition-colors cursor-pointer shadow-2xs"
                  >
                    Gmail / 587 (STARTTLS)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('ssl465')}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] rounded transition-colors cursor-pointer shadow-2xs"
                  >
                    SSL / 465 (Direct SSL)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1b1c1a] mb-1 uppercase tracking-wider">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => handleFieldChange('host', e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#eae8e5] rounded-xl font-mono outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1b1c1a] mb-1 uppercase tracking-wider">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) => {
                      const p = parseInt(e.target.value, 10) || 587;
                      handleFieldChange('port', p);
                      if (p === 465) handleFieldChange('smtpStarttls', false);
                      else if (p === 587) handleFieldChange('smtpStarttls', true);
                    }}
                    min={1}
                    max={65535}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#eae8e5] rounded-xl font-mono outline-none focus:border-[#af101a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#eae8e5]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.smtpAuth}
                    onChange={(e) => handleFieldChange('smtpAuth', e.target.checked)}
                    className="w-4 h-4 rounded text-[#af101a] border-[#eae8e5]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1b1c1a] block">Xác thực SMTP (Auth)</span>
                    <span className="text-[10px] text-[#585757]">Bắt buộc đăng nhập username/password</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.smtpStarttls}
                    onChange={(e) => handleFieldChange('smtpStarttls', e.target.checked)}
                    className="w-4 h-4 rounded text-[#af101a] border-[#eae8e5]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1b1c1a] block">Kích hoạt STARTTLS</span>
                    <span className="text-[10px] text-[#585757]">Nâng cấp bảo mật kết nối TLS (Port 587)</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Sender Identity Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#af101a] text-lg">badge</span>
            <span>Sender Identity &amp; Addressing</span>
          </h3>
          <p className="text-[11px] text-[#585757] mt-0.5">
            Default FROM headers displayed to recipients on OTP codes and administrative security alerts
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* From Email */}
          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              From Email Address <span className="text-[#af101a]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.fromEmail}
              onChange={(e) => handleFieldChange('fromEmail', e.target.value)}
              placeholder="e.g. noreply@cutletspring.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none transition-all"
            />
          </div>

          {/* From Name */}
          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              From Display Name <span className="text-[#af101a]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fromName}
              onChange={(e) => handleFieldChange('fromName', e.target.value)}
              placeholder="e.g. Cutlet Spring Security"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 4. Action Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#eae8e5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#585757]">
          <span className="material-symbols-outlined text-[#af101a] text-lg">verified_user</span>
          <span>Settings take effect immediately without requiring a backend restart.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          {/* Test Connection Button */}
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTestingConnection || isSaving}
            className="px-4 py-2.5 bg-[#fbf9f6] hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isTestingConnection ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#1b1c1a] border-t-transparent rounded-full animate-spin" />
                <span>Testing Transport...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">network_check</span>
                <span>Test Connection</span>
              </>
            )}
          </button>

          {/* Send Test Email Button */}
          <button
            type="button"
            onClick={() => setIsTestEmailModalOpen(true)}
            disabled={!formData.enabled || isSaving || isSendingTest}
            className="px-4 py-2.5 bg-[#fbf9f6] hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Send Test Email</span>
          </button>

          {/* Save Configuration Button */}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Save Email Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <SendTestEmailModal
        isOpen={isTestEmailModalOpen}
        onClose={() => setIsTestEmailModalOpen(false)}
        onSend={handleSendTestEmail}
        isLoading={isSendingTest}
      />

      <DisableEmailConfirmModal
        isOpen={isDisableModalOpen}
        onClose={() => setIsDisableModalOpen(false)}
        onConfirm={() => setFormData((prev) => ({ ...prev, enabled: false }))}
      />
    </div>
  );
};
