package com.cutletspring.category.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private String id;
    private String code;
    private String name;
    private String description;
    private int displayOrder;
    private boolean active;
    private long assignedCount;
}

