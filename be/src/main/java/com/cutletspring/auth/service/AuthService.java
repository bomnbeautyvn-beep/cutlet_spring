package com.cutletspring.auth.service;

import com.cutletspring.auth.dto.request.ChangePasswordRequest;
import com.cutletspring.auth.dto.request.LoginRequest;
import com.cutletspring.auth.dto.response.AdminResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface AuthService {

    AdminResponse login(LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response);

    AdminResponse getCurrentAdmin(Authentication authentication);

    void logout(HttpServletRequest request);

    void changePassword(ChangePasswordRequest request, Authentication authentication, HttpServletRequest httpRequest);
}

