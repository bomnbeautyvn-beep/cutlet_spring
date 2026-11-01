package com.cutletspring.email.service;

import com.cutletspring.email.entity.EmailConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Dynamically constructs and caches {@link JavaMailSenderImpl} instances
 * from the database-backed {@link EmailConfiguration}.
 * Invalidates automatically when settings are updated without backend restart.
 */
@Component
@Slf4j
public class DynamicJavaMailSenderFactory {

    private final AtomicReference<CachedSender> cachedSenderRef = new AtomicReference<>(null);

    private record CachedSender(
            JavaMailSenderImpl sender,
            String configId,
            Instant updatedAt,
            String host,
            int port,
            String username,
            boolean auth,
            boolean starttls
    ) {}

    /**
     * Obtains a thread-safe {@link JavaMailSenderImpl} matching the provided configuration.
     * Reuses cached sender if configuration has not changed.
     *
     * @param config            The active database email configuration
     * @param decryptedPassword The decrypted plaintext SMTP password (or null)
     * @return Configured JavaMailSenderImpl instance
     */
    public JavaMailSenderImpl getOrCreateSender(EmailConfiguration config, String decryptedPassword) {
        CachedSender cached = cachedSenderRef.get();

        if (cached != null && isCacheValid(cached, config)) {
            return cached.sender();
        }

        JavaMailSenderImpl newSender = buildSender(config, decryptedPassword);
        CachedSender newCache = new CachedSender(
                newSender,
                config.getId(),
                config.getUpdatedAt(),
                config.getHost(),
                config.getPort(),
                config.getUsername(),
                config.isSmtpAuth(),
                config.isSmtpStarttls()
        );

        cachedSenderRef.set(newCache);
        log.info("Initialized new dynamic JavaMailSender for host {}:{}", config.getHost(), config.getPort());
        return newSender;
    }

    /**
     * Builds a standalone {@link JavaMailSenderImpl} instance for testing connectivity.
     */
    public JavaMailSenderImpl createTestSender(EmailConfiguration config, String decryptedPassword) {
        return buildSender(config, decryptedPassword);
    }

    /**
     * Invalidates the cached mail sender, ensuring subsequent dispatches use fresh settings.
     */
    public void invalidate() {
        cachedSenderRef.set(null);
        log.info("Invalidated dynamic JavaMailSender cache.");
    }

    private boolean isCacheValid(CachedSender cached, EmailConfiguration config) {
        if (!cached.configId().equals(config.getId())) {
            return false;
        }
        if (config.getUpdatedAt() != null && !config.getUpdatedAt().equals(cached.updatedAt())) {
            return false;
        }
        return cached.host().equals(config.getHost())
                && cached.port() == config.getPort()
                && (cached.username() == null ? config.getUsername() == null : cached.username().equals(config.getUsername()))
                && cached.auth() == config.isSmtpAuth()
                && cached.starttls() == config.isSmtpStarttls();
    }

    private JavaMailSenderImpl buildSender(EmailConfiguration config, String decryptedPassword) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(config.getHost());
        sender.setPort(config.getPort());
        sender.setDefaultEncoding("UTF-8");

        if (config.getUsername() != null && !config.getUsername().trim().isEmpty()) {
            sender.setUsername(config.getUsername().trim());
        }

        if (decryptedPassword != null && !decryptedPassword.trim().isEmpty()) {
            sender.setPassword(decryptedPassword);
        }

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", String.valueOf(config.isSmtpAuth()));

        // Port 465 uses direct SSL; Port 587 uses explicit STARTTLS
        if (config.getPort() == 465) {
            props.put("mail.smtp.ssl.enable", "true");
            props.put("mail.smtp.starttls.enable", "false");
            props.put("mail.smtp.socketFactory.port", "465");
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        } else {
            props.put("mail.smtp.ssl.enable", "false");
            props.put("mail.smtp.starttls.enable", String.valueOf(config.isSmtpStarttls()));
            props.put("mail.smtp.starttls.required", String.valueOf(config.isSmtpStarttls()));
        }

        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        return sender;
    }
}

