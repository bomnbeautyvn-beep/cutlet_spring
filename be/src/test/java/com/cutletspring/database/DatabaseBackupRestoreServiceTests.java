package com.cutletspring.database;

import com.cutletspring.database.dto.*;
import com.cutletspring.database.entity.DatabaseBackupHistory;
import com.cutletspring.database.model.DatabaseConnectionInfo;
import com.cutletspring.database.repository.DatabaseBackupHistoryRepository;
import com.cutletspring.database.service.*;
import com.cutletspring.shared.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class DatabaseBackupRestoreServiceTests {

    @Autowired
    private DatabaseBackupService backupService;

    @Autowired
    private DatabaseRestoreService restoreService;

    @Autowired
    private DatabaseMetadataService metadataService;

    @Autowired
    private MaintenanceModeService maintenanceModeService;

    @Autowired
    private DatabaseBackupHistoryRepository historyRepository;

    @MockitoBean
    private DatabaseToolExecutor toolExecutor;

    @BeforeEach
    void setUp() {
        Mockito.reset(toolExecutor);
    }

    @Test
    @DisplayName("Metadata service retrieves valid database metrics in test environment")
    void testGetDatabaseStatus() {
        DatabaseStatusDto status = metadataService.getDatabaseStatus();
        assertNotNull(status);
        assertTrue(status.isConnected());
        assertNotNull(status.getDatabaseType());
        assertTrue(status.getTableCount() > 0);
        assertTrue(metadataService.verifyConnectivity());
        assertTrue(metadataService.verifyRequiredTables());
        assertTrue(metadataService.verifyAdminExists());
        assertTrue(metadataService.verifyFlywayCompatibility());
    }

    @Test
    @DisplayName("Maintenance mode toggles state and reason correctly")
    void testMaintenanceMode() {
        assertFalse(maintenanceModeService.isMaintenanceMode());

        maintenanceModeService.setMaintenanceMode(true, "Scheduled test maintenance");
        assertTrue(maintenanceModeService.isMaintenanceMode());
        assertEquals("Scheduled test maintenance", maintenanceModeService.getMaintenanceReason());

        maintenanceModeService.setMaintenanceMode(false, null);
        assertFalse(maintenanceModeService.isMaintenanceMode());
        assertNull(maintenanceModeService.getMaintenanceReason());
    }

    @Test
    @DisplayName("Export database calls tool executor, verifies file, and records history")
    void testExportDatabase() {
        // Mock tool executor dump execution to create a dummy valid file
        doAnswer(invocation -> {
            File target = invocation.getArgument(1);
            try (FileOutputStream fos = new FileOutputStream(target)) {
                // Write valid PGDMP magic header + some dummy content
                fos.write(new byte[]{0x50, 0x47, 0x44, 0x4D, 0x50, 0x01, 0x02, 0x03});
            }
            return null;
        }).when(toolExecutor).executeDump(any(DatabaseConnectionInfo.class), any(File.class));

        when(toolExecutor.validateDumpHeader(any(File.class))).thenReturn(true);

        DatabaseBackupDto backup = backupService.exportDatabase("admin@cutletspring.com", "Test manual backup");
        assertNotNull(backup);
        assertNotNull(backup.getId());
        assertEquals("COMPLETED", backup.getStatus());
        assertEquals("MANUAL", backup.getBackupType());
        assertEquals("admin@cutletspring.com", backup.getCreatedBy());
        assertTrue(backup.getFileSizeBytes() > 0);

        List<DatabaseBackupDto> list = backupService.listBackups();
        assertFalse(list.isEmpty());

        File downloadFile = backupService.getBackupFileForDownload(backup.getId());
        assertNotNull(downloadFile);
        assertTrue(downloadFile.exists());

        // Cleanup
        backupService.deleteBackup(backup.getId());
        assertFalse(historyRepository.existsById(backup.getId()));
    }

    @Test
    @DisplayName("Stage and preview validates magic header and extracts TOC metadata")
    void testStageAndPreview() {
        when(toolExecutor.validateDumpHeader(any(File.class))).thenReturn(true);

        String sampleToc = """
                ; Archive created at 2026-11-02 12:00:00
                ;     dbname: cutlet_spring
                ;     Dumped by pg_dump version: 16.2
                215; 1259 16385 TABLE public admins cutlet_user
                216; 1259 16395 TABLE public menu_items cutlet_user
                217; 1259 16405 TABLE public categories cutlet_user
                218; 1259 16415 TABLE public restaurant_settings cutlet_user
                219; 1259 16425 TABLE public flyway_schema_history cutlet_user
                """;

        when(toolExecutor.executeRestoreList(any(File.class))).thenReturn(sampleToc);

        byte[] validContent = new byte[]{0x50, 0x47, 0x44, 0x4D, 0x50, 0x01, 0x02};
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "sample_backup.dump",
                "application/octet-stream",
                validContent
        );

        BackupPreviewResponse preview = restoreService.stageAndPreviewBackup(file, "admin@cutletspring.com");
        assertNotNull(preview);
        assertNotNull(preview.getStagingToken());
        assertEquals("sample_backup.dump", preview.getFilename());
        assertEquals("16.2", preview.getPgDumpVersion());
        assertTrue(preview.isHasAdminTable());
        assertTrue(preview.isHasFlywayHistory());
        assertTrue(preview.getTables().contains("admins"));
        assertTrue(preview.getTables().contains("menu_items"));
        assertEquals(5, preview.getTableCount());
    }

    @Test
    @DisplayName("Stage rejects non-dump files and corrupted headers")
    void testStageRejectsCorruptedFiles() {
        MockMultipartFile invalidExt = new MockMultipartFile(
                "file",
                "hack.sql",
                "text/plain",
                "DROP TABLE admins;".getBytes()
        );

        assertThrows(BadRequestException.class, () ->
                restoreService.stageAndPreviewBackup(invalidExt, "admin@cutletspring.com"));

        when(toolExecutor.validateDumpHeader(any(File.class))).thenReturn(false);

        MockMultipartFile corruptFile = new MockMultipartFile(
                "file",
                "corrupt.dump",
                "application/octet-stream",
                new byte[]{0x00, 0x01, 0x02}
        );

        assertThrows(BadRequestException.class, () ->
                restoreService.stageAndPreviewBackup(corruptFile, "admin@cutletspring.com"));
    }

    @Test
    @DisplayName("Confirm restore enforces warning checkbox and exact 'RESTORE DATABASE' phrase")
    void testConfirmRestoreValidations() {
        ConfirmRestoreRequest invalidPhrase = ConfirmRestoreRequest.builder()
                .stagingToken("dummy-token")
                .confirmedWarning(true)
                .confirmationText("yes restore")
                .build();

        assertThrows(BadRequestException.class, () ->
                restoreService.confirmAndStartRestore(invalidPhrase, "admin@cutletspring.com"));

        ConfirmRestoreRequest uncheckedWarning = ConfirmRestoreRequest.builder()
                .stagingToken("dummy-token")
                .confirmedWarning(false)
                .confirmationText("RESTORE DATABASE")
                .build();

        assertThrows(BadRequestException.class, () ->
                restoreService.confirmAndStartRestore(uncheckedWarning, "admin@cutletspring.com"));
    }
}
