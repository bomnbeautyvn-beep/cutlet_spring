package com.cutletspring.email;

import com.cutletspring.email.controller.AdminEmailSettingsController;
import com.cutletspring.email.dto.EmailConfigResponse;
import com.cutletspring.email.dto.SendTestEmailRequest;
import com.cutletspring.email.dto.UpdateEmailConfigRequest;
import com.cutletspring.email.entity.EmailConfiguration;
import com.cutletspring.email.repository.EmailConfigurationRepository;
import com.cutletspring.email.service.DynamicJavaMailSenderFactory;
import com.cutletspring.email.service.EmailConfigurationService;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@DisplayName("Admin Email & SMTP Settings Controller Tests")
class AdminEmailSettingsControllerTests {

    @Autowired
    private AdminEmailSettingsController controller;

    @Autowired
    private EmailConfigurationRepository repository;

    @Autowired
    private EmailConfigurationService configService;

    @MockitoBean
    private DynamicJavaMailSenderFactory mailSenderFactory;

    private JavaMailSenderImpl mockMailSender;

    @BeforeEach
    void setUp() {
        mockMailSender = mock(JavaMailSenderImpl.class);
        when(mailSenderFactory.getOrCreateSender(any(), any())).thenReturn(mockMailSender);
        when(mailSenderFactory.createTestSender(any(), any())).thenReturn(mockMailSender);
        when(mockMailSender.createMimeMessage()).thenReturn(new JavaMailSenderImpl().createMimeMessage());

        setAdminAuth();
    }

    private void setAdminAuth() {
        var auth = new UsernamePasswordAuthenticationToken(
                "admin@cutletspring.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private void setStaffAuth() {
        var auth = new UsernamePasswordAuthenticationToken(
                "staff@cutletspring.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STAFF"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("Admin can get current email configuration without exposing password")
    void testGetEmailConfig() {
        ResponseEntity<ApiResponse<EmailConfigResponse>> response = controller.getEmailConfig();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        EmailConfigResponse data = response.getBody().getData();
        assertNotNull(data);
        assertNotNull(data.getHost());
        assertTrue(data.getPort() > 0);
        assertNotNull(data.getFromEmail());
        assertNotNull(data.getFromName());
    }

    @Test
    @DisplayName("Admin can update email configuration and newly set password is encrypted")
    void testUpdateEmailConfigWithNewPassword() {
        UpdateEmailConfigRequest request = UpdateEmailConfigRequest.builder()
                .host("smtp.customrelay.com")
                .port(587)
                .username("smtp-operator")
                .password("NewSuperSecretPassword123!")
                .smtpAuth(true)
                .smtpStarttls(true)
                .fromEmail("alerts@cutletspring.com")
                .fromName("Cutlet Spring Alerts")
                .enabled(true)
                .build();

        ResponseEntity<ApiResponse<EmailConfigResponse>> response = controller.updateEmailConfig(request);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        EmailConfigResponse data = response.getBody().getData();
        assertEquals("smtp.customrelay.com", data.getHost());
        assertEquals(587, data.getPort());
        assertEquals("smtp-operator", data.getUsername());
        assertEquals("alerts@cutletspring.com", data.getFromEmail());
        assertEquals("Cutlet Spring Alerts", data.getFromName());
        assertTrue(data.isPasswordConfigured());

        // Verify password was encrypted and decrypts properly
        EmailConfiguration persisted = repository.findFirstByOrderByIdAsc().orElseThrow();
        assertNotEquals("NewSuperSecretPassword123!", persisted.getEncryptedPassword());
        assertEquals("NewSuperSecretPassword123!", configService.getDecryptedPassword(persisted));
    }

    @Test
    @DisplayName("Updating email configuration with blank password preserves existing encrypted password")
    void testUpdateEmailConfigPreservesPasswordWhenBlank() {
        // First set a password
        UpdateEmailConfigRequest initial = UpdateEmailConfigRequest.builder()
                .host("smtp.gmail.com")
                .port(587)
                .username("initial-user")
                .password("InitialPasswordToKeep123!")
                .smtpAuth(true)
                .smtpStarttls(true)
                .fromEmail("noreply@cutletspring.com")
                .fromName("Cutlet Spring")
                .enabled(true)
                .build();
        controller.updateEmailConfig(initial);

        // Update other fields but pass blank password
        UpdateEmailConfigRequest update = UpdateEmailConfigRequest.builder()
                .host("smtp.gmail.com")
                .port(465)
                .username("initial-user")
                .password("") // Empty string should preserve existing
                .smtpAuth(true)
                .smtpStarttls(false)
                .fromEmail("noreply@cutletspring.com")
                .fromName("Cutlet Spring Renovated")
                .enabled(true)
                .build();

        ResponseEntity<ApiResponse<EmailConfigResponse>> response = controller.updateEmailConfig(update);
        assertEquals(200, response.getStatusCode().value());
        EmailConfigResponse data = response.getBody().getData();
        assertEquals(465, data.getPort());
        assertEquals("Cutlet Spring Renovated", data.getFromName());
        assertTrue(data.isPasswordConfigured());

        // Verify existing password was preserved
        EmailConfiguration persisted = repository.findFirstByOrderByIdAsc().orElseThrow();
        assertEquals("InitialPasswordToKeep123!", configService.getDecryptedPassword(persisted));
    }

    @Test
    @DisplayName("Admin can test SMTP connection successfully")
    void testTestSmtpConnection() throws Exception {
        ResponseEntity<ApiResponse<String>> response = controller.testSmtpConnection();
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        verify(mockMailSender, atLeastOnce()).testConnection();
    }

    @Test
    @DisplayName("Admin can send test email successfully")
    void testSendTestEmail() {
        SendTestEmailRequest request = new SendTestEmailRequest("recipient@example.com");
        ResponseEntity<ApiResponse<String>> response = controller.sendTestEmail(request);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        verify(mockMailSender, atLeastOnce()).send(any(jakarta.mail.internet.MimeMessage.class));
    }

    @Test
    @DisplayName("Staff user is forbidden from accessing email settings")
    void testStaffUserIsForbidden() {
        setStaffAuth();
        assertThrows(AccessDeniedException.class, () -> controller.getEmailConfig());
        assertThrows(AccessDeniedException.class, () -> controller.testSmtpConnection());
    }
}

