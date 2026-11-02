import { api } from '@/lib/axios';
import {
  DatabaseStatus,
  DatabaseBackup,
  BackupPreview,
  ConfirmRestoreRequest,
  DatabaseJob,
} from '@/types/database.types';

export const databaseService = {
  /**
   * Retrieves database connection status, metrics and active job
   */
  async getStatus(): Promise<DatabaseStatus> {
    const res = await api.get('/admin/database/status');
    return res.data.data;
  },

  /**
   * Lists backup history records
   */
  async listBackups(): Promise<DatabaseBackup[]> {
    const res = await api.get('/admin/database/backups');
    return res.data.data;
  },

  /**
   * Generates an on-demand PostgreSQL custom dump (pg_dump -Fc)
   */
  async exportDatabase(notes?: string): Promise<DatabaseBackup> {
    const res = await api.post('/admin/database/export', null, {
      params: notes ? { notes } : undefined,
      timeout: 180000, // 3 minutes timeout for heavy database dumps
    });
    return res.data.data;
  },

  /**
   * Downloads a backup file
   */
  async downloadBackup(id: string, filename: string): Promise<void> {
    const response = await api.get(`/admin/database/backups/${id}/download`, {
      responseType: 'blob',
      timeout: 120000,
    });

    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  /**
   * Deletes a backup record and associated storage file
   */
  async deleteBackup(id: string): Promise<void> {
    await api.delete(`/admin/database/backups/${id}`);
  },

  /**
   * Stages an uploaded backup file and retrieves preview without restoring
   */
  async uploadAndPreview(file: File): Promise<BackupPreview> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/admin/database/import/preview', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 180000, // 3 minutes timeout for upload & TOC analysis
    });
    return res.data.data;
  },

  /**
   * Confirms and starts background restore process
   */
  async confirmRestore(request: ConfirmRestoreRequest): Promise<DatabaseJob> {
    const res = await api.post('/admin/database/import/confirm', request);
    return res.data.data;
  },

  /**
   * Polls the status of an ongoing or completed restore job
   */
  async getJobStatus(jobId: string): Promise<DatabaseJob> {
    const res = await api.get(`/admin/database/jobs/${jobId}`);
    return res.data.data;
  },

  /**
   * Checks for an active restore or export job
   */
  async getActiveJob(): Promise<DatabaseJob | null> {
    const res = await api.get('/admin/database/jobs/active');
    return res.data.data;
  },
};
