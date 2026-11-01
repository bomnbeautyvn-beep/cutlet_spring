-- V9: Create Email & SMTP Configuration table
CREATE TABLE IF NOT EXISTS email_configurations (
    id VARCHAR(50) PRIMARY KEY,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    username VARCHAR(255),
    encrypted_password TEXT,
    smtp_auth BOOLEAN NOT NULL DEFAULT TRUE,
    smtp_starttls BOOLEAN NOT NULL DEFAULT TRUE,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial default configuration row
INSERT INTO email_configurations (
    id, host, port, username, encrypted_password,
    smtp_auth, smtp_starttls, from_email, from_name,
    enabled, created_at, updated_at
) VALUES (
    'default',
    'smtp.gmail.com',
    587,
    '',
    NULL,
    TRUE,
    TRUE,
    'noreply@cutletspring.com',
    'Cutlet Spring Security',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

