package com.cutletspring.database.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackupPreviewResponse {
    private String stagingToken;
    private String filename;
    private Long fileSizeBytes;
    private String fileSizeFormatted;
    private String pgDumpVersion;
    private String archiveCreatedAt;
    private String sourceDatabaseName;
    private List<String> tables;
    private int tableCount;
    private boolean hasFlywayHistory;
    private boolean hasAdminTable;
    private List<String> warnings;
    private String destructiveWarningMessage;
}

