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
public class DatabaseJobDto {
    private String jobId;
    private String jobType; // EXPORT, RESTORE
    private String status;  // PENDING, RUNNING, CREATING_SAFETY_BACKUP, RESTORING, VERIFYING, COMPLETED, FAILED, ROLLED_BACK
    private int progressPercentage;
    private String currentStepMessage;
    private Instant startedAt;
    private Instant completedAt;
    private String error;
}
