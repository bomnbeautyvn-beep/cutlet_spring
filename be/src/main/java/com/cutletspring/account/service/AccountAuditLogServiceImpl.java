package com.cutletspring.account.service;

import com.cutletspring.account.entity.AccountAuditLog;
import com.cutletspring.account.repository.AccountAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountAuditLogServiceImpl implements AccountAuditLogService {

    private final AccountAuditLogRepository auditLogRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String adminEmail, String adminName, String action, String targetType, String targetId, String details, String ipAddress) {
        try {
            AccountAuditLog logEntry = AccountAuditLog.builder()
                    .adminEmail(adminEmail != null ? adminEmail : "SYSTEM")
                    .adminName(adminName)
                    .action(action)
                    .targetType(targetType)
                    .targetId(targetId)
                    .details(details)
                    .ipAddress(ipAddress)
                    .build();
            auditLogRepository.save(logEntry);
        } catch (Exception ex) {
            log.error("Failed to record audit log: {}", ex.getMessage(), ex);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountAuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}

