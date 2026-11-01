package com.cutletspring.cms.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveGoogleReviewRequest {

    private String id;

    @NotBlank(message = "Reviewer name is required")
    private String reviewerName;

    private String reviewerInitials;

    private String reviewerAvatarUrl;

    private String reviewerMetadata;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    @NotBlank(message = "Review language is required")
    private String reviewLanguage;

    @NotBlank(message = "Review content is required")
    private String reviewContent;

    @NotBlank(message = "Review date is required")
    private String reviewDate;

    private String ownerResponse;

    private String ownerResponseDate;

    private String reviewUrl;

    private Boolean isFeatured;

    private Boolean isActive;

    private Integer displayOrder;
}

