import React, { useState, useEffect, useCallback } from 'react';
import { adminService, AdminAccount, AccountAuditLog, PageResult } from '@/services/admin.service';
import { useAuthStore } from '@/stores/auth.store';

export const AccountManagementPage: React.FC = () => {
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
    // Protection checks on client side for instant feedback
    if (account.active && account.email.toLowerCase() === currentAdmin?.email.toLowerCase()) {
      showFeedback('Self-Deactivation Protection: You cannot deactivate your own active session account.', true);
      return;
    }

    const previousState = account.active;
    const nextState = !previousState;
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

  const accounts = pageResult?.content || [];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">
            Account Management &amp; Role Access
          </h1>
          <p className="text-xs text-[#585757] mt-0.5">
            Administer staff credentials, role-based authorizations, status toggles, and security audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="px-4 py-2.5 bg-white hover:bg-[#fbf9f6] text-[#1b1c1a] border border-[#eae8e5] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-[#af101a]">security</span>
            <span>{showAuditLogs ? 'Hide Audit Log' : 'View Audit Trail'}</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add Account</span>
          </button>
        </div>
      </div>

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

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#eae8e5] shadow-xs">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Search Accounts
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or full name..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Role Filter
          </label>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
          >
            <option value="">All Roles</option>
            <option value="ROLE_ADMIN">ROLE_ADMIN (Full Atelier Access)</option>
            <option value="ROLE_STAFF">ROLE_STAFF (Menu &amp; Counter Operations)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Account Status
          </label>
          <select
            value={selectedActive}
            onChange={(e) => {
              setSelectedActive(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
          >
            <option value="all">All Accounts (Active &amp; Inactive)</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
            <div className="w-7 h-7 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-wider font-bold">Loading Accounts...</span>
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-16 text-center text-[#8f6f6c] text-xs">
            No administrator or staff accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f3f0] border-b border-[#eae8e5] text-[#585757] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Operator / Email</th>
                  <th className="py-3.5 px-4">Role &amp; Permissions</th>
                  <th className="py-3.5 px-4 text-center">Active Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e5]">
                {accounts.map((acc) => {
                  const isCurrent = acc.email.toLowerCase() === currentAdmin?.email.toLowerCase();
                  const isAdminRole = acc.role === 'ROLE_ADMIN' || acc.role === 'ADMIN';

                  return (
                    <tr
                      key={acc.id}
                      className={`hover:bg-[#fbf9f6] transition-colors ${
                        !acc.active ? 'opacity-60 bg-gray-50/50' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs uppercase ${
                              isAdminRole ? 'bg-[#af101a]' : 'bg-amber-600'
                            }`}
                          >
                            {acc.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#1b1c1a] text-sm flex items-center gap-2">
                              <span>{acc.fullName}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-700">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#585757] font-mono">{acc.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                            isAdminRole
                              ? 'bg-[#af101a]/10 text-[#af101a] border border-[#af101a]/20'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAdminRole ? 'bg-[#af101a]' : 'bg-amber-500'
                            }`}
                          />
                          <span>{isAdminRole ? 'Administrator (Full Access)' : 'Staff (Operations)'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <button
                            type="button"
                            disabled={togglingId === acc.id}
                            onClick={() => handleToggleStatus(acc)}
                            title={
                              isCurrent
                                ? 'Self-deactivation disabled'
                                : acc.active
                                ? 'Deactivate operator account'
                                : 'Activate operator account'
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer disabled:opacity-40 ${
                              acc.active ? 'bg-emerald-600' : 'bg-zinc-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                                acc.active ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              acc.active ? 'text-emerald-700' : 'text-zinc-400'
                            }`}
                          >
                            {acc.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingAccount(acc)}
                            title="Edit Role & Name"
                            className="p-1.5 text-[#585757] hover:text-[#af101a] hover:bg-[#f5f3f0] rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => setResettingAccount(acc)}
                            title="Reset Password"
                            className="p-1.5 text-[#585757] hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Audit Log Table */}
      {showAuditLogs && (
        <div className="bg-white rounded-2xl border border-[#eae8e5] shadow-xs p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-sm font-bold uppercase tracking-wider text-[#1b1c1a]">
                Security Audit Log
              </h3>
              <p className="text-[11px] text-[#585757]">
                Immutable trail of administrative updates, role modifications, status changes, and settings updates
              </p>
            </div>
            <button
              onClick={fetchAuditLogs}
              className="px-3 py-1 bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#1b1c1a] rounded-lg text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              <span>Sync</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f3f0] border-b border-[#eae8e5] text-[#585757] uppercase font-bold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor Email</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e5]">
                {auditLogsResult?.content?.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fbf9f6]">
                    <td className="py-2.5 px-3 whitespace-nowrap text-[#8f6f6c] font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#1b1c1a]">
                      {log.adminEmail}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#585757] text-[11px]">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Account */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#eae8e5] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
              <h3 className="font-headline-sm text-base font-bold text-[#1b1c1a]">
                Create Admin or Staff Account
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="e.g. chef.assistant@cutletspring.com"
                  className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={createFullName}
                  onChange={(e) => setCreateFullName(e.target.value)}
                  placeholder="e.g. Master Chef Kim"
                  className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol"
                  className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                />
                <p className="text-[10px] text-[#8f6f6c] mt-1">
                  Requirements: 8-72 chars, upper, lower, number, special character.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Role &amp; Privileges *
                </label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                >
                  <option value="ROLE_STAFF">ROLE_STAFF — Menu Viewing &amp; Counter Ops</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN — Full Atelier Administration</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-[#585757] hover:bg-[#eae8e5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Account */}
      {editingAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setEditingAccount(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#eae8e5] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
              <h3 className="font-headline-sm text-base font-bold text-[#1b1c1a]">
                Edit Account: {editingAccount.email}
              </h3>
              <button
                onClick={() => setEditingAccount(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingAccount.fullName}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  Role Assignment *
                </label>
                <select
                  value={editingAccount.role}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, role: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                >
                  <option value="ROLE_STAFF">ROLE_STAFF — Operations Only</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN — Full Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 text-xs font-bold uppercase text-[#585757] hover:bg-[#eae8e5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Direct Reset Password */}
      {resettingAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setResettingAccount(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#eae8e5] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-[#1b1c1a]">
                  Reset Account Password
                </h3>
                <span className="text-xs text-[#8f6f6c] font-mono">{resettingAccount.email}</span>
              </div>
              <button
                onClick={() => setResettingAccount(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585757] mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol"
                  className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResettingAccount(null)}
                  className="px-4 py-2 text-xs font-bold uppercase text-[#585757] hover:bg-[#eae8e5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
