package com.cutletspring.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRestaurantSettingsRequest {

    @NotBlank(message = "English name is required")
    private String nameEn;

    @NotBlank(message = "Korean name is required")
    private String nameKr;

    @NotBlank(message = "Vietnamese name is required")
    private String nameVi;

    @NotBlank(message = "Japanese name is required")
    private String nameJp;

    private String sloganEn;
    private String sloganKr;
    private String sloganVi;
    private String sloganJp;

    private String descriptionEn;
    private String descriptionKr;
    private String descriptionVi;
    private String descriptionJp;

    @NotBlank(message = "English address is required")
    private String addressEn;

    @NotBlank(message = "Korean address is required")
    private String addressKr;

    @NotBlank(message = "Vietnamese address is required")
    private String addressVi;

    @NotBlank(message = "Japanese address is required")
    private String addressJp;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Lunch start time is required")
    private String openingHourLunchStart;

    @NotBlank(message = "Lunch end time is required")
    private String openingHourLunchEnd;

    @NotBlank(message = "Dinner start time is required")
    private String openingHourDinnerStart;

    @NotBlank(message = "Dinner end time is required")
    private String openingHourDinnerEnd;

    @NotBlank(message = "Last order time is required")
    private String lastOrderTime;

    private String closedDaysEn;
    private String closedDaysKr;
    private String closedDaysVi;
    private String closedDaysJp;

    private String holidayNoticeEn;
    private String holidayNoticeKr;
    private String holidayNoticeVi;
    private String holidayNoticeJp;

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
}

