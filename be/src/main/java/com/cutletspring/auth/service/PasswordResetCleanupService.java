package com.cutletspring.auth.service;

import com.cutletspring.auth.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetCleanupService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    /**
     * Periodically cleans up expired or consumed tokens older than 24 hours.
     * Runs every hour.
     */
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupOldTokens() {
        Instant cutoff = Instant.now().minus(Duration.ofHours(24));
        int deleted = passwordResetTokenRepository.deleteOldTokens(cutoff);
        if (deleted > 0) {
            log.info("Purged {} expired/consumed password reset records older than 24 hours", deleted);
        }
    }
}

