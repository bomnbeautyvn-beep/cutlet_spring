package com.cutletspring.cms.repository;

import com.cutletspring.cms.entity.GoogleReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoogleReviewRepository extends JpaRepository<GoogleReview, String> {

    List<GoogleReview> findAllByOrderByDisplayOrderAsc();

    List<GoogleReview> findAllByIsActiveTrueOrderByDisplayOrderAsc();

    List<GoogleReview> findAllByIsActiveTrueAndIsFeaturedTrueOrderByDisplayOrderAsc();

    @Query("SELECT COUNT(r) FROM GoogleReview r WHERE r.isActive = true")
    long countActiveReviews();

    @Query("SELECT AVG(r.rating) FROM GoogleReview r WHERE r.isActive = true")
    Double averageActiveRating();
}

