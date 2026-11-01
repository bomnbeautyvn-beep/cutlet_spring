package com.cutletspring.account.repository;

import com.cutletspring.account.entity.AccountAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountAuditLogRepository extends JpaRepository<AccountAuditLog, String> {

    Page<AccountAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

