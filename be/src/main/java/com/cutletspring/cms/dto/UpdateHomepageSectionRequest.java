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
public class UpdateHomepageSectionRequest {

    @NotBlank(message = "Section key is required")
    private String sectionKey;

    @NotBlank(message = "English title is required")
    private String titleEn;

    @NotBlank(message = "Korean title is required")
    private String titleKr;

    @NotBlank(message = "Vietnamese title is required")
    private String titleVi;

    @NotBlank(message = "Japanese title is required")
    private String titleJp;

    private String subtitleEn;
    private String subtitleKr;
    private String subtitleVi;
    private String subtitleJp;

    private Integer displayOrder;
    private Boolean isActive;
}

