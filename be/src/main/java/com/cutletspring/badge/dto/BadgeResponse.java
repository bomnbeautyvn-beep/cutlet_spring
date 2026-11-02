package com.cutletspring.badge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeResponse {
    private String id;
    private String code;
    private String name;
    private String nameVi;
    private String nameKr;
    private String nameJp;
    private String description;
    private String badgeColor;
    private String icon;
    private int displayOrder;
    private boolean active;
    private long assignedCount;
}

