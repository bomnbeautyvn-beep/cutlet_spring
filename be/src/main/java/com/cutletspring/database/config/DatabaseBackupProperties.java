package com.cutletspring.database.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.database")
public class DatabaseBackupProperties {

    private Backup backup = new Backup();
    private Tools tools = new Tools();

    @Data
    public static class Backup {
        private String dir = "backups";
        private long maxFileSize = 104857600L; // 100 MB default
    }

    @Data
    public static class Tools {
        private String pgDumpPath = "pg_dump";
        private String pgRestorePath = "pg_restore";
    }
}
