package com.cutletspring.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultEmailService implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@cutletspring.com}")
    private String fromAddress;

    @Value("${app.mail.from-name:Cutlet Spring Security}")
    private String fromName;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Override
    public void sendPasswordResetOtp(String toEmail, String recipientName, String otp, int expiryMinutes) {
        String masked = maskEmail(toEmail);
        log.info("Preparing password reset OTP email for administrator [{}] ({})", recipientName, masked);

        if (!mailEnabled) {
            log.warn("Email service is disabled by configuration. Skipping dispatch to {}", masked);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("[Cutlet Spring] Your Administrative Password Reset Code");

            String htmlBody = buildOtpEmailHtml(recipientName, otp, expiryMinutes);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Password reset OTP email successfully dispatched to {}", masked);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to construct or send password reset email to {}: {}", masked, e.getMessage());
            throw new IllegalStateException("Failed to send password reset email. Please try again later.", e);
        } catch (Exception e) {
            log.error("Unexpected error sending password reset email to {}: {}", masked, e.getMessage());
            throw new IllegalStateException("Email delivery service temporarily unavailable.", e);
        }
    }

    @Override
    public void sendPasswordResetConfirmation(String toEmail, String recipientName) {
        String masked = maskEmail(toEmail);
        log.info("Preparing password reset confirmation notification for administrator [{}] ({})", recipientName, masked);

        if (!mailEnabled) {
            log.warn("Email service is disabled by configuration. Skipping confirmation dispatch to {}", masked);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("[Cutlet Spring] Security Alert: Administrative Password Changed");

            String timestamp = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"))
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z"));
            String htmlBody = buildConfirmationEmailHtml(recipientName, timestamp);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Password change confirmation email dispatched to {}", masked);
        } catch (Exception e) {
            // Confirmation alert should not break transaction if delivery fails, but must log warning
            log.warn("Failed to deliver password change confirmation notification to {}: {}", masked, e.getMessage());
        }
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

    private String buildOtpEmailHtml(String recipientName, String otp, int expiryMinutes) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1b1c1a; }
                .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e8e3d8; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
                .header { background-color: #1b1c1a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #af101a; }
                .header h1 { color: #fbf9f6; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px; }
                .header p { color: #d0c8b8; margin: 6px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
                .content { padding: 36px 32px; }
                .otp-box { background-color: #fcfbf8; border: 2px dashed #af101a; border-radius: 8px; text-align: center; padding: 24px; margin: 28px 0; }
                .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 700; color: #af101a; letter-spacing: 12px; margin: 0; }
                .footer { background-color: #faf8f5; padding: 20px 32px; border-top: 1px solid #eee8df; font-size: 12px; color: #7f7b75; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>봄돈까스 • CUTLET SPRING</h1>
                  <p>Artisanal Tonkatsu Atelier</p>
                </div>
                <div class="content">
                  <p style="font-size: 16px; margin-top: 0;">Hello, <strong>%s</strong>,</p>
                  <p style="line-height: 1.6; color: #3c3a37;">
                    A request was submitted to reset your administrative password for the Cutlet Spring back-office portal.
                    Please enter the one-time verification code below to proceed:
                  </p>
                  <div class="otp-box">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #8c827a; margin-bottom: 8px;">Single-Use Verification Code</div>
                    <div class="otp-code">%s</div>
                  </div>
                  <p style="font-size: 14px; color: #c0392b; font-weight: 600; margin-bottom: 24px;">
                    ⚠️ This verification code expires in %d minutes and can only be used once.
                  </p>
                  <p style="font-size: 13px; line-height: 1.6; color: #66615b;">
                    If you did not request this password recovery, please ignore this email or notify your system administrator immediately. No changes have been made to your account.
                  </p>
                </div>
                <div class="footer">
                  <p style="margin: 0;">Cutlet Spring Atelier Security Operations • Automated System Message</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(recipientName, otp, expiryMinutes);
    }

    private String buildConfirmationEmailHtml(String recipientName, String timestamp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1b1c1a; }
                .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e8e3d8; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
                .header { background-color: #1b1c1a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #27ae60; }
                .header h1 { color: #fbf9f6; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px; }
                .content { padding: 36px 32px; }
                .status-badge { background-color: #eafaf1; color: #27ae60; padding: 12px 18px; border-radius: 6px; font-weight: 600; display: inline-block; margin-bottom: 20px; }
                .footer { background-color: #faf8f5; padding: 20px 32px; border-top: 1px solid #eee8df; font-size: 12px; color: #7f7b75; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>봄돈까스 • CUTLET SPRING</h1>
                </div>
                <div class="content">
                  <div class="status-badge">✓ Password Updated Successfully</div>
                  <p style="font-size: 16px; margin-top: 0;">Hello, <strong>%s</strong>,</p>
                  <p style="line-height: 1.6; color: #3c3a37;">
                    Your administrative account password for Cutlet Spring was successfully changed at <strong>%s</strong>.
                  </p>
                  <p style="line-height: 1.6; color: #3c3a37;">
                    As a security safeguard, all existing active sessions have been invalidated. You must log in using your newly established password.
                  </p>
                  <p style="font-size: 13px; color: #c0392b; font-weight: 600; margin-top: 24px;">
                    If you did NOT authorize this change, please contact your security team immediately.
                  </p>
                </div>
                <div class="footer">
                  <p style="margin: 0;">Cutlet Spring Atelier Security Operations</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(recipientName, timestamp);
    }
}

