package com.cutletspring.email.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "email_configurations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfiguration {

    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id;

    @Column(name = "host", nullable = false)
    private String host;

    @Column(name = "port", nullable = false)
    private int port;

    @Column(name = "username")
    private String username;

    @Column(name = "encrypted_password", columnDefinition = "TEXT")
    private String encryptedPassword;

    @Column(name = "smtp_auth", nullable = false)
    @Builder.Default
    private boolean smtpAuth = true;

    @Column(name = "smtp_starttls", nullable = false)
    @Builder.Default
    private boolean smtpStarttls = true;

    @Column(name = "from_email", nullable = false)
    private String fromEmail;

    @Column(name = "from_name", nullable = false)
    private String fromName;

    @Column(name = "enabled", nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

