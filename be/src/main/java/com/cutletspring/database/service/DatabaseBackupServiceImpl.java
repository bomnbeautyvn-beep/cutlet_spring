package com.cutletspring.database.service;

import com.cutletspring.database.config.DatabaseBackupProperties;
import com.cutletspring.database.dto.DatabaseBackupDto;
import com.cutletspring.database.entity.DatabaseBackupHistory;
import com.cutletspring.database.model.DatabaseConnectionInfo;
import com.cutletspring.database.repository.DatabaseBackupHistoryRepository;
import com.cutletspring.shared.exception.BadRequestException;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.sql.Connection;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseBackupServiceImpl implements DatabaseBackupService {

    private final DatabaseBackupProperties backupProperties;
    private final DatabaseBackupHistoryRepository historyRepository;
    private final DatabaseToolExecutor toolExecutor;
    private final DatabaseMetadataService metadataService;
    private final DataSource dataSource;

    @Value("${spring.datasource.url:}")
    private String configuredDatasourceUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter
            .ofPattern("yyyyMMdd_HHmmss")
            .withZone(ZoneId.systemDefault());

    @Override
    @Transactional
    public DatabaseBackupDto exportDatabase(String adminEmail, String notes) {
        return performDump(adminEmail, "MANUAL", notes);
    }

    @Override
    @Transactional
    public DatabaseBackupDto createSafetyBackup(String adminEmail) {
        return performDump(adminEmail, "PRE_RESTORE_SAFETY", "Automatic pre-restore safety backup");
    }

    private DatabaseBackupDto performDump(String adminEmail, String backupType, String notes) {
        DatabaseConnectionInfo connInfo = getConnectionInfo();
        String timestamp = TIMESTAMP_FORMAT.format(Instant.now());
        String prefix = "PRE_RESTORE_SAFETY".equalsIgnoreCase(backupType)
                ? "cutlet_spring_safety_backup_"
                : "cutlet_spring_backup_";
        String filename = prefix + timestamp + ".dump";

        File backupDir = getOrCreateBackupDirectory();
        File targetFile = new File(backupDir, filename);

        log.info("Starting database export: filename={}, type={}, admin={}", filename, backupType, adminEmail);

        try {
            toolExecutor.executeDump(connInfo, targetFile);

            long fileSizeBytes = targetFile.length();
            String sha256 = calculateSha256(targetFile);
            int tableCount = metadataService.getPublicTables().size();

            DatabaseBackupHistory record = DatabaseBackupHistory.builder()
                    .id(UUID.randomUUID().toString())
                    .filename(filename)
                    .filePath(targetFile.getAbsolutePath())
                    .fileSizeBytes(fileSizeBytes)
                    .status("COMPLETED")
                    .backupType(backupType)
                    .checksumSha256(sha256)
                    .tableCount(tableCount)
                    .createdAt(Instant.now())
                    .createdBy(adminEmail != null ? adminEmail : "SYSTEM")
                    .notes(notes)
                    .build();

            DatabaseBackupHistory saved = historyRepository.save(record);
            log.info("Database export completed successfully: id={}, size={} bytes", saved.getId(), fileSizeBytes);
            return toDto(saved);
        } catch (Exception e) {
            log.error("Database export failed: {}", e.getMessage(), e);

            // Record failed attempt in history for audit trail
            DatabaseBackupHistory failedRecord = DatabaseBackupHistory.builder()
                    .id(UUID.randomUUID().toString())
                    .filename(filename)
                    .filePath(targetFile.getAbsolutePath())
                    .fileSizeBytes(targetFile.exists() ? targetFile.length() : 0L)
                    .status("FAILED")
                    .backupType(backupType)
                    .createdAt(Instant.now())
                    .createdBy(adminEmail != null ? adminEmail : "SYSTEM")
                    .notes("Failed: " + e.getMessage())
                    .build();
            historyRepository.save(failedRecord);

            // Clean up partial file
            if (targetFile.exists()) {
                try {
                    Files.deleteIfExists(targetFile.toPath());
                } catch (Exception ignored) {
                }
            }

            throw new IllegalStateException("Database backup failed: " + e.getMessage(), e);
        }
    }

    @Override
    public List<DatabaseBackupDto> listBackups() {
        return historyRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public File getBackupFileForDownload(String backupId) {
        DatabaseBackupHistory record = historyRepository.findById(backupId)
                .orElseThrow(() -> new ResourceNotFoundException("Backup not found with ID: " + backupId));

        if (!"COMPLETED".equalsIgnoreCase(record.getStatus())) {
            throw new BadRequestException("Cannot download a backup that has failed or incomplete status");
        }

        File file = new File(record.getFilePath());
        if (!file.exists()) {
            throw new ResourceNotFoundException("Backup file no longer exists on disk: " + record.getFilename());
        }

        return file;
    }

    @Override
    @Transactional
    public void deleteBackup(String backupId) {
        DatabaseBackupHistory record = historyRepository.findById(backupId)
                .orElseThrow(() -> new ResourceNotFoundException("Backup not found with ID: " + backupId));

        try {
            File file = new File(record.getFilePath());
            if (file.exists()) {
                Files.deleteIfExists(file.toPath());
            }
        } catch (Exception e) {
            log.warn("Failed to delete backup file from disk {}: {}", record.getFilePath(), e.getMessage());
        }

        historyRepository.delete(record);
        log.info("Deleted backup record: id={}, filename={}", backupId, record.getFilename());
    }

    @Override
    public DatabaseConnectionInfo getConnectionInfo() {
        String effectiveUrl = configuredDatasourceUrl;
        String effectiveUser = configuredUsername;
        String effectivePass = configuredPassword;

        if (effectiveUrl == null || effectiveUrl.isBlank()) {
            try (Connection conn = dataSource.getConnection()) {
                effectiveUrl = conn.getMetaData().getURL();
                if (effectiveUser == null || effectiveUser.isBlank()) {
                    effectiveUser = conn.getMetaData().getUserName();
                }
            } catch (Exception e) {
                log.warn("Could not inspect Connection metadata: {}", e.getMessage());
            }
        }

        return DatabaseConnectionInfo.parse(effectiveUrl, effectiveUser, effectivePass);
    }

    private File getOrCreateBackupDirectory() {
        String dirPath = backupProperties.getBackup().getDir();
        Path path = Paths.get(dirPath);
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (Exception e) {
                throw new IllegalStateException("Failed to create backup directory: " + dirPath, e);
            }
        }
        return path.toFile();
    }

    private String calculateSha256(File file) {
        try (InputStream fis = new FileInputStream(file)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;
            while ((read = fis.read(buffer)) != -1) {
                digest.update(buffer, 0, read);
            }
            byte[] hash = digest.digest();
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.warn("Failed to compute SHA-256 for file {}: {}", file.getName(), e.getMessage());
            return null;
        }
    }

    private DatabaseBackupDto toDto(DatabaseBackupHistory entity) {
        return DatabaseBackupDto.builder()
                .id(entity.getId())
                .filename(entity.getFilename())
                .fileSizeBytes(entity.getFileSizeBytes())
                .fileSizeFormatted(formatFileSize(entity.getFileSizeBytes()))
                .status(entity.getStatus())
                .backupType(entity.getBackupType())
                .checksumSha256(entity.getChecksumSha256())
                .tableCount(entity.getTableCount())
                .createdAt(entity.getCreatedAt())
                .createdBy(entity.getCreatedBy())
                .notes(entity.getNotes())
                .build();
    }

    private String formatFileSize(Long bytes) {
        if (bytes == null || bytes <= 0) return "0 B";
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format(java.util.Locale.US, "%.2f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
