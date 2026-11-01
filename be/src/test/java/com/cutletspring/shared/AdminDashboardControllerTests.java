package com.cutletspring.shared;

import com.cutletspring.shared.controller.AdminDashboardController;
import com.cutletspring.shared.dto.AdminDashboardStatsDto;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AdminDashboardControllerTests {

    @Autowired
    private AdminDashboardController dashboardController;

    @Test
    @DisplayName("Admin retrieves live atelier metrics and service stats")
    void testGetDashboardStats() {
        ResponseEntity<ApiResponse<AdminDashboardStatsDto>> response = dashboardController.getDashboardStats();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        AdminDashboardStatsDto stats = response.getBody().getData();
        assertNotNull(stats);
        assertTrue(stats.getTotalDishes() >= 38);
        assertTrue(stats.getActiveDishes() >= 30);
        assertTrue(stats.getTotalCategories() >= 7);
        assertTrue(stats.getTotalAccounts() >= 1);
        assertNotNull(stats.getLunchHours());
        assertNotNull(stats.getDinnerHours());
        assertNotNull(stats.getCurrentSession());
        assertTrue(stats.getCapacityHall() >= 30);
        assertTrue(stats.getCapacityCounter() >= 10);
        assertFalse(stats.getCategoryDistribution().isEmpty());
    }
}
