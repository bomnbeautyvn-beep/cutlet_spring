package com.cutletspring.category.repository;

import com.cutletspring.category.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, String> {
    List<MenuCategory> findAllByActiveTrueOrderByDisplayOrderAsc();
    List<MenuCategory> findAllByOrderByDisplayOrderAsc();
    Optional<MenuCategory> findByCode(String code);
    boolean existsByCode(String code);
    long countByActiveTrue();
}

