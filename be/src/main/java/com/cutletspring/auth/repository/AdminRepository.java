package com.cutletspring.auth.repository;

import com.cutletspring.auth.entity.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRoleInAndActiveTrue(Collection<String> roles);

    @Query("SELECT a FROM Admin a WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(a.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.fullName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:role IS NULL OR :role = '' OR a.role = :role) AND " +
           "(:active IS NULL OR a.active = :active) " +
           "ORDER BY a.createdAt DESC")
    Page<Admin> findFilteredAdmins(
            @Param("query") String query,
            @Param("role") String role,
            @Param("active") Boolean active,
            Pageable pageable
    );
}
