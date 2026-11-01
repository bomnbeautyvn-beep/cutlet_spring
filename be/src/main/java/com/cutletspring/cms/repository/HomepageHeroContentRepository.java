package com.cutletspring.cms.repository;

import com.cutletspring.cms.entity.HomepageHeroContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomepageHeroContentRepository extends JpaRepository<HomepageHeroContent, String> {

    List<HomepageHeroContent> findAllByOrderByDisplayOrderAsc();

    @Query("SELECT h FROM HomepageHeroContent h WHERE h.isActive = true ORDER BY h.displayOrder ASC")
    List<HomepageHeroContent> findAllActive();

    @Query("SELECT h FROM HomepageHeroContent h WHERE h.id = 'default-hero'")
    Optional<HomepageHeroContent> findDefaultHero();
}

