package com.cutletspring.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfigResponse {
    private String host;
    private int port;
    private String username;
    private boolean smtpAuth;
    private boolean smtpStarttls;
    private String fromEmail;
    private String fromName;
    private boolean enabled;
    private boolean passwordConfigured;
    private Instant updatedAt;
}

