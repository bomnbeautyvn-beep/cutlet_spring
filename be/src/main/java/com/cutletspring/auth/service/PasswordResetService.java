package com.cutletspring.auth.service;

import com.cutletspring.auth.dto.request.ChangePasswordRequest;
import com.cutletspring.auth.dto.request.ForgotPasswordRequest;
import com.cutletspring.auth.dto.request.ResetPasswordRequest;
import com.cutletspring.auth.dto.request.VerifyOtpRequest;
import com.cutletspring.auth.dto.response.VerifyOtpResponse;
import com.cutletspring.auth.entity.Admin;
import jakarta.servlet.http.HttpServletRequest;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public interface PasswordResetService {

    void changePassword(Admin admin, ChangePasswordRequest request, HttpServletRequest httpRequest);

    String requestForgotPasswordOtp(ForgotPasswordRequest request);

    VerifyOtpResponse verifyResetOtp(VerifyOtpRequest request);

    void resetPassword(ResetPasswordRequest request);

    static String sha256Hex(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm unavailable", e);
        }
    }
}
