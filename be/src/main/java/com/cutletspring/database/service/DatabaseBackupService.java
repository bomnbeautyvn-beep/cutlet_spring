package com.cutletspring.database.service;

import com.cutletspring.database.dto.DatabaseBackupDto;
import com.cutletspring.database.model.DatabaseConnectionInfo;

import java.io.File;
import java.util.List;

public interface DatabaseBackupService {

    DatabaseBackupDto exportDatabase(String adminEmail, String notes);

    DatabaseBackupDto createSafetyBackup(String adminEmail);

    List<DatabaseBackupDto> listBackups();

    File getBackupFileForDownload(String backupId);

    void deleteBackup(String backupId);

    DatabaseConnectionInfo getConnectionInfo();
}

