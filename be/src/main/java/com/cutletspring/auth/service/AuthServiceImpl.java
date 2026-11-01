package com.cutletspring.auth.service;

import com.cutletspring.auth.config.HybridCsrfTokenRepository;
import com.cutletspring.auth.dto.request.ChangePasswordRequest;
import com.cutletspring.auth.dto.request.LoginRequest;
import com.cutletspring.auth.dto.response.AdminResponse;
import com.cutletspring.auth.entity.Admin;
import com.cutletspring.auth.repository.AdminRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final AdminRepository adminRepository;
    private final PasswordResetService passwordResetService;

    @Override
    public AdminResponse login(LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        // Associate CSRF token with the newly authenticated session
        HttpSession session = request.getSession(true);
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            session.setAttribute(HybridCsrfTokenRepository.CSRF_SESSION_ATTR, csrfToken);
            String token = csrfToken.getToken();
            if (token != null && !token.isEmpty()) {
                response.setHeader("X-XSRF-TOKEN", token);
            }
        }

        Admin admin = adminRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Admin record not found"));

        return AdminResponse.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .role(admin.getRole())
                .active(admin.isActive())
                .build();
    }

    @Override
    public AdminResponse getCurrentAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BadCredentialsException("No active administrative session found");
        }

        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Admin profile not found"));

        return AdminResponse.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .role(admin.getRole())
                .active(admin.isActive())
                .build();
    }

    @Override
    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    @Override
    public void changePassword(ChangePasswordRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BadCredentialsException("Authentication required to change password");
        }

        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Admin profile not found"));

        passwordResetService.changePassword(admin, request, httpRequest);
    }
}

