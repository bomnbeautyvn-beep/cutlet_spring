package com.cutletspring.email.controller;

import com.cutletspring.email.dto.EmailConfigResponse;
import com.cutletspring.email.dto.SendTestEmailRequest;
import com.cutletspring.email.dto.UpdateEmailConfigRequest;
import com.cutletspring.email.service.EmailConfigurationService;
import com.cutletspring.email.service.EmailSenderService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/settings/email")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Email Settings", description = "Endpoints for managing database-backed SMTP configuration")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEmailSettingsController {

    private final EmailConfigurationService configService;
    private final EmailSenderService senderService;

    @GetMapping
    @Operation(summary = "Get current email and SMTP configuration")
    public ResponseEntity<ApiResponse<EmailConfigResponse>> getEmailConfig() {
        EmailConfigResponse config = configService.getConfigResponse();
        return ResponseEntity.ok(ApiResponse.success(config));
    }

    @PutMapping
    @Operation(summary = "Update email and SMTP configuration")
    public ResponseEntity<ApiResponse<EmailConfigResponse>> updateEmailConfig(
            @Valid @RequestBody UpdateEmailConfigRequest request
    ) {
        log.info("Administrator updating SMTP configuration for host [{}:{}]", request.getHost(), request.getPort());
        EmailConfigResponse updated = configService.updateConfiguration(request);
        return ResponseEntity.ok(ApiResponse.success("Email configuration updated successfully.", updated));
    }

    @PostMapping("/test-connection")
    @Operation(summary = "Test SMTP transport connection and authentication")
    public ResponseEntity<ApiResponse<String>> testSmtpConnection() {
        log.info("Administrator initiated SMTP connection diagnostic test");
        configService.testConnection();
        return ResponseEntity.ok(ApiResponse.success("SMTP connection and authentication verified successfully.", null));
    }

    @PostMapping("/send-test")
    @Operation(summary = "Dispatch a diagnostic test email to the specified recipient")
    public ResponseEntity<ApiResponse<String>> sendTestEmail(
            @Valid @RequestBody SendTestEmailRequest request
    ) {
        log.info("Administrator initiated diagnostic test email dispatch to target email");
        senderService.sendTestEmail(request.getRecipientEmail());
        return ResponseEntity.ok(ApiResponse.success("Test email dispatched successfully to " + request.getRecipientEmail(), null));
    }
}

