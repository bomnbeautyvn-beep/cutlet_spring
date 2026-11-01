package com.cutletspring.cms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "homepage_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomepageSection {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "section_key", nullable = false, unique = true, length = 50)
    private String sectionKey;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "title_kr", nullable = false)
    private String titleKr;

    @Column(name = "title_vi", nullable = false)
    private String titleVi;

    @Column(name = "title_jp", nullable = false)
    private String titleJp;

    @Column(name = "subtitle_en", length = 500)
    private String subtitleEn;

    @Column(name = "subtitle_kr", length = 500)
    private String subtitleKr;

    @Column(name = "subtitle_vi", length = 500)
    private String subtitleVi;

    @Column(name = "subtitle_jp", length = 500)
    private String subtitleJp;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

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

