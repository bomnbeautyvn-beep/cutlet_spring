package com.cutletspring.database.service;

import com.cutletspring.database.dto.DatabaseStatusDto;

import java.util.List;

public interface DatabaseMetadataService {

    DatabaseStatusDto getDatabaseStatus();

    List<String> getPublicTables();

    boolean verifyConnectivity();

    boolean verifyRequiredTables();

    boolean verifyAdminExists();

    boolean verifyFlywayCompatibility();
}
