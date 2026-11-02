package com.cutletspring.database.service;

import com.cutletspring.database.dto.DatabaseJobDto;
import com.cutletspring.database.dto.DatabaseStatusDto;
import com.cutletspring.database.entity.DatabaseBackupHistory;
import com.cutletspring.database.repository.DatabaseBackupHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseMetadataServiceImpl implements DatabaseMetadataService {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;
    private final DatabaseBackupHistoryRepository backupHistoryRepository;
    private final MaintenanceModeService maintenanceModeService;

    @Override
    public DatabaseStatusDto getDatabaseStatus() {
        boolean connected = false;
        String dbType = "Unknown";
        String dbVersion = "Unknown";
        String dbName = "Unknown";
        String dbSizeFormatted = "Unknown";
        Long dbSizeBytes = null;
        int tableCount = 0;
        long totalRecords = 0;

        try (Connection conn = dataSource.getConnection()) {
            connected = !conn.isClosed();
            DatabaseMetaData metaData = conn.getMetaData();
            dbType = metaData.getDatabaseProductName();
            dbVersion = metaData.getDatabaseProductVersion();
            dbName = conn.getCatalog() != null ? conn.getCatalog() : "cutlet_spring";

            // Table count in public schema
            List<String> tables = getPublicTables();
            tableCount = tables.size();

            // Try postgres-specific size queries
            if (dbType.toLowerCase(Locale.ROOT).contains("postgresql")) {
                try {
                    dbSizeFormatted = jdbcTemplate.queryForObject(
                            "SELECT pg_size_pretty(pg_database_size(current_database()))", String.class);
                    dbSizeBytes = jdbcTemplate.queryForObject(
                            "SELECT pg_database_size(current_database())", Long.class);
                } catch (Exception e) {
                    log.debug("Could not query PostgreSQL database size: {}", e.getMessage());
                }

                try {
                    Long recCount = jdbcTemplate.queryForObject(
                            "SELECT COALESCE(SUM(n_live_tup), 0) FROM pg_stat_user_tables", Long.class);
                    if (recCount != null) {
                        totalRecords = recCount;
                    }
                } catch (Exception e) {
                    log.debug("Could not query PostgreSQL live row counts: {}", e.getMessage());
                }
            } else {
                // Fallback for H2 or generic database
                dbSizeFormatted = "In-Memory / Test";
                for (String tbl : tables) {
                    try {
                        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tbl, Long.class);
                        if (count != null) {
                            totalRecords += count;
                        }
                    } catch (Exception ignored) {
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to query database metadata: {}", e.getMessage());
        }

        // Last successful backup
        Optional<DatabaseBackupHistory> lastBackup = backupHistoryRepository
                .findFirstByStatusOrderByCreatedAtDesc("COMPLETED");

        return DatabaseStatusDto.builder()
                .connected(connected)
                .databaseType(dbType)
                .databaseVersion(dbVersion)
                .databaseName(dbName)
                .databaseSize(dbSizeFormatted)
                .databaseSizeBytes(dbSizeBytes)
                .tableCount(tableCount)
                .totalRecords(totalRecords)
                .lastBackupTime(lastBackup.map(DatabaseBackupHistory::getCreatedAt).orElse(null))
                .lastBackupFilename(lastBackup.map(DatabaseBackupHistory::getFilename).orElse(null))
                .maintenanceMode(maintenanceModeService.isMaintenanceMode())
                .maintenanceReason(maintenanceModeService.getMaintenanceReason())
                .activeJob(null)
                .build();
    }

    @Override
    public List<String> getPublicTables() {
        try {
            return jdbcTemplate.query(
                    "SELECT table_name FROM information_schema.tables WHERE (table_schema = 'public' OR table_schema = 'PUBLIC') AND table_type = 'BASE TABLE' ORDER BY table_name",
                    (rs, rowNum) -> rs.getString("table_name").toLowerCase(Locale.ROOT)
            );
        } catch (Exception e) {
            log.error("Failed to fetch public tables: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public boolean verifyConnectivity() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (Exception e) {
            log.error("Database connectivity verification failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean verifyRequiredTables() {
        try {
            List<String> tables = getPublicTables();
            List<String> required = List.of("admins", "menu_items", "restaurant_settings", "flyway_schema_history");
            for (String req : required) {
                if (!tables.contains(req.toLowerCase(Locale.ROOT))) {
                    log.error("Verification failed: required table '{}' is missing from schema", req);
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            log.error("Required tables check encountered error: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean verifyAdminExists() {
        try {
            Integer adminCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM admins WHERE active = true", Integer.class);
            return adminCount != null && adminCount > 0;
        } catch (Exception e) {
            log.error("Admin account verification check failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean verifyFlywayCompatibility() {
        try {
            Boolean success = jdbcTemplate.queryForObject(
                    "SELECT success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 1", Boolean.class);
            return Boolean.TRUE.equals(success);
        } catch (Exception e) {
            log.error("Flyway schema history compatibility check failed: {}", e.getMessage());
            return false;
        }
    }
}
