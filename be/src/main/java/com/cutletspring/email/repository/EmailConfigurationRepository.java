package com.cutletspring.email.repository;

import com.cutletspring.email.entity.EmailConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailConfigurationRepository extends JpaRepository<EmailConfiguration, String> {

    Optional<EmailConfiguration> findFirstByOrderByIdAsc();
}

