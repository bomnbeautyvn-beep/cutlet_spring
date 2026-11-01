package com.cutletspring.account.service;

import com.cutletspring.account.dto.AdminAccountDto;
import com.cutletspring.account.dto.CreateAdminAccountRequest;
import com.cutletspring.account.dto.UpdateAdminAccountRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminAccountService {

    Page<AdminAccountDto> getAccounts(String query, String role, Boolean active, Pageable pageable);

    AdminAccountDto getAccountById(String id);

    AdminAccountDto createAccount(CreateAdminAccountRequest request, String currentAdminEmail);

    AdminAccountDto updateAccount(String id, UpdateAdminAccountRequest request, String currentAdminEmail);

    AdminAccountDto updateStatus(String id, boolean active, String currentAdminEmail);

    void resetPassword(String id, String newPassword, String currentAdminEmail);
}
