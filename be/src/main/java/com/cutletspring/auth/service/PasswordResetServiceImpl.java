package com.cutletspring.auth.service;

import com.cutletspring.auth.dto.request.ChangePasswordRequest;
import com.cutletspring.auth.dto.request.ForgotPasswordRequest;
import com.cutletspring.auth.dto.request.ResetPasswordRequest;
import com.cutletspring.auth.dto.request.VerifyOtpRequest;
import com.cutletspring.auth.dto.response.VerifyOtpResponse;
import com.cutletspring.auth.entity.Admin;
import com.cutletspring.auth.entity.PasswordResetToken;
import com.cutletspring.auth.repository.AdminRepository;
import com.cutletspring.auth.repository.PasswordResetTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int TOKEN_EXPIRY_MINUTES = 10;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_RESEND_COUNT = 5;
    private static final int MAX_VERIFY_ATTEMPTS = 5;

    private final AdminRepository adminRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SessionRegistry sessionRegistry;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public void changePassword(Admin admin, ChangePasswordRequest request, HttpServletRequest httpRequest) {
        log.info("Processing password change for admin: {}", admin.getEmail());

        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        PasswordValidator.validateConfirmation(request.getNewPassword(), request.getConfirmNewPassword());

        if (passwordEncoder.matches(request.getNewPassword(), admin.getPasswordHash())) {
            throw new IllegalArgumentException("New password cannot be the same as your current password");
        }

        admin.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);

        // Invalidate current session and security context
        if (httpRequest != null) {
            HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                session.invalidate();
            }
        }
        SecurityContextHolder.clearContext();

        // Invalidate all concurrent sessions tracked for this administrator
        invalidateAllSessionsForUser(admin.getEmail());

        // Send confirmation email
        emailService.sendPasswordResetConfirmation(admin.getEmail(), admin.getFullName());

        log.info("Password successfully changed for admin: {}", admin.getEmail());
    }

    @Override
    @Transactional
    public String requestForgotPasswordOtp(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        log.info("Received password reset request for email");

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isEmpty() || !adminOpt.get().isActive()) {
            log.info("Admin account not found or inactive. Returning generic response.");
            return "If the account exists, password reset instructions have been sent.";
        }

        Admin admin = adminOpt.get();

        // Check recent OTP request for cooldown
        Optional<PasswordResetToken> latestTokenOpt = passwordResetTokenRepository
                .findFirstByAdminIdAndConsumedAtIsNullOrderByCreatedAtDesc(admin.getId());

        int resendCount = 0;
        if (latestTokenOpt.isPresent()) {
            PasswordResetToken latest = latestTokenOpt.get();
            long secondsSinceCreation = Duration.between(latest.getCreatedAt(), Instant.now()).getSeconds();

            if (secondsSinceCreation < RESEND_COOLDOWN_SECONDS) {
                long waitTime = RESEND_COOLDOWN_SECONDS - secondsSinceCreation;
                throw new IllegalStateException("Please wait " + waitTime + " seconds before requesting a new verification code.");
            }

            if (latest.getResendCount() >= MAX_RESEND_COUNT) {
                throw new IllegalStateException("Maximum verification code requests exceeded. Please try again later.");
            }
            resendCount = latest.getResendCount() + 1;

            // Invalidate old token
            latest.setConsumedAt(Instant.now());
            passwordResetTokenRepository.save(latest);
        }

        // Generate 6-digit numeric OTP
        int otpNumber = secureRandom.nextInt(900_000) + 100_000;
        String otp = String.valueOf(otpNumber);

        // Send email FIRST. If sending fails, exception propagates and NO token record is created
        emailService.sendPasswordResetOtp(admin.getEmail(), admin.getFullName(), otp, OTP_EXPIRY_MINUTES);

        // Store hashed OTP
        PasswordResetToken resetRecord = PasswordResetToken.builder()
                .admin(admin)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(Instant.now().plus(Duration.ofMinutes(OTP_EXPIRY_MINUTES)))
                .attemptCount(0)
                .resendCount(resendCount)
                .build();

        passwordResetTokenRepository.save(resetRecord);
        log.info("Stored hashed OTP for password reset record");

        return "If the account exists, password reset instructions have been sent.";
    }

    @Override
    @Transactional(noRollbackFor = IllegalArgumentException.class)
    public VerifyOtpResponse verifyResetOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String otp = request.getOtp().trim();

        PasswordResetToken token = passwordResetTokenRepository
                .findFirstByAdminEmailAndConsumedAtIsNullOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired verification code. Please request a new one."));

        if (token.isOtpExpired()) {
            token.setConsumedAt(Instant.now());
            passwordResetTokenRepository.save(token);
            throw new IllegalArgumentException("Verification code has expired. Please request a new one.");
        }

        if (token.isVerified()) {
            throw new IllegalArgumentException("This verification code has already been used. Please request a new code.");
        }

        if (token.getAttemptCount() >= MAX_VERIFY_ATTEMPTS) {
            token.setConsumedAt(Instant.now());
            passwordResetTokenRepository.save(token);
            throw new IllegalArgumentException("Maximum verification attempts exceeded. Please request a new verification code.");
        }

        // Compare OTP
        if (!passwordEncoder.matches(otp, token.getOtpHash())) {
            token.setAttemptCount(token.getAttemptCount() + 1);
            passwordResetTokenRepository.save(token);
            int remaining = MAX_VERIFY_ATTEMPTS - token.getAttemptCount();
            if (remaining <= 0) {
                token.setConsumedAt(Instant.now());
                passwordResetTokenRepository.save(token);
                throw new IllegalArgumentException("Maximum verification attempts exceeded. Please request a new verification code.");
            }
            throw new IllegalArgumentException("Invalid verification code. " + remaining + " attempts remaining.");
        }

        // OTP matched - Generate secure single-use reset token
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String rawResetToken = HexFormat.of().formatHex(randomBytes);

        token.setVerifiedAt(Instant.now());
        token.setResetTokenHash(PasswordResetService.sha256Hex(rawResetToken));
        token.setTokenExpiresAt(Instant.now().plus(Duration.ofMinutes(TOKEN_EXPIRY_MINUTES)));
        passwordResetTokenRepository.save(token);

        log.info("OTP verified successfully. Issued reset token for account");

        return VerifyOtpResponse.builder()
                .resetToken(rawResetToken)
                .expiresInSeconds(Duration.ofMinutes(TOKEN_EXPIRY_MINUTES).toSeconds())
                .build();
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String rawToken = request.getResetToken().trim();

        PasswordValidator.validateConfirmation(request.getNewPassword(), request.getConfirmNewPassword());

        String tokenHash = PasswordResetService.sha256Hex(rawToken);
        PasswordResetToken token = passwordResetTokenRepository
                .findByResetTokenHashAndConsumedAtIsNull(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid, expired, or already used reset token. Please restart the reset process."));

        if (!token.getAdmin().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Reset token does not match the specified account.");
        }

        if (!token.isVerified() || token.isTokenExpired()) {
            token.setConsumedAt(Instant.now());
            passwordResetTokenRepository.save(token);
            throw new IllegalArgumentException("Reset token has expired. Please restart the password reset process.");
        }

        Admin admin = token.getAdmin();

        if (passwordEncoder.matches(request.getNewPassword(), admin.getPasswordHash())) {
            throw new IllegalArgumentException("New password cannot be the same as your previous password.");
        }

        // Update password
        admin.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);

        // Mark token consumed
        token.setConsumedAt(Instant.now());
        passwordResetTokenRepository.save(token);

        // Invalidate all other active reset tokens for this admin
        List<PasswordResetToken> otherTokens = passwordResetTokenRepository.findAllByAdminIdAndConsumedAtIsNull(admin.getId());
        for (PasswordResetToken t : otherTokens) {
            t.setConsumedAt(Instant.now());
        }
        passwordResetTokenRepository.saveAll(otherTokens);

        // Invalidate any active sessions for this administrator
        invalidateAllSessionsForUser(admin.getEmail());

        // Send confirmation email
        emailService.sendPasswordResetConfirmation(admin.getEmail(), admin.getFullName());

        log.info("Password successfully reset via OTP recovery for admin: {}", admin.getEmail());
    }

    private void invalidateAllSessionsForUser(String username) {
        try {
            for (Object principal : sessionRegistry.getAllPrincipals()) {
                String principalName = null;
                if (principal instanceof UserDetails ud) {
                    principalName = ud.getUsername();
                } else if (principal != null) {
                    principalName = principal.toString();
                }

                if (principalName != null && principalName.equalsIgnoreCase(username)) {
                    for (SessionInformation session : sessionRegistry.getAllSessions(principal, false)) {
                        session.expireNow();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not invalidate sessions for user {}: {}", username, e.getMessage());
        }
    }
}

