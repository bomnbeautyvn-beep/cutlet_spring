package com.cutletspring.database;

import com.cutletspring.database.controller.AdminDatabaseController;
import com.cutletspring.database.dto.*;
import com.cutletspring.database.model.DatabaseConnectionInfo;
import com.cutletspring.database.service.DatabaseToolExecutor;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
class AdminDatabaseControllerTests {

    @Autowired
    private AdminDatabaseController databaseController;

    @MockitoBean
    private DatabaseToolExecutor toolExecutor;

    @BeforeEach
    void setUp() {
        Mockito.reset(toolExecutor);
    }

    private UsernamePasswordAuthenticationToken createAdminAuth(String email) {
        return new UsernamePasswordAuthenticationToken(
                email,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }

    @Test
    @DisplayName("Admin retrieves database status and metrics successfully")
    void testGetStatus() {
        var auth = createAdminAuth("admin@cutletspring.com");
        SecurityContextHolder.getContext().setAuthentication(auth);

        ResponseEntity<ApiResponse<DatabaseStatusDto>> response = databaseController.getStatus();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());

        DatabaseStatusDto data = response.getBody().getData();
        assertNotNull(data);
        assertTrue(data.isConnected());
        assertTrue(data.getTableCount() > 0);
        assertFalse(data.isMaintenanceMode());
    }

    @Test
    @DisplayName("Admin exports database and can list and download the backup")
    void testExportListAndDownload() {
        var auth = createAdminAuth("admin@cutletspring.com");
        SecurityContextHolder.getContext().setAuthentication(auth);

        doAnswer(invocation -> {
            File target = invocation.getArgument(1);
            try (FileOutputStream fos = new FileOutputStream(target)) {
                fos.write(new byte[]{0x50, 0x47, 0x44, 0x4D, 0x50, 0x01, 0x02, 0x03, 0x04});
            }
            return null;
        }).when(toolExecutor).executeDump(any(DatabaseConnectionInfo.class), any(File.class));

        when(toolExecutor.validateDumpHeader(any(File.class))).thenReturn(true);

        ResponseEntity<ApiResponse<DatabaseBackupDto>> exportResp =
                databaseController.exportDatabase("Controller test backup", auth);
        assertNotNull(exportResp);
        assertEquals(200, exportResp.getStatusCode().value());
        assertNotNull(exportResp.getBody());

        DatabaseBackupDto backupDto = exportResp.getBody().getData();
        assertNotNull(backupDto);
        assertNotNull(backupDto.getId());

        // List backups
        ResponseEntity<ApiResponse<List<DatabaseBackupDto>>> listResp = databaseController.listBackups();
        assertNotNull(listResp);
        assertEquals(200, listResp.getStatusCode().value());
        assertTrue(listResp.getBody().getData().stream().anyMatch(b -> b.getId().equals(backupDto.getId())));

        // Download backup
        ResponseEntity<Resource> downloadResp = databaseController.downloadBackup(backupDto.getId());
        assertNotNull(downloadResp);
        assertEquals(200, downloadResp.getStatusCode().value());
        assertTrue(downloadResp.getHeaders().getFirst("Content-Disposition").contains(backupDto.getFilename()));

        // Delete backup
        ResponseEntity<ApiResponse<Void>> deleteResp = databaseController.deleteBackup(backupDto.getId());
        assertNotNull(deleteResp);
        assertEquals(200, deleteResp.getStatusCode().value());
    }

    @Test
    @DisplayName("Admin previews uploaded backup and initiates background restore workflow")
    void testPreviewAndConfirmRestore() {
        var auth = createAdminAuth("admin@cutletspring.com");
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(toolExecutor.validateDumpHeader(any(File.class))).thenReturn(true);
        String mockToc = """
                ; Archive created at 2026-11-02 12:00:00
                ;     dbname: cutlet_spring
                ;     Dumped by pg_dump version: 16.2
                215; 1259 16385 TABLE public admins cutlet_user
                216; 1259 16395 TABLE public menu_items cutlet_user
                217; 1259 16405 TABLE public restaurant_settings cutlet_user
                218; 1259 16415 TABLE public flyway_schema_history cutlet_user
                """;
        when(toolExecutor.executeRestoreList(any(File.class))).thenReturn(mockToc);

        // Upload and Preview
        byte[] content = new byte[]{0x50, 0x47, 0x44, 0x4D, 0x50, 0x01, 0x02};
        MockMultipartFile file = new MockMultipartFile("file", "atelier_prod.dump", "application/octet-stream", content);

        ResponseEntity<ApiResponse<BackupPreviewResponse>> previewResp = databaseController.previewBackup(file, auth);
        assertNotNull(previewResp);
        assertEquals(200, previewResp.getStatusCode().value());
        BackupPreviewResponse preview = previewResp.getBody().getData();
        assertNotNull(preview);
        assertNotNull(preview.getStagingToken());
        assertEquals("atelier_prod.dump", preview.getFilename());
        assertTrue(preview.isHasAdminTable());
        assertTrue(preview.isHasFlywayHistory());

        // Mock safety dump execution and restore
        doAnswer(inv -> {
            File target = inv.getArgument(1);
            try (FileOutputStream fos = new FileOutputStream(target)) {
                fos.write(new byte[]{0x50, 0x47, 0x44, 0x4D, 0x50, 0x01, 0x02, 0x03});
            }
            return null;
        }).when(toolExecutor).executeDump(any(DatabaseConnectionInfo.class), any(File.class));
        doNothing().when(toolExecutor).executeRestore(any(DatabaseConnectionInfo.class), any(File.class));

        // Confirm restore
        ConfirmRestoreRequest req = ConfirmRestoreRequest.builder()
                .stagingToken(preview.getStagingToken())
                .confirmationText("RESTORE DATABASE")
                .confirmedWarning(true)
                .build();

        ResponseEntity<ApiResponse<DatabaseJobDto>> confirmResp = databaseController.confirmRestore(req, auth);
        assertNotNull(confirmResp);
        assertEquals(200, confirmResp.getStatusCode().value());

        DatabaseJobDto job = confirmResp.getBody().getData();
        assertNotNull(job);
        assertNotNull(job.getJobId());

        // Wait for background execution to complete to avoid mock interference
        long start = System.currentTimeMillis();
        while (System.currentTimeMillis() - start < 3000) {
            ResponseEntity<ApiResponse<DatabaseJobDto>> statusResp = databaseController.getJobStatus(job.getJobId());
            String status = statusResp.getBody().getData().getStatus();
            if ("COMPLETED".equals(status) || "FAILED".equals(status) || "ROLLED_BACK".equals(status)) {
                break;
            }
            try {
                Thread.sleep(50);
            } catch (InterruptedException ignored) {
            }
        }

        // Poll job status
        ResponseEntity<ApiResponse<DatabaseJobDto>> statusResp = databaseController.getJobStatus(job.getJobId());
        assertNotNull(statusResp);
        assertEquals(200, statusResp.getStatusCode().value());
    }
}
