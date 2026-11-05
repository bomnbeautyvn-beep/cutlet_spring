import { useState, useEffect, useCallback } from 'react';
import { adminService, AdminAccount, AccountAuditLog, PageResult } from '@/services/admin.service';
import { useAuthStore } from '@/stores/auth.store';

export function useAccountManagement() {
  const { admin: currentAdmin } = useAuthStore();
  const [pageResult, setPageResult] = useState<PageResult<AdminAccount> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedActive, setSelectedActive] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [resettingAccount, setResettingAccount] = useState<AdminAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<AdminAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogsResult, setAuditLogsResult] = useState<PageResult<AccountAuditLog> | null>(null);

  // Form states
  const [createEmail, setCreateEmail] = useState('');
  const [createFullName, setCreateFullName] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState('ROLE_STAFF');
  const [newPasswordValue, setNewPasswordValue] = useState('');

  const [feedback, setFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const showFeedback = (message: string, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeParam =
        selectedActive === 'active' ? true : selectedActive === 'inactive' ? false : undefined;
      const data = await adminService.getAccounts(
        searchQuery || undefined,
        selectedRole || undefined,
        activeParam,
        currentPage,
        15
      );
      setPageResult(data);
    } catch (err: any) {
      console.error('Failed to load accounts:', err);
      showFeedback('Failed to load user accounts', true);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedRole, selectedActive, currentPage]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const logs = await adminService.getAuditLogs(0, 30);
      setAuditLogsResult(logs);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (showAuditLogs) {
      fetchAuditLogs();
    }
  }, [showAuditLogs, fetchAuditLogs]);

  // Handle active status toggle with security protections
  const handleToggleStatus = async (account: AdminAccount) => {
    if (account.active && account.email.toLowerCase() === currentAdmin?.email.toLowerCase()) {
      showFeedback('Self-Deactivation Protection: You cannot deactivate your own active session account.', true);
      return;
    }

    const nextState = !account.active;
    setTogglingId(account.id);

    try {
      await adminService.setAccountStatus(account.id, nextState);
      showFeedback(
        nextState
          ? `Account "${account.email}" activated successfully`
          : `Account "${account.email}" deactivated`
      );
      fetchAccounts();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update status';
      showFeedback(msg, true);
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createAccount({
        email: createEmail.trim(),
        fullName: createFullName.trim(),
        password: createPassword,
        role: createRole,
      });
      showFeedback(`Account "${createEmail}" created successfully.`);
      setIsCreateOpen(false);
      setCreateEmail('');
      setCreateFullName('');
      setCreatePassword('');
      setCreateRole('ROLE_STAFF');
      fetchAccounts();
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || err?.message || 'Failed to create account', true);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    try {
      await adminService.updateAccount(editingAccount.id, {
        fullName: editingAccount.fullName.trim(),
        role: editingAccount.role,
      });
      showFeedback(`Account "${editingAccount.email}" updated successfully.`);
      setEditingAccount(null);
      fetchAccounts();
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || err?.message || 'Failed to update account', true);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingAccount) return;
    try {
      await adminService.resetAccountPassword(resettingAccount.id, newPasswordValue);
      showFeedback(`Password reset successfully for "${resettingAccount.email}".`);
      setResettingAccount(null);
      setNewPasswordValue('');
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || err?.message || 'Failed to reset password', true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return;
    setIsDeleting(true);
    try {
      await adminService.deleteAccount(deletingAccount.id);
      showFeedback(`Account "${deletingAccount.email}" deleted successfully.`);
      setDeletingAccount(null);
      await fetchAccounts();
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || err?.message || 'Failed to delete account', true);
    } finally {
      setIsDeleting(false);
    }
  };

  const accounts = pageResult?.content || [];

  return {
    currentAdmin,
    pageResult,
    accounts,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    selectedActive,
    setSelectedActive,
    isLoading,
    feedback,
    togglingId,
    // Modals state
    isCreateOpen,
    setIsCreateOpen,
    editingAccount,
    setEditingAccount,
    resettingAccount,
    setResettingAccount,
    deletingAccount,
    setDeletingAccount,
    isDeleting,
    showAuditLogs,
    setShowAuditLogs,
    auditLogsResult,
    // Form fields
    createEmail,
    setCreateEmail,
    createFullName,
    setCreateFullName,
    createPassword,
    setCreatePassword,
    createRole,
    setCreateRole,
    newPasswordValue,
    setNewPasswordValue,
    // Handlers
    handleToggleStatus,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleResetPasswordSubmit,
    handleDeleteAccount,
    fetchAccounts,
  };
}

