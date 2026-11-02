package com.cutletspring.database.repository;

import com.cutletspring.database.entity.DatabaseBackupHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DatabaseBackupHistoryRepository extends JpaRepository<DatabaseBackupHistory, String> {

    List<DatabaseBackupHistory> findAllByOrderByCreatedAtDesc();

    Optional<DatabaseBackupHistory> findFirstByStatusOrderByCreatedAtDesc(String status);
}

