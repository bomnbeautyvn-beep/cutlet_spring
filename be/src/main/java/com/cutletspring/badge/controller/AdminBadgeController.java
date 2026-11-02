package com.cutletspring.badge.controller;

import com.cutletspring.badge.dto.BadgeRequest;
import com.cutletspring.badge.dto.BadgeResponse;
import com.cutletspring.badge.service.MenuBadgeService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/badges")
@RequiredArgsConstructor
@Tag(name = "Admin Badges", description = "Administrative endpoints for Atelier Badges & Dining Attributes")
public class AdminBadgeController {

    private final MenuBadgeService badgeService;

    @Operation(summary = "List All Badges", description = "Retrieves all badges including inactive ones for administration")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BadgeResponse>>> getAllBadges() {
        List<BadgeResponse> badges = badgeService.getAllBadges();
        return ResponseEntity.ok(ApiResponse.success(badges));
    }

    @Operation(summary = "Get Badge by ID", description = "Retrieves a specific badge by identifier")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BadgeResponse>> getBadgeById(@PathVariable String id) {
        BadgeResponse badge = badgeService.getBadgeById(id);
        return ResponseEntity.ok(ApiResponse.success(badge));
    }

    @Operation(summary = "Create Badge", description = "Creates a new Atelier Badge")
    @PostMapping
    public ResponseEntity<ApiResponse<BadgeResponse>> createBadge(@Valid @RequestBody BadgeRequest request) {
        BadgeResponse created = badgeService.createBadge(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu badge created successfully", created));
    }

    @Operation(summary = "Update Badge", description = "Updates an existing Atelier Badge")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BadgeResponse>> updateBadge(
            @PathVariable String id,
            @Valid @RequestBody BadgeRequest request
    ) {
        BadgeResponse updated = badgeService.updateBadge(id, request);
        return ResponseEntity.ok(ApiResponse.success("Menu badge updated successfully", updated));
    }

    @Operation(summary = "Toggle Badge Active Status")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BadgeResponse>> setBadgeStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> payload
    ) {
        boolean active = payload != null && Boolean.TRUE.equals(payload.get("active"));
        BadgeResponse updated = badgeService.setBadgeStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Badge status updated", updated));
    }

    @Operation(summary = "Delete Badge", description = "Deletes an unassigned badge from the system")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBadge(@PathVariable String id) {
        badgeService.deleteBadge(id);
        return ResponseEntity.ok(ApiResponse.success("Menu badge deleted successfully", null));
    }
}

