package com.cutletspring.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDto {

    private long totalDishes;
    private long activeDishes;
    private long inactiveDishes;

    private long totalCategories;
    private long activeCategories;

    private long totalAccounts;
    private long activeAccounts;

    private boolean isOpenNow;
    private String currentSession; // "LUNCH", "DINNER", "AFTERNOON_BREAK", "CLOSED"
    private String lunchHours;
    private String dinnerHours;
    private String lastOrderTime;

    private int capacityHall;
    private int capacityCounter;

    private Map<String, Long> categoryDistribution;
}

