package com.cutletspring.cms.controller;

import com.cutletspring.cms.dto.*;
import com.cutletspring.cms.service.CmsPublicService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public CMS", description = "Public endpoints for homepage sections, ingredients, reviews, and branding")
public class CmsPublicController {

    private final CmsPublicService cmsPublicService;

    @GetMapping("/homepage")
    @Operation(summary = "Get consolidated homepage payload with all active sections, hero, ingredients, and reviews")
    public ResponseEntity<ApiResponse<HomepagePublicResponse>> getHomepage() {
        HomepagePublicResponse response = cmsPublicService.getHomepageData();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/ingredients")
    @Operation(summary = "Get active atelier ingredients")
    public ResponseEntity<ApiResponse<List<IngredientDto>>> getIngredients() {
        List<IngredientDto> list = cmsPublicService.getActiveIngredients();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/reviews")
    @Operation(summary = "Get active curated Google reviews")
    public ResponseEntity<ApiResponse<List<GoogleReviewDto>>> getReviews() {
        List<GoogleReviewDto> list = cmsPublicService.getActiveReviews();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/reviews/summary")
    @Operation(summary = "Get Google reviews summary rating and counts")
    public ResponseEntity<ApiResponse<GoogleReviewsSummaryDto>> getReviewsSummary() {
        GoogleReviewsSummaryDto summary = cmsPublicService.getReviewsSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/header-footer")
    @Operation(summary = "Get public header and footer branding and notice policies")
    public ResponseEntity<ApiResponse<HeaderFooterDto>> getHeaderFooter() {
        HeaderFooterDto headerFooter = cmsPublicService.getHeaderFooter();
        return ResponseEntity.ok(ApiResponse.success(headerFooter));
    }
}

