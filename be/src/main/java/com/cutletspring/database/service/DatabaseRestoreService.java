package com.cutletspring.database.service;

import com.cutletspring.database.dto.BackupPreviewResponse;
import com.cutletspring.database.dto.ConfirmRestoreRequest;
import com.cutletspring.database.dto.DatabaseJobDto;
import org.springframework.web.multipart.MultipartFile;

public interface DatabaseRestoreService {

    BackupPreviewResponse stageAndPreviewBackup(MultipartFile file, String adminEmail);

    DatabaseJobDto confirmAndStartRestore(ConfirmRestoreRequest request, String adminEmail);

    DatabaseJobDto getJobStatus(String jobId);

    DatabaseJobDto getActiveJob();
}
