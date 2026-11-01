package com.cutletspring.restaurant.controller;

import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import com.cutletspring.restaurant.service.RestaurantSettingsService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/restaurant", "/restaurant"})
@RequiredArgsConstructor
@Tag(name = "Restaurant Information", description = "Public endpoints for Cutlet Spring atelier profile, service hours, and dining policies")
public class RestaurantSettingsController {

    private final RestaurantSettingsService settingsService;

    @Operation(summary = "Get Restaurant Settings", description = "Retrieves public atelier configuration, multilingual branding, operating hours, and dining policies")
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<RestaurantSettingsDto>> getPublicSettings() {
        RestaurantSettingsDto settings = settingsService.getSettings();
        return ResponseEntity.ok(ApiResponse.success(settings));
    }
}

