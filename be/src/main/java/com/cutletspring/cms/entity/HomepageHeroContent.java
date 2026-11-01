package com.cutletspring.cms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "homepage_hero_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomepageHeroContent {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "title_kr", nullable = false)
    private String titleKr;

    @Column(name = "title_vi", nullable = false)
    private String titleVi;

    @Column(name = "title_jp", nullable = false)
    private String titleJp;

    @Column(name = "headline_en", nullable = false)
    private String headlineEn;

    @Column(name = "headline_kr", nullable = false)
    private String headlineKr;

    @Column(name = "headline_vi", nullable = false)
    private String headlineVi;

    @Column(name = "headline_jp", nullable = false)
    private String headlineJp;

    @Column(name = "tagline_en", length = 500)
    private String taglineEn;

    @Column(name = "tagline_kr", length = 500)
    private String taglineKr;

    @Column(name = "tagline_vi", length = 500)
    private String taglineVi;

    @Column(name = "tagline_jp", length = 500)
    private String taglineJp;

    @Column(name = "description_en", nullable = false, columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_kr", nullable = false, columnDefinition = "TEXT")
    private String descriptionKr;

    @Column(name = "description_vi", nullable = false, columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_jp", nullable = false, columnDefinition = "TEXT")
    private String descriptionJp;

    @Column(name = "cta_text_en", nullable = false, length = 100)
    private String ctaTextEn;

    @Column(name = "cta_text_kr", nullable = false, length = 100)
    private String ctaTextKr;

    @Column(name = "cta_text_vi", nullable = false, length = 100)
    private String ctaTextVi;

    @Column(name = "cta_text_jp", nullable = false, length = 100)
    private String ctaTextJp;

    @Column(name = "cta_target", nullable = false, length = 100)
    @Builder.Default
    private String ctaTarget = "menu";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "image_public_id", length = 255)
    private String imagePublicId;

    @Column(name = "badge_text_en", length = 100)
    @Builder.Default
    private String badgeTextEn = "Established 2023";

    @Column(name = "badge_text_kr", length = 100)
    @Builder.Default
    private String badgeTextKr = "2023년 개업";

    @Column(name = "badge_text_vi", length = 100)
    @Builder.Default
    private String badgeTextVi = "Thành lập 2023";

    @Column(name = "badge_text_jp", length = 100)
    @Builder.Default
    private String badgeTextJp = "2023年創業";

    @Column(name = "dish_title_en")
    @Builder.Default
    private String dishTitleEn = "Signature Hire Katsu Medallion";

    @Column(name = "dish_title_kr")
    @Builder.Default
    private String dishTitleKr = "시그니처 히레카츠 메달리온";

    @Column(name = "dish_title_vi")
    @Builder.Default
    private String dishTitleVi = "Mề Đay Tonkatsu Nạc Lưng Đặc Trưng";

    @Column(name = "dish_title_jp")
    @Builder.Default
    private String dishTitleJp = "極上ヒレカツ メダリオン";

    @Column(name = "dish_desc_en")
    @Builder.Default
    private String dishDescEn = "Natural Rosy Hue · 100% Fully Cooked";

    @Column(name = "dish_desc_kr")
    @Builder.Default
    private String dishDescKr = "자연스러운 선홍빛 · 100% 완벽한 조리";

    @Column(name = "dish_desc_vi")
    @Builder.Default
    private String dishDescVi = "Sắc hồng tự nhiên · Chín chuẩn 100%";

    @Column(name = "dish_desc_jp")
    @Builder.Default
    private String dishDescJp = "自然な桜色 · 100%芯まで火入れ";

    @Column(name = "metric1_value", length = 50)
    @Builder.Default
    private String metric1Value = "120h";

    @Column(name = "metric1_label_en", length = 100)
    @Builder.Default
    private String metric1LabelEn = "Wet-Aged Chilled Pork";

    @Column(name = "metric1_label_kr", length = 100)
    @Builder.Default
    private String metric1LabelKr = "120시간 습식숙성 냉장육";

    @Column(name = "metric1_label_vi", length = 100)
    @Builder.Default
    private String metric1LabelVi = "Thịt heo mát ủ 120 giờ";

    @Column(name = "metric1_label_jp", length = 100)
    @Builder.Default
    private String metric1LabelJp = "120時間熟成チルドポーク";

    @Column(name = "metric2_value", length = 50)
    @Builder.Default
    private String metric2Value = "100%";

    @Column(name = "metric2_label_en", length = 100)
    @Builder.Default
    private String metric2LabelEn = "Never Frozen Quality";

    @Column(name = "metric2_label_kr", length = 100)
    @Builder.Default
    private String metric2LabelKr = "비냉동 최상급 원육";

    @Column(name = "metric2_label_vi", length = 100)
    @Builder.Default
    private String metric2LabelVi = "Tuyệt đối không đông lạnh";

    @Column(name = "metric2_label_jp", length = 100)
    @Builder.Default
    private String metric2LabelJp = "完全非冷凍のこだわり";

    @Column(name = "metric3_value", length = 50)
    @Builder.Default
    private String metric3Value = "Daily";

    @Column(name = "metric3_label_en", length = 100)
    @Builder.Default
    private String metric3LabelEn = "Fresh Bakery Panko";

    @Column(name = "metric3_label_kr", length = 100)
    @Builder.Default
    private String metric3LabelKr = "매일 새벽 직접 구운 빵가루";

    @Column(name = "metric3_label_vi", length = 100)
    @Builder.Default
    private String metric3LabelVi = "Bột chiên tươi nướng mỗi sáng";

    @Column(name = "metric3_label_jp", length = 100)
    @Builder.Default
    private String metric3LabelJp = "毎朝焼き上げる生パン粉";

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 1;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) this.createdAt = Instant.now();
        if (this.updatedAt == null) this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = Instant.now();
    }
}

