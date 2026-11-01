package com.cutletspring.cms.controller;

import com.cutletspring.cms.dto.*;
import com.cutletspring.cms.service.CmsAdminService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cms")
@RequiredArgsConstructor
@Tag(name = "Admin CMS", description = "Admin endpoints for homepage content management")
public class AdminCmsController {

    private final CmsAdminService cmsAdminService;

    // =========================================================================
    // 1. SECTIONS
    // =========================================================================

    @GetMapping("/sections")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get all homepage sections")
    public ResponseEntity<ApiResponse<List<HomepageSectionDto>>> getAllSections() {
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.getAllSections()));
    }

    @PutMapping("/sections/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update homepage section titles and visibility")
    public ResponseEntity<ApiResponse<HomepageSectionDto>> updateSection(
            @PathVariable String id,
            @Valid @RequestBody UpdateHomepageSectionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.updateSection(id, request, adminEmail)));
    }

    @PutMapping("/sections/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reorder homepage sections")
    public ResponseEntity<ApiResponse<List<HomepageSectionDto>>> reorderSections(
            @RequestBody List<String> sectionIds,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.reorderSections(sectionIds, adminEmail)));
    }

    // =========================================================================
    // 2. HERO
    // =========================================================================

    @GetMapping("/hero")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get hero section contents")
    public ResponseEntity<ApiResponse<HomepageHeroDto>> getHero() {
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.getHero()));
    }

    @PutMapping("/hero")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update hero section headlines, descriptions, and CTA")
    public ResponseEntity<ApiResponse<HomepageHeroDto>> updateHero(
            @Valid @RequestBody UpdateHomepageHeroRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.updateHero(request, adminEmail)));
    }

    @PostMapping(value = "/hero/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload hero image to Cloudinary")
    public ResponseEntity<ApiResponse<HomepageHeroDto>> uploadHeroImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.uploadHeroImage(file, adminEmail)));
    }

    // =========================================================================
    // 3. INGREDIENTS
    // =========================================================================

    @GetMapping("/ingredients")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get all ingredients")
    public ResponseEntity<ApiResponse<List<IngredientDto>>> getAllIngredients() {
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.getAllIngredients()));
    }

    @GetMapping("/ingredients/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get ingredient details")
    public ResponseEntity<ApiResponse<IngredientDto>> getIngredient(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.getIngredient(id)));
    }

    @PostMapping("/ingredients")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new ingredient")
    public ResponseEntity<ApiResponse<IngredientDto>> createIngredient(
            @Valid @RequestBody SaveIngredientRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.createIngredient(request, adminEmail)));
    }

    @PutMapping("/ingredients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing ingredient")
    public ResponseEntity<ApiResponse<IngredientDto>> updateIngredient(
            @PathVariable String id,
            @Valid @RequestBody SaveIngredientRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.updateIngredient(id, request, adminEmail)));
    }

    @PatchMapping("/ingredients/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle ingredient active status")
    public ResponseEntity<ApiResponse<IngredientDto>> toggleIngredientStatus(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.toggleIngredientStatus(id, adminEmail)));
    }

    @DeleteMapping("/ingredients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an ingredient")
    public ResponseEntity<ApiResponse<Void>> deleteIngredient(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        cmsAdminService.deleteIngredient(id, adminEmail);
        return ResponseEntity.ok(ApiResponse.<Void>success("Ingredient deleted successfully", null));
    }

    @PostMapping(value = "/ingredients/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload ingredient visual to Cloudinary")
    public ResponseEntity<ApiResponse<IngredientDto>> uploadIngredientImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.uploadIngredientImage(id, file, adminEmail)));
    }

    // =========================================================================
    // 4. GOOGLE REVIEWS
    // =========================================================================

    @GetMapping("/reviews")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get all curated Google reviews")
    public ResponseEntity<ApiResponse<List<GoogleReviewDto>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.getAllReviews()));
    }

    @GetMapping("/reviews/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get Google review details")
    public ResponseEntity<ApiResponse<GoogleReviewDto>> getReview(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.getReview(id)));
    }

    @PostMapping("/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a curated Google review")
    public ResponseEntity<ApiResponse<GoogleReviewDto>> createReview(
            @Valid @RequestBody SaveGoogleReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.createReview(request, adminEmail)));
    }

    @PutMapping("/reviews/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Google review and restaurant owner response")
    public ResponseEntity<ApiResponse<GoogleReviewDto>> updateReview(
            @PathVariable String id,
            @Valid @RequestBody SaveGoogleReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.updateReview(id, request, adminEmail)));
    }

    @PatchMapping("/reviews/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle review active status")
    public ResponseEntity<ApiResponse<GoogleReviewDto>> toggleReviewStatus(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.toggleReviewStatus(id, adminEmail)));
    }

    @PatchMapping("/reviews/{id}/featured")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle review featured badge")
    public ResponseEntity<ApiResponse<GoogleReviewDto>> toggleReviewFeatured(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.toggleReviewFeatured(id, adminEmail)));
    }

    @DeleteMapping("/reviews/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a curated Google review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        cmsAdminService.deleteReview(id, adminEmail);
        return ResponseEntity.ok(ApiResponse.<Void>success("Google review deleted successfully", null));
    }

    // =========================================================================
    // 5. HEADER & FOOTER
    // =========================================================================

    @GetMapping("/header-footer")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get Header & Footer settings")
    public ResponseEntity<ApiResponse<HeaderFooterDto>> getHeaderFooter() {
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.getHeaderFooter()));
    }

    @PutMapping("/header-footer")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Header & Footer branding and policies")
    public ResponseEntity<ApiResponse<HeaderFooterDto>> updateHeaderFooter(
            @Valid @RequestBody UpdateHeaderFooterRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.updateHeaderFooter(request, adminEmail)));
    }

    @PostMapping(value = "/header-footer/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload restaurant logo for header/footer")
    public ResponseEntity<ApiResponse<HeaderFooterDto>> uploadLogo(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails != null ? userDetails.getUsername() : "ADMIN";
        return ResponseEntity.ok(ApiResponse.success(cmsAdminService.uploadLogo(file, adminEmail)));
    }
}
