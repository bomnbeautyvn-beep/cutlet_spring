package com.cutletspring.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemSizeOptionDto {
    private Long id;

    @NotBlank(message = "Size label is required")
    private String label;

    @PositiveOrZero(message = "Size price must be zero or positive")
    private int price;

    @Builder.Default
    private int displayOrder = 0;
}

