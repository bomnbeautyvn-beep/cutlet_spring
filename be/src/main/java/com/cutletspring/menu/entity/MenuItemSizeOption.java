package com.cutletspring.menu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_item_size_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemSizeOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false)
    private int price;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;
}

