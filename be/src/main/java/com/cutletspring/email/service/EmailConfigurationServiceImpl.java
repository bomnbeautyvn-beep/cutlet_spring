package com.cutletspring.email.service;

import com.cutletspring.email.crypto.AesGcmEncryptionService;
import com.cutletspring.email.dto.EmailConfigResponse;
import com.cutletspring.email.dto.UpdateEmailConfigRequest;
import com.cutletspring.email.entity.EmailConfiguration;
import com.cutletspring.email.repository.EmailConfigurationRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailConfigurationServiceImpl implements EmailConfigurationService {

    private final EmailConfigurationRepository repository;
    private final AesGcmEncryptionService encryptionService;
    private final DynamicJavaMailSenderFactory mailSenderFactory;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String defaultHost;

    @Value("${spring.mail.port:587}")
    private int defaultPort;

    @Value("${spring.mail.username:}")
    private String defaultUsername;

    @Value("${app.mail.from:noreply@cutletspring.com}")
    private String defaultFromEmail;

    @Value("${app.mail.from-name:Cutlet Spring Security}")
    private String defaultFromName;

    @Value("${app.mail.enabled:true}")
    private boolean defaultEnabled;

    @Override
    @Transactional(readOnly = true)
    public EmailConfiguration getConfiguration() {
        return repository.findFirstByOrderByIdAsc().orElseGet(this::createInitialConfiguration);
    }

    @Override
    @Transactional(readOnly = true)
    public EmailConfigResponse getConfigResponse() {
        EmailConfiguration config = getConfiguration();
        boolean hasPassword = config.getEncryptedPassword() != null && !config.getEncryptedPassword().trim().isEmpty();

        return EmailConfigResponse.builder()
                .host(config.getHost())
                .port(config.getPort())
                .username(config.getUsername())
                .smtpAuth(config.isSmtpAuth())
                .smtpStarttls(config.isSmtpStarttls())
                .fromEmail(config.getFromEmail())
                .fromName(config.getFromName())
                .enabled(config.isEnabled())
                .passwordConfigured(hasPassword)
                .updatedAt(config.getUpdatedAt() != null ? config.getUpdatedAt() : Instant.now())
                .build();
    }

    @Override
    @Transactional
    public EmailConfigResponse updateConfiguration(UpdateEmailConfigRequest request) {
        EmailConfiguration config = repository.findFirstByOrderByIdAsc().orElseGet(() ->
                EmailConfiguration.builder().id("default").build()
        );

        config.setHost(request.getHost().trim());
        config.setPort(request.getPort());
        config.setUsername(request.getUsername() != null ? request.getUsername().trim() : "");
        config.setSmtpAuth(request.isSmtpAuth());
        config.setSmtpStarttls(request.isSmtpStarttls());
        config.setFromEmail(request.getFromEmail().trim());
        config.setFromName(request.getFromName().trim());
        config.setEnabled(request.isEnabled());

        // Password handling: empty means preserve existing password
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String encrypted = encryptionService.encrypt(request.getPassword().trim());
            config.setEncryptedPassword(encrypted);
            log.info("Encrypted new SMTP password for host [{}]", config.getHost());
        }

        EmailConfiguration saved = repository.save(config);

        // Invalidate dynamic mail sender cache so changes take immediate effect
        mailSenderFactory.invalidate();

        boolean hasPassword = saved.getEncryptedPassword() != null && !saved.getEncryptedPassword().trim().isEmpty();

        return EmailConfigResponse.builder()
                .host(saved.getHost())
                .port(saved.getPort())
                .username(saved.getUsername())
                .smtpAuth(saved.isSmtpAuth())
                .smtpStarttls(saved.isSmtpStarttls())
                .fromEmail(saved.getFromEmail())
                .fromName(saved.getFromName())
                .enabled(saved.isEnabled())
                .passwordConfigured(hasPassword)
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    @Override
    public String getDecryptedPassword(EmailConfiguration config) {
        if (config.getEncryptedPassword() == null || config.getEncryptedPassword().trim().isEmpty()) {
            return null;
        }
        return encryptionService.decrypt(config.getEncryptedPassword());
    }

    @Override
    @Transactional(readOnly = true)
    public void testConnection() {
        EmailConfiguration config = getConfiguration();
        String password = getDecryptedPassword(config);

        JavaMailSenderImpl testSender = mailSenderFactory.createTestSender(config, password);
        try {
            testSender.testConnection();
            log.info("SMTP test connection successful for {}:{}", config.getHost(), config.getPort());
        } catch (MessagingException e) {
            log.error("SMTP test connection failed for {}:{}: {}", config.getHost(), config.getPort(), e.getMessage());
            throw new IllegalStateException("Failed to connect to SMTP server: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error testing SMTP connection: {}", e.getMessage());
            throw new IllegalStateException("SMTP connection error: " + e.getMessage(), e);
        }
    }

    private EmailConfiguration createInitialConfiguration() {
        EmailConfiguration config = EmailConfiguration.builder()
                .id("default")
                .host(defaultHost)
                .port(defaultPort)
                .username(defaultUsername)
                .encryptedPassword(null)
                .smtpAuth(true)
                .smtpStarttls(true)
                .fromEmail(defaultFromEmail)
                .fromName(defaultFromName)
                .enabled(defaultEnabled)
                .build();
        return repository.save(config);
    }
}

