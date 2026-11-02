package com.cutletspring.badge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "menu_badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuBadge {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "name_vi", length = 100)
    private String nameVi;

    @Column(name = "name_kr", length = 100)
    private String nameKr;

    @Column(name = "name_jp", length = 100)
    private String nameJp;

    @Column(length = 255)
    private String description;

    @Column(name = "badge_color", length = 50)
    @Builder.Default
    private String badgeColor = "#af101a";

    @Column(length = 50)
    @Builder.Default
    private String icon = "star";

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = code != null ? code.toLowerCase().trim() : java.util.UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (updatedAt == null) {
            updatedAt = Instant.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}

