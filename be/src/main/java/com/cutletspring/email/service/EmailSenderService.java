package com.cutletspring.email.service;

public interface EmailSenderService {

    /**
     * Sends a 6-digit password reset OTP email using dynamic database configuration.
     */
    void sendPasswordResetOtp(String toEmail, String recipientName, String otp, int expiryMinutes);

    /**
     * Sends a password reset confirmation notification email.
     */
    void sendPasswordResetConfirmation(String toEmail, String recipientName);

    /**
     * Sends a diagnostic test email to verify end-to-end SMTP dispatch.
     */
    void sendTestEmail(String recipientEmail);

    /**
     * Sends a welcome notification email to a newly created administrative or staff account,
     * including login credentials, portal access link, and recommendations to change password.
     */
    void sendAccountWelcomeEmail(String toEmail, String recipientName, String role, String initialPassword);
}

