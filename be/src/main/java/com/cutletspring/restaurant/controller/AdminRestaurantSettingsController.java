package com.cutletspring.restaurant.controller;

import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import com.cutletspring.restaurant.dto.UpdateRestaurantSettingsRequest;
import com.cutletspring.restaurant.service.RestaurantSettingsService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/restaurant")
@RequiredArgsConstructor
@Tag(name = "Admin Restaurant Settings", description = "Administrative endpoints for managing atelier branding, operating hours, and dining policies")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRestaurantSettingsController {

    private final RestaurantSettingsService settingsService;

    @Operation(summary = "Get Restaurant Settings", description = "Retrieves full atelier settings for administrative configuration")
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<RestaurantSettingsDto>> getAdminSettings() {
        RestaurantSettingsDto settings = settingsService.getSettings();
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @Operation(summary = "Update Restaurant Settings", description = "Updates atelier profile, multilingual texts, operating hours, and dining policies")
    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<RestaurantSettingsDto>> updateSettings(
            @Valid @RequestBody UpdateRestaurantSettingsRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        RestaurantSettingsDto updated = settingsService.updateSettings(request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Restaurant settings updated successfully", updated));
    }

    @Operation(summary = "Upload Atelier Logo", description = "Uploads a new logo image to Cloudinary and updates atelier profile")
    @PostMapping(value = "/settings/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<RestaurantSettingsDto>> uploadLogo(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        RestaurantSettingsDto updated = settingsService.uploadLogo(file, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Atelier logo updated successfully", updated));
    }

    @Operation(summary = "Upload Atelier Banner", description = "Uploads a new hero banner image to Cloudinary and updates atelier profile")
    @PostMapping(value = "/settings/banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<RestaurantSettingsDto>> uploadBanner(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        RestaurantSettingsDto updated = settingsService.uploadBanner(file, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Atelier banner updated successfully", updated));
    }
}

