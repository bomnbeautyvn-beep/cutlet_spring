package com.cutletspring.menu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_item_addons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemAddon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int price;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;
}

