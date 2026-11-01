package com.cutletspring.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "restaurant_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantSettings {

    @Id
    @Column(length = 50)
    @Builder.Default
    private String id = "default";

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "name_kr", nullable = false)
    private String nameKr;

    @Column(name = "name_vi", nullable = false)
    private String nameVi;

    @Column(name = "name_jp", nullable = false)
    private String nameJp;

    @Column(name = "slogan_en")
    private String sloganEn;

    @Column(name = "slogan_kr")
    private String sloganKr;

    @Column(name = "slogan_vi")
    private String sloganVi;

    @Column(name = "slogan_jp")
    private String sloganJp;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_kr", columnDefinition = "TEXT")
    private String descriptionKr;

    @Column(name = "description_vi", columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_jp", columnDefinition = "TEXT")
    private String descriptionJp;

    @Column(name = "address_en", nullable = false, length = 500)
    private String addressEn;

    @Column(name = "address_kr", nullable = false, length = 500)
    private String addressKr;

    @Column(name = "address_vi", nullable = false, length = 500)
    private String addressVi;

    @Column(name = "address_jp", nullable = false, length = 500)
    private String addressJp;

    @Column(name = "phone_number", nullable = false, length = 50)
    private String phoneNumber;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "logo_public_id", length = 255)
    private String logoPublicId;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "banner_public_id", length = 255)
    private String bannerPublicId;

    @Column(name = "opening_hour_lunch_start", nullable = false, length = 10)
    @Builder.Default
    private String openingHourLunchStart = "11:00";

    @Column(name = "opening_hour_lunch_end", nullable = false, length = 10)
    @Builder.Default
    private String openingHourLunchEnd = "15:00";

    @Column(name = "opening_hour_dinner_start", nullable = false, length = 10)
    @Builder.Default
    private String openingHourDinnerStart = "17:00";

    @Column(name = "opening_hour_dinner_end", nullable = false, length = 10)
    @Builder.Default
    private String openingHourDinnerEnd = "21:00";

    @Column(name = "last_order_time", nullable = false, length = 10)
    @Builder.Default
    private String lastOrderTime = "20:30";

    @Column(name = "closed_days_en")
    private String closedDaysEn;

    @Column(name = "closed_days_kr")
    private String closedDaysKr;

    @Column(name = "closed_days_vi")
    private String closedDaysVi;

    @Column(name = "closed_days_jp")
    private String closedDaysJp;

    @Column(name = "holiday_notice_en", length = 500)
    private String holidayNoticeEn;

    @Column(name = "holiday_notice_kr", length = 500)
    private String holidayNoticeKr;

    @Column(name = "holiday_notice_vi", length = 500)
    private String holidayNoticeVi;

    @Column(name = "holiday_notice_jp", length = 500)
    private String holidayNoticeJp;

    @Column(name = "policy_one_dish_en", length = 500)
    private String policyOneDishEn;

    @Column(name = "policy_one_dish_kr", length = 500)
    private String policyOneDishKr;

    @Column(name = "policy_one_dish_vi", length = 500)
    private String policyOneDishVi;

    @Column(name = "policy_one_dish_jp", length = 500)
    private String policyOneDishJp;

    @Column(name = "policy_vat_en", length = 500)
    private String policyVatEn;

    @Column(name = "policy_vat_kr", length = 500)
    private String policyVatKr;

    @Column(name = "policy_vat_vi", length = 500)
    private String policyVatVi;

    @Column(name = "policy_vat_jp", length = 500)
    private String policyVatJp;

    @Column(name = "policy_takeout_en", length = 500)
    private String policyTakeoutEn;

    @Column(name = "policy_takeout_kr", length = 500)
    private String policyTakeoutKr;

    @Column(name = "policy_takeout_vi", length = 500)
    private String policyTakeoutVi;

    @Column(name = "policy_takeout_jp", length = 500)
    private String policyTakeoutJp;

    @Column(name = "vat_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal vatRate = new BigDecimal("8.00");

    @Column(name = "default_prep_minutes")
    @Builder.Default
    private Integer defaultPrepMinutes = 18;

    @Column(name = "capacity_hall")
    @Builder.Default
    private Integer capacityHall = 30;

    @Column(name = "capacity_counter")
    @Builder.Default
    private Integer capacityCounter = 10;

    @Column(name = "google_rating", precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal googleRating = new BigDecimal("4.8");

    @Column(name = "google_review_count")
    @Builder.Default
    private Integer googleReviewCount = 562;

    @Column(name = "google_maps_url", length = 500)
    @Builder.Default
    private String googleMapsUrl = "https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h";

    @Column(name = "google_maps_embed_url", length = 1000)
    @Builder.Default
    private String googleMapsEmbedUrl = "https://maps.google.com/maps?q=10.8037915,106.7449356+(%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring)&t=&z=17&ie=UTF8&iwloc=B&output=embed";

    @Column(name = "established_year", length = 10)
    @Builder.Default
    private String establishedYear = "2023";

    @Column(name = "copyright_text_en", length = 255)
    @Builder.Default
    private String copyrightTextEn = "© 2025 CUTLET SPRING Atelier. All Rights Reserved.";

    @Column(name = "copyright_text_kr", length = 255)
    @Builder.Default
    private String copyrightTextKr = "© 2025 CUTLET SPRING 아틀리에. All Rights Reserved.";

    @Column(name = "copyright_text_vi", length = 255)
    @Builder.Default
    private String copyrightTextVi = "© 2025 Xưởng CUTLET SPRING. Bảo lưu mọi quyền.";

    @Column(name = "copyright_text_jp", length = 255)
    @Builder.Default
    private String copyrightTextJp = "© 2025 CUTLET SPRING アトリエ. 無断転載を禁じます。";

    @Column(name = "hotline_visible")
    @Builder.Default
    private Boolean hotlineVisible = true;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @Column(name = "updated_by", length = 255)
    private String updatedBy;

    @PrePersist
    @PreUpdate
    public void onSave() {
        this.updatedAt = Instant.now();
    }
}

