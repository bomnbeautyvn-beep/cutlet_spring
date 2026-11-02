package com.cutletspring.menu.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {

    private String id;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    @NotBlank(message = "English name (EN) is required")
    private String nameEn;

    private String nameKr;

    private String nameKrSubtitle;

    private String nameVi;

    private String nameJp;

    @NotBlank(message = "English description (EN) is required")
    private String descriptionEn;

    private String descriptionKr;

    private String descriptionVi;

    private String descriptionJp;

    private String portionEn;

    private String portionKr;

    private String portionVi;

    private String portionJp;

    @PositiveOrZero(message = "Base price must be zero or positive")
    private int basePrice;

    @Builder.Default
    private Integer prepTimeMinutes = 15;

    private String imageUrl;
    private String imagePublicId;
    private String altText;

    @JsonProperty("isBestSeller")
    @JsonAlias({"bestSeller", "isBestSeller"})
    @Builder.Default
    private Boolean isBestSeller = false;

    @JsonProperty("isChefSignature")
    @JsonAlias({"chefSignature", "isChefSignature"})
    @Builder.Default
    private Boolean isChefSignature = false;

    @JsonProperty("isLimited")
    @JsonAlias({"limited", "isLimited"})
    @Builder.Default
    private Boolean isLimited = false;

    @JsonProperty("isSpicy")
    @JsonAlias({"spicy", "isSpicy"})
    @Builder.Default
    private Boolean isSpicy = false;

    @Builder.Default
    private Integer spiceLevel = 0;

    private String spiceNote;

    private List<String> badgeIds;

    private List<String> dishTypes;
    private List<String> tags;
    private List<String> features;

    private List<MenuItemSizeOptionDto> sizes;
    private List<String> sauceOptions;
    private List<MenuItemAddonDto> addons;

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private Integer displayOrder = 0;
}
