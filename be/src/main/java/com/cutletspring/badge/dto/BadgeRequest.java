package com.cutletspring.badge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeRequest {

    @NotBlank(message = "Badge code is required")
    private String code;

    @NotBlank(message = "Badge name is required")
    private String name;

    private String nameVi;
    private String nameKr;
    private String nameJp;
    private String description;

    @Builder.Default
    private String badgeColor = "#af101a";

    @Builder.Default
    private String icon = "star";

    @Builder.Default
    private Integer displayOrder = 0;

    @Builder.Default
    private Boolean active = true;
}

