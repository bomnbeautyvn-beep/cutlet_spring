package com.cutletspring.cms.mapper;

import com.cutletspring.cms.dto.*;
import com.cutletspring.cms.entity.*;
import com.cutletspring.restaurant.entity.RestaurantSettings;
import org.springframework.stereotype.Component;

@Component
public class CmsMapper {

    public HomepageSectionDto toDto(HomepageSection entity) {
        if (entity == null) return null;
        return HomepageSectionDto.builder()
                .id(entity.getId())
                .sectionKey(entity.getSectionKey())
                .titleEn(entity.getTitleEn())
                .titleKr(entity.getTitleKr())
                .titleVi(entity.getTitleVi())
                .titleJp(entity.getTitleJp())
                .subtitleEn(entity.getSubtitleEn())
                .subtitleKr(entity.getSubtitleKr())
                .subtitleVi(entity.getSubtitleVi())
                .subtitleJp(entity.getSubtitleJp())
                .displayOrder(entity.getDisplayOrder())
                .isActive(entity.getIsActive())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public HomepageHeroDto toDto(HomepageHeroContent entity) {
        if (entity == null) return null;
        return HomepageHeroDto.builder()
                .id(entity.getId())
                .titleEn(entity.getTitleEn())
                .titleKr(entity.getTitleKr())
                .titleVi(entity.getTitleVi())
                .titleJp(entity.getTitleJp())
                .headlineEn(entity.getHeadlineEn())
                .headlineKr(entity.getHeadlineKr())
                .headlineVi(entity.getHeadlineVi())
                .headlineJp(entity.getHeadlineJp())
                .taglineEn(entity.getTaglineEn())
                .taglineKr(entity.getTaglineKr())
                .taglineVi(entity.getTaglineVi())
                .taglineJp(entity.getTaglineJp())
                .descriptionEn(entity.getDescriptionEn())
                .descriptionKr(entity.getDescriptionKr())
                .descriptionVi(entity.getDescriptionVi())
                .descriptionJp(entity.getDescriptionJp())
                .ctaTextEn(entity.getCtaTextEn())
                .ctaTextKr(entity.getCtaTextKr())
                .ctaTextVi(entity.getCtaTextVi())
                .ctaTextJp(entity.getCtaTextJp())
                .ctaTarget(entity.getCtaTarget())
                .imageUrl(entity.getImageUrl())
                .imagePublicId(entity.getImagePublicId())
                .badgeTextEn(entity.getBadgeTextEn())
                .badgeTextKr(entity.getBadgeTextKr())
                .badgeTextVi(entity.getBadgeTextVi())
                .badgeTextJp(entity.getBadgeTextJp())
                .dishTitleEn(entity.getDishTitleEn())
                .dishTitleKr(entity.getDishTitleKr())
                .dishTitleVi(entity.getDishTitleVi())
                .dishTitleJp(entity.getDishTitleJp())
                .dishDescEn(entity.getDishDescEn())
                .dishDescKr(entity.getDishDescKr())
                .dishDescVi(entity.getDishDescVi())
                .dishDescJp(entity.getDishDescJp())
                .metric1Value(entity.getMetric1Value())
                .metric1LabelEn(entity.getMetric1LabelEn())
                .metric1LabelKr(entity.getMetric1LabelKr())
                .metric1LabelVi(entity.getMetric1LabelVi())
                .metric1LabelJp(entity.getMetric1LabelJp())
                .metric2Value(entity.getMetric2Value())
                .metric2LabelEn(entity.getMetric2LabelEn())
                .metric2LabelKr(entity.getMetric2LabelKr())
                .metric2LabelVi(entity.getMetric2LabelVi())
                .metric2LabelJp(entity.getMetric2LabelJp())
                .metric3Value(entity.getMetric3Value())
                .metric3LabelEn(entity.getMetric3LabelEn())
                .metric3LabelKr(entity.getMetric3LabelKr())
                .metric3LabelVi(entity.getMetric3LabelVi())
                .metric3LabelJp(entity.getMetric3LabelJp())
                .displayOrder(entity.getDisplayOrder())
                .isActive(entity.getIsActive())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public IngredientDto toDto(Ingredient entity) {
        if (entity == null) return null;
        return IngredientDto.builder()
                .id(entity.getId())
                .nameEn(entity.getNameEn())
                .nameKr(entity.getNameKr())
                .nameVi(entity.getNameVi())
                .nameJp(entity.getNameJp())
                .subtitleEn(entity.getSubtitleEn())
                .subtitleKr(entity.getSubtitleKr())
                .subtitleVi(entity.getSubtitleVi())
                .subtitleJp(entity.getSubtitleJp())
                .descriptionEn(entity.getDescriptionEn())
                .descriptionKr(entity.getDescriptionKr())
                .descriptionVi(entity.getDescriptionVi())
                .descriptionJp(entity.getDescriptionJp())
                .imageUrl(entity.getImageUrl())
                .imagePublicId(entity.getImagePublicId())
                .displayOrder(entity.getDisplayOrder())
                .isActive(entity.getIsActive())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public GoogleReviewDto toDto(GoogleReview entity) {
        if (entity == null) return null;
        return GoogleReviewDto.builder()
                .id(entity.getId())
                .reviewerName(entity.getReviewerName())
                .reviewerInitials(entity.getReviewerInitials())
                .reviewerAvatarUrl(entity.getReviewerAvatarUrl())
                .reviewerMetadata(entity.getReviewerMetadata())
                .rating(entity.getRating())
                .reviewLanguage(entity.getReviewLanguage())
                .reviewContent(entity.getReviewContent())
                .reviewDate(entity.getReviewDate())
                .ownerResponse(entity.getOwnerResponse())
                .ownerResponseDate(entity.getOwnerResponseDate())
                .reviewUrl(entity.getReviewUrl())
                .isFeatured(entity.getIsFeatured())
                .isActive(entity.getIsActive())
                .displayOrder(entity.getDisplayOrder())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public HeaderFooterDto toHeaderFooterDto(RestaurantSettings settings) {
        if (settings == null) return null;
        String lunchHours = settings.getOpeningHourLunchStart() + " - " + settings.getOpeningHourLunchEnd();
        String dinnerHours = settings.getOpeningHourDinnerStart() + " - " + settings.getOpeningHourDinnerEnd();

        return HeaderFooterDto.builder()
                .logoUrl(settings.getLogoUrl())
                .logoPublicId(settings.getLogoPublicId())
                .phoneNumber(settings.getPhoneNumber())
                .hotlineVisible(settings.getHotlineVisible())
                .email(settings.getEmail())
                .brandNameEn(settings.getNameEn())
                .brandNameKr(settings.getNameKr())
                .brandNameVi(settings.getNameVi())
                .brandNameJp(settings.getNameJp())
                .brandSloganEn(settings.getSloganEn())
                .brandSloganKr(settings.getSloganKr())
                .brandSloganVi(settings.getSloganVi())
                .brandSloganJp(settings.getSloganJp())
                .footerAboutEn(settings.getDescriptionEn())
                .footerAboutKr(settings.getDescriptionKr())
                .footerAboutVi(settings.getDescriptionVi())
                .footerAboutJp(settings.getDescriptionJp())
                .addressEn(settings.getAddressEn())
                .addressKr(settings.getAddressKr())
                .addressVi(settings.getAddressVi())
                .addressJp(settings.getAddressJp())
                .lunchHours(lunchHours)
                .dinnerHours(dinnerHours)
                .lastOrderTime(settings.getLastOrderTime())
                .closedDaysEn(settings.getClosedDaysEn())
                .closedDaysKr(settings.getClosedDaysKr())
                .closedDaysVi(settings.getClosedDaysVi())
                .closedDaysJp(settings.getClosedDaysJp())
                .policyOneDishEn(settings.getPolicyOneDishEn())
                .policyOneDishKr(settings.getPolicyOneDishKr())
                .policyOneDishVi(settings.getPolicyOneDishVi())
                .policyOneDishJp(settings.getPolicyOneDishJp())
                .policyVatEn(settings.getPolicyVatEn())
                .policyVatKr(settings.getPolicyVatKr())
                .policyVatVi(settings.getPolicyVatVi())
                .policyVatJp(settings.getPolicyVatJp())
                .policyTakeoutEn(settings.getPolicyTakeoutEn())
                .policyTakeoutKr(settings.getPolicyTakeoutKr())
                .policyTakeoutVi(settings.getPolicyTakeoutVi())
                .policyTakeoutJp(settings.getPolicyTakeoutJp())
                .establishedYear(settings.getEstablishedYear())
                .copyrightTextEn(settings.getCopyrightTextEn())
                .copyrightTextKr(settings.getCopyrightTextKr())
                .copyrightTextVi(settings.getCopyrightTextVi())
                .copyrightTextJp(settings.getCopyrightTextJp())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}

