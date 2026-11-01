import React, { useState, useEffect } from 'react';
import { adminService, EmailConfig, UpdateEmailConfigPayload } from '@/services/admin.service';
import { SendTestEmailModal } from './SendTestEmailModal';
import { DisableEmailConfirmModal } from './DisableEmailConfirmModal';

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
    if (!formData.fromEmail || !formData.fromEmail.trim()) {
      return 'Sender From Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.fromEmail.trim())) {
      return 'Sender From Email must be a valid email address.';
    }
    if (formData.smtpAuth && (!formData.username || !formData.username.trim())) {
      return 'SMTP Username is required when authentication is enabled.';
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
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-blue-600 text-lg">edit_note</span>
            <span className="font-semibold">
              You have unsaved changes to your SMTP configuration.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[11px] uppercase tracking-wider cursor-pointer transition-colors shadow-xs shrink-0 self-end sm:self-auto"
          >
            Save Changes
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

      {/* 2. SMTP Server Configuration Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#af101a] text-lg">dns</span>
              <span>SMTP Server &amp; Authentication</span>
            </h3>
            <p className="text-[11px] text-[#585757] mt-0.5">
              Configure outgoing mail server host, port, protocol security, and authentication credentials
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#585757] uppercase font-bold">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('gmail587')}
              className="px-2.5 py-1 text-[10px] font-bold bg-[#fbf9f6] hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] rounded-lg transition-colors cursor-pointer"
            >
              Gmail / 587 (STARTTLS)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('ssl465')}
              className="px-2.5 py-1 text-[10px] font-bold bg-[#fbf9f6] hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] rounded-lg transition-colors cursor-pointer"
            >
              SSL / 465 (Direct SSL)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Host */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              SMTP Host <span className="text-[#af101a]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.host}
              onChange={(e) => handleFieldChange('host', e.target.value)}
              placeholder="e.g. smtp.gmail.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none font-mono transition-all"
            />
          </div>

          {/* Port */}
          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              SMTP Port <span className="text-[#af101a]">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.port}
              onChange={(e) => {
                const p = parseInt(e.target.value, 10) || 587;
                handleFieldChange('port', p);
                if (p === 465) {
                  handleFieldChange('smtpStarttls', false);
                } else if (p === 587) {
                  handleFieldChange('smtpStarttls', true);
                }
              }}
              min={1}
              max={65535}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none font-mono transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              SMTP Username / Account <span className="text-[#af101a]">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              placeholder="e.g. admin@cutletspring.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none transition-all"
            />
            <p className="text-[10px] text-[#8f6f6c] mt-1">
              For Gmail, use your Google Account or Workspace email.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#1b1c1a] mb-1.5 uppercase tracking-wider">
              SMTP Password / App Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder={
                  config?.passwordConfigured
                    ? '•••••••• (Preserved - leave blank to keep)'
                    : 'Enter SMTP App Password'
                }
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-[#eae8e5] rounded-xl focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] outline-none font-mono transition-all placeholder:text-[#8f6f6c]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-[10px] text-[#8f6f6c] mt-1">
              {config?.passwordConfigured
                ? 'An encrypted password is saved. Leave blank to preserve it, or enter a new value to update.'
                : 'For Gmail, generate a 16-character App Password under Google Account Security.'}
            </p>
          </div>
        </div>

        {/* Protocols & Flags */}
        <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* SMTP Auth */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.smtpAuth}
              onChange={(e) => handleFieldChange('smtpAuth', e.target.checked)}
              className="w-4 h-4 rounded text-[#af101a] focus:ring-[#af101a] border-[#eae8e5]"
            />
            <div>
              <span className="text-xs font-bold text-[#1b1c1a] block">SMTP Authentication</span>
              <span className="text-[10px] text-[#585757]">Require username/password login</span>
            </div>
          </label>

          {/* STARTTLS */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.smtpStarttls}
              onChange={(e) => handleFieldChange('smtpStarttls', e.target.checked)}
              className="w-4 h-4 rounded text-[#af101a] focus:ring-[#af101a] border-[#eae8e5]"
            />
            <div>
              <span className="text-xs font-bold text-[#1b1c1a] block">STARTTLS Enabled</span>
              <span className="text-[10px] text-[#585757]">Opportunistic TLS upgrade (Port 587)</span>
            </div>
          </label>

          {/* SSL/TLS Direct Indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                isSslDirect ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
            <div>
              <span className="text-xs font-bold text-[#1b1c1a] block">
                {isSslDirect ? 'Direct SSL/TLS Active' : 'STARTTLS Mode'}
              </span>
              <span className="text-[10px] text-[#585757]">
                {isSslDirect ? 'Direct SSL socket factory (Port 465)' : 'RFC 3207 standard STARTTLS'}
              </span>
            </div>
          </div>
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
            className="px-4 py-2.5 bg-[#fbf9f6] hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
            className="px-4 py-2.5 bg-[#fbf9f6] hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Send Test Email</span>
          </button>

          {/* Save Configuration Button */}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
