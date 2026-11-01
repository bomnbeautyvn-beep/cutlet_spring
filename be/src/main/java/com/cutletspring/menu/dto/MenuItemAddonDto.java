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
public class MenuItemAddonDto {
    private Long id;

    @NotBlank(message = "Add-on name is required")
    private String name;

    @PositiveOrZero(message = "Add-on price must be zero or positive")
    private int price;

    @Builder.Default
    private int displayOrder = 0;
}

