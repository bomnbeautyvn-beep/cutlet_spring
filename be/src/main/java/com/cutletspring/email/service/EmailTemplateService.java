package com.cutletspring.email.service;

import org.springframework.stereotype.Service;

/**
 * Renders branded, responsive HTML email templates for Cutlet Spring Atelier.
 */
@Service
public class EmailTemplateService {

    public String buildOtpEmailHtml(String recipientName, String otp, int expiryMinutes) {
        String safeName = recipientName != null && !recipientName.isBlank() ? recipientName : "Administrator";
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1b1c1a; }
                .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e8e3d8; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
                .header { background-color: #1b1c1a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #af101a; }
                .header h1 { color: #fbf9f6; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 2px; }
                .header p { color: #feae2c; margin: 6px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
                .content { padding: 36px 32px; }
                .otp-box { background-color: #fcfbf8; border: 2px dashed #af101a; border-radius: 8px; text-align: center; padding: 24px; margin: 28px 0; }
                .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #af101a; letter-spacing: 12px; margin: 0; }
                .footer { background-color: #faf8f5; padding: 20px 32px; border-top: 1px solid #eee8df; font-size: 11px; color: #7f7b75; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>봄돈까스 • CUTLET SPRING</h1>
                  <p>Artisanal Tonkatsu Atelier</p>
                </div>
                <div class="content">
                  <p style="font-size: 15px; margin-top: 0;">Hello, <strong>%s</strong>,</p>
                  <p style="line-height: 1.6; color: #3c3a37; font-size: 14px;">
                    A request was submitted to reset your administrative password for the Cutlet Spring back-office portal.
                    Please enter the one-time verification code below to proceed:
                  </p>
                  <div class="otp-box">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8c827a; margin-bottom: 8px; font-weight: 600;">One-Time Verification Code</div>
                    <div class="otp-code">%s</div>
                  </div>
                  <p style="font-size: 13px; color: #af101a; font-weight: 600; margin-bottom: 24px;">
                    ⚠️ This verification code expires in %d minutes and can only be used once.
                  </p>
                  <p style="font-size: 12px; line-height: 1.6; color: #66615b;">
                    If you did not request this password recovery, please ignore this email or notify your system administrator immediately. No changes have been made to your account.
                  </p>
                </div>
                <div class="footer">
                  <p style="margin: 0;">Cutlet Spring Atelier Security Operations • Automated Security Notification</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(safeName, otp, expiryMinutes);
    }

    public String buildConfirmationEmailHtml(String recipientName, String timestamp) {
        String safeName = recipientName != null && !recipientName.isBlank() ? recipientName : "Administrator";
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1b1c1a; }
                .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e8e3d8; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
                .header { background-color: #1b1c1a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #27ae60; }
                .header h1 { color: #fbf9f6; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 2px; }
                .content { padding: 36px 32px; }
                .status-badge { background-color: #eafaf1; color: #27ae60; padding: 10px 16px; border-radius: 6px; font-weight: 700; display: inline-block; margin-bottom: 20px; font-size: 13px; }
                .footer { background-color: #faf8f5; padding: 20px 32px; border-top: 1px solid #eee8df; font-size: 11px; color: #7f7b75; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>봄돈까스 • CUTLET SPRING</h1>
                </div>
                <div class="content">
                  <div class="status-badge">✓ Password Updated Successfully</div>
                  <p style="font-size: 15px; margin-top: 0;">Hello, <strong>%s</strong>,</p>
                  <p style="line-height: 1.6; color: #3c3a37; font-size: 14px;">
                    Your administrative account password for Cutlet Spring was successfully changed at <strong>%s</strong>.
                  </p>
                  <p style="line-height: 1.6; color: #3c3a37; font-size: 14px;">
                    As a security safeguard, all existing active sessions have been invalidated. You must log in using your newly established password.
                  </p>
                  <p style="font-size: 13px; color: #af101a; font-weight: 600; margin-top: 24px;">
                    If you did NOT authorize this change, please contact your security team immediately.
                  </p>
                </div>
                <div class="footer">
                  <p style="margin: 0;">Cutlet Spring Atelier Security Operations</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(safeName, timestamp);
    }

    public String buildTestEmailHtml(String recipientEmail, String senderName, String host, int port, String timestamp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1b1c1a; }
                .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e8e3d8; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
                .header { background-color: #1b1c1a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #27ae60; }
                .header h1 { color: #fbf9f6; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 2px; }
                .header p { color: #feae2c; margin: 6px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
                .content { padding: 36px 32px; }
                .status-badge { background-color: #eafaf1; color: #27ae60; padding: 10px 16px; border-radius: 6px; font-weight: 700; display: inline-block; margin-bottom: 20px; font-size: 13px; }
                .info-table { width: 100%%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
                .info-table td { padding: 8px 12px; border-bottom: 1px solid #eee8df; }
                .info-table td.label { font-weight: 600; color: #7f7b75; width: 35%%; }
                .info-table td.value { color: #1b1c1a; font-family: monospace; }
                .footer { background-color: #faf8f5; padding: 20px 32px; border-top: 1px solid #eee8df; font-size: 11px; color: #7f7b75; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>봄돈까스 • CUTLET SPRING</h1>
                  <p>Email &amp; SMTP Configuration Diagnostic</p>
                </div>
                <div class="content">
                  <div class="status-badge">✓ SMTP Relay Verified &amp; Active</div>
                  <p style="font-size: 15px; margin-top: 0;">Hello Administrator,</p>
                  <p style="line-height: 1.6; color: #3c3a37; font-size: 14px;">
                    This test message confirms that your database-backed SMTP configuration for Cutlet Spring is fully operational and capable of sending system notifications and OTP password resets.
                  </p>
                  <table class="info-table">
                    <tr>
                      <td class="label">SMTP Relay Host</td>
                      <td class="value">%s:%d</td>
                    </tr>
                    <tr>
                      <td class="label">Sender Identity</td>
                      <td class="value">%s</td>
                    </tr>
                    <tr>
                      <td class="label">Recipient Target</td>
                      <td class="value">%s</td>
                    </tr>
                    <tr>
                      <td class="label">Verification Time</td>
                      <td class="value">%s</td>
                    </tr>
                  </table>
                  <p style="font-size: 12px; line-height: 1.6; color: #66615b; margin-top: 20px;">
                    No further action is required. Your dynamic SMTP configuration took effect immediately without server restart.
                  </p>
                </div>
                <div class="footer">
                  <p style="margin: 0;">Cutlet Spring Atelier Portal • Diagnostics System</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(host, port, senderName, recipientEmail, timestamp);
    }
}

