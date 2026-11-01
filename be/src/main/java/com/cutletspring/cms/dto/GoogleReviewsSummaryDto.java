package com.cutletspring.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleReviewsSummaryDto {
    private BigDecimal averageRating;
    private Integer totalReviewsCount;
    private String googleMapsUrl;
    private String googleMapsEmbedUrl;
}

