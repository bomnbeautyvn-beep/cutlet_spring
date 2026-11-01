package com.cutletspring.auth;

import com.cutletspring.auth.controller.AuthController;
import com.cutletspring.auth.dto.request.*;
import com.cutletspring.auth.dto.response.VerifyOtpResponse;
import com.cutletspring.auth.entity.Admin;
import com.cutletspring.auth.entity.PasswordResetToken;
import com.cutletspring.auth.repository.AdminRepository;
import com.cutletspring.auth.repository.PasswordResetTokenRepository;
import com.cutletspring.auth.service.EmailService;
import com.cutletspring.auth.service.PasswordResetService;
import com.cutletspring.auth.service.PasswordValidator;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class PasswordRecoveryTests {

    @Autowired
    private AuthController authController;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private EmailService emailService;

    private Admin testAdmin;

    @BeforeEach
    void setUp() {
        passwordResetTokenRepository.deleteAll();

        // Ensure default test admin has known password
        testAdmin = adminRepository.findByEmail("admin@cutletspring.com").orElseGet(() -> {
            Admin newAdmin = Admin.builder()
                    .email("admin@cutletspring.com")
                    .fullName("Cutlet Spring Admin")
                    .role("ROLE_ADMIN")
                    .active(true)
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .build();
            return adminRepository.save(newAdmin);
        });

        testAdmin.setPasswordHash(passwordEncoder.encode("admin123"));
        adminRepository.save(testAdmin);

        reset(emailService);
    }

    // ----------------------------------------------------
    // Change Password Tests
    // ----------------------------------------------------

    @Test
    @DisplayName("Change Password - Successfully changes password and invalidates session")
    void testChangePasswordSuccess() {
        var auth = new UsernamePasswordAuthenticationToken(
                testAdmin.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpSession session = new MockHttpSession();
        request.setSession(session);

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("admin123")
                .newPassword("ArtisanalP@ssw0rd2026!")
                .confirmNewPassword("ArtisanalP@ssw0rd2026!")
                .build();

        ResponseEntity<ApiResponse<Void>> response = authController.changePassword(changeReq, auth, request);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        assertTrue(session.isInvalid(), "Session must be invalidated upon successful password change");

        // Verify password in DB updated
        Admin updated = adminRepository.findByEmail(testAdmin.getEmail()).orElseThrow();
        assertTrue(passwordEncoder.matches("ArtisanalP@ssw0rd2026!", updated.getPasswordHash()));

        // Confirmation email dispatched
        verify(emailService, times(1)).sendPasswordResetConfirmation(eq(testAdmin.getEmail()), anyString());
    }

    @Test
    @DisplayName("Change Password - Rejects incorrect current password")
    void testChangePasswordIncorrectCurrentPassword() {
        var auth = new UsernamePasswordAuthenticationToken(
                testAdmin.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("wrongCurrentPassword")
                .newPassword("ArtisanalP@ssw0rd2026!")
                .confirmNewPassword("ArtisanalP@ssw0rd2026!")
                .build();

        assertThrows(BadCredentialsException.class, () ->
                authController.changePassword(changeReq, auth, new MockHttpServletRequest())
        );
    }

    @Test
    @DisplayName("Change Password - Rejects weak password failing policy")
    void testChangePasswordWeakPassword() {
        var auth = new UsernamePasswordAuthenticationToken(
                testAdmin.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        // Lacks special character and uppercase
        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("admin123")
                .newPassword("weakpassword1")
                .confirmNewPassword("weakpassword1")
                .build();

        assertThrows(IllegalArgumentException.class, () ->
                authController.changePassword(changeReq, auth, new MockHttpServletRequest())
        );
    }

    @Test
    @DisplayName("Change Password - Rejects password confirmation mismatch")
    void testChangePasswordConfirmationMismatch() {
        var auth = new UsernamePasswordAuthenticationToken(
                testAdmin.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("admin123")
                .newPassword("ArtisanalP@ssw0rd2026!")
                .confirmNewPassword("MismatchP@ssw0rd2026!")
                .build();

        assertThrows(IllegalArgumentException.class, () ->
                authController.changePassword(changeReq, auth, new MockHttpServletRequest())
        );
    }

    @Test
    @DisplayName("Change Password - Rejects new password identical to current password")
    void testChangePasswordSameAsCurrentPassword() {
        var auth = new UsernamePasswordAuthenticationToken(
                testAdmin.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("admin123")
                .newPassword("admin123")
                .confirmNewPassword("admin123")
                .build();

        assertThrows(IllegalArgumentException.class, () ->
                authController.changePassword(changeReq, auth, new MockHttpServletRequest())
        );
    }

    // ----------------------------------------------------
    // Forgot Password & OTP Flow Tests
    // ----------------------------------------------------

    @Test
    @DisplayName("Forgot Password - Requests OTP and dispatches email for valid admin")
    void testForgotPasswordOtpRequestSuccess() {
        ForgotPasswordRequest req = ForgotPasswordRequest.builder()
                .email("admin@cutletspring.com")
                .build();

        ResponseEntity<ApiResponse<Void>> response = authController.forgotPassword(req);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("If the account exists, password reset instructions have been sent.", response.getBody().getMessage());

        // Verify email sent with OTP
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService, times(1)).sendPasswordResetOtp(
                eq("admin@cutletspring.com"), anyString(), otpCaptor.capture(), eq(5)
        );

        String capturedOtp = otpCaptor.getValue();
        assertNotNull(capturedOtp);
        assertEquals(6, capturedOtp.length());

        // Verify DB stores hashed OTP, never plain text
        PasswordResetToken savedToken = passwordResetTokenRepository
                .findFirstByAdminEmailAndConsumedAtIsNullOrderByCreatedAtDesc("admin@cutletspring.com")
                .orElseThrow();

        assertNotEquals(capturedOtp, savedToken.getOtpHash(), "Raw OTP must never be persisted in PostgreSQL");
        assertTrue(passwordEncoder.matches(capturedOtp, savedToken.getOtpHash()), "Stored hash must match BCrypt verification");
    }

    @Test
    @DisplayName("Forgot Password - Returns generic message for non-existent email without creating tokens")
    void testForgotPasswordGenericResponseUnknownEmail() {
        ForgotPasswordRequest req = ForgotPasswordRequest.builder()
                .email("unknown_hacker@evil.com")
                .build();

        ResponseEntity<ApiResponse<Void>> response = authController.forgotPassword(req);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("If the account exists, password reset instructions have been sent.", response.getBody().getMessage());

        verify(emailService, never()).sendPasswordResetOtp(anyString(), anyString(), anyString(), anyInt());
        assertEquals(0, passwordResetTokenRepository.count());
    }

    @Test
    @DisplayName("Forgot Password - Enforces resend cooldown rate limit")
    void testForgotPasswordResendRateLimit() {
        ForgotPasswordRequest req = ForgotPasswordRequest.builder()
                .email("admin@cutletspring.com")
                .build();

        // First request succeeds
        authController.forgotPassword(req);

        // Immediate second request must trigger cooldown rate limit exception
        assertThrows(IllegalStateException.class, () -> authController.forgotPassword(req));
    }

    @Test
    @DisplayName("Forgot Password - Does not store token record if email delivery fails")
    void testForgotPasswordEmailDeliveryFailure() {
        doThrow(new IllegalStateException("SMTP connection timed out"))
                .when(emailService).sendPasswordResetOtp(anyString(), anyString(), anyString(), anyInt());

        ForgotPasswordRequest req = ForgotPasswordRequest.builder()
                .email("admin@cutletspring.com")
                .build();

        assertThrows(IllegalStateException.class, () -> authController.forgotPassword(req));
        assertEquals(0, passwordResetTokenRepository.count(), "No reset token must be persisted if email dispatch fails");
    }

    // ----------------------------------------------------
    // Verify OTP & Reset Password Tests
    // ----------------------------------------------------

    @Test
    @DisplayName("Verify OTP - Valid OTP generates single-use reset token")
    void testVerifyOtpSuccess() {
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        authController.forgotPassword(ForgotPasswordRequest.builder().email("admin@cutletspring.com").build());
        verify(emailService).sendPasswordResetOtp(anyString(), anyString(), otpCaptor.capture(), eq(5));
        String validOtp = otpCaptor.getValue();

        VerifyOtpRequest verifyReq = VerifyOtpRequest.builder()
                .email("admin@cutletspring.com")
                .otp(validOtp)
                .build();

        ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyResp = authController.verifyResetOtp(verifyReq);
        assertEquals(200, verifyResp.getStatusCode().value());
        assertTrue(verifyResp.getBody().isSuccess());

        VerifyOtpResponse data = verifyResp.getBody().getData();
        assertNotNull(data);
        assertNotNull(data.getResetToken());
        assertTrue(data.getExpiresInSeconds() > 0);

        // Verify token in DB is marked verified and stores hash of reset token
        PasswordResetToken token = passwordResetTokenRepository
                .findFirstByAdminEmailAndConsumedAtIsNullOrderByCreatedAtDesc("admin@cutletspring.com")
                .orElseThrow();
        assertNotNull(token.getVerifiedAt());
        assertNotNull(token.getResetTokenHash());
        assertNotEquals(data.getResetToken(), token.getResetTokenHash(), "Raw reset token must never be saved directly in DB");
    }

    @Test
    @DisplayName("Verify OTP - Rejects wrong OTP and increments attempt count")
    void testVerifyOtpWrongCode() {
        authController.forgotPassword(ForgotPasswordRequest.builder().email("admin@cutletspring.com").build());

        VerifyOtpRequest verifyReq = VerifyOtpRequest.builder()
                .email("admin@cutletspring.com")
                .otp("999999")
                .build();

        assertThrows(IllegalArgumentException.class, () -> authController.verifyResetOtp(verifyReq));

        PasswordResetToken token = passwordResetTokenRepository
                .findFirstByAdminEmailAndConsumedAtIsNullOrderByCreatedAtDesc("admin@cutletspring.com")
                .orElseThrow();
        assertEquals(1, token.getAttemptCount());
    }

    @Test
    @DisplayName("Verify OTP - Locks out and invalidates token after maximum failed attempts")
    void testVerifyOtpMaxAttempts() {
        authController.forgotPassword(ForgotPasswordRequest.builder().email("admin@cutletspring.com").build());

        VerifyOtpRequest verifyReq = VerifyOtpRequest.builder()
                .email("admin@cutletspring.com")
                .otp("999999")
                .build();

        // 5 consecutive wrong attempts
        for (int i = 0; i < 4; i++) {
            assertThrows(IllegalArgumentException.class, () -> authController.verifyResetOtp(verifyReq));
        }

        // 5th attempt must invalidate and lockout
        assertThrows(IllegalArgumentException.class, () -> authController.verifyResetOtp(verifyReq));

        PasswordResetToken token = passwordResetTokenRepository
                .findFirstByAdminIdAndConsumedAtIsNullOrderByCreatedAtDesc(testAdmin.getId())
                .orElse(null);

        assertNull(token, "Token should now be consumed/invalidated and no longer active");
    }

    @Test
    @DisplayName("Verify OTP - Rejects expired OTP code")
    void testVerifyOtpExpired() {
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        authController.forgotPassword(ForgotPasswordRequest.builder().email("admin@cutletspring.com").build());
        verify(emailService).sendPasswordResetOtp(anyString(), anyString(), otpCaptor.capture(), eq(5));
        String validOtp = otpCaptor.getValue();

        // Artificially expire the token in DB
        PasswordResetToken token = passwordResetTokenRepository
                .findFirstByAdminEmailAndConsumedAtIsNullOrderByCreatedAtDesc("admin@cutletspring.com")
                .orElseThrow();
        token.setExpiresAt(Instant.now().minus(Duration.ofMinutes(1)));
        passwordResetTokenRepository.save(token);

        VerifyOtpRequest verifyReq = VerifyOtpRequest.builder()
                .email("admin@cutletspring.com")
                .otp(validOtp)
                .build();

        assertThrows(IllegalArgumentException.class, () -> authController.verifyResetOtp(verifyReq));
    }

    @Test
    @DisplayName("End-to-End Reset Password - Completes reset and prevents token reuse")
    void testEndToEndResetPasswordAndPreventReuse() {
        // Step 1: Request OTP
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        authController.forgotPassword(ForgotPasswordRequest.builder().email("admin@cutletspring.com").build());
        verify(emailService).sendPasswordResetOtp(anyString(), anyString(), otpCaptor.capture(), eq(5));
        String otp = otpCaptor.getValue();

        // Step 2: Verify OTP and acquire raw reset token
        VerifyOtpResponse verifyResp = authController.verifyResetOtp(
                VerifyOtpRequest.builder().email("admin@cutletspring.com").otp(otp).build()
        ).getBody().getData();
        String rawResetToken = verifyResp.getResetToken();

        // Step 3: Reset password
        ResetPasswordRequest resetReq = ResetPasswordRequest.builder()
                .email("admin@cutletspring.com")
                .resetToken(rawResetToken)
                .newPassword("BrandNewP@ssw0rd2026!")
                .confirmNewPassword("BrandNewP@ssw0rd2026!")
                .build();

        ResponseEntity<ApiResponse<Void>> resetResp = authController.resetPassword(resetReq);
        assertEquals(200, resetResp.getStatusCode().value());
        assertTrue(resetResp.getBody().isSuccess());

        // Verify password updated in PostgreSQL
        Admin updatedAdmin = adminRepository.findByEmail("admin@cutletspring.com").orElseThrow();
        assertTrue(passwordEncoder.matches("BrandNewP@ssw0rd2026!", updatedAdmin.getPasswordHash()));

        // Confirmation email dispatched
        verify(emailService, times(1)).sendPasswordResetConfirmation(eq("admin@cutletspring.com"), anyString());

        // Step 4: Reusing the same reset token MUST fail
        assertThrows(IllegalArgumentException.class, () -> authController.resetPassword(resetReq));
    }

    @Test
    @DisplayName("Reset Password - Rejects expired reset token")
    void testResetPasswordExpiredToken() {
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        authController.forgotPassword(ForgotPasswordRequest.builder().email("admin@cutletspring.com").build());
        verify(emailService).sendPasswordResetOtp(anyString(), anyString(), otpCaptor.capture(), eq(5));

        VerifyOtpResponse verifyResp = authController.verifyResetOtp(
                VerifyOtpRequest.builder().email("admin@cutletspring.com").otp(otpCaptor.getValue()).build()
        ).getBody().getData();

        // Artificially expire the reset token in DB
        PasswordResetToken token = passwordResetTokenRepository
                .findFirstByAdminEmailAndConsumedAtIsNullOrderByCreatedAtDesc("admin@cutletspring.com")
                .orElseThrow();
        token.setTokenExpiresAt(Instant.now().minus(Duration.ofMinutes(1)));
        passwordResetTokenRepository.save(token);

        ResetPasswordRequest resetReq = ResetPasswordRequest.builder()
                .email("admin@cutletspring.com")
                .resetToken(verifyResp.getResetToken())
                .newPassword("BrandNewP@ssw0rd2026!")
                .confirmNewPassword("BrandNewP@ssw0rd2026!")
                .build();

        assertThrows(IllegalArgumentException.class, () -> authController.resetPassword(resetReq));
    }

    // ----------------------------------------------------
    // Password Policy Unit Tests
    // ----------------------------------------------------

    @Test
    @DisplayName("PasswordValidator - Validates comprehensive policy")
    void testPasswordPolicyRules() {
        // Valid
        assertDoesNotThrow(() -> PasswordValidator.validate("ValidP@ssw0rd1"));

        // Blank
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate(""));
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate(null));

        // Too short (< 8)
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate("Ab1!"));

        // Too long (> 72)
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate("A".repeat(73) + "1!"));

        // No uppercase
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate("validp@ssw0rd1"));

        // No lowercase
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate("VALIDP@SSW0RD1"));

        // No digit
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate("ValidP@ssword"));

        // No special character
        assertThrows(IllegalArgumentException.class, () -> PasswordValidator.validate("ValidPassw0rd1"));
    }
}

