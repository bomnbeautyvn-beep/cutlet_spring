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

    @NotBlank(message = "Korean name (KO) is required")
    private String nameKr;

    private String nameKrSubtitle;

    @NotBlank(message = "Vietnamese name (VI) is required")
    private String nameVi;

    @NotBlank(message = "Japanese name (JA) is required")
    private String nameJp;

    @NotBlank(message = "English description (EN) is required")
    private String descriptionEn;

    @NotBlank(message = "Korean description (KO) is required")
    private String descriptionKr;

    @NotBlank(message = "Vietnamese description (VI) is required")
    private String descriptionVi;

    @NotBlank(message = "Japanese description (JA) is required")
    private String descriptionJp;

    @NotBlank(message = "English portion info (EN) is required")
    private String portionEn;

    @NotBlank(message = "Korean portion info (KO) is required")
    private String portionKr;

    @NotBlank(message = "Vietnamese portion info (VI) is required")
    private String portionVi;

    @NotBlank(message = "Japanese portion info (JA) is required")
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
