import React, { useState, useEffect, useRef } from 'react';
import { BackupPreview, DatabaseJob } from '@/types/database.types';
import { databaseService } from '@/services/database.service';

interface DatabaseRestoreSectionProps {
  onRestoreCompleted: () => void;
}

export const DatabaseRestoreSection: React.FC<DatabaseRestoreSectionProps> = ({
  onRestoreCompleted,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Preview state
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [tableSearch, setTableSearch] = useState('');

  // Confirmation state
  const [confirmedWarning, setConfirmedWarning] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isSubmittingRestore, setIsSubmittingRestore] = useState(false);

  // Active Job state
  const [activeJob, setActiveJob] = useState<DatabaseJob | null>(null);
  const pollingTimerRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check for any currently running job on mount
  useEffect(() => {
    let mounted = true;
    databaseService
      .getActiveJob()
      .then((job) => {
        if (mounted && job && (job.status !== 'COMPLETED' && job.status !== 'FAILED' && job.status !== 'ROLLED_BACK')) {
          setActiveJob(job);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  // Poll job status when an active job is running
  useEffect(() => {
    if (!activeJob) return;

    const isFinished =
      activeJob.status === 'COMPLETED' ||
      activeJob.status === 'FAILED' ||
      activeJob.status === 'ROLLED_BACK' ||
      activeJob.status === 'FAILED_REQUIRES_MANUAL_INTERVENTION';

    if (isFinished) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      if (activeJob.status === 'COMPLETED') {
        onRestoreCompleted();
      }
      return;
    }

    pollingTimerRef.current = window.setInterval(async () => {
      try {
        const updated = await databaseService.getJobStatus(activeJob.jobId);
        setActiveJob(updated);
      } catch (err) {
        console.error('Failed to poll restore job status:', err);
      }
    }, 1500);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [activeJob?.jobId, activeJob?.status, onRestoreCompleted]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.dump') && !lowerName.endsWith('.backup')) {
      setUploadError('Invalid file format. Only PostgreSQL custom format archives (.dump, .backup) are supported.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadError('File size exceeds the 100 MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const data = await databaseService.uploadAndPreview(selectedFile);
      setPreview(data);
      setConfirmedWarning(false);
      setConfirmationText('');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to inspect backup file. Ensure it is a valid pg_dump archive.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setConfirmedWarning(false);
    setConfirmationText('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmRestore = async () => {
    if (!preview) return;
    if (!confirmedWarning || confirmationText !== 'RESTORE DATABASE') return;

    setIsSubmittingRestore(true);
    setUploadError(null);

    try {
      const job = await databaseService.confirmRestore({
        stagingToken: preview.stagingToken,
        confirmationText: 'RESTORE DATABASE',
        confirmedWarning: true,
      });
      setActiveJob(job);
      setPreview(null);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to initiate restore.');
    } finally {
      setIsSubmittingRestore(false);
    }
  };

  const isConfirmationSatisfied = confirmedWarning && confirmationText === 'RESTORE DATABASE';

  // Filter tables in preview
  const filteredTables = preview?.tables.filter((t) =>
    t.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded border border-[#eae8e5] p-5 sm:p-6 space-y-6 shadow-xs">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-2">
          <span>Database Restoration Workflow</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
            Destructive Action
          </span>
        </h3>
        <p className="text-xs text-[#8f6f6c] mt-1 leading-relaxed">
          Follow the mandatory multi-step verification process to preview archive contents, verify schema compatibility, and perform a controlled restoration.
        </p>
      </div>

      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-900 text-xs flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0 mt-0.5">
            error
          </span>
          <div className="leading-relaxed font-medium">{uploadError}</div>
        </div>
      )}

      {/* --- ACTIVE RESTORE TRACKER --- */}
      {activeJob && (
        <div className="p-5 sm:p-6 bg-[#fbf9f6] rounded border-2 border-[#af101a]/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#af101a] animate-ping" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Database Restoration In Progress
              </h4>
            </div>
            <span className="text-[11px] font-mono font-semibold text-[#8f6f6c]">
              Job: {activeJob.jobId.substring(0, 8)}...
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-zinc-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                activeJob.status === 'FAILED' || activeJob.status === 'FAILED_REQUIRES_MANUAL_INTERVENTION'
                  ? 'bg-red-600'
                  : activeJob.status === 'ROLLED_BACK'
                  ? 'bg-amber-600'
                  : 'bg-[#af101a]'
              }`}
              style={{ width: `${Math.max(activeJob.progressPercentage, 5)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1b1c1a]">{activeJob.currentStepMessage}</span>
            <span className="font-bold text-[#af101a]">{activeJob.progressPercentage}%</span>
          </div>

          {/* Job Result Alerts */}
          {activeJob.status === 'COMPLETED' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                <span className="font-bold">Database restoration successfully verified!</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveJob(null)}
                className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeJob.status === 'ROLLED_BACK' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-[18px] text-amber-600">warning</span>
                <span>Restoration Rolled Back Safely</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Post-restoration verification encountered errors. The system automatically rolled back all tables to the pre-restore safety backup. Production data remains intact.
              </p>
              <button
                type="button"
                onClick={() => setActiveJob(null)}
                className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeJob.status === 'FAILED' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                <span>Restoration Job Failed</span>
              </div>
              <p className="text-[11px] text-red-800">{activeJob.error || 'An unexpected error occurred.'}</p>
              <button
                type="button"
                onClick={() => setActiveJob(null)}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- STEP 1: UPLOAD & ANALYZE (WHEN NO PREVIEW ACTIVE) --- */}
      {!preview && !activeJob && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#eae8e5] hover:border-[#af101a]/50 rounded p-6 sm:p-8 text-center bg-[#fbf9f6] transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".dump,.backup"
              className="hidden"
              id="database-file-upload"
            />
            <label
              htmlFor="database-file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-[#eae8e5] text-[#af101a] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              </div>
              <div className="text-xs font-bold text-[#1b1c1a]">
                {selectedFile ? (
                  <span className="text-[#af101a] font-mono">{selectedFile.name}</span>
                ) : (
                  <span>Click to select or drag and drop a .dump backup archive</span>
                )}
              </div>
              <p className="text-[11px] text-[#8f6f6c]">
                PostgreSQL Custom Format only (<code className="font-mono">pg_dump -Fc</code>) • Max 100 MB
              </p>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUploadAndAnalyze}
              disabled={!selectedFile || isUploading}
              className="px-5 py-2.5 bg-[#1b1c1a] hover:bg-black text-white rounded text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-40 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Inspecting Archive Header & TOC...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                  <span>Upload & Preview Archive</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 2 & 3: PREVIEW METADATA & CONFIRMATION --- */}
      {preview && !activeJob && (
        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="p-4 sm:p-5 bg-[#fbf9f6] rounded border border-[#eae8e5] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">verified</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                  Archive Validation & Preview
                </h4>
              </div>
              <button
                type="button"
                onClick={handleResetPreview}
                className="text-xs text-[#8f6f6c] hover:text-[#1b1c1a] hover:underline cursor-pointer"
              >
                Choose Different File
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#8f6f6c] uppercase font-bold block">Archive File</span>
                <span className="font-mono font-semibold text-[#1b1c1a] truncate block" title={preview.filename}>
                  {preview.filename}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8f6f6c] uppercase font-bold block">File Size</span>
                <span className="font-mono font-semibold text-[#1b1c1a]">{preview.fileSizeFormatted}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8f6f6c] uppercase font-bold block">Dump Version</span>
                <span className="font-semibold text-[#1b1c1a]">PostgreSQL {preview.pgDumpVersion || '16'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8f6f6c] uppercase font-bold block">Source DB</span>
                <span className="font-mono font-semibold text-[#1b1c1a]">{preview.sourceDatabaseName || 'cutlet_spring'}</span>
              </div>
            </div>

            {/* Warnings list */}
            {preview.warnings && preview.warnings.length > 0 && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded space-y-1.5 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
                  <span>Compatibility & Security Notices</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-800">
                  {preview.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tables List */}
            <div className="space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#585757]">
                  Tables Contained in Archive ({preview.tableCount})
                </span>
                <input
                  type="text"
                  placeholder="Filter table names..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a] max-w-xs"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-white rounded border border-[#eae8e5]">
                {filteredTables && filteredTables.length > 0 ? (
                  filteredTables.map((tbl) => (
                    <span
                      key={tbl}
                      className="inline-block px-2 py-0.5 rounded bg-[#fbf9f6] border border-[#eae8e5] text-[11px] font-mono text-[#1b1c1a]"
                    >
                      {tbl}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400 italic">No tables match filter</span>
                )}
              </div>
            </div>
          </div>

          {/* Warning & Confirmation Box */}
          <div className="p-5 bg-red-50/70 border-2 border-red-200 rounded space-y-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[24px] text-red-600 shrink-0 mt-0.5">
                dangerous
              </span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-950 uppercase tracking-wide">
                  Destructive Action Confirmation Required
                </h4>
                <p className="text-xs text-red-800 leading-relaxed">
                  Restoring will overwrite current tables and replace active data. An automatic pre-restore safety backup will be created immediately before import. If verification fails, the database will roll back automatically.
                </p>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#1b1c1a] font-medium pt-2 border-t border-red-200">
              <input
                type="checkbox"
                checked={confirmedWarning}
                onChange={(e) => setConfirmedWarning(e.target.checked)}
                className="mt-0.5 rounded text-[#af101a] focus:ring-[#af101a]"
              />
              <span>
                I have reviewed the preview tables and compatibility warnings. I authorize replacing current production data.
              </span>
            </label>

            {/* Confirmation text input */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-red-950">
                To confirm, type <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded font-black">RESTORE DATABASE</span> below:
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="RESTORE DATABASE"
                className="w-full sm:max-w-md px-3.5 py-2 text-xs font-mono font-bold tracking-wider border border-red-300 rounded bg-white focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-red-200">
              <button
                type="button"
                onClick={handleResetPreview}
                className="px-4 py-2 text-xs font-bold text-[#585757] hover:bg-white rounded cursor-pointer"
              >
                Cancel Restoration
              </button>

              <button
                type="button"
                onClick={handleConfirmRestore}
                disabled={!isConfirmationSatisfied || isSubmittingRestore}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingRestore ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Initiating Safety Backup & Restore...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
                    <span>Execute Database Restore</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

