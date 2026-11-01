package com.cutletspring.auth.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;

/**
 * Hybrid CSRF token repository supporting both cookie-based and session-based token persistence.
 *
 * In cross-site SPA architectures (e.g. Vercel frontend calling Render backend),
 * modern browsers may reject or drop third-party XSRF-TOKEN cookies while preserving
 * the authenticated session cookie (JSESSIONID). This repository persists the CSRF token
 * to both the XSRF-TOKEN cookie and the active HttpSession, and loads from either source.
 */
@Slf4j
public class HybridCsrfTokenRepository implements CsrfTokenRepository {

    public static final String CSRF_SESSION_ATTR = "CSRF_TOKEN_SESSION_ATTR";
    private final CookieCsrfTokenRepository cookieRepository;

    public HybridCsrfTokenRepository(CookieCsrfTokenRepository cookieRepository) {
        this.cookieRepository = cookieRepository;
    }

    @Override
    public CsrfToken generateToken(HttpServletRequest request) {
        return cookieRepository.generateToken(request);
    }

    @Override
    public void saveToken(CsrfToken token, HttpServletRequest request, HttpServletResponse response) {
        // 1. Save to cookie via CookieCsrfTokenRepository (which applies SameSite and Secure flags)
        cookieRepository.saveToken(token, request, response);

        // 2. Also save to HttpSession if a session exists or is currently active
        HttpSession session = request.getSession(false);
        if (session != null) {
            if (token == null) {
                session.removeAttribute(CSRF_SESSION_ATTR);
            } else {
                session.setAttribute(CSRF_SESSION_ATTR, token);
            }
        }
    }

    @Override
    public CsrfToken loadToken(HttpServletRequest request) {
        // 1. Primary: load from the XSRF-TOKEN request cookie
        CsrfToken token = cookieRepository.loadToken(request);
        if (token != null) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.setAttribute(CSRF_SESSION_ATTR, token);
            }
            return token;
        }

        // 2. Cross-site fallback: if the cookie was blocked or dropped by the browser,
        // load the valid CSRF token from the authenticated HttpSession (tied to JSESSIONID)
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object sessionToken = session.getAttribute(CSRF_SESSION_ATTR);
            if (sessionToken instanceof CsrfToken csrfToken) {
                return csrfToken;
            }
        }

        return null;
    }
}
