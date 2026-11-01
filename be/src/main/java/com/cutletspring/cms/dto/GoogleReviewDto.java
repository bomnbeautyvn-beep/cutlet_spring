package com.cutletspring.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleReviewDto {
    private String id;
    private String reviewerName;
    private String reviewerInitials;
    private String reviewerAvatarUrl;
    private String reviewerMetadata;
    private Integer rating;
    private String reviewLanguage;
    private String reviewContent;
    private String reviewDate;
    private String ownerResponse;
    private String ownerResponseDate;
    private String reviewUrl;
    private Boolean isFeatured;
    private Boolean isActive;
    private Integer displayOrder;
    private Instant updatedAt;
}

