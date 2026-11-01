package com.cutletspring.auth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            // Invoking getToken() forces the DeferredCsrfToken to populate the cookie
            String token = csrfToken.getToken();
            if (token != null && !token.isEmpty()) {
                response.setHeader("X-XSRF-TOKEN", token);
                HttpSession session = request.getSession(false);
                if (session != null) {
                    session.setAttribute(HybridCsrfTokenRepository.CSRF_SESSION_ATTR, csrfToken);
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}

