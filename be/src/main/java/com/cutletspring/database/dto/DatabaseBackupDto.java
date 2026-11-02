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
public class DatabaseBackupDto {
    private String id;
    private String filename;
    private Long fileSizeBytes;
    private String fileSizeFormatted;
    private String status;
    private String backupType;
    private String checksumSha256;
    private Integer tableCount;
    private Instant createdAt;
    private String createdBy;
    private String notes;
}

