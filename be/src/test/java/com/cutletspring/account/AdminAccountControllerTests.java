package com.cutletspring.account;

import com.cutletspring.account.controller.AdminAccountController;
import com.cutletspring.account.dto.*;
import com.cutletspring.account.entity.AccountAuditLog;
import com.cutletspring.shared.exception.BadRequestException;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AdminAccountControllerTests {

    @Autowired
    private AdminAccountController accountController;

    private UsernamePasswordAuthenticationToken createAdminAuth(String email) {
        return new UsernamePasswordAuthenticationToken(
                email,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }

    @Test
    @DisplayName("Admin can list accounts and view audit logs")
    void testListAccountsAndAuditLogs() {
        var auth = createAdminAuth("admin@cutletspring.com");
        SecurityContextHolder.getContext().setAuthentication(auth);

        ResponseEntity<ApiResponse<Page<AdminAccountDto>>> response = accountController.getAccounts(null, null, null, 0, 10);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().getData().getTotalElements() >= 1);

        ResponseEntity<ApiResponse<Page<AccountAuditLog>>> auditResp = accountController.getAuditLogs(0, 10);
        assertNotNull(auditResp);
        assertEquals(200, auditResp.getStatusCode().value());
    }

    @Test
    @DisplayName("Admin creates, updates, and manages staff account with security protections")
    void testAccountLifecycleAndProtections() {
        var auth = createAdminAuth("admin@cutletspring.com");
        SecurityContextHolder.getContext().setAuthentication(auth);

        // 1. Create a staff account
        CreateAdminAccountRequest createReq = CreateAdminAccountRequest.builder()
                .email("staff.test@cutletspring.com")
                .fullName("Chef Assistant")
                .password("StaffSecret@2025")
                .role("ROLE_STAFF")
                .build();

        ResponseEntity<ApiResponse<AdminAccountDto>> createResp = accountController.createAccount(createReq, auth);
        assertNotNull(createResp);
        assertEquals(201, createResp.getStatusCode().value());
        AdminAccountDto staff = createResp.getBody().getData();
        assertNotNull(staff);
        assertEquals("ROLE_STAFF", staff.getRole());

        // 2. Update staff account
        UpdateAdminAccountRequest updateReq = UpdateAdminAccountRequest.builder()
                .fullName("Senior Chef Assistant")
                .role("ROLE_STAFF")
                .build();
        ResponseEntity<ApiResponse<AdminAccountDto>> updateResp = accountController.updateAccount(staff.getId(), updateReq, auth);
        assertEquals("Senior Chef Assistant", updateResp.getBody().getData().getFullName());

        // 3. Test protection: Self-deactivation prevention
        AccountStatusRequest deactivateReq = AccountStatusRequest.builder().active(false).build();
        // Try deactivating the currently logged in admin "admin@cutletspring.com"
        ResponseEntity<ApiResponse<Page<AdminAccountDto>>> admins = accountController.getAccounts("admin@cutletspring.com", null, null, 0, 1);
        String mainAdminId = admins.getBody().getData().getContent().get(0).getId();

        BadRequestException selfEx = assertThrows(BadRequestException.class, () -> {
            accountController.updateStatus(mainAdminId, deactivateReq, auth);
        });
        assertTrue(selfEx.getMessage().contains("cannot deactivate your own"));

        // 4. Test protection: Last active admin protection (if deactivating main admin under another session)
        var anotherAuth = createAdminAuth("other@cutletspring.com");
        BadRequestException lastAdminEx = assertThrows(BadRequestException.class, () -> {
            accountController.updateStatus(mainAdminId, deactivateReq, anotherAuth);
        });
        assertTrue(lastAdminEx.getMessage().contains("last active administrator"));

        // 5. Deactivate staff account succeeds
        ResponseEntity<ApiResponse<AdminAccountDto>> staffStatusResp = accountController.updateStatus(staff.getId(), deactivateReq, auth);
        assertFalse(staffStatusResp.getBody().getData().isActive());

        // 6. Reset password for staff
        ResetAccountPasswordRequest resetReq = ResetAccountPasswordRequest.builder()
                .newPassword("NewStaffSecret@2025")
                .build();
        ResponseEntity<ApiResponse<Void>> resetResp = accountController.resetPassword(staff.getId(), resetReq, auth);
        assertEquals(200, resetResp.getStatusCode().value());
    }
}

