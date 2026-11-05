package com.cutletspring.account.controller;

import com.cutletspring.account.dto.*;
import com.cutletspring.account.entity.AccountAuditLog;
import com.cutletspring.account.service.AccountAuditLogService;
import com.cutletspring.account.service.AdminAccountService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
@Tag(name = "Admin Account Management", description = "Endpoints for managing administrator and staff credentials, roles, and audit trail")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAccountController {

    private final AdminAccountService accountService;
    private final AccountAuditLogService auditLogService;

    @Operation(summary = "List Admin & Staff Accounts", description = "Retrieves paginated accounts with optional query, role, and active status filters")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminAccountDto>>> getAccounts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminAccountDto> result = accountService.getAccounts(query, role, active, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Operation(summary = "Get Account Details", description = "Retrieves single administrator or staff account profile")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminAccountDto>> getAccountById(@PathVariable String id) {
        AdminAccountDto account = accountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.success(account));
    }

    @Operation(summary = "Create Account", description = "Creates a new administrator or staff account")
    @PostMapping
    public ResponseEntity<ApiResponse<AdminAccountDto>> createAccount(
            @Valid @RequestBody CreateAdminAccountRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        AdminAccountDto created = accountService.createAccount(request, adminEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", created));
    }

    @Operation(summary = "Update Account", description = "Updates full name and role of an account")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminAccountDto>> updateAccount(
            @PathVariable String id,
            @Valid @RequestBody UpdateAdminAccountRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        AdminAccountDto updated = accountService.updateAccount(id, request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Account updated successfully", updated));
    }

    @Operation(summary = "Update Account Active Status", description = "Activates or deactivates an account with protection rules")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminAccountDto>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody AccountStatusRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        AdminAccountDto updated = accountService.updateStatus(id, request.getActive(), adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Account status updated successfully", updated));
    }

    @Operation(summary = "Direct Password Reset", description = "Sets a new password for an administrator or staff member")
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @PathVariable String id,
            @Valid @RequestBody ResetAccountPasswordRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        accountService.resetPassword(id, request.getNewPassword(), adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", null));
    }

    @Operation(summary = "Delete Account", description = "Permanently deletes an administrator or staff account")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            @PathVariable String id,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        accountService.deleteAccount(id, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }

    @Operation(summary = "List Account Audit Logs", description = "Retrieves recent audit logs for security oversight")
    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AccountAuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AccountAuditLog> logs = auditLogService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}

