package com.cutletspring.restaurant.mapper;

import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import com.cutletspring.restaurant.entity.RestaurantSettings;
import org.springframework.stereotype.Component;

@Component
public class RestaurantSettingsMapper {

    public RestaurantSettingsDto toDto(RestaurantSettings entity) {
        if (entity == null) return null;

        return RestaurantSettingsDto.builder()
                .id(entity.getId())
                .nameEn(entity.getNameEn())
                .nameKr(entity.getNameKr())
                .nameVi(entity.getNameVi())
                .nameJp(entity.getNameJp())
                .sloganEn(entity.getSloganEn())
                .sloganKr(entity.getSloganKr())
                .sloganVi(entity.getSloganVi())
                .sloganJp(entity.getSloganJp())
                .descriptionEn(entity.getDescriptionEn())
                .descriptionKr(entity.getDescriptionKr())
                .descriptionVi(entity.getDescriptionVi())
                .descriptionJp(entity.getDescriptionJp())
                .addressEn(entity.getAddressEn())
                .addressKr(entity.getAddressKr())
                .addressVi(entity.getAddressVi())
                .addressJp(entity.getAddressJp())
                .phoneNumber(entity.getPhoneNumber())
                .email(entity.getEmail())
                .logoUrl(entity.getLogoUrl())
                .logoPublicId(entity.getLogoPublicId())
                .bannerUrl(entity.getBannerUrl())
                .bannerPublicId(entity.getBannerPublicId())
                .openingHourLunchStart(entity.getOpeningHourLunchStart())
                .openingHourLunchEnd(entity.getOpeningHourLunchEnd())
                .openingHourDinnerStart(entity.getOpeningHourDinnerStart())
                .openingHourDinnerEnd(entity.getOpeningHourDinnerEnd())
                .lastOrderTime(entity.getLastOrderTime())
                .closedDaysEn(entity.getClosedDaysEn())
                .closedDaysKr(entity.getClosedDaysKr())
                .closedDaysVi(entity.getClosedDaysVi())
                .closedDaysJp(entity.getClosedDaysJp())
                .holidayNoticeEn(entity.getHolidayNoticeEn())
                .holidayNoticeKr(entity.getHolidayNoticeKr())
                .holidayNoticeVi(entity.getHolidayNoticeVi())
                .holidayNoticeJp(entity.getHolidayNoticeJp())
                .policyOneDishEn(entity.getPolicyOneDishEn())
                .policyOneDishKr(entity.getPolicyOneDishKr())
                .policyOneDishVi(entity.getPolicyOneDishVi())
                .policyOneDishJp(entity.getPolicyOneDishJp())
                .policyVatEn(entity.getPolicyVatEn())
                .policyVatKr(entity.getPolicyVatKr())
                .policyVatVi(entity.getPolicyVatVi())
                .policyVatJp(entity.getPolicyVatJp())
                .policyTakeoutEn(entity.getPolicyTakeoutEn())
                .policyTakeoutKr(entity.getPolicyTakeoutKr())
                .policyTakeoutVi(entity.getPolicyTakeoutVi())
                .policyTakeoutJp(entity.getPolicyTakeoutJp())
                .vatRate(entity.getVatRate())
                .defaultPrepMinutes(entity.getDefaultPrepMinutes())
                .capacityHall(entity.getCapacityHall())
                .capacityCounter(entity.getCapacityCounter())
                .googleRating(entity.getGoogleRating())
                .googleReviewCount(entity.getGoogleReviewCount())
                .googleMapsUrl(entity.getGoogleMapsUrl())
                .googleMapsEmbedUrl(entity.getGoogleMapsEmbedUrl())
                .establishedYear(entity.getEstablishedYear())
                .copyrightTextEn(entity.getCopyrightTextEn())
                .copyrightTextKr(entity.getCopyrightTextKr())
                .copyrightTextVi(entity.getCopyrightTextVi())
                .copyrightTextJp(entity.getCopyrightTextJp())
                .hotlineVisible(entity.getHotlineVisible())
                .updatedAt(entity.getUpdatedAt())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }
}

