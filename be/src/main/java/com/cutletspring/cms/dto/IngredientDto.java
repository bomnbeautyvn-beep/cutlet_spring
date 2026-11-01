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
public class IngredientDto {
    private String id;
    private String nameEn;
    private String nameKr;
    private String nameVi;
    private String nameJp;
    private String subtitleEn;
    private String subtitleKr;
    private String subtitleVi;
    private String subtitleJp;
    private String descriptionEn;
    private String descriptionKr;
    private String descriptionVi;
    private String descriptionJp;
    private String imageUrl;
    private String imagePublicId;
    private Integer displayOrder;
    private Boolean isActive;
    private Instant updatedAt;
}

