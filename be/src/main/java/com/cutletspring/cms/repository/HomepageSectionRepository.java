package com.cutletspring.cms.repository;

import com.cutletspring.cms.entity.HomepageSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomepageSectionRepository extends JpaRepository<HomepageSection, String> {

    List<HomepageSection> findAllByOrderByDisplayOrderAsc();

    List<HomepageSection> findAllByIsActiveTrueOrderByDisplayOrderAsc();

    Optional<HomepageSection> findBySectionKey(String sectionKey);
}

