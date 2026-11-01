package com.cutletspring.account.service;

import com.cutletspring.account.entity.AccountAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountAuditLogService {

    void record(String adminEmail, String adminName, String action, String targetType, String targetId, String details, String ipAddress);

    Page<AccountAuditLog> getAuditLogs(Pageable pageable);
}
