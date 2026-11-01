package com.cutletspring.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeaderFooterDto {
    private String logoUrl;
    private String logoPublicId;
    private String phoneNumber;
    private Boolean hotlineVisible;
    private String email;

    // Brand Names
    private String brandNameEn;
    private String brandNameKr;
    private String brandNameVi;
    private String brandNameJp;

    // Brand Slogans
    private String brandSloganEn;
    private String brandSloganKr;
    private String brandSloganVi;
    private String brandSloganJp;

    // Brand Description / About in Footer
    private String footerAboutEn;
    private String footerAboutKr;
    private String footerAboutVi;
    private String footerAboutJp;

    // Addresses
    private String addressEn;
    private String addressKr;
    private String addressVi;
    private String addressJp;

    // Hours
    private String lunchHours;
    private String dinnerHours;
    private String lastOrderTime;
    private String closedDaysEn;
    private String closedDaysKr;
    private String closedDaysVi;
    private String closedDaysJp;

    // Policies
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

    // Copyright & Established
    private String establishedYear;
    private String copyrightTextEn;
    private String copyrightTextKr;
    private String copyrightTextVi;
    private String copyrightTextJp;

    private Instant updatedAt;
}

