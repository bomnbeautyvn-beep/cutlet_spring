import React from 'react';
import { AccountAuditLog, PageResult } from '@/services/admin.service';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogsResult: PageResult<AccountAuditLog> | null;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({
  isOpen,
  onClose,
  auditLogsResult,
}) => {
  if (!isOpen) return null;

  const logs = auditLogsResult?.content || [];

  return (
    <div className="bg-white p-6 rounded border border-[#eae8e5] shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#af101a] text-[20px]">
            history_toggle_off
          </span>
          <h2 className="text-sm font-bold text-[#1b1c1a] uppercase tracking-wider">
            Security Audit Trail (Latest Events)
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[#585757] hover:text-[#1b1c1a] font-bold cursor-pointer"
        >
          Close
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#8f6f6c]">
          No audit logs recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f3f0] text-[#585757] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Admin / Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e5]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#fbf9f6]">
                  <td className="py-2 px-3 text-[#585757] whitespace-nowrap font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 font-semibold text-[#1b1c1a]">{log.adminEmail}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 bg-[#f5f3f0] font-bold text-[10px] uppercase rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#585757] text-[11px]">{log.details || '—'}</td>
                  <td className="py-2 px-3 text-[#8f6f6c] font-mono text-[11px]">
                    {log.ipAddress || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
