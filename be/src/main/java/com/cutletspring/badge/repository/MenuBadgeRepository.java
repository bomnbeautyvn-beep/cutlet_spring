package com.cutletspring.badge.repository;

import com.cutletspring.badge.entity.MenuBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuBadgeRepository extends JpaRepository<MenuBadge, String> {

    List<MenuBadge> findAllByOrderByDisplayOrderAsc();

    List<MenuBadge> findAllByActiveTrueOrderByDisplayOrderAsc();

    Optional<MenuBadge> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    @Query(value = "SELECT COUNT(*) FROM menu_item_badges WHERE badge_id = :badgeId", nativeQuery = true)
    long countAssignedMenuItems(@Param("badgeId") String badgeId);
}

