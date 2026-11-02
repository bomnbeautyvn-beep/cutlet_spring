package com.cutletspring.database.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatabaseStatusDto {
    private boolean connected;
    private String databaseType;
    private String databaseVersion;
    private String databaseName;
    private String databaseSize;
    private Long databaseSizeBytes;
    private int tableCount;
    private long totalRecords;
    private Instant lastBackupTime;
    private String lastBackupFilename;
    private boolean maintenanceMode;
    private String maintenanceReason;
    private DatabaseJobDto activeJob;
}
