package com.cutletspring.auth.service;

public interface EmailService {

    /**
     * Sends a 6-digit password reset OTP email to the administrator.
     *
     * @param toEmail        Recipient email address
     * @param recipientName  Administrator full name
     * @param otp            6-digit OTP code (must not be logged)
     * @param expiryMinutes  Minutes until OTP expires
     */
    void sendPasswordResetOtp(String toEmail, String recipientName, String otp, int expiryMinutes);

    /**
     * Sends a security notification email confirming the password has been reset.
     *
     * @param toEmail        Recipient email address
     * @param recipientName  Administrator full name
     */
    void sendPasswordResetConfirmation(String toEmail, String recipientName);
}

