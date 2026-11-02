import React, { useState, useEffect, useCallback } from 'react';
import { DatabaseStatus, DatabaseBackup } from '@/types/database.types';
import { databaseService } from '@/services/database.service';
import { DatabaseOverviewCard } from './components/DatabaseOverviewCard';
import { DatabaseExportSection } from './components/DatabaseExportSection';
import { DatabaseRestoreSection } from './components/DatabaseRestoreSection';

export const DatabaseManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'export' | 'restore'>('export');
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [backups, setBackups] = useState<DatabaseBackup[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingBackups, setIsLoadingBackups] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoadingStatus(true);
    setIsLoadingBackups(true);
    try {
      const [st, bk] = await Promise.all([
        databaseService.getStatus(),
        databaseService.listBackups(),
      ]);
      setStatus(st);
      setBackups(bk);
    } catch (err: any) {
      console.error('Failed to load database status and backups:', err);
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to load database status.',
      });
    } finally {
      setIsLoadingStatus(false);
      setIsLoadingBackups(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async (notes?: string) => {
    setIsExporting(true);
    setFeedbackMessage(null);
    try {
      const newBackup = await databaseService.exportDatabase(notes);
      setFeedbackMessage({
        type: 'success',
        text: `Database backup "${newBackup.filename}" generated successfully!`,
      });
      await loadData();
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to generate database backup.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      await databaseService.downloadBackup(id, filename);
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to download backup file.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await databaseService.deleteBackup(id);
      setFeedbackMessage({
        type: 'success',
        text: 'Backup deleted successfully.',
      });
      await loadData();
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to delete backup file.',
      });
    }
  };

  const handleRestoreCompleted = () => {
    setFeedbackMessage({
      type: 'success',
      text: 'Database restoration verified and completed successfully!',
    });
    loadData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8f6f6c] mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#1b1c1a] font-semibold">Database Management</span>
          </div>
          <h1 className="font-headline-sm text-lg sm:text-xl font-bold tracking-tight text-[#1b1c1a] uppercase">
            Database Backup & Recovery
          </h1>
          <p className="text-xs text-[#8f6f6c] mt-0.5">
            Safely export, inspect, and restore production PostgreSQL database archives.
          </p>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded border flex items-center justify-between gap-3 text-xs ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {feedbackMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="font-medium">{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Section 1: Overview */}
      <DatabaseOverviewCard
        status={status}
        isLoading={isLoadingStatus}
        onRefresh={loadData}
      />

      {/* Section 2: Tab Navigation */}
      <div className="flex border-b border-[#eae8e5] gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'export'
              ? 'border-b-2 border-[#af101a] text-[#af101a]'
              : 'text-[#8f6f6c] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">cloud_download</span>
          <span>Export & Backup History</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-100 text-[#585757]">
            {backups.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('restore')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'restore'
              ? 'border-b-2 border-[#af101a] text-[#af101a]'
              : 'text-[#8f6f6c] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
          <span>Restore Database</span>
        </button>
      </div>

      {/* Section 3: Active Tab Content */}
      {activeTab === 'export' && (
        <DatabaseExportSection
          backups={backups}
          isLoading={isLoadingBackups}
          isExporting={isExporting}
          onExport={handleExport}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}

      {activeTab === 'restore' && (
        <DatabaseRestoreSection onRestoreCompleted={handleRestoreCompleted} />
      )}
    </div>
  );
};

