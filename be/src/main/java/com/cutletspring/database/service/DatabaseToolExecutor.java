package com.cutletspring.database.service;

import com.cutletspring.database.model.DatabaseConnectionInfo;

import java.io.File;

public interface DatabaseToolExecutor {

    boolean isToolsAvailable();

    boolean validateDumpHeader(File archiveFile);

    void executeDump(DatabaseConnectionInfo connInfo, File targetFile);

    String executeRestoreList(File archiveFile);

    void executeRestore(DatabaseConnectionInfo connInfo, File archiveFile);
}

