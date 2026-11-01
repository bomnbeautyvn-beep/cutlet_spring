import React from 'react';
import { useAccountManagement } from './account/hooks/useAccountManagement';
import { AccountFilterToolbar } from './account/components/AccountFilterToolbar';
import { AccountTable } from './account/components/AccountTable';
import { CreateAccountModal } from './account/components/CreateAccountModal';
import { EditAccountModal } from './account/components/EditAccountModal';
import { ResetAccountPasswordModal } from './account/components/ResetAccountPasswordModal';
import { AuditLogsModal } from './account/components/AuditLogsModal';

export const AccountManagementPage: React.FC = () => {
  const {
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
    // Modals
    isCreateOpen,
    setIsCreateOpen,
    editingAccount,
    setEditingAccount,
    resettingAccount,
    setResettingAccount,
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
  } = useAccountManagement();

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

      {/* Audit Logs Drawer / Modal if Open */}
      <AuditLogsModal
        isOpen={showAuditLogs}
        onClose={() => setShowAuditLogs(false)}
        auditLogsResult={auditLogsResult}
      />

      {/* Filters */}
      <AccountFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={(role) => {
          setSelectedRole(role);
          setCurrentPage(0);
        }}
        selectedActive={selectedActive}
        onActiveChange={(active) => {
          setSelectedActive(active);
          setCurrentPage(0);
        }}
      />

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] shadow-xs overflow-hidden">
        <AccountTable
          accounts={accounts}
          pageResult={pageResult}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          currentAdminEmail={currentAdmin?.email}
          togglingId={togglingId}
          onToggleStatus={handleToggleStatus}
          onEdit={(acc) => setEditingAccount({ ...acc })}
          onResetPassword={(acc) => {
            setResettingAccount(acc);
            setNewPasswordValue('');
          }}
        />
      </div>

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        email={createEmail}
        onEmailChange={setCreateEmail}
        fullName={createFullName}
        onFullNameChange={setCreateFullName}
        password={createPassword}
        onPasswordChange={setCreatePassword}
        role={createRole}
        onRoleChange={setCreateRole}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Account Modal */}
      <EditAccountModal
        editingAccount={editingAccount}
        onClose={() => setEditingAccount(null)}
        onFullNameChange={(fullName) =>
          setEditingAccount((prev) => (prev ? { ...prev, fullName } : null))
        }
        onRoleChange={(role) =>
          setEditingAccount((prev) => (prev ? { ...prev, role } : null))
        }
        onSubmit={handleUpdateSubmit}
      />

      {/* Administrative Password Reset Modal */}
      <ResetAccountPasswordModal
        resettingAccount={resettingAccount}
        onClose={() => {
          setResettingAccount(null);
          setNewPasswordValue('');
        }}
        newPasswordValue={newPasswordValue}
        onPasswordChange={setNewPasswordValue}
        onSubmit={handleResetPasswordSubmit}
      />
    </div>
  );
};
