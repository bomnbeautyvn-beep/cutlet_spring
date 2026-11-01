package com.cutletspring.cms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHeaderFooterRequest {

    private String phoneNumber;
    private Boolean hotlineVisible;
    private String email;

    @NotBlank(message = "English brand name is required")
    private String brandNameEn;

    @NotBlank(message = "Korean brand name is required")
    private String brandNameKr;

    @NotBlank(message = "Vietnamese brand name is required")
    private String brandNameVi;

    @NotBlank(message = "Japanese brand name is required")
    private String brandNameJp;

    private String brandSloganEn;
    private String brandSloganKr;
    private String brandSloganVi;
    private String brandSloganJp;

    private String footerAboutEn;
    private String footerAboutKr;
    private String footerAboutVi;
    private String footerAboutJp;

    private String addressEn;
    private String addressKr;
    private String addressVi;
    private String addressJp;

    private String closedDaysEn;
    private String closedDaysKr;
    private String closedDaysVi;
    private String closedDaysJp;

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

    private String establishedYear;
    private String copyrightTextEn;
    private String copyrightTextKr;
    private String copyrightTextVi;
    private String copyrightTextJp;
}

