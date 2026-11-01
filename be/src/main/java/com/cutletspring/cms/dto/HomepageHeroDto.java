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
public class HomepageHeroDto {
    private String id;
    private String titleEn;
    private String titleKr;
    private String titleVi;
    private String titleJp;
    private String headlineEn;
    private String headlineKr;
    private String headlineVi;
    private String headlineJp;
    private String taglineEn;
    private String taglineKr;
    private String taglineVi;
    private String taglineJp;
    private String descriptionEn;
    private String descriptionKr;
    private String descriptionVi;
    private String descriptionJp;
    private String ctaTextEn;
    private String ctaTextKr;
    private String ctaTextVi;
    private String ctaTextJp;
    private String ctaTarget;
    private String imageUrl;
    private String imagePublicId;
    private String badgeTextEn;
    private String badgeTextKr;
    private String badgeTextVi;
    private String badgeTextJp;
    private String dishTitleEn;
    private String dishTitleKr;
    private String dishTitleVi;
    private String dishTitleJp;
    private String dishDescEn;
    private String dishDescKr;
    private String dishDescVi;
    private String dishDescJp;
    private String metric1Value;
    private String metric1LabelEn;
    private String metric1LabelKr;
    private String metric1LabelVi;
    private String metric1LabelJp;
    private String metric2Value;
    private String metric2LabelEn;
    private String metric2LabelKr;
    private String metric2LabelVi;
    private String metric2LabelJp;
    private String metric3Value;
    private String metric3LabelEn;
    private String metric3LabelKr;
    private String metric3LabelVi;
    private String metric3LabelJp;
    private Integer displayOrder;
    private Boolean isActive;
    private Instant updatedAt;
}

