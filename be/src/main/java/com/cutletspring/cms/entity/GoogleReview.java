package com.cutletspring.cms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "google_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoogleReview {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "reviewer_name", nullable = false)
    private String reviewerName;

    @Column(name = "reviewer_initials", nullable = false, length = 10)
    private String reviewerInitials;

    @Column(name = "reviewer_avatar_url", length = 500)
    private String reviewerAvatarUrl;

    @Column(name = "reviewer_metadata")
    private String reviewerMetadata;

    @Column(nullable = false)
    @Builder.Default
    private Integer rating = 5;

    @Column(name = "review_language", nullable = false, length = 10)
    @Builder.Default
    private String reviewLanguage = "VI";

    @Column(name = "review_content", nullable = false, columnDefinition = "TEXT")
    private String reviewContent;

    @Column(name = "review_date", nullable = false, length = 100)
    private String reviewDate;

    @Column(name = "owner_response", columnDefinition = "TEXT")
    private String ownerResponse;

    @Column(name = "owner_response_date", length = 100)
    private String ownerResponseDate;

    @Column(name = "review_url", length = 500)
    private String reviewUrl;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private Boolean isFeatured = true;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) this.createdAt = Instant.now();
        if (this.updatedAt == null) this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = Instant.now();
    }
}

