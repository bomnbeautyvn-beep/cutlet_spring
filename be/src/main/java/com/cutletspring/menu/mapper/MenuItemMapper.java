package com.cutletspring.menu.mapper;

import com.cutletspring.menu.dto.MenuItemAddonDto;
import com.cutletspring.menu.dto.MenuItemResponse;
import com.cutletspring.menu.dto.MenuItemSauceOptionDto;
import com.cutletspring.menu.dto.MenuItemSizeOptionDto;
import com.cutletspring.menu.entity.MenuItem;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Locale;

@Component
public class MenuItemMapper {

    public MenuItemResponse toResponse(MenuItem entity) {
        if (entity == null) return null;

        String priceFormatted = formatPrice(entity.getBasePrice());

        return MenuItemResponse.builder()
                .id(entity.getId())
                .category(entity.getCategory() != null ? entity.getCategory().getCode() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .nameEn(entity.getNameEn())
                .nameKr(entity.getNameKr())
                .nameKrSubtitle(entity.getNameKrSubtitle())
                .nameJp(entity.getNameJp())
                .nameVi(entity.getNameVi())
                .descriptionEn(entity.getDescriptionEn())
                .descriptionKr(entity.getDescriptionKr())
                .descriptionVi(entity.getDescriptionVi())
                .descriptionJp(entity.getDescriptionJp())
                .portionEn(entity.getPortionEn())
                .portionVi(entity.getPortionVi())
                .portionKr(entity.getPortionKr())
                .portionJp(entity.getPortionJp())
                .price(entity.getBasePrice())
                .priceFormatted(priceFormatted)
                .prepTimeMinutes(entity.getPrepTimeMinutes())
                .image(entity.getImageUrl() != null ? entity.getImageUrl() : "")
                .imagePublicId(entity.getImagePublicId())
                .altText(entity.getAltText() != null ? entity.getAltText() : "")
                .isBestSeller(entity.isBestSeller())
                .isChefSignature(entity.isChefSignature())
                .isLimited(entity.isLimited())
                .isSpicy(entity.isSpicy())
                .spiceLevel(entity.getSpiceLevel())
                .spiceNote(entity.getSpiceNote())
                .dishTypes(entity.getDishTypes() != null ? new ArrayList<>(entity.getDishTypes()) : new ArrayList<>())
                .tags(entity.getTags() != null ? new ArrayList<>(entity.getTags()) : new ArrayList<>())
                .features(entity.getFeatures() != null ? new ArrayList<>(entity.getFeatures()) : new ArrayList<>())
                .sizes(entity.getSizes() != null ? entity.getSizes().stream()
                        .map(s -> MenuItemSizeOptionDto.builder()
                                .id(s.getId())
                                .label(s.getLabel())
                                .price(s.getPrice())
                                .displayOrder(s.getDisplayOrder())
                                .build())
                        .toList() : new ArrayList<>())
                .sauceOptions(entity.getSauceOptions() != null ? entity.getSauceOptions().stream()
                        .map(s -> s.getName())
                        .toList() : new ArrayList<>())
                .addons(entity.getAddons() != null ? entity.getAddons().stream()
                        .map(a -> MenuItemAddonDto.builder()
                                .id(a.getId())
                                .name(a.getName())
                                .price(a.getPrice())
                                .displayOrder(a.getDisplayOrder())
                                .build())
                        .toList() : new ArrayList<>())
                .active(entity.isActive())
                .displayOrder(entity.getDisplayOrder())
                .build();
    }

    private String formatPrice(int priceInThousands) {
        // e.g. 200 -> "200.000 VND"
        NumberFormat nf = NumberFormat.getInstance(Locale.GERMANY); // Uses dot for thousands separator
        return nf.format(priceInThousands * 1000L) + " VND";
    }
}

