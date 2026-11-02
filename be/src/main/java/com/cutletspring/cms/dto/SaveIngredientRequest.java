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
public class SaveIngredientRequest {

    private String id;

    @NotBlank(message = "English name is required")
    private String nameEn;

    private String nameKr;

    private String nameVi;

    private String nameJp;

    private String subtitleEn;
    private String subtitleKr;
    private String subtitleVi;
    private String subtitleJp;

    @NotBlank(message = "English description is required")
    private String descriptionEn;

    private String descriptionKr;

    private String descriptionVi;

    private String descriptionJp;

    private Integer displayOrder;
    private Boolean isActive;
}

