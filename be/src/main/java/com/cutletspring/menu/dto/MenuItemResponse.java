package com.cutletspring.menu.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponse {
    private String id;
    private String category;
    private String categoryName;
    private String nameEn;
    private String nameKr;
    private String nameKrSubtitle;
    private String nameJp;
    private String nameVi;
    private String descriptionEn;
    private String descriptionKr;
    private String descriptionVi;
    private String descriptionJp;
    private String portionEn;
    private String portionVi;
    private String portionKr;
    private String portionJp;
    private int price;
    private String priceFormatted;
    private int prepTimeMinutes;
    private String image;
    private String imagePublicId;
    private String altText;

    @JsonProperty("isBestSeller")
    private boolean isBestSeller;

    @JsonProperty("isChefSignature")
    private boolean isChefSignature;

    @JsonProperty("isLimited")
    private boolean isLimited;

    @JsonProperty("isSpicy")
    private boolean isSpicy;

    private int spiceLevel;
    private String spiceNote;
    private List<String> dishTypes;
    private List<String> tags;
    private List<String> features;
    private List<MenuItemSizeOptionDto> sizes;
    private List<String> sauceOptions;
    private List<MenuItemAddonDto> addons;
    private List<com.cutletspring.badge.dto.BadgeResponse> badges;
    private List<String> badgeIds;
    private boolean active;
    private int displayOrder;

    @JsonProperty("bestSeller")
    public boolean getBestSellerAlias() {
        return isBestSeller;
    }

    @JsonProperty("chefSignature")
    public boolean getChefSignatureAlias() {
        return isChefSignature;
    }

    @JsonProperty("limited")
    public boolean getLimitedAlias() {
        return isLimited;
    }

    @JsonProperty("spicy")
    public boolean getSpicyAlias() {
        return isSpicy;
    }
}
