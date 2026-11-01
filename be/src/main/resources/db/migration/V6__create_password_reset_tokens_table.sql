CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    reset_token_hash VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    consumed_at TIMESTAMP WITH TIME ZONE,
    attempt_count INT NOT NULL DEFAULT 0,
    resend_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pwd_reset_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pwd_reset_admin_id ON password_reset_tokens(admin_id);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_token_expires_at ON password_reset_tokens(token_expires_at);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_reset_token_hash ON password_reset_tokens(reset_token_hash);

