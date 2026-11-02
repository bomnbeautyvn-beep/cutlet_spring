package com.cutletspring.menu.repository;

import com.cutletspring.menu.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, String>, JpaSpecificationExecutor<MenuItem> {

    List<MenuItem> findAllByActiveTrueOrderByDisplayOrderAsc();

    @Query("SELECT m FROM MenuItem m WHERE (m.category.id = :categoryId OR m.category.code = :categoryId) AND m.active = true ORDER BY m.displayOrder ASC")
    List<MenuItem> findAllByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(@Param("categoryId") String categoryId);

    @Query("SELECT m FROM MenuItem m WHERE m.active = true AND (m.isBestSeller = true OR m.isChefSignature = true) ORDER BY m.displayOrder ASC")
    List<MenuItem> findFeaturedItems();

    Page<MenuItem> findAllByOrderByDisplayOrderAsc(Pageable pageable);

    @Query("SELECT m FROM MenuItem m WHERE (:categoryId IS NULL OR m.category.id = :categoryId OR m.category.code = :categoryId) AND (:active IS NULL OR m.active = :active) ORDER BY m.displayOrder ASC")
    Page<MenuItem> findAdminMenuItems(@Param("categoryId") String categoryId, @Param("active") Boolean active, Pageable pageable);

    long countByActiveTrue();
    long countByActiveFalse();

    @Query("SELECT COUNT(m) FROM MenuItem m WHERE m.category.id = :categoryId OR m.category.code = :categoryId")
    long countByCategoryId(@Param("categoryId") String categoryId);

    Optional<MenuItem> findByIdAndActiveTrue(String id);
}

