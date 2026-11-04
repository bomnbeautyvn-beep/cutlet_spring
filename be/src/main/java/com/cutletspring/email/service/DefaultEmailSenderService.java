package com.cutletspring.email.service;

import com.cutletspring.email.entity.EmailConfiguration;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultEmailSenderService implements EmailSenderService {

    private final EmailConfigurationService configService;
    private final DynamicJavaMailSenderFactory mailSenderFactory;
    private final EmailTemplateService templateService;

    @org.springframework.beans.factory.annotation.Value("${app.portal-url:http://localhost:3000/admin}")
    private String portalUrl;

    @Override
    public void sendPasswordResetOtp(String toEmail, String recipientName, String otp, int expiryMinutes) {
        String masked = maskEmail(toEmail);
        log.info("Preparing password reset OTP email for administrator [{}] ({})", recipientName, masked);

        EmailConfiguration config = configService.getConfiguration();
        if (!config.isEnabled()) {
            log.warn("Dynamic email service is currently disabled in settings. Skipping OTP dispatch to {}", masked);
            return;
        }

        try {
            JavaMailSenderImpl sender = getSender(config);
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(config.getFromEmail(), config.getFromName());
            helper.setTo(toEmail);
            helper.setSubject("[Cutlet Spring] Your Administrative Password Reset Code");

            String htmlBody = templateService.buildOtpEmailHtml(recipientName, otp, expiryMinutes);
            helper.setText(htmlBody, true);

            sender.send(message);
            log.info("Password reset OTP email successfully dispatched to {} via {}:{}", masked, config.getHost(), config.getPort());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to construct or send password reset email to {}: {}", masked, e.getMessage());
            throw new IllegalStateException("Failed to send password reset email: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error sending password reset email to {}: {}", masked, e.getMessage());
            throw new IllegalStateException("Email delivery service temporarily unavailable: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendPasswordResetConfirmation(String toEmail, String recipientName) {
        String masked = maskEmail(toEmail);
        log.info("Preparing password reset confirmation notification for administrator [{}] ({})", recipientName, masked);

        EmailConfiguration config = configService.getConfiguration();
        if (!config.isEnabled()) {
            log.warn("Dynamic email service is currently disabled in settings. Skipping confirmation dispatch to {}", masked);
            return;
        }

        try {
            JavaMailSenderImpl sender = getSender(config);
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(config.getFromEmail(), config.getFromName());
            helper.setTo(toEmail);
            helper.setSubject("[Cutlet Spring] Security Alert: Administrative Password Changed");

            String timestamp = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"))
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z"));
            String htmlBody = templateService.buildConfirmationEmailHtml(recipientName, timestamp);
            helper.setText(htmlBody, true);

            sender.send(message);
            log.info("Password change confirmation email dispatched to {} via {}:{}", masked, config.getHost(), config.getPort());
        } catch (Exception e) {
            log.warn("Failed to deliver password change confirmation notification to {}: {}", masked, e.getMessage());
        }
    }

    @Override
    public void sendTestEmail(String recipientEmail) {
        String masked = maskEmail(recipientEmail);
        log.info("Sending diagnostic test email to {}", masked);

        EmailConfiguration config = configService.getConfiguration();
        if (!config.isEnabled()) {
            throw new IllegalStateException("Email service is disabled. Enable email service before sending test emails.");
        }

        try {
            JavaMailSenderImpl sender = getSender(config);
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(config.getFromEmail(), config.getFromName());
            helper.setTo(recipientEmail);
            helper.setSubject("[Cutlet Spring] SMTP Configuration Test Verification");

            String timestamp = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"))
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z"));
            String htmlBody = templateService.buildTestEmailHtml(
                    recipientEmail,
                    config.getFromName(),
                    config.getHost(),
                    config.getPort(),
                    timestamp
            );
            helper.setText(htmlBody, true);

            sender.send(message);
            log.info("Diagnostic test email successfully delivered to {} via {}:{}", masked, config.getHost(), config.getPort());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send test email to {}: {}", masked, e.getMessage());
            throw new IllegalStateException("Failed to send test email: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error sending test email to {}: {}", masked, e.getMessage());
            throw new IllegalStateException("Email delivery service error: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendAccountWelcomeEmail(String toEmail, String recipientName, String role, String initialPassword) {
        String masked = maskEmail(toEmail);
        log.info("Preparing welcome email for new account [{}] ({}) with role [{}]", recipientName, masked, role);

        EmailConfiguration config = configService.getConfiguration();
        if (!config.isEnabled()) {
            log.warn("Dynamic email service is currently disabled in settings. Skipping welcome email dispatch to {}", masked);
            return;
        }

        try {
            JavaMailSenderImpl sender = getSender(config);
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(config.getFromEmail(), config.getFromName());
            helper.setTo(toEmail);
            helper.setSubject("[Cutlet Spring] Welcome to the Atelier - Your Account Credentials");

            String normalizedRole = (role != null && (role.contains("ADMIN") || role.equalsIgnoreCase("ROLE_ADMIN")))
                    ? "Administrator"
                    : "Staff";

            String htmlBody = templateService.buildWelcomeEmailHtml(
                    recipientName,
                    toEmail,
                    normalizedRole,
                    initialPassword,
                    portalUrl
            );
            helper.setText(htmlBody, true);

            sender.send(message);
            log.info("Welcome email successfully dispatched to {} via {}:{}", masked, config.getHost(), config.getPort());
        } catch (Exception e) {
            log.warn("Non-fatal: Failed to deliver welcome email to {}: {}", masked, e.getMessage());
        }
    }

    private JavaMailSenderImpl getSender(EmailConfiguration config) {
        String decryptedPassword = configService.getDecryptedPassword(config);
        return mailSenderFactory.getOrCreateSender(config, decryptedPassword);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        int atIndex = email.indexOf('@');
        String name = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        if (name.length() <= 2) {
            return name.charAt(0) + "***" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + domain;
    }
}

