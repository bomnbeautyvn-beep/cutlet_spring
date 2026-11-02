import React, { useState } from 'react';
import { DatabaseBackup } from '@/types/database.types';

interface DatabaseExportSectionProps {
  backups: DatabaseBackup[];
  isLoading: boolean;
  isExporting: boolean;
  onExport: (notes?: string) => Promise<void>;
  onDownload: (id: string, filename: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const DatabaseExportSection: React.FC<DatabaseExportSectionProps> = ({
  backups,
  isLoading,
  isExporting,
  onExport,
  onDownload,
  onDelete,
}) => {
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleTriggerExport = async () => {
    setShowNotesModal(false);
    await onExport(notes.trim() || undefined);
    setNotes('');
  };

  const handleDownload = async (backup: DatabaseBackup) => {
    try {
      setDownloadingId(backup.id);
      await onDownload(backup.id, backup.filename);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete backup file "${filename}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyChecksum = (id: string, checksum?: string) => {
    if (!checksum) return;
    navigator.clipboard.writeText(checksum);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-2">
            <span>Database Backup Archive</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-[#585757]">
              {backups.length} Files
            </span>
          </h3>
          <p className="text-xs text-[#8f6f6c] mt-1 leading-relaxed">
            Exports full database schema and data using PostgreSQL Custom Format (<code className="text-[#af101a] font-mono">pg_dump -Fc</code>).
            Files are compressed and include TOC metadata.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNotesModal(true)}
          disabled={isExporting}
          className="self-start sm:self-center px-4 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0 active:scale-98"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Generating Backup...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Database</span>
            </>
          )}
        </button>
      </div>

      {/* Backups Table / Mobile Cards */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-[#8f6f6c] gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Loading backup history...</span>
        </div>
      ) : backups.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-[#eae8e5] rounded-2xl bg-[#fbf9f6] p-6">
          <span className="material-symbols-outlined text-[36px] text-zinc-400 mb-2">folder_off</span>
          <p className="text-sm font-bold text-[#1b1c1a]">No Backups Found</p>
          <p className="text-xs text-[#8f6f6c] mt-1 max-w-md mx-auto">
            You have not created any manual database backups yet. Click "Export Database" above to create your first .dump archive.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#eae8e5] text-[11px] font-bold uppercase tracking-wider text-[#8f6f6c] bg-[#fbf9f6]">
                <th className="py-3 px-3 rounded-l-xl">Archive Name & Hash</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Tables</th>
                <th className="py-3 px-3">Created At</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e5]/60 text-xs text-[#1b1c1a]">
              {backups.map((b) => {
                const isSafety = b.backupType === 'PRE_RESTORE_SAFETY';
                const isFailed = b.status === 'FAILED';

                return (
                  <tr key={b.id} className="hover:bg-[#fbf9f6]/70 transition-colors">
                    {/* Filename & Hash */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#af101a] shrink-0">
                          inventory_2
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-[#1b1c1a] truncate font-mono">
                            {b.filename}
                          </div>
                          {b.checksumSha256 && (
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#8f6f6c]">
                              <span className="font-mono truncate max-w-[150px]" title={b.checksumSha256}>
                                SHA: {b.checksumSha256.substring(0, 12)}...
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyChecksum(b.id, b.checksumSha256)}
                                className="text-[#af101a] hover:underline cursor-pointer inline-flex items-center"
                                title="Copy full SHA-256 hash"
                              >
                                {copiedId === b.id ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          )}
                          {b.notes && (
                            <div className="text-[10px] text-zinc-500 italic mt-0.5 truncate max-w-[220px]">
                              "{b.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isSafety
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isSafety ? 'Safety Backup' : 'Manual'}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-3.5 px-3 font-mono text-[11px] font-semibold text-[#585757]">
                      {b.fileSizeFormatted}
                    </td>

                    {/* Tables */}
                    <td className="py-3.5 px-3 text-[#585757]">
                      {b.tableCount ? `${b.tableCount} tables` : '—'}
                    </td>

                    {/* Created At */}
                    <td className="py-3.5 px-3 text-[#585757]">
                      <div>
                        {new Date(b.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-[#8f6f6c]">
                        {new Date(b.createdAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isFailed
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isFailed ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                        />
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleDownload(b)}
                          disabled={isFailed || downloadingId === b.id}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-40"
                          title="Download .dump archive"
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              downloadingId === b.id ? 'animate-spin' : ''
                            }`}
                          >
                            download
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(b.id, b.filename)}
                          disabled={deletingId === b.id}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                          title="Delete backup"
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              deletingId === b.id ? 'animate-spin' : ''
                            }`}
                          >
                            delete
                          </span>
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

      {/* Export Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#eae8e5] p-5 sm:p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#af101a]">download</span>
                <span>Export Production Database</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#585757] leading-relaxed">
              This will create a full binary backup of all tables, relations, and data. You can optionally add a note for audit records:
            </p>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                Backup Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Pre-deployment backup before menu update"
                className="w-full px-3 py-2 text-xs border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                maxLength={200}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eae8e5]">
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#585757] hover:bg-zinc-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerExport}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#af101a] hover:bg-[#d32f2f] text-white rounded-xl shadow-xs cursor-pointer"
              >
                Start Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
