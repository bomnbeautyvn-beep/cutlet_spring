package com.cutletspring.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @NotBlank(message = "Category code is required")
    private String code;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    @Builder.Default
    private Integer displayOrder = 0;

    @Builder.Default
    private Boolean active = true;
}

