package com.cutletspring.badge.controller;

import com.cutletspring.badge.dto.BadgeResponse;
import com.cutletspring.badge.service.MenuBadgeService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/badges", "/badges"})
@RequiredArgsConstructor
@Tag(name = "Menu Badges", description = "Public endpoints for Atelier Badges")
public class BadgeController {

    private final MenuBadgeService badgeService;

    @Operation(summary = "Get Active Badges", description = "Retrieves all active Atelier Badges in display order")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BadgeResponse>>> getActiveBadges() {
        List<BadgeResponse> badges = badgeService.getActiveBadges();
        return ResponseEntity.ok(ApiResponse.success(badges));
    }

    @Operation(summary = "Get Badge by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BadgeResponse>> getBadgeById(@PathVariable String id) {
        BadgeResponse badge = badgeService.getBadgeById(id);
        return ResponseEntity.ok(ApiResponse.success(badge));
    }
}

