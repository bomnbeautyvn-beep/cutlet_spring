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
public class MenuItemSauceOptionDto {
    private Long id;

    @NotBlank(message = "Sauce name is required")
    private String name;

    @PositiveOrZero(message = "Sauce price must be zero or positive")
    @Builder.Default
    private int price = 0;

    @Builder.Default
    private int displayOrder = 0;
}

