package com.cutletspring.auth.config;

import com.cutletspring.auth.entity.Admin;
import com.cutletspring.auth.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@cutletspring.com}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    @Value("${admin.full-name:Cutlet Spring Administrator}")
    private String adminFullName;

    @Override
    public void run(ApplicationArguments args) {
        var existing = adminRepository.findByEmail(adminEmail);
        if (existing.isEmpty()) {
            log.info("Initializing default administrator account for Cutlet Spring: {}", adminEmail);
            Admin admin = Admin.builder()
                    .id(UUID.randomUUID().toString())
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .fullName(adminFullName)
                    .role("ROLE_ADMIN")
                    .active(true)
                    .build();
            adminRepository.save(admin);
            log.info("Default administrator account successfully provisioned.");
        } else {
            Admin admin = existing.get();
            if (!passwordEncoder.matches(adminPassword, admin.getPasswordHash())) {
                admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                adminRepository.save(admin);
                log.info("Administrator password hash refreshed to match configuration.");
            } else {
                log.info("Administrator account {} already exists with verified credentials.", adminEmail);
            }
        }
    }
}
