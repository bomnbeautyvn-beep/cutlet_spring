package com.cutletspring.menu.entity;

import com.cutletspring.category.entity.MenuCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private MenuCategory category;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "name_kr", nullable = false)
    private String nameKr;

    @Column(name = "name_kr_subtitle")
    private String nameKrSubtitle;

    @Column(name = "name_jp")
    private String nameJp;

    @Column(name = "name_vi")
    private String nameVi;

    @Column(name = "description_en", columnDefinition = "TEXT", nullable = false)
    private String descriptionEn;

    @Column(name = "description_kr", columnDefinition = "TEXT", nullable = false)
    private String descriptionKr;

    @Column(name = "description_vi", columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_jp", columnDefinition = "TEXT")
    private String descriptionJp;

    @Column(name = "portion_en", length = 100)
    private String portionEn;

    @Column(name = "portion_vi", length = 100)
    private String portionVi;

    @Column(name = "portion_kr", length = 100)
    private String portionKr;

    @Column(name = "portion_jp", length = 100)
    private String portionJp;

    @Column(name = "base_price", nullable = false)
    private int basePrice;

    @Column(name = "prep_time_minutes", nullable = false)
    @Builder.Default
    private int prepTimeMinutes = 15;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "image_public_id", length = 255)
    private String imagePublicId;

    @Column(name = "alt_text", length = 500)
    private String altText;

    @Column(name = "is_best_seller", nullable = false)
    @Builder.Default
    private boolean isBestSeller = false;

    @Column(name = "is_chef_signature", nullable = false)
    @Builder.Default
    private boolean isChefSignature = false;

    @Column(name = "is_limited", nullable = false)
    @Builder.Default
    private boolean isLimited = false;

    @Column(name = "is_spicy", nullable = false)
    @Builder.Default
    private boolean isSpicy = false;

    @Column(name = "spice_level", nullable = false)
    @Builder.Default
    private int spiceLevel = 0;

    @Column(name = "spice_note")
    private String spiceNote;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "menu_item_dish_types", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "dish_type")
    @Builder.Default
    private Set<String> dishTypes = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "menu_item_tags", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "menu_item_features", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "feature")
    @Builder.Default
    private Set<String> features = new HashSet<>();

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<MenuItemSizeOption> sizes = new ArrayList<>();

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<MenuItemSauceOption> sauceOptions = new ArrayList<>();

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<MenuItemAddon> addons = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = nameEn != null ? nameEn.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "") : java.util.UUID.randomUUID().toString();
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

