package com.cutletspring.cms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHomepageHeroRequest {

    @NotBlank(message = "English title is required")
    private String titleEn;

    @NotBlank(message = "Korean title is required")
    private String titleKr;

    @NotBlank(message = "Vietnamese title is required")
    private String titleVi;

    @NotBlank(message = "Japanese title is required")
    private String titleJp;

    @NotBlank(message = "English headline is required")
    private String headlineEn;

    @NotBlank(message = "Korean headline is required")
    private String headlineKr;

    @NotBlank(message = "Vietnamese headline is required")
    private String headlineVi;

    @NotBlank(message = "Japanese headline is required")
    private String headlineJp;

    private String taglineEn;
    private String taglineKr;
    private String taglineVi;
    private String taglineJp;

    @NotBlank(message = "English description is required")
    private String descriptionEn;

    @NotBlank(message = "Korean description is required")
    private String descriptionKr;

    @NotBlank(message = "Vietnamese description is required")
    private String descriptionVi;

    @NotBlank(message = "Japanese description is required")
    private String descriptionJp;

    @NotBlank(message = "English CTA is required")
    private String ctaTextEn;

    @NotBlank(message = "Korean CTA is required")
    private String ctaTextKr;

    @NotBlank(message = "Vietnamese CTA is required")
    private String ctaTextVi;

    @NotBlank(message = "Japanese CTA is required")
    private String ctaTextJp;

    private String ctaTarget;

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

    private Boolean isActive;
}

