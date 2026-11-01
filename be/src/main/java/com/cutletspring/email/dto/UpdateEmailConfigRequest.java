package com.cutletspring.email.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmailConfigRequest {

    @NotBlank(message = "SMTP host is required")
    private String host;

    @NotNull(message = "SMTP port is required")
    @Min(value = 1, message = "Port must be at least 1")
    @Max(value = 65535, message = "Port cannot exceed 65535")
    private Integer port;

    private String username;

    /**
     * Optional newly entered password. If left empty or null, the existing encrypted password is preserved.
     */
    private String password;

    @Builder.Default
    private boolean smtpAuth = true;

    @Builder.Default
    private boolean smtpStarttls = true;

    @NotBlank(message = "From email address is required")
    @Email(message = "Invalid from email address format")
    private String fromEmail;

    @NotBlank(message = "From display name is required")
    private String fromName;

    @Builder.Default
    private boolean enabled = true;
}

