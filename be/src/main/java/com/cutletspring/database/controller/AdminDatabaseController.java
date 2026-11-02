package com.cutletspring.database.controller;

import com.cutletspring.database.dto.*;
import com.cutletspring.database.service.DatabaseBackupService;
import com.cutletspring.database.service.DatabaseMetadataService;
import com.cutletspring.database.service.DatabaseRestoreService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/database")
@RequiredArgsConstructor
@Tag(name = "Admin Database Management", description = "Administrative endpoints for database backup, export, preview and restoration")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDatabaseController {

    private final DatabaseBackupService backupService;
    private final DatabaseRestoreService restoreService;
    private final DatabaseMetadataService metadataService;

    @Operation(summary = "Get Database Status & Metrics", description = "Retrieves live connection status, version, size, table metrics, and active restore job")
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<DatabaseStatusDto>> getStatus() {
        DatabaseStatusDto status = metadataService.getDatabaseStatus();
        DatabaseJobDto activeJob = restoreService.getActiveJob();
        status.setActiveJob(activeJob);
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    @Operation(summary = "List Backup History", description = "Lists all recorded manual and pre-restore safety backups with metadata")
    @GetMapping("/backups")
    public ResponseEntity<ApiResponse<List<DatabaseBackupDto>>> listBackups() {
        List<DatabaseBackupDto> backups = backupService.listBackups();
        return ResponseEntity.ok(ApiResponse.success(backups));
    }

    @Operation(summary = "Export Database Backup", description = "Triggers an on-demand PostgreSQL custom format backup (pg_dump -Fc)")
    @PostMapping("/export")
    public ResponseEntity<ApiResponse<DatabaseBackupDto>> exportDatabase(
            @RequestParam(value = "notes", required = false) String notes,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        DatabaseBackupDto backup = backupService.exportDatabase(adminEmail, notes);
        return ResponseEntity.ok(ApiResponse.success("Database backup generated successfully", backup));
    }

    @Operation(summary = "Download Database Backup", description = "Downloads the generated .dump backup file")
    @GetMapping("/backups/{id}/download")
    public ResponseEntity<Resource> downloadBackup(@PathVariable("id") String id) {
        File file = backupService.getBackupFileForDownload(id);
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.length())
                .body(resource);
    }

    @Operation(summary = "Delete Backup File", description = "Removes a backup file from storage and deletes its history record")
    @DeleteMapping("/backups/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBackup(@PathVariable("id") String id) {
        backupService.deleteBackup(id);
        return ResponseEntity.ok(ApiResponse.success("Backup deleted successfully", null));
    }

    @Operation(summary = "Upload & Preview Backup", description = "Stages uploaded backup file, reads TOC via pg_restore -l, and displays preview without modifying database")
    @PostMapping(value = "/import/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BackupPreviewResponse>> previewBackup(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        BackupPreviewResponse preview = restoreService.stageAndPreviewBackup(file, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Backup verified and staged for preview", preview));
    }

    @Operation(summary = "Confirm & Execute Database Restore", description = "Validates confirmation phrase, creates safety backup, and executes background restore")
    @PostMapping("/import/confirm")
    public ResponseEntity<ApiResponse<DatabaseJobDto>> confirmRestore(
            @Valid @RequestBody ConfirmRestoreRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        DatabaseJobDto job = restoreService.confirmAndStartRestore(request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Database restore job initiated", job));
    }

    @Operation(summary = "Get Restore Job Status", description = "Polls the status, progress percentage, and step message of an ongoing or completed restore job")
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<DatabaseJobDto>> getJobStatus(@PathVariable("jobId") String jobId) {
        DatabaseJobDto job = restoreService.getJobStatus(jobId);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @Operation(summary = "Get Active Job", description = "Retrieves currently executing backup or restore job if any")
    @GetMapping("/jobs/active")
    public ResponseEntity<ApiResponse<DatabaseJobDto>> getActiveJob() {
        DatabaseJobDto active = restoreService.getActiveJob();
        return ResponseEntity.ok(ApiResponse.success(active));
    }
}
