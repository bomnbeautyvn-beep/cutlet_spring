package com.cutletspring.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantSettingsDto {

    private String id;

    // Names in 4 languages
    private String nameEn;
    private String nameKr;
    private String nameVi;
    private String nameJp;

    // Slogans in 4 languages
    private String sloganEn;
    private String sloganKr;
    private String sloganVi;
    private String sloganJp;

    // Description / Intros in 4 languages
    private String descriptionEn;
    private String descriptionKr;
    private String descriptionVi;
    private String descriptionJp;

    // Addresses in 4 languages
    private String addressEn;
    private String addressKr;
    private String addressVi;
    private String addressJp;

    private String phoneNumber;
    private String email;

    private String logoUrl;
    private String logoPublicId;
    private String bannerUrl;
    private String bannerPublicId;

    // Operating hours
    private String openingHourLunchStart;
    private String openingHourLunchEnd;
    private String openingHourDinnerStart;
    private String openingHourDinnerEnd;
    private String lastOrderTime;

    // Closed days
    private String closedDaysEn;
    private String closedDaysKr;
    private String closedDaysVi;
    private String closedDaysJp;

    // Holiday notices
    private String holidayNoticeEn;
    private String holidayNoticeKr;
    private String holidayNoticeVi;
    private String holidayNoticeJp;

    // Dining policies
    private String policyOneDishEn;
    private String policyOneDishKr;
    private String policyOneDishVi;
    private String policyOneDishJp;

    private String policyVatEn;
    private String policyVatKr;
    private String policyVatVi;
    private String policyVatJp;

    private String policyTakeoutEn;
    private String policyTakeoutKr;
    private String policyTakeoutVi;
    private String policyTakeoutJp;

    private BigDecimal vatRate;
    private Integer defaultPrepMinutes;
    private Integer capacityHall;
    private Integer capacityCounter;

    private BigDecimal googleRating;
    private Integer googleReviewCount;
    private String googleMapsUrl;
    private String googleMapsEmbedUrl;
    private String establishedYear;
    private String copyrightTextEn;
    private String copyrightTextKr;
    private String copyrightTextVi;
    private String copyrightTextJp;
    private Boolean hotlineVisible;

    private Instant updatedAt;
    private String updatedBy;
}

