package com.cutletspring.account.service;

import com.cutletspring.account.dto.AdminAccountDto;
import com.cutletspring.account.dto.CreateAdminAccountRequest;
import com.cutletspring.account.dto.UpdateAdminAccountRequest;
import com.cutletspring.auth.entity.Admin;
import com.cutletspring.auth.repository.AdminRepository;
import com.cutletspring.auth.service.PasswordValidator;
import com.cutletspring.email.service.EmailSenderService;
import com.cutletspring.shared.exception.BadRequestException;
import com.cutletspring.shared.exception.ConflictException;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminAccountServiceImpl implements AdminAccountService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountAuditLogService auditLogService;
    private final EmailSenderService emailSenderService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminAccountDto> getAccounts(String query, String role, Boolean active, Pageable pageable) {
        String normalizedRole = null;
        if (role != null && !role.isBlank() && !"all".equalsIgnoreCase(role)) {
            normalizedRole = role.startsWith("ROLE_") ? role.toUpperCase() : "ROLE_" + role.toUpperCase();
        }

        return adminRepository.findFilteredAdmins(query, normalizedRole, active, pageable)
                .map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminAccountDto getAccountById(String id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return toDto(admin);
    }

    @Override
    @Transactional
    public AdminAccountDto createAccount(CreateAdminAccountRequest request, String currentAdminEmail) {
        String email = request.getEmail().trim().toLowerCase();
        if (adminRepository.existsByEmail(email)) {
            throw new ConflictException("An administrator account with email '" + email + "' already exists");
        }

        try {
            PasswordValidator.validate(request.getPassword());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }

        String role = request.getRole().trim().toUpperCase();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        Admin admin = Admin.builder()
                .id(UUID.randomUUID().toString())
                .email(email)
                .fullName(request.getFullName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Admin saved = adminRepository.save(admin);

        auditLogService.record(
                currentAdminEmail,
                null,
                "CREATE_ACCOUNT",
                "ADMIN_ACCOUNT",
                saved.getId(),
                "Created new account: " + saved.getEmail() + " with role " + saved.getRole(),
                null
        );

        try {
            emailSenderService.sendAccountWelcomeEmail(
                    saved.getEmail(),
                    saved.getFullName(),
                    saved.getRole(),
                    request.getPassword()
            );
        } catch (Exception ex) {
            log.warn("Non-fatal: Failed to dispatch welcome email to {}: {}", saved.getEmail(), ex.getMessage());
        }

        return toDto(saved);
    }

    @Override
    @Transactional
    public AdminAccountDto updateAccount(String id, UpdateAdminAccountRequest request, String currentAdminEmail) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        String newRole = request.getRole().trim().toUpperCase();
        if (!newRole.startsWith("ROLE_")) {
            newRole = "ROLE_" + newRole;
        }

        // If demoting from ROLE_ADMIN to another role, check if it is the last active ADMIN
        if (admin.getRole().contains("ADMIN") && !newRole.contains("ADMIN") && admin.isActive()) {
            long activeAdminCount = adminRepository.countByRoleInAndActiveTrue(List.of("ROLE_ADMIN", "ADMIN"));
            if (activeAdminCount <= 1) {
                throw new BadRequestException("Cannot demote the last active administrator account");
            }
        }

        admin.setFullName(request.getFullName().trim());
        admin.setRole(newRole);
        admin.setUpdatedAt(Instant.now());

        Admin updated = adminRepository.save(admin);

        auditLogService.record(
                currentAdminEmail,
                null,
                "UPDATE_ACCOUNT",
                "ADMIN_ACCOUNT",
                updated.getId(),
                "Updated account info for: " + updated.getEmail() + " (role: " + updated.getRole() + ")",
                null
        );

        return toDto(updated);
    }

    @Override
    @Transactional
    public AdminAccountDto updateStatus(String id, boolean active, String currentAdminEmail) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        // Protection 1: Self-deactivation protection
        if (!active && admin.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new BadRequestException("You cannot deactivate your own logged-in administrator account");
        }

        // Protection 2: Last active admin protection
        if (!active && admin.getRole().contains("ADMIN") && admin.isActive()) {
            long activeAdminCount = adminRepository.countByRoleInAndActiveTrue(List.of("ROLE_ADMIN", "ADMIN"));
            if (activeAdminCount <= 1) {
                throw new BadRequestException("Cannot deactivate the last active administrator account");
            }
        }

        admin.setActive(active);
        admin.setUpdatedAt(Instant.now());
        Admin saved = adminRepository.save(admin);

        auditLogService.record(
                currentAdminEmail,
                null,
                active ? "ACTIVATE_ACCOUNT" : "DEACTIVATE_ACCOUNT",
                "ADMIN_ACCOUNT",
                saved.getId(),
                (active ? "Activated" : "Deactivated") + " account: " + saved.getEmail(),
                null
        );

        return toDto(saved);
    }

    @Override
    @Transactional
    public void resetPassword(String id, String newPassword, String currentAdminEmail) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        try {
            PasswordValidator.validate(newPassword);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }

        admin.setPasswordHash(passwordEncoder.encode(newPassword));
        admin.setUpdatedAt(Instant.now());
        adminRepository.save(admin);

        auditLogService.record(
                currentAdminEmail,
                null,
                "RESET_PASSWORD",
                "ADMIN_ACCOUNT",
                admin.getId(),
                "Directly reset password for account: " + admin.getEmail(),
                null
        );
    }

    private AdminAccountDto toDto(Admin entity) {
        return AdminAccountDto.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .role(entity.getRole())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

