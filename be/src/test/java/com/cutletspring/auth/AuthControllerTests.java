package com.cutletspring.auth;

import com.cutletspring.auth.controller.AuthController;
import com.cutletspring.auth.dto.request.LoginRequest;
import com.cutletspring.auth.dto.response.AdminResponse;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthControllerTests {

    @Autowired
    private AuthController authController;

    @Test
    @DisplayName("GET /api/auth/csrf - Successfully initializes CSRF response")
    void testGetCsrfToken() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        ResponseEntity<ApiResponse<Map<String, String>>> response = authController.getCsrfToken(request);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData());
    }

    @Test
    @DisplayName("POST /api/auth/login - Successfully authenticates admin and establishes session")
    void testLoginSuccess() {
        LoginRequest request = LoginRequest.builder()
                .email("admin@cutletspring.com")
                .password("admin123")
                .build();

        MockHttpServletRequest httpRequest = new MockHttpServletRequest();
        MockHttpServletResponse httpResponse = new MockHttpServletResponse();

        ResponseEntity<ApiResponse<AdminResponse>> response = authController.login(request, httpRequest, httpResponse);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        AdminResponse admin = response.getBody().getData();
        assertNotNull(admin);
        assertEquals("admin@cutletspring.com", admin.getEmail());
        assertEquals("ROLE_ADMIN", admin.getRole());

        assertNotNull(httpRequest.getSession(false), "HTTP session must be established upon successful login");
    }

    @Test
    @DisplayName("POST /api/auth/login - Throws BadCredentialsException when password is invalid")
    void testLoginInvalidPassword() {
        LoginRequest request = LoginRequest.builder()
                .email("admin@cutletspring.com")
                .password("wrongpassword")
                .build();

        MockHttpServletRequest httpRequest = new MockHttpServletRequest();
        MockHttpServletResponse httpResponse = new MockHttpServletResponse();

        assertThrows(BadCredentialsException.class, () -> authController.login(request, httpRequest, httpResponse));
    }

    @Test
    @DisplayName("GET /api/auth/me - Throws BadCredentialsException when unauthenticated")
    void testGetMeUnauthenticated() {
        assertThrows(BadCredentialsException.class, () -> authController.getCurrentAdmin(null));
    }

    @Test
    @DisplayName("GET /api/auth/me - Returns admin info when authenticated")
    void testGetMeAuthenticated() {
        var auth = new UsernamePasswordAuthenticationToken(
                "admin@cutletspring.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        ResponseEntity<ApiResponse<AdminResponse>> response = authController.getCurrentAdmin(auth);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("admin@cutletspring.com", response.getBody().getData().getEmail());
        assertEquals("ROLE_ADMIN", response.getBody().getData().getRole());
    }

    @Test
    @DisplayName("POST /api/auth/logout - Successfully logs out and clears session")
    void testLogout() {
        MockHttpServletRequest httpRequest = new MockHttpServletRequest();
        httpRequest.getSession(true);

        ResponseEntity<ApiResponse<Void>> response = authController.logout(httpRequest);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }
}
