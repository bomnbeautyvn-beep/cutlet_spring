package com.cutletspring.shared.controller;

import com.cutletspring.shared.dto.AdminDashboardStatsDto;
import com.cutletspring.shared.response.ApiResponse;
import com.cutletspring.shared.service.AdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "Endpoints for live restaurant status, catalog analytics, and atelier metrics")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    @Operation(summary = "Get Dashboard Stats", description = "Retrieves live counts of dishes, categories, accounts, and current operational service status")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        AdminDashboardStatsDto stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
