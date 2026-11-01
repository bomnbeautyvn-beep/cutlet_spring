package com.cutletspring.shared.controller;

import com.cutletspring.auth.repository.AdminRepository;
import com.cutletspring.category.entity.MenuCategory;
import com.cutletspring.category.repository.MenuCategoryRepository;
import com.cutletspring.menu.entity.MenuItem;
import com.cutletspring.menu.repository.MenuItemRepository;
import com.cutletspring.restaurant.entity.RestaurantSettings;
import com.cutletspring.restaurant.repository.RestaurantSettingsRepository;
import com.cutletspring.shared.dto.AdminDashboardStatsDto;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "Endpoints for live restaurant status, catalog analytics, and atelier metrics")
public class AdminDashboardController {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository categoryRepository;
    private final AdminRepository adminRepository;
    private final RestaurantSettingsRepository settingsRepository;

    @Operation(summary = "Get Dashboard Stats", description = "Retrieves live counts of dishes, categories, accounts, and current operational service status")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        long totalDishes = menuItemRepository.count();
        long activeDishes = menuItemRepository.countByActiveTrue();
        long inactiveDishes = menuItemRepository.countByActiveFalse();

        long totalCategories = categoryRepository.count();
        long activeCategories = categoryRepository.countByActiveTrue();

        long totalAccounts = adminRepository.count();
        long activeAccounts = adminRepository.countByRoleInAndActiveTrue(List.of("ROLE_ADMIN", "ROLE_STAFF", "ADMIN", "STAFF"));

        RestaurantSettings settings = settingsRepository.findDefault().orElse(null);

        String lunchStart = settings != null ? settings.getOpeningHourLunchStart() : "11:00";
        String lunchEnd = settings != null ? settings.getOpeningHourLunchEnd() : "15:00";
        String dinnerStart = settings != null ? settings.getOpeningHourDinnerStart() : "17:00";
        String dinnerEnd = settings != null ? settings.getOpeningHourDinnerEnd() : "21:00";
        String lastOrder = settings != null ? settings.getLastOrderTime() : "20:30";

        int hallCap = settings != null ? settings.getCapacityHall() : 30;
        int counterCap = settings != null ? settings.getCapacityCounter() : 10;

        // Calculate current service session
        LocalTime now = LocalTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalTime lStart = parseTime(lunchStart, 11, 0);
        LocalTime lEnd = parseTime(lunchEnd, 15, 0);
        LocalTime dStart = parseTime(dinnerStart, 17, 0);
        LocalTime dEnd = parseTime(dinnerEnd, 21, 0);

        boolean isOpen = false;
        String session = "CLOSED";

        if (!now.isBefore(lStart) && now.isBefore(lEnd)) {
            isOpen = true;
            session = "LUNCH";
        } else if (!now.isBefore(lEnd) && now.isBefore(dStart)) {
            isOpen = false;
            session = "AFTERNOON_PREP_BREAK";
        } else if (!now.isBefore(dStart) && now.isBefore(dEnd)) {
            isOpen = true;
            session = "DINNER";
        } else {
            isOpen = false;
            session = "CLOSED";
        }

        // Category distribution
        Map<String, Long> categoryDistribution = new HashMap<>();
        List<MenuCategory> categories = categoryRepository.findAll();
        for (MenuCategory cat : categories) {
            long count = menuItemRepository.count((root, query, cb) -> cb.equal(root.get("category").get("id"), cat.getId()));
            categoryDistribution.put(cat.getName(), count);
        }

        AdminDashboardStatsDto stats = AdminDashboardStatsDto.builder()
                .totalDishes(totalDishes)
                .activeDishes(activeDishes)
                .inactiveDishes(inactiveDishes)
                .totalCategories(totalCategories)
                .activeCategories(activeCategories)
                .totalAccounts(totalAccounts)
                .activeAccounts(activeAccounts)
                .isOpenNow(isOpen)
                .currentSession(session)
                .lunchHours(lunchStart + " - " + lunchEnd)
                .dinnerHours(dinnerStart + " - " + dinnerEnd)
                .lastOrderTime(lastOrder)
                .capacityHall(hallCap)
                .capacityCounter(counterCap)
                .categoryDistribution(categoryDistribution)
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    private LocalTime parseTime(String timeStr, int defHour, int defMin) {
        if (timeStr == null || timeStr.isBlank()) {
            return LocalTime.of(defHour, defMin);
        }
        try {
            String[] parts = timeStr.trim().split(":");
            return LocalTime.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
        } catch (Exception ex) {
            return LocalTime.of(defHour, defMin);
        }
    }
}

