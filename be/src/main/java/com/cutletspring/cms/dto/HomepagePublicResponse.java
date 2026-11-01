package com.cutletspring.cms.dto;

import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomepagePublicResponse {
    private List<HomepageSectionDto> sections;
    private HomepageHeroDto hero;
    private List<IngredientDto> ingredients;
    private GoogleReviewsSummaryDto reviewsSummary;
    private List<GoogleReviewDto> reviews;
    private RestaurantSettingsDto restaurant;
    private HeaderFooterDto headerFooter;
}

