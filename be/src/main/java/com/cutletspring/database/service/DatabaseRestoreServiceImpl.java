package com.cutletspring.database.service;

import com.cutletspring.database.config.DatabaseBackupProperties;
import com.cutletspring.database.dto.*;
import com.cutletspring.database.model.DatabaseConnectionInfo;
import com.cutletspring.shared.exception.BadRequestException;
import com.cutletspring.shared.exception.ConflictException;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseRestoreServiceImpl implements DatabaseRestoreService {

    private final DatabaseBackupProperties backupProperties;
    private final DatabaseToolExecutor toolExecutor;
    private final DatabaseBackupService backupService;
    private final DatabaseMetadataService metadataService;
    private final MaintenanceModeService maintenanceModeService;

    private final Map<String, StagedBackup> stagedBackups = new ConcurrentHashMap<>();
    private final Map<String, DatabaseJobDto> jobRegistry = new ConcurrentHashMap<>();
    private final AtomicReference<String> activeJobId = new AtomicReference<>(null);

    private final ExecutorService restoreExecutor = Executors.newSingleThreadExecutor();

    @Getter
    private static class StagedBackup {
        private final String token;
        private final File file;
        private final String originalFilename;
        private final long fileSizeBytes;
        private final BackupPreviewResponse preview;
        private final Instant createdAt;
        private final Instant expiresAt;

        public StagedBackup(String token, File file, String originalFilename, long fileSizeBytes, BackupPreviewResponse preview) {
            this.token = token;
            this.file = file;
            this.originalFilename = originalFilename;
            this.fileSizeBytes = fileSizeBytes;
            this.preview = preview;
            this.createdAt = Instant.now();
            this.expiresAt = Instant.now().plus(30, ChronoUnit.MINUTES);
        }

        public boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }

    @Override
    public BackupPreviewResponse stageAndPreviewBackup(MultipartFile file, String adminEmail) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded backup file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "uploaded_database.dump";
        }

        // Validate extension
        String lowerName = originalFilename.toLowerCase(Locale.ROOT);
        if (!lowerName.endsWith(".dump") && !lowerName.endsWith(".backup")) {
            throw new BadRequestException("Invalid file extension. Only PostgreSQL custom format archives (.dump, .backup) are supported");
        }

        // Validate max file size
        long maxBytes = backupProperties.getBackup().getMaxFileSize();
        if (file.getSize() > maxBytes) {
            throw new BadRequestException("Backup file exceeds maximum allowed size of " + (maxBytes / (1024 * 1024)) + " MB");
        }

        // Staging directory
        File stagingDir = getOrCreateStagingDirectory();
        String stagingToken = UUID.randomUUID().toString();
        File stagedFile = new File(stagingDir, "stage_" + stagingToken + ".dump");

        try {
            // Write uploaded stream to temporary staged file
            try (InputStream is = file.getInputStream();
                 FileOutputStream fos = new FileOutputStream(stagedFile)) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = is.read(buffer)) != -1) {
                    fos.write(buffer, 0, read);
                }
            }

            // Check PostgreSQL header magic bytes (PGDMP)
            if (!toolExecutor.validateDumpHeader(stagedFile)) {
                cleanupFile(stagedFile);
                throw new BadRequestException("Corrupted or invalid PostgreSQL backup: file missing PGDMP custom archive header");
            }

            // Read archive TOC via pg_restore -l
            String tocOutput = toolExecutor.executeRestoreList(stagedFile);
            BackupPreviewResponse preview = parseToc(stagingToken, originalFilename, stagedFile.length(), tocOutput);

            // Store staged backup info in memory
            stagedBackups.put(stagingToken, new StagedBackup(stagingToken, stagedFile, originalFilename, stagedFile.length(), preview));
            cleanExpiredStagedBackups();

            log.info("Backup successfully staged for preview: token={}, filename={}, size={} bytes, tables={}",
                    stagingToken, originalFilename, stagedFile.length(), preview.getTableCount());
            return preview;
        } catch (Exception e) {
            cleanupFile(stagedFile);
            log.error("Failed to stage and preview backup {}: {}", originalFilename, e.getMessage());
            if (e instanceof BadRequestException) {
                throw (BadRequestException) e;
            }
            throw new BadRequestException("Failed to read and validate backup archive: " + e.getMessage());
        }
    }

    @Override
    public DatabaseJobDto confirmAndStartRestore(ConfirmRestoreRequest request, String adminEmail) {
        if (!Boolean.TRUE.equals(request.getConfirmedWarning())) {
            throw new BadRequestException("You must check the confirmation warning checkbox before proceeding");
        }

        if (!"RESTORE DATABASE".equals(request.getConfirmationText())) {
            throw new BadRequestException("Confirmation text must match 'RESTORE DATABASE' exactly");
        }

        StagedBackup staged = stagedBackups.get(request.getStagingToken());
        if (staged == null || staged.isExpired() || !staged.getFile().exists()) {
            throw new BadRequestException("Backup staging session has expired or is invalid. Please upload the file again.");
        }

        // Concurrency lock
        String newJobId = UUID.randomUUID().toString();
        if (!activeJobId.compareAndSet(null, newJobId)) {
            throw new ConflictException("Another database backup or restore operation is currently in progress. Please wait.");
        }

        DatabaseJobDto job = DatabaseJobDto.builder()
                .jobId(newJobId)
                .jobType("RESTORE")
                .status("CREATING_SAFETY_BACKUP")
                .progressPercentage(10)
                .currentStepMessage("Generating pre-restore safety backup of production database...")
                .startedAt(Instant.now())
                .build();

        jobRegistry.put(newJobId, job);

        // Run restore in background
        restoreExecutor.submit(() -> executeRestoreJob(newJobId, staged, adminEmail));

        log.info("Started background database restore job: jobId={}, admin={}", newJobId, adminEmail);
        return job;
    }

    private void executeRestoreJob(String jobId, StagedBackup staged, String adminEmail) {
        DatabaseBackupDto safetyBackup = null;
        DatabaseConnectionInfo connInfo = backupService.getConnectionInfo();

        try {
            // Step 1: Create automatic pre-restore safety backup
            updateJob(jobId, "CREATING_SAFETY_BACKUP", 15, "Generating safety backup of current production database...");
            safetyBackup = backupService.createSafetyBackup(adminEmail);

            File safetyFile = new File(backupService.getBackupFileForDownload(safetyBackup.getId()).getAbsolutePath());
            if (!safetyFile.exists() || safetyFile.length() == 0 || !toolExecutor.validateDumpHeader(safetyFile)) {
                throw new IllegalStateException("Safety backup verification failed. Aborting restore to prevent data loss.");
            }
            log.info("Pre-restore safety backup verified: file={}, size={} bytes", safetyFile.getName(), safetyFile.length());

            // Step 2: Set maintenance mode
            updateJob(jobId, "RESTORING", 35, "Enabling maintenance mode and restoring database schema & records...");
            maintenanceModeService.setMaintenanceMode(true, "Database restore in progress by admin " + adminEmail);

            // Step 3: Execute pg_restore
            toolExecutor.executeRestore(connInfo, staged.getFile());
            updateJob(jobId, "VERIFYING", 75, "Database restored. Verifying database integrity and application schema...");

            // Step 4: Post-restore verification
            boolean verified = verifyRestoredDatabase();
            if (!verified) {
                throw new IllegalStateException("Post-restore verification failed: missing required tables or administrator account");
            }

            // Step 5: Complete successfully
            updateJob(jobId, "COMPLETED", 100, "Database restoration and post-verification completed successfully.");
            jobRegistry.get(jobId).setCompletedAt(Instant.now());
            maintenanceModeService.setMaintenanceMode(false, null);

            log.info("Database restore job {} completed successfully", jobId);
        } catch (Exception e) {
            log.error("Restore failed during execution for job {}: {}", jobId, e.getMessage(), e);

            // Automatic rollback using safety backup
            if (safetyBackup != null) {
                attemptRollback(jobId, safetyBackup, connInfo, e.getMessage());
            } else {
                updateJob(jobId, "FAILED", 0, "Restore failed before safety backup could be created: " + e.getMessage());
                jobRegistry.get(jobId).setError(e.getMessage());
                jobRegistry.get(jobId).setCompletedAt(Instant.now());
                maintenanceModeService.setMaintenanceMode(false, null);
            }
        } finally {
            // Release active job lock
            activeJobId.compareAndSet(jobId, null);
            // Cleanup staged file
            stagedBackups.remove(staged.getToken());
            cleanupFile(staged.getFile());
        }
    }

    private void attemptRollback(String jobId, DatabaseBackupDto safetyBackup, DatabaseConnectionInfo connInfo, String originalError) {
        log.warn("Initiating automatic rollback to safety backup {} for job {}", safetyBackup.getId(), jobId);
        updateJob(jobId, "ROLLING_BACK", 50, "Restore failed. Automatically rolling back to pre-restore safety backup...");

        try {
            File safetyFile = backupService.getBackupFileForDownload(safetyBackup.getId());
            toolExecutor.executeRestore(connInfo, safetyFile);

            boolean rolledBackVerified = verifyRestoredDatabase();
            if (rolledBackVerified) {
                updateJob(jobId, "ROLLED_BACK", 100,
                        "Restore failed and was automatically rolled back to safety backup. Original error: " + originalError);
                jobRegistry.get(jobId).setError(originalError);
                jobRegistry.get(jobId).setCompletedAt(Instant.now());
                maintenanceModeService.setMaintenanceMode(false, null);
                log.info("Automatic rollback succeeded for job {}", jobId);
            } else {
                throw new IllegalStateException("Rollback verification check failed");
            }
        } catch (Exception rollbackEx) {
            log.error("CRITICAL: Automatic rollback failed for job {}: {}", jobId, rollbackEx.getMessage(), rollbackEx);
            updateJob(jobId, "FAILED_REQUIRES_MANUAL_INTERVENTION", 0,
                    "CRITICAL: Restore and rollback both failed. Database remains in maintenance mode. " + rollbackEx.getMessage());
            jobRegistry.get(jobId).setError("Restore error: " + originalError + " | Rollback error: " + rollbackEx.getMessage());
            jobRegistry.get(jobId).setCompletedAt(Instant.now());
            // Intentionally keep maintenance mode enabled
        }
    }

    private boolean verifyRestoredDatabase() {
        log.info("Running post-restore verification checks...");
        if (!metadataService.verifyConnectivity()) {
            log.error("Verification failed: Database connectivity is down");
            return false;
        }
        if (!metadataService.verifyRequiredTables()) {
            log.error("Verification failed: Missing essential application tables");
            return false;
        }
        if (!metadataService.verifyAdminExists()) {
            log.error("Verification failed: No active admin account exists in restored database");
            return false;
        }
        log.info("Post-restore verification succeeded.");
        return true;
    }

    private void updateJob(String jobId, String status, int progress, String message) {
        DatabaseJobDto job = jobRegistry.get(jobId);
        if (job != null) {
            job.setStatus(status);
            job.setProgressPercentage(progress);
            job.setCurrentStepMessage(message);
        }
    }

    @Override
    public DatabaseJobDto getJobStatus(String jobId) {
        DatabaseJobDto job = jobRegistry.get(jobId);
        if (job == null) {
            throw new ResourceNotFoundException("Restore job not found with ID: " + jobId);
        }
        return job;
    }

    @Override
    public DatabaseJobDto getActiveJob() {
        String currentId = activeJobId.get();
        if (currentId != null) {
            return jobRegistry.get(currentId);
        }
        return null;
    }

    private BackupPreviewResponse parseToc(String token, String filename, long size, String toc) {
        String pgDumpVersion = "Unknown";
        String archiveCreatedAt = "Unknown";
        String dbName = "Unknown";
        Set<String> tableNames = new LinkedHashSet<>();

        Pattern versionPattern = Pattern.compile("(?i)Dumped by pg_dump version:\\s*([0-9.]+)");
        Pattern createdPattern = Pattern.compile("(?i)Archive created at\\s*(.+)");
        Pattern dbPattern = Pattern.compile("(?i)dbname:\\s*([a-zA-Z0-9_-]+)");

        String[] lines = toc.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith(";")) {
                Matcher vm = versionPattern.matcher(trimmed);
                if (vm.find()) pgDumpVersion = vm.group(1);

                Matcher cm = createdPattern.matcher(trimmed);
                if (cm.find()) archiveCreatedAt = cm.group(1).trim();

                Matcher dm = dbPattern.matcher(trimmed);
                if (dm.find()) dbName = dm.group(1).trim();
            } else {
                // TOC item line: e.g. "215; 1259 16385 TABLE public admins cutlet_user"
                String[] parts = trimmed.split(";");
                if (parts.length >= 2) {
                    String[] tokens = parts[1].trim().split("\\s+");
                    // tokens: [<classId>, <objectId>, <desc>, <schema>, <name>, <owner>]
                    if (tokens.length >= 5) {
                        String desc = tokens[2];
                        String schema = tokens[3];
                        String name = tokens[4];
                        if ("TABLE".equalsIgnoreCase(desc) && "public".equalsIgnoreCase(schema)) {
                            tableNames.add(name.toLowerCase(Locale.ROOT));
                        }
                    }
                }
            }
        }

        List<String> tablesList = new ArrayList<>(tableNames);
        Collections.sort(tablesList);

        boolean hasFlyway = tablesList.contains("flyway_schema_history");
        boolean hasAdmin = tablesList.contains("admins");

        List<String> warnings = new ArrayList<>();
        if (!hasFlyway) {
            warnings.add("Backup archive does not contain 'flyway_schema_history' table. Database migrations may need manual realignment.");
        }
        if (!hasAdmin) {
            warnings.add("CRITICAL: Backup archive does not contain 'admins' table. Restoring will erase all administrative login accounts!");
        }
        if (!tablesList.contains("menu_items")) {
            warnings.add("Backup archive does not contain 'menu_items' table. Restaurant catalog will be empty after restoration.");
        }
        warnings.add("Restoring this backup will replace current tables and data in production. An automatic safety backup will be created prior to restore.");

        return BackupPreviewResponse.builder()
                .stagingToken(token)
                .filename(filename)
                .fileSizeBytes(size)
                .fileSizeFormatted(formatFileSize(size))
                .pgDumpVersion(pgDumpVersion)
                .archiveCreatedAt(archiveCreatedAt)
                .sourceDatabaseName(dbName)
                .tables(tablesList)
                .tableCount(tablesList.size())
                .hasFlywayHistory(hasFlyway)
                .hasAdminTable(hasAdmin)
                .warnings(warnings)
                .destructiveWarningMessage("WARNING: Restoration will overwrite existing tables and data in production. Ensure you have reviewed table compatibility.")
                .build();
    }

    private File getOrCreateStagingDirectory() {
        String dir = backupProperties.getBackup().getDir() + "/staging";
        Path path = Paths.get(dir);
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (Exception e) {
                throw new IllegalStateException("Failed to create staging directory: " + dir, e);
            }
        }
        return path.toFile();
    }

    private void cleanExpiredStagedBackups() {
        stagedBackups.entrySet().removeIf(entry -> {
            if (entry.getValue().isExpired()) {
                cleanupFile(entry.getValue().getFile());
                return true;
            }
            return false;
        });
    }

    private void cleanupFile(File file) {
        if (file != null && file.exists()) {
            try {
                Files.deleteIfExists(file.toPath());
            } catch (Exception ignored) {
            }
        }
    }

    private String formatFileSize(long bytes) {
        if (bytes <= 0) return "0 B";
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format(Locale.US, "%.2f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
