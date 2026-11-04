package com.cutletspring.email;

import com.cutletspring.email.service.EmailTemplateService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class EmailTemplateServiceTests {

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Test
    @DisplayName("Renders OTP email template using Thymeleaf")
    void testOtpEmailRendering() {
        String html = emailTemplateService.buildOtpEmailHtml("John Doe", "987654", 15);
        assertNotNull(html);
        assertTrue(html.contains("987654"));
        assertTrue(html.contains("John Doe"));
        assertTrue(html.contains("15"));
        assertTrue(html.contains("봄돈까스 • CUTLET SPRING"));
    }

    @Test
    @DisplayName("Renders Confirmation email template using Thymeleaf")
    void testConfirmationEmailRendering() {
        String html = emailTemplateService.buildConfirmationEmailHtml("Jane Smith", "2026-11-04 10:30:00 JST");
        assertNotNull(html);
        assertTrue(html.contains("Jane Smith"));
        assertTrue(html.contains("2026-11-04 10:30:00 JST"));
        assertTrue(html.contains("Password Updated Successfully"));
    }

    @Test
    @DisplayName("Renders SMTP Test email template using Thymeleaf")
    void testTestEmailRendering() {
        String html = emailTemplateService.buildTestEmailHtml("admin@cutletspring.com", "Cutlet Spring Security", "smtp.gmail.com", 587, "2026-11-04 10:30:00 JST");
        assertNotNull(html);
        assertTrue(html.contains("admin@cutletspring.com"));
        assertTrue(html.contains("Cutlet Spring Security"));
        assertTrue(html.contains("smtp.gmail.com"));
        assertTrue(html.contains("587"));
        assertTrue(html.contains("SMTP Relay Verified"));
    }

    @Test
    @DisplayName("Renders Welcome email template with credentials and password change recommendation using Thymeleaf")
    void testWelcomeEmailRendering() {
        String html = emailTemplateService.buildWelcomeEmailHtml(
                "Alice Chef",
                "alice@cutletspring.com",
                "Staff",
                "TempPass123!",
                "http://localhost:3000/admin"
        );
        assertNotNull(html);
        assertTrue(html.contains("Alice Chef"));
        assertTrue(html.contains("alice@cutletspring.com"));
        assertTrue(html.contains("Staff"));
        assertTrue(html.contains("TempPass123!"));
        assertTrue(html.contains("http://localhost:3000/admin"));
        assertTrue(html.contains("Khuyến nghị đổi mật khẩu"));
    }
}

