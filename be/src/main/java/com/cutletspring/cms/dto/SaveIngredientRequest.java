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

    @NotBlank(message = "Korean name is required")
    private String nameKr;

    @NotBlank(message = "Vietnamese name is required")
    private String nameVi;

    @NotBlank(message = "Japanese name is required")
    private String nameJp;

    private String subtitleEn;
    private String subtitleKr;
    private String subtitleVi;
    private String subtitleJp;

    @NotBlank(message = "English description is required")
    private String descriptionEn;

    @NotBlank(message = "Korean description is required")
    private String descriptionKr;

    @NotBlank(message = "Vietnamese description is required")
    private String descriptionVi;

    @NotBlank(message = "Japanese description is required")
    private String descriptionJp;

    private Integer displayOrder;
    private Boolean isActive;
}

