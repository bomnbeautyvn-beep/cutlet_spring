package com.cutletspring.auth.repository;

import com.cutletspring.auth.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findFirstByAdminEmailAndConsumedAtIsNullOrderByCreatedAtDesc(String email);

    Optional<PasswordResetToken> findFirstByAdminIdAndConsumedAtIsNullOrderByCreatedAtDesc(String adminId);

    Optional<PasswordResetToken> findByResetTokenHashAndConsumedAtIsNull(String resetTokenHash);

    List<PasswordResetToken> findAllByAdminIdAndConsumedAtIsNull(String adminId);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiresAt < :cutoff OR (t.consumedAt IS NOT NULL AND t.consumedAt < :cutoff)")
    int deleteOldTokens(@Param("cutoff") Instant cutoff);
}

