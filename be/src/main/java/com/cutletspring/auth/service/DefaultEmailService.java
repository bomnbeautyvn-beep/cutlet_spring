package com.cutletspring.auth.service;

import com.cutletspring.email.service.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Backward-compatible wrapper delegating to the dynamic {@link EmailSenderService}.
 */
@Service
@RequiredArgsConstructor
public class DefaultEmailService implements EmailService {

    private final EmailSenderService emailSenderService;

    @Override
    public void sendPasswordResetOtp(String toEmail, String recipientName, String otp, int expiryMinutes) {
        emailSenderService.sendPasswordResetOtp(toEmail, recipientName, otp, expiryMinutes);
    }

    @Override
    public void sendPasswordResetConfirmation(String toEmail, String recipientName) {
        emailSenderService.sendPasswordResetConfirmation(toEmail, recipientName);
    }
}
