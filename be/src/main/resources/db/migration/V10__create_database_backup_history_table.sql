-- V10: Create Database Backup History table
CREATE TABLE IF NOT EXISTS database_backup_history (
    id VARCHAR(36) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    backup_type VARCHAR(50) NOT NULL,
    checksum_sha256 VARCHAR(64),
    table_count INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_db_backup_created_at ON database_backup_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_db_backup_status ON database_backup_history(status);

