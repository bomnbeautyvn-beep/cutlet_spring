export interface DatabaseJob {
  jobId: string;
  jobType: 'EXPORT' | 'RESTORE';
  status:
    | 'PENDING'
    | 'RUNNING'
    | 'CREATING_SAFETY_BACKUP'
    | 'RESTORING'
    | 'VERIFYING'
    | 'COMPLETED'
    | 'FAILED'
    | 'ROLLED_BACK'
    | 'FAILED_REQUIRES_MANUAL_INTERVENTION';
  progressPercentage: number;
  currentStepMessage: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface DatabaseStatus {
  connected: boolean;
  databaseType: string;
  databaseVersion: string;
  databaseName: string;
  databaseSize: string;
  databaseSizeBytes?: number;
  tableCount: number;
  totalRecords: number;
  lastBackupTime?: string;
  lastBackupFilename?: string;
  maintenanceMode: boolean;
  maintenanceReason?: string;
  activeJob?: DatabaseJob | null;
}

export interface DatabaseBackup {
  id: string;
  filename: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
  backupType: 'MANUAL' | 'PRE_RESTORE_SAFETY';
  checksumSha256?: string;
  tableCount?: number;
  createdAt: string;
  createdBy: string;
  notes?: string;
}

export interface BackupPreview {
  stagingToken: string;
  filename: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  pgDumpVersion?: string;
  archiveCreatedAt?: string;
  sourceDatabaseName?: string;
  tables: string[];
  tableCount: number;
  hasFlywayHistory: boolean;
  hasAdminTable: boolean;
  warnings: string[];
  destructiveWarningMessage: string;
}

export interface ConfirmRestoreRequest {
  stagingToken: string;
  confirmationText: string;
  confirmedWarning: boolean;
}

