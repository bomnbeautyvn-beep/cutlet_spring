package com.cutletspring.auth.controller;

import com.cutletspring.auth.config.HybridCsrfTokenRepository;
import com.cutletspring.auth.dto.request.ChangePasswordRequest;
import com.cutletspring.auth.dto.request.ForgotPasswordRequest;
import com.cutletspring.auth.dto.request.LoginRequest;
import com.cutletspring.auth.dto.request.ResetPasswordRequest;
import com.cutletspring.auth.dto.request.VerifyOtpRequest;
import com.cutletspring.auth.dto.response.AdminResponse;
import com.cutletspring.auth.dto.response.VerifyOtpResponse;
import com.cutletspring.auth.service.AuthService;
import com.cutletspring.auth.service.PasswordResetService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/auth"})
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Admin authentication, session persistence, and CSRF token initialization")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @Operation(summary = "Initialize CSRF Token", description = "Retrieves the current CSRF token and ensures the XSRF-TOKEN cookie is set")
    @GetMapping("/csrf")
    public ResponseEntity<ApiResponse<Map<String, String>>> getCsrfToken(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            jakarta.servlet.http.HttpSession session = request.getSession(false);
            if (session != null) {
                session.setAttribute(HybridCsrfTokenRepository.CSRF_SESSION_ATTR, csrfToken);
            }
        }
        String token = csrfToken != null ? csrfToken.getToken() : "";
        String headerName = csrfToken != null ? csrfToken.getHeaderName() : "X-XSRF-TOKEN";
        return ResponseEntity.ok(ApiResponse.success("CSRF token initialized", Map.of(
                "token", token,
                "headerName", headerName
        )));
    }

    @Operation(summary = "Admin Login", description = "Authenticates administrator credentials and establishes an HTTP session")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        AdminResponse adminResponse = authService.login(loginRequest, request, response);
        return ResponseEntity.ok(ApiResponse.success("Login successful", adminResponse));
    }

    @Operation(summary = "Get Current Admin", description = "Restores authentication state and returns the current authenticated administrator")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AdminResponse>> getCurrentAdmin(Authentication authentication) {
        AdminResponse adminResponse = authService.getCurrentAdmin(authentication);
        return ResponseEntity.ok(ApiResponse.success("Current administrator authenticated", adminResponse));
    }

    @Operation(summary = "Admin Logout", description = "Invalidates the current administrative session and clears security context")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @Operation(summary = "Change Password", description = "Allows an authenticated administrator to securely change their password and invalidates active sessions")
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        authService.changePassword(request, authentication, httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully. Please log in again with your new password.", null));
    }

    @Operation(summary = "Forgot Password (Request OTP)", description = "Requests a 6-digit verification code sent to the administrator's email. Returns generic response to prevent account enumeration.")
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String message = passwordResetService.requestForgotPasswordOtp(request);
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }

    @Operation(summary = "Verify Reset OTP", description = "Validates the 6-digit OTP code and returns a single-use short-lived reset token")
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyResetOtp(@Valid @RequestBody VerifyOtpRequest request) {
        VerifyOtpResponse response = passwordResetService.verifyResetOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Verification code confirmed", response));
    }

    @Operation(summary = "Reset Password", description = "Resets the administrator password using the verified reset token and invalidates active sessions")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully. Please log in with your new password.", null));
    }
}
