package com.cutletspring.email.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

/**
 * Renders branded, responsive HTML email templates for Cutlet Spring Atelier using Thymeleaf.
 */
@Service
@RequiredArgsConstructor
public class EmailTemplateService {

    private final ITemplateEngine templateEngine;

    public String buildOtpEmailHtml(String recipientName, String otp, int expiryMinutes) {
        Context context = new Context();
        context.setVariable("recipientName", (recipientName != null && !recipientName.isBlank()) ? recipientName : "Administrator");
        context.setVariable("otp", otp);
        context.setVariable("expiryMinutes", expiryMinutes);
        return templateEngine.process("email/otp-email", context);
    }

    public String buildConfirmationEmailHtml(String recipientName, String timestamp) {
        Context context = new Context();
        context.setVariable("recipientName", (recipientName != null && !recipientName.isBlank()) ? recipientName : "Administrator");
        context.setVariable("timestamp", timestamp);
        return templateEngine.process("email/confirmation-email", context);
    }

    public String buildTestEmailHtml(String recipientEmail, String senderName, String host, int port, String timestamp) {
        Context context = new Context();
        context.setVariable("recipientEmail", recipientEmail);
        context.setVariable("senderName", senderName);
        context.setVariable("host", host);
        context.setVariable("port", port);
        context.setVariable("timestamp", timestamp);
        return templateEngine.process("email/test-email", context);
    }

    public String buildWelcomeEmailHtml(
            String recipientName,
            String email,
            String role,
            String initialPassword,
            String loginUrl
    ) {
        Context context = new Context();
        context.setVariable("recipientName", (recipientName != null && !recipientName.isBlank()) ? recipientName : "Team Member");
        context.setVariable("email", email);
        context.setVariable("role", role);
        context.setVariable("initialPassword", initialPassword);
        context.setVariable("loginUrl", (loginUrl != null && !loginUrl.isBlank()) ? loginUrl : "http://localhost:3000/admin");
        return templateEngine.process("email/welcome-email", context);
    }
}
